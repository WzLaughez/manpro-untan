"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabase";

const LABELS: Record<string, string> = {
  form_penilaian: "Form Penilaian (Terisi)",
  berita_acara: "Berita Acara (Ditandatangani)",
  lembar_observasi: "Lembar Observasi",
  form_revisi: "Form Revisi",
};

export async function uploadPenilaianBerkas(formData: FormData) {
  const teacherId = await getCurrentUserId();
  const kpId = String(formData.get("kp_id") ?? "");
  const docKey = String(formData.get("doc_key") ?? "");
  const file = formData.get("file") as File | null;

  if (!kpId || !docKey || !file || file.size === 0) return;
  const label = LABELS[docKey] ?? docKey;

  const ext = file.name.split(".").pop() ?? "pdf";
  const safeName = file.name.replace(/[^\w.\-]/g, "_");
  const path = `${docKey}/${kpId}-${Date.now()}-${safeName}`;

  const { error } = await supabaseAdmin.storage
    .from("kp-penilaian")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) {
    throw new Error(
      `Upload gagal: ${error.message}. Pastikan bucket 'kp-penilaian' sudah dibuat.`,
    );
  }

  const { data: pub } = supabaseAdmin.storage
    .from("kp-penilaian")
    .getPublicUrl(path);

  // Upsert by (kp_id, doc_key)
  const { data: existing } = await supabaseAdmin
    .from("penilaian_berkas")
    .select("id")
    .eq("kp_id", kpId)
    .eq("doc_key", docKey)
    .maybeSingle();

  const payload = {
    kp_id: kpId,
    doc_key: docKey,
    label,
    file_name: file.name,
    file_url: pub.publicUrl,
    uploaded_at: new Date().toISOString(),
    uploaded_by: teacherId,
  };

  if (existing) {
    await supabaseAdmin
      .from("penilaian_berkas")
      .update(payload)
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("penilaian_berkas").insert(payload);
  }

  revalidatePath("/teacher/penilaian", "layout");
}
