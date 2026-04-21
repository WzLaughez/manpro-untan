"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/currentUser";
import { REQUIRED_SEMINAR_DOCS } from "@/lib/data/seminar";
import { supabaseAdmin } from "@/lib/supabase";

async function getKPId(studentId: string) {
  const { data } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("student_id", studentId)
    .maybeSingle();
  return data?.id ?? null;
}

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

/**
 * Ensure the seminar row exists with the 4 doc slots.
 * Used before any file upload.
 */
async function ensureSeminar(studentId: string, kpId: string) {
  const { data: existing } = await supabaseAdmin
    .from("seminar")
    .select("id")
    .eq("kp_id", kpId)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabaseAdmin
    .from("seminar")
    .insert({
      kp_id: kpId,
      student_id: studentId,
      kode_presensi: randomCode(),
      status: "diajukan", // moves via daftarSeminar which keeps it 'diajukan'
    })
    .select("id")
    .single();
  if (error || !created) throw new Error(error?.message ?? "Create seminar failed");

  await supabaseAdmin.from("seminar_documents").insert(
    REQUIRED_SEMINAR_DOCS.map((d) => ({
      seminar_id: created.id,
      doc_key: d.key,
      label: d.label,
    })),
  );

  return created.id;
}

async function uploadOneDoc(
  seminarId: string,
  docKey: string,
  file: File,
) {
  const ext = file.name.split(".").pop() ?? "pdf";
  const safeName = file.name.replace(/[^\w.\-]/g, "_");
  const path = `${docKey}/${seminarId}-${Date.now()}-${safeName}`;

  const { error } = await supabaseAdmin.storage
    .from("kp-seminar")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) {
    throw new Error(
      `Seminar upload failed (${docKey}): ${error.message}. Pastikan bucket 'kp-seminar' sudah dibuat.`,
    );
  }

  const { data: pub } = supabaseAdmin.storage
    .from("kp-seminar")
    .getPublicUrl(path);

  await supabaseAdmin
    .from("seminar_documents")
    .update({
      file_name: file.name,
      file_url: pub.publicUrl,
      uploaded_at: new Date().toISOString(),
    })
    .eq("seminar_id", seminarId)
    .eq("doc_key", docKey);
}

/**
 * Single action: save info + upload all picked files + submit pengajuan.
 * File inputs are named `file_<doc_key>`. Only files that were actually picked
 * (size > 0) get uploaded; others keep their previous state.
 */
export async function daftarSeminar(formData: FormData) {
  const studentId = await getCurrentUserId();
  const kpId = await getKPId(studentId);
  if (!kpId) return;

  const seminarId = await ensureSeminar(studentId, kpId);

  // 1. Upload any files the student picked
  const docKeys = ["laporan_kp", "form_if_05", "form_if_06", "form_if_07"];
  for (const key of docKeys) {
    const file = formData.get(`file_${key}`) as File | null;
    if (file && file.size > 0) {
      await uploadOneDoc(seminarId, key, file);
    }
  }

  // 2. Save info fields
  const tanggal = String(formData.get("tanggal_pengajuan") ?? "");
  const lokasi = String(formData.get("lokasi") ?? "").trim();
  const pembimbingLapangan = String(
    formData.get("pembimbing_lapangan") ?? "",
  ).trim();

  await supabaseAdmin
    .from("seminar")
    .update({
      tanggal_pengajuan: tanggal || null,
      lokasi: lokasi || null,
      pembimbing_lapangan: pembimbingLapangan || null,
      status: "diajukan",
      updated_at: new Date().toISOString(),
    })
    .eq("id", seminarId);

  revalidatePath("/student/seminar", "layout");
  revalidatePath("/student", "layout");
  redirect("/student/seminar/daftar?saved=1");
}

export async function konfirmasiKehadiran() {
  const studentId = await getCurrentUserId();
  const { data: seminar } = await supabaseAdmin
    .from("seminar")
    .select("id")
    .eq("student_id", studentId)
    .maybeSingle();
  if (!seminar) return;

  await supabaseAdmin
    .from("seminar")
    .update({
      kehadiran_konfirmasi: true,
      kehadiran_konfirmasi_pada: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", seminar.id);

  revalidatePath("/student/seminar", "layout");
  redirect("/student/seminar/jadwal?confirmed=1");
}

export async function submitPresensi(formData: FormData) {
  const studentId = await getCurrentUserId();
  const input = String(formData.get("kode") ?? "").trim().toUpperCase();

  const { data: seminar } = await supabaseAdmin
    .from("seminar")
    .select("id, kode_presensi")
    .eq("student_id", studentId)
    .maybeSingle();
  if (!seminar) return { error: "Seminar belum diajukan." };

  if (input !== (seminar.kode_presensi ?? "")) {
    return { error: "Kode presensi salah. Silakan coba lagi." };
  }

  await supabaseAdmin
    .from("seminar")
    .update({
      kehadiran_hadir: true,
      kehadiran_hadir_pada: new Date().toISOString(),
      status: "selesai",
      updated_at: new Date().toISOString(),
    })
    .eq("id", seminar.id);

  revalidatePath("/student/seminar", "layout");
  redirect("/student/seminar/jadwal?presensi=1");
}
