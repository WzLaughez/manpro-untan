import { supabaseAdmin } from "@/lib/supabase";

export async function getTeacherLaporanList(teacherId: string) {
  const { data: kps } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("dosen_pembimbing_id", teacherId);

  if (!kps || kps.length === 0) return [];
  const kpIds = kps.map((k) => k.id);

  const { data } = await supabaseAdmin
    .from("laporan_akhir")
    .select(
      "*, student:profiles!laporan_akhir_student_id_fkey(id, name, nim), kp:kp_registrations!laporan_akhir_kp_id_fkey(judul, dosen_pembimbing_id)",
    )
    .in("kp_id", kpIds)
    .in("status", ["diajukan", "diterima", "revisi"])
    .order("updated_at", { ascending: false });

  return data ?? [];
}

export async function getPendingLaporanCount(teacherId: string) {
  const { data: kps } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("dosen_pembimbing_id", teacherId);

  if (!kps || kps.length === 0) return 0;
  const kpIds = kps.map((k) => k.id);

  const { count } = await supabaseAdmin
    .from("laporan_akhir")
    .select("id", { count: "exact", head: true })
    .in("kp_id", kpIds)
    .eq("status", "diajukan");

  return count ?? 0;
}

export async function getLaporanDetailForTeacher(id: string) {
  const { data } = await supabaseAdmin
    .from("laporan_akhir")
    .select(
      "*, student:profiles!laporan_akhir_student_id_fkey(name, nim), kp:kp_registrations!laporan_akhir_kp_id_fkey(judul, dosen_pembimbing_id)",
    )
    .eq("id", id)
    .maybeSingle();
  return data;
}
