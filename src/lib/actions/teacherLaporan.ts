"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabase";

export async function approveLaporan(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!id) return;

  const teacherId = await getCurrentUserId();

  await supabaseAdmin
    .from("laporan_akhir")
    .update({
      status: "diterima",
      catatan_dosen: body || null,
      verifikasi_oleh: teacherId,
      tanggal_verifikasi: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/teacher/laporan", "layout");
  revalidatePath("/student/laporan", "layout");
  redirect("/teacher/laporan?sent=1");
}

export async function revisiLaporan(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!id) return;

  const teacherId = await getCurrentUserId();

  await supabaseAdmin
    .from("laporan_akhir")
    .update({
      status: "revisi",
      catatan_dosen: body || "Mohon revisi laporan sesuai masukan.",
      verifikasi_oleh: teacherId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/teacher/laporan", "layout");
  revalidatePath("/student/laporan", "layout");
  redirect("/teacher/laporan?sent=1");
}
