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

async function uploadToStorage(
  file: File,
  folder: "main" | "lampiran",
  kpId: string,
): Promise<{ name: string; url: string } | null> {
  if (!file || file.size === 0) return null;
  const ext = file.name.split(".").pop() ?? "pdf";
  // Deterministic path so re-uploads overwrite the old file
  const path = `${folder}/${kpId}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("kp-laporan")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) {
    throw new Error(
      `Laporan upload failed: ${error.message}. Pastikan bucket 'kp-laporan' sudah dibuat di Supabase Storage.`,
    );
  }
  const { data } = supabaseAdmin.storage
    .from("kp-laporan")
    .getPublicUrl(path);
  // Add timestamp cache-buster so the browser re-fetches after re-upload
  return { name: file.name, url: `${data.publicUrl}?t=${Date.now()}` };
}

export async function submitLaporan(formData: FormData) {
  const studentId = await getCurrentUserId();
  const kpId = await getKPId(studentId);
  if (!kpId) return;

  const mainFile = formData.get("file") as File | null;
  const lampiranFile = formData.get("lampiran") as File | null;
  const catatan = String(formData.get("catatan") ?? "").trim();

  // Check existing row — if none AND no main file, reject
  const { data: existing } = await supabaseAdmin
    .from("laporan_akhir")
    .select("id, file_url, file_name, lampiran_url, lampiran_name")
    .eq("kp_id", kpId)
    .maybeSingle();

  if (!existing && (!mainFile || mainFile.size === 0)) {
    return; // nothing to save
  }

  const mainUpload = mainFile && mainFile.size > 0
    ? await uploadToStorage(mainFile, "main", kpId)
    : null;
  const lampiranUpload = lampiranFile && lampiranFile.size > 0
    ? await uploadToStorage(lampiranFile, "lampiran", kpId)
    : null;

  const payload: Record<string, unknown> = {
    student_id: studentId,
    kp_id: kpId,
    catatan_mahasiswa: catatan || null,
    status: "diajukan",
    // Reset verification fields on re-upload
    verifikasi_oleh: null,
    tanggal_verifikasi: null,
    catatan_dosen: null,
    updated_at: new Date().toISOString(),
  };

  if (mainUpload) {
    payload.file_name = mainUpload.name;
    payload.file_url = mainUpload.url;
  }
  if (lampiranUpload) {
    payload.lampiran_name = lampiranUpload.name;
    payload.lampiran_url = lampiranUpload.url;
  }

  if (existing) {
    await supabaseAdmin
      .from("laporan_akhir")
      .update(payload)
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("laporan_akhir").insert(payload);
  }

  revalidatePath("/student/laporan", "layout");
  revalidatePath("/student", "layout");
  redirect("/student/laporan/riwayat?submitted=1");
}
