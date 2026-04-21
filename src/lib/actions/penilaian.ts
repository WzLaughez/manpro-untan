"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/currentUser";
import { computeNilaiAkhir, CRITERIA } from "@/lib/penilaianConstants";
import { supabaseAdmin } from "@/lib/supabase";

function numOrNull(v: FormDataEntryValue | null): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function strOrNull(v: FormDataEntryValue | null): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s || null;
}

export async function kirimPenilaian(formData: FormData) {
  const dosenId = await getCurrentUserId();
  const seminarId = String(formData.get("seminar_id") ?? "");
  const kpId = String(formData.get("kp_id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  if (!kpId || !studentId) return;

  const scores: Record<string, number | null> = {};
  const feedbacks: Record<string, string | null> = {};
  for (const c of CRITERIA) {
    scores[c.key] = numOrNull(formData.get(`skor_${c.key}`));
    feedbacks[c.key] = strOrNull(formData.get(`feedback_${c.key}`));
  }
  const komentar = strOrNull(formData.get("komentar_tambahan"));

  const nilaiAkhir = computeNilaiAkhir({
    kerajinan: scores.kerajinan,
    ide: scores.ide,
    analisa: scores.analisa,
    solusi: scores.solusi,
    penugasan: scores.penugasan,
  });

  const payload = {
    kp_id: kpId,
    seminar_id: seminarId || null,
    student_id: studentId,
    dosen_id: dosenId,
    skor_kerajinan: scores.kerajinan,
    skor_ide: scores.ide,
    skor_analisa: scores.analisa,
    skor_solusi: scores.solusi,
    skor_penugasan: scores.penugasan,
    feedback_kerajinan: feedbacks.kerajinan,
    feedback_ide: feedbacks.ide,
    feedback_analisa: feedbacks.analisa,
    feedback_solusi: feedbacks.solusi,
    feedback_penugasan: feedbacks.penugasan,
    komentar_tambahan: komentar,
    nilai_akhir: nilaiAkhir,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabaseAdmin
    .from("penilaian_kp")
    .select("id")
    .eq("kp_id", kpId)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("penilaian_kp")
      .update(payload)
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("penilaian_kp").insert(payload);
  }

  await supabaseAdmin
    .from("kp_registrations")
    .update({ status: "selesai" })
    .eq("id", kpId);
  if (seminarId) {
    await supabaseAdmin
      .from("seminar")
      .update({ status: "selesai" })
      .eq("id", seminarId);
  }

  revalidatePath("/teacher/penilaian", "layout");
  revalidatePath("/student/status", "layout");
  revalidatePath("/student", "layout");
  redirect(`/teacher/penilaian/${seminarId}?submitted=1`);
}
