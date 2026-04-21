import { supabaseAdmin } from "@/lib/supabase";

// Re-export constants from the client-safe module so existing imports
// from "@/lib/data/penilaian" keep working.
export {
  CRITERIA,
  SKOR_OPTIONS,
  computeNilaiAkhir,
  letterGrade,
} from "@/lib/penilaianConstants";

export const TEACHER_BERKAS_SLOTS = [
  { doc_key: "form_penilaian", label: "Form Penilaian (Terisi)" },
  { doc_key: "berita_acara", label: "Berita Acara (Ditandatangani)" },
  { doc_key: "lembar_observasi", label: "Lembar Observasi" },
  { doc_key: "form_revisi", label: "Form Revisi" },
] as const;

export async function getTeacherBerkasByKP(kpId: string) {
  type Row = {
    id: string;
    doc_key: string;
    label: string;
    file_name: string | null;
    file_url: string | null;
    uploaded_at: string | null;
  };
  const { data } = await supabaseAdmin
    .from("penilaian_berkas")
    .select("id, doc_key, label, file_name, file_url, uploaded_at")
    .eq("kp_id", kpId);
  const rows = (data as Row[] | null) ?? [];
  const byKey: Record<string, Row> = {};
  for (const r of rows) byKey[r.doc_key] = r;

  return TEACHER_BERKAS_SLOTS.map(
    (s) =>
      byKey[s.doc_key] ?? {
        id: `placeholder-${s.doc_key}`,
        doc_key: s.doc_key,
        label: s.label,
        file_name: null,
        file_url: null,
        uploaded_at: null,
      },
  );
}

export async function getPenilaianByKP(kpId: string) {
  const { data } = await supabaseAdmin
    .from("penilaian_kp")
    .select(
      "*, dosen:profiles!penilaian_kp_dosen_id_fkey(name)",
    )
    .eq("kp_id", kpId)
    .maybeSingle();
  return data;
}

export async function getPenilaianByStudent(studentId: string) {
  const { data } = await supabaseAdmin
    .from("penilaian_kp")
    .select(
      "*, dosen:profiles!penilaian_kp_dosen_id_fkey(name)",
    )
    .eq("student_id", studentId)
    .maybeSingle();
  return data;
}

/**
 * Students under this teacher whose seminar has been completed,
 * with optional penilaian_kp row joined in.
 */
export async function getTeacherPenilaianList(teacherId: string) {
  const { data: kps } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("dosen_pembimbing_id", teacherId);
  if (!kps || kps.length === 0) return [];
  const kpIds = kps.map((k) => k.id);

  // Eligible for penilaian = confirmed OR attended OR selesai
  // (loosened so teacher can grade without waiting for QR presensi)
  const { data: seminars } = await supabaseAdmin
    .from("seminar")
    .select(
      "id, kp_id, tanggal_seminar, kehadiran_hadir, kehadiran_konfirmasi, status, student:profiles!seminar_student_id_fkey(id, name, nim, semester), kp:kp_registrations!seminar_kp_id_fkey(judul, dosen_pembimbing_id)",
    )
    .in("kp_id", kpIds)
    .or(
      "kehadiran_konfirmasi.eq.true,kehadiran_hadir.eq.true,status.eq.selesai",
    );

  if (!seminars || seminars.length === 0) return [];

  const { data: existing } = await supabaseAdmin
    .from("penilaian_kp")
    .select("kp_id, nilai_akhir, updated_at")
    .in(
      "kp_id",
      seminars.map((s) => s.kp_id),
    );
  const byKp: Record<
    string,
    { nilai_akhir: number | null; updated_at: string | null }
  > = {};
  for (const p of existing ?? [])
    byKp[p.kp_id] = {
      nilai_akhir: p.nilai_akhir,
      updated_at: p.updated_at,
    };

  return seminars.map((s) => ({
    ...s,
    penilaian: byKp[s.kp_id] ?? null,
  }));
}

export async function getMahasiswaBelumDinilaiCount(
  teacherId: string,
): Promise<number> {
  const list = await getTeacherPenilaianList(teacherId);
  return list.filter((s) => !s.penilaian).length;
}

export async function getPenilaianDetailForTeacher(seminarId: string) {
  const { data: seminar } = await supabaseAdmin
    .from("seminar")
    .select(
      "*, student:profiles!seminar_student_id_fkey(id, name, nim, semester), kp:kp_registrations!seminar_kp_id_fkey(id, judul, dosen_pa, dosen_pembimbing_id)",
    )
    .eq("id", seminarId)
    .maybeSingle();
  if (!seminar) return null;

  const [{ data: documents }, existing] = await Promise.all([
    supabaseAdmin
      .from("seminar_documents")
      .select("*")
      .eq("seminar_id", seminarId)
      .order("doc_key"),
    getPenilaianByKP(seminar.kp_id),
  ]);

  return { seminar, documents: documents ?? [], penilaian: existing };
}
