import { supabaseAdmin } from "@/lib/supabase";

export async function getBimbinganByStudent(studentId: string) {
  const { data } = await supabaseAdmin
    .from("bimbingan")
    .select("*")
    .eq("student_id", studentId)
    .order("tanggal", { ascending: false });
  return data ?? [];
}

export async function getBimbinganById(id: string) {
  const { data } = await supabaseAdmin
    .from("bimbingan")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getBimbinganStats(studentId: string) {
  const all = await getBimbinganByStudent(studentId);
  return {
    total: all.length,
    disetujui: all.filter((b) => b.status === "disetujui").length,
    revisi: all.filter((b) => b.status === "revisi").length,
    items: all,
  };
}
