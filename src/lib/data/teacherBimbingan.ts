import { supabaseAdmin } from "@/lib/supabase";

export async function getTeacherBimbinganList(teacherId: string) {
  // Get all KPs assigned to this teacher
  const { data: kps } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("dosen_pembimbing_id", teacherId);

  if (!kps || kps.length === 0) return [];

  const kpIds = kps.map((k) => k.id);

  const { data } = await supabaseAdmin
    .from("bimbingan")
    .select(
      "id, tanggal, jenis, ringkasan, status, file_name, file_url, created_at, student:profiles!bimbingan_student_id_fkey(id, name, nim), kp:kp_registrations!bimbingan_kp_id_fkey(judul)",
    )
    .in("kp_id", kpIds)
    .order("tanggal", { ascending: false });

  return data ?? [];
}

export async function getBimbinganDetail(id: string) {
  const { data } = await supabaseAdmin
    .from("bimbingan")
    .select(
      "*, student:profiles!bimbingan_student_id_fkey(id, name, nim, email), kp:kp_registrations!bimbingan_kp_id_fkey(judul)",
    )
    .eq("id", id)
    .maybeSingle();
  return data;
}
