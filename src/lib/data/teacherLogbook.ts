import { supabaseAdmin } from "@/lib/supabase";

export async function getTeacherLogbookList(teacherId: string) {
  const { data: kps } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("dosen_pembimbing_id", teacherId);

  if (!kps || kps.length === 0) return [];

  const kpIds = kps.map((k) => k.id);

  const { data } = await supabaseAdmin
    .from("logbook")
    .select(
      "id, tanggal, aktivitas, kendala, hasil, status, file_name, file_url, catatan_dosen, created_at, student:profiles!logbook_student_id_fkey(id, name, nim), kp:kp_registrations!logbook_kp_id_fkey(judul)",
    )
    .in("kp_id", kpIds)
    .in("status", ["diajukan", "disetujui", "revisi"])
    .order("tanggal", { ascending: false });

  return data ?? [];
}

export async function getLogbookDetailForTeacher(id: string) {
  const { data } = await supabaseAdmin
    .from("logbook")
    .select(
      "*, student:profiles!logbook_student_id_fkey(id, name, nim), kp:kp_registrations!logbook_kp_id_fkey(judul, dosen_pembimbing_id)",
    )
    .eq("id", id)
    .maybeSingle();
  return data;
}
