import { supabaseAdmin } from "@/lib/supabase";

export async function getKPByStudent(studentId: string) {
  const { data: kp } = await supabaseAdmin
    .from("kp_registrations")
    .select("*")
    .eq("student_id", studentId)
    .maybeSingle();
  return kp;
}

export async function getKPWithRelations(studentId: string) {
  const kp = await getKPByStudent(studentId);
  if (!kp) return null;

  const [{ data: documents }, { data: activity }] = await Promise.all([
    supabaseAdmin
      .from("kp_documents")
      .select("*")
      .eq("kp_id", kp.id)
      .order("doc_key"),
    supabaseAdmin
      .from("kp_activity")
      .select("*")
      .eq("kp_id", kp.id)
      .order("created_at", { ascending: false }),
  ]);

  return { kp, documents: documents ?? [], activity: activity ?? [] };
}

export async function listAllKP() {
  const { data } = await supabaseAdmin
    .from("kp_registrations")
    .select("*, student:profiles!kp_registrations_student_id_fkey(name, nim)")
    .order("created_at", { ascending: false });
  return data ?? [];
}
