import { supabaseAdmin } from "@/lib/supabase";

export async function getLogbookByStudent(studentId: string) {
  const { data } = await supabaseAdmin
    .from("logbook")
    .select("*")
    .eq("student_id", studentId)
    .order("tanggal", { ascending: false });
  return data ?? [];
}

export async function getLogbookById(id: string) {
  const { data } = await supabaseAdmin
    .from("logbook")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getLogbookStats(studentId: string) {
  const all = await getLogbookByStudent(studentId);
  return {
    total: all.length,
    disetujui: all.filter((l) => l.status === "disetujui").length,
    revisi: all.filter((l) => l.status === "revisi").length,
    items: all,
  };
}

export async function getLastLogbookDate(studentId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("logbook")
    .select("tanggal")
    .eq("student_id", studentId)
    .order("tanggal", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.tanggal ?? null;
}
