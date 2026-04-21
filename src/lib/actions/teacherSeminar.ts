"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

const DEFAULT_WAKTU_MULAI = "09:00";
const DEFAULT_WAKTU_SELESAI = "11:00";
const DEFAULT_RUANG = "Ruang Sidang Utama Informatika";

/**
 * Approve a seminar pengajuan. Uses the student's proposed date and lokasi,
 * falling back to sensible defaults for time + ruangan.
 */
export async function approveSeminar(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data: current } = await supabaseAdmin
    .from("seminar")
    .select("tanggal_pengajuan, lokasi, tanggal_seminar, ruang_seminar")
    .eq("id", id)
    .single();

  const payload = {
    status: "disetujui" as const,
    tanggal_seminar: current?.tanggal_seminar ?? current?.tanggal_pengajuan ?? null,
    waktu_mulai: DEFAULT_WAKTU_MULAI,
    waktu_selesai: DEFAULT_WAKTU_SELESAI,
    ruang_seminar: current?.ruang_seminar ?? current?.lokasi ?? DEFAULT_RUANG,
    catatan_dosen: null,
    updated_at: new Date().toISOString(),
  };

  await supabaseAdmin.from("seminar").update(payload).eq("id", id);

  revalidatePath("/teacher/seminar", "layout");
  revalidatePath("/student/seminar", "layout");
  revalidatePath("/student", "layout");
  redirect(`/teacher/seminar?confirmed=1`);
}

/**
 * Reject and propose a new date. Keeps the student loop simple:
 * student sees the note + proposed date on their Jadwal page and re-submits
 * (status goes back to 'diajukan' on their next Daftar Seminar submit).
 */
export async function usulkanJadwalBaru(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const alasan = String(formData.get("alasan") ?? "").trim();
  const tanggalBaru = String(formData.get("tanggal_baru") ?? "");
  if (!id) return;

  await supabaseAdmin
    .from("seminar")
    .update({
      status: "revisi",
      catatan_dosen: alasan || "Mohon ajukan ulang dengan tanggal yang disarankan.",
      tanggal_seminar: tanggalBaru || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/teacher/seminar", "layout");
  revalidatePath("/student/seminar", "layout");
  revalidatePath("/student", "layout");
  redirect(`/teacher/seminar?rejected=1`);
}
