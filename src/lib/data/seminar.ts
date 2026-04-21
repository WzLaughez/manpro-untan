import { supabaseAdmin } from "@/lib/supabase";

const REQUIRED_SEMINAR_DOCS = [
  { key: "laporan_kp", label: "Laporan KP" },
  { key: "form_if_05", label: "Form KP IF-05" },
  { key: "form_if_06", label: "Form KP IF-06" },
  { key: "form_if_07", label: "Form KP IF-07" },
] as const;

export async function getSeminarByStudent(studentId: string) {
  const { data } = await supabaseAdmin
    .from("seminar")
    .select("*")
    .eq("student_id", studentId)
    .maybeSingle();
  return data;
}

export async function getSeminarWithDocs(studentId: string) {
  const seminar = await getSeminarByStudent(studentId);
  if (!seminar) return null;

  type SeminarDoc = {
    id: string;
    seminar_id: string;
    doc_key: string;
    label: string;
    file_name: string | null;
    file_url: string | null;
    uploaded_at: string | null;
  };

  const { data: documentsRaw } = await supabaseAdmin
    .from("seminar_documents")
    .select("*")
    .eq("seminar_id", seminar.id)
    .order("doc_key");
  const documents: SeminarDoc[] = (documentsRaw as SeminarDoc[] | null) ?? [];

  // Ensure all 4 slots exist (defensive — docs should be pre-created on first save)
  const byKey: Record<string, SeminarDoc | undefined> = {};
  for (const d of documents) byKey[d.doc_key] = d;

  const ordered = REQUIRED_SEMINAR_DOCS.map(
    (r) =>
      byKey[r.key] ?? {
        id: `placeholder-${r.key}`,
        seminar_id: seminar.id,
        doc_key: r.key,
        label: r.label,
        file_name: null,
        file_url: null,
        uploaded_at: null,
      },
  );

  return { seminar, documents: ordered };
}

export { REQUIRED_SEMINAR_DOCS };
