"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export async function approveLogbook(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!id) return;

  await supabaseAdmin
    .from("logbook")
    .update({
      status: "disetujui",
      catatan_dosen: body || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/teacher/logbook", "layout");
  revalidatePath("/student/logbook", "layout");
  redirect("/teacher/logbook?sent=1");
}

export async function revisiLogbook(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!id) return;

  await supabaseAdmin
    .from("logbook")
    .update({
      status: "revisi",
      catatan_dosen: body || "Mohon revisi logbook.",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/teacher/logbook", "layout");
  revalidatePath("/student/logbook", "layout");
  redirect("/teacher/logbook?sent=1");
}
