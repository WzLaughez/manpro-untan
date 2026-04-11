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

export async function getTeacherDashboard(teacherId: string) {
  const kps = await getTeacherKPs(teacherId);

  const proposalsBelumVerif = kps.filter(
    (k) => k.status === "diajukan" || k.status === "verifikasi",
  ).length;

  const mahasiswaBimbingan = kps.length;

  // Logbook & nilai stats — wired in later flows
  const logbookMasuk = 0;
  const mahasiswaBelumDinilai = 0;

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
