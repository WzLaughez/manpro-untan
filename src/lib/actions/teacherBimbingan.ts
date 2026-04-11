"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export async function sendTanggapan(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!id || !body) return;

  await supabaseAdmin
    .from("bimbingan")
    .update({
      catatan_dosen: body,
      status: "disetujui",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/teacher/bimbingan", "layout");
  revalidatePath("/student/bimbingan", "layout");
  redirect("/teacher/bimbingan?sent=1");
}

export async function revisiBimbingan(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!id) return;

  await supabaseAdmin
    .from("bimbingan")
    .update({
      catatan_dosen: body || "Mohon revisi sesuai catatan.",
      status: "revisi",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/teacher/bimbingan", "layout");
  revalidatePath("/student/bimbingan", "layout");
  redirect("/teacher/bimbingan?sent=1");
}
