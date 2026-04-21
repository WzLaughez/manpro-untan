import { supabaseAdmin } from "@/lib/supabase";

export async function getLaporanByStudent(studentId: string) {
  const { data } = await supabaseAdmin
    .from("laporan_akhir")
    .select(
      "*, verifikator:profiles!laporan_akhir_verifikasi_oleh_fkey(name)",
    )
    .eq("student_id", studentId)
    .maybeSingle();
  return data;
}
