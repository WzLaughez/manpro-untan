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

async function uploadBimbinganFile(
  file: File,
  studentId: string,
): Promise<{ name: string; url: string } | null> {
  if (!file || file.size === 0) return null;
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `${studentId}-${Date.now()}.${ext}`;
  const { error } = await supabaseAdmin.storage
    .from("kp-bimbingan")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) {
    console.error("Bimbingan file upload failed:", error.message);
    return null;
  }
  const { data } = supabaseAdmin.storage
    .from("kp-bimbingan")
    .getPublicUrl(path);
  return { name: file.name, url: data.publicUrl };
}

export async function submitBimbingan(formData: FormData) {
  const studentId = await getCurrentUserId();
  const kpId = await getKPId(studentId);
  if (!kpId) return;

  const file = formData.get("file") as File | null;
  const uploaded = file ? await uploadBimbinganFile(file, studentId) : null;

  await supabaseAdmin.from("bimbingan").insert({
    kp_id: kpId,
    student_id: studentId,
    tanggal: String(formData.get("tanggal")),
    jenis: String(formData.get("jenis")),
    ringkasan: String(formData.get("ringkasan") ?? ""),
    file_name: uploaded?.name ?? null,
    file_url: uploaded?.url ?? null,
    status: "diajukan",
  });

  revalidatePath("/student/bimbingan", "layout");
  redirect("/student/bimbingan/ajukan?saved=1");
}

export async function updateBimbingan(formData: FormData) {
  const studentId = await getCurrentUserId();
  const id = String(formData.get("id"));

  const file = formData.get("file") as File | null;
  const uploaded = file ? await uploadBimbinganFile(file, studentId) : null;

  const payload: Record<string, unknown> = {
    tanggal: String(formData.get("tanggal")),
    jenis: String(formData.get("jenis")),
    ringkasan: String(formData.get("ringkasan") ?? ""),
    updated_at: new Date().toISOString(),
  };
  if (uploaded) {
    payload.file_name = uploaded.name;
    payload.file_url = uploaded.url;
  }

  await supabaseAdmin.from("bimbingan").update(payload).eq("id", id);

  revalidatePath("/student/bimbingan", "layout");
  redirect("/student/bimbingan/riwayat?updated=1");
}
