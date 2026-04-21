import { supabaseAdmin } from "@/lib/supabase";

export async function getTeacherSeminarList(teacherId: string) {
  const { data: kps } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("dosen_pembimbing_id", teacherId);

  if (!kps || kps.length === 0) return [];
  const kpIds = kps.map((k) => k.id);

  const { data } = await supabaseAdmin
    .from("seminar")
    .select(
      "id, tanggal_pengajuan, tanggal_seminar, waktu_mulai, waktu_selesai, lokasi, ruang_seminar, pembimbing_lapangan, status, updated_at, created_at, student:profiles!seminar_student_id_fkey(id, name, nim), kp:kp_registrations!seminar_kp_id_fkey(judul, dosen_pa, dosen_pembimbing_id)",
    )
    .in("kp_id", kpIds)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getPendingSeminarCount(teacherId: string) {
  const { data: kps } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("dosen_pembimbing_id", teacherId);
  if (!kps || kps.length === 0) return 0;
  const kpIds = kps.map((k) => k.id);

  const { count } = await supabaseAdmin
    .from("seminar")
    .select("id", { count: "exact", head: true })
    .in("kp_id", kpIds)
    .eq("status", "diajukan");
  return count ?? 0;
}

export async function getTeacherSeminarDetail(id: string) {
  const { data: seminar } = await supabaseAdmin
    .from("seminar")
    .select(
      "*, student:profiles!seminar_student_id_fkey(id, name, nim), kp:kp_registrations!seminar_kp_id_fkey(judul, dosen_pa, dosen_pembimbing_id)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!seminar) return null;

  const { data: documents } = await supabaseAdmin
    .from("seminar_documents")
    .select("*")
    .eq("seminar_id", id)
    .order("doc_key");

  return { seminar, documents: documents ?? [] };
}
