import { supabaseAdmin } from "@/lib/supabase";

export type TeacherKP = {
  id: string;
  judul: string;
  status: string;
  tanggal_pengajuan: string | null;
  created_at: string;
  student: { id: string; name: string; nim: string | null } | null;
};

export async function getTeacherKPs(teacherId: string) {
  const { data } = await supabaseAdmin
    .from("kp_registrations")
    .select(
      "id, judul, status, tanggal_pengajuan, created_at, student:profiles!kp_registrations_student_id_fkey(id, name, nim)",
    )
    .eq("dosen_pembimbing_id", teacherId)
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as TeacherKP[];
}

/**
 * Global pool: all proposals waiting for verification,
 * regardless of which teacher (if any) is assigned.
 * Any teacher can pick one up — whoever approves it becomes the dosen pembimbing.
 */
export async function getAllPendingProposals() {
  const { data } = await supabaseAdmin
    .from("kp_registrations")
    .select(
      "id, judul, status, tanggal_pengajuan, created_at, student:profiles!kp_registrations_student_id_fkey(id, name, nim)",
    )
    .in("status", ["diajukan", "verifikasi"])
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as TeacherKP[];
}

export async function getTeacherDashboard(teacherId: string) {
  const [kps, pending] = await Promise.all([
    getTeacherKPs(teacherId),
    getAllPendingProposals(),
  ]);

  // Global backlog (any teacher sees the same number)
  const proposalsBelumVerif = pending.length;

  // Only this teacher's own students
  const mahasiswaBimbingan = kps.length;

  // Logbook count: entries from this teacher's students with status='diajukan'
  const kpIds = kps.map((k) => k.id);
  let logbookMasuk = 0;
  if (kpIds.length > 0) {
    const { count } = await supabaseAdmin
      .from("logbook")
      .select("id", { count: "exact", head: true })
      .in("kp_id", kpIds)
      .eq("status", "diajukan");
    logbookMasuk = count ?? 0;
  }

  let mahasiswaBelumDinilai = 0;
  if (kpIds.length > 0) {
    // Students whose seminar is done AND no penilaian_kp yet
    const { data: finishedSeminars } = await supabaseAdmin
      .from("seminar")
      .select("kp_id")
      .in("kp_id", kpIds)
      .or(
        "kehadiran_konfirmasi.eq.true,kehadiran_hadir.eq.true,status.eq.selesai",
      );
    const finishedIds = (finishedSeminars ?? []).map((s) => s.kp_id);
    if (finishedIds.length > 0) {
      const { data: graded } = await supabaseAdmin
        .from("penilaian_kp")
        .select("kp_id")
        .in("kp_id", finishedIds);
      const gradedIds = new Set((graded ?? []).map((g) => g.kp_id));
      mahasiswaBelumDinilai = finishedIds.filter(
        (id) => !gradedIds.has(id),
      ).length;
    }
  }

  return {
    kps,
    stats: {
      proposalsBelumVerif,
      mahasiswaBimbingan,
      logbookMasuk,
      mahasiswaBelumDinilai,
    },
  };
}

export async function getKPDetail(kpId: string) {
  const { data: kp } = await supabaseAdmin
    .from("kp_registrations")
    .select(
      "*, student:profiles!kp_registrations_student_id_fkey(id, name, nim, email, semester, ipk)",
    )
    .eq("id", kpId)
    .maybeSingle();
  if (!kp) return null;

  const [{ data: documents }, { data: comments }] = await Promise.all([
    supabaseAdmin
      .from("kp_documents")
      .select("*")
      .eq("kp_id", kpId)
      .order("doc_key"),
    supabaseAdmin
      .from("kp_comments")
      .select("*, author:profiles!kp_comments_author_id_fkey(name, role)")
      .eq("kp_id", kpId)
      .order("created_at", { ascending: false }),
  ]);

  return {
    kp,
    documents: documents ?? [],
    comments: comments ?? [],
  };
}
