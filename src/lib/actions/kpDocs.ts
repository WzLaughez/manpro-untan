"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabase";

export async function uploadKPDocument(formData: FormData) {
  const studentId = await getCurrentUserId();
  const docKey = String(formData.get("doc_key") ?? "");
  const file = formData.get("file") as File | null;

  if (!docKey || !file || file.size === 0) return;

  const { data: kp } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("student_id", studentId)
    .maybeSingle();
  if (!kp) return;

  const ext = file.name.split(".").pop() ?? "pdf";
  const safeName = file.name.replace(/[^\w.\-]/g, "_");
  const path = `${docKey}/${kp.id}-${Date.now()}-${safeName}`;

  const { error } = await supabaseAdmin.storage
    .from("kp-documents")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) {
    console.error("Doc upload failed:", error.message);
    return;
  }

  const { data: pub } = supabaseAdmin.storage
    .from("kp-documents")
    .getPublicUrl(path);

  await supabaseAdmin
    .from("kp_documents")
    .update({
      file_name: file.name,
      file_url: pub.publicUrl,
      uploaded_at: new Date().toISOString(),
    })
    .eq("kp_id", kp.id)
    .eq("doc_key", docKey);

  await supabaseAdmin.from("kp_activity").insert({
    kp_id: kp.id,
    title: `Upload dokumen: ${docKey}`,
  });

  revalidatePath("/student/pendaftaran/upload");
}
