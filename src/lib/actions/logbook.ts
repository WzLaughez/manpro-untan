"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabase";

async function getKPId(studentId: string) {
  const { data } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("student_id", studentId)
    .maybeSingle();
  return data?.id ?? null;
}

async function uploadLogbookFile(
  file: File,
  studentId: string,
): Promise<{ name: string; url: string } | null> {
  if (!file || file.size === 0) return null;
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `${studentId}-${Date.now()}.${ext}`;
  const { error } = await supabaseAdmin.storage
    .from("kp-logbook")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) {
    throw new Error(
      `Logbook upload failed: ${error.message}. Pastikan bucket 'kp-logbook' sudah dibuat di Supabase Storage.`,
    );
  }
  const { data } = supabaseAdmin.storage
    .from("kp-logbook")
    .getPublicUrl(path);
  return { name: file.name, url: data.publicUrl };
}

async function savePayload(
  formData: FormData,
  studentId: string,
  status: "draft" | "diajukan",
) {
  const file = formData.get("file") as File | null;
  const uploaded = file ? await uploadLogbookFile(file, studentId) : null;

  const payload: Record<string, unknown> = {
    tanggal: String(formData.get("tanggal")),
    aktivitas: String(formData.get("aktivitas") ?? ""),
    kendala: String(formData.get("kendala") ?? "") || null,
    hasil: String(formData.get("hasil") ?? "") || null,
    updated_at: new Date().toISOString(),
    status,
  };
  if (uploaded) {
    payload.file_name = uploaded.name;
    payload.file_url = uploaded.url;
  }
  return payload;
}

export async function saveDraftLogbook(formData: FormData) {
  const studentId = await getCurrentUserId();
  const kpId = await getKPId(studentId);
  if (!kpId) return;

  const payload = await savePayload(formData, studentId, "draft");
  await supabaseAdmin
    .from("logbook")
    .insert({ ...payload, kp_id: kpId, student_id: studentId });

  revalidatePath("/student/logbook", "layout");
  revalidatePath("/student", "layout");
  redirect("/student/logbook/pengisian?saved=1");
}

export async function submitLogbook(formData: FormData) {
  const studentId = await getCurrentUserId();
  const kpId = await getKPId(studentId);
  if (!kpId) return;

  const payload = await savePayload(formData, studentId, "diajukan");
  await supabaseAdmin
    .from("logbook")
    .insert({ ...payload, kp_id: kpId, student_id: studentId });

  revalidatePath("/student/logbook", "layout");
  revalidatePath("/student", "layout");
  redirect("/student/logbook/riwayat?submitted=1");
}

export async function updateLogbookDraft(formData: FormData) {
  const studentId = await getCurrentUserId();
  const id = String(formData.get("id"));
  const payload = await savePayload(formData, studentId, "draft");

  await supabaseAdmin.from("logbook").update(payload).eq("id", id);

  revalidatePath("/student/logbook", "layout");
  revalidatePath("/student", "layout");
  redirect("/student/logbook/riwayat?updated=1");
}

export async function updateLogbookSubmit(formData: FormData) {
  const studentId = await getCurrentUserId();
  const id = String(formData.get("id"));
  const payload = await savePayload(formData, studentId, "diajukan");

  await supabaseAdmin.from("logbook").update(payload).eq("id", id);

  revalidatePath("/student/logbook", "layout");
  revalidatePath("/student", "layout");
  redirect("/student/logbook/riwayat?submitted=1");
}
