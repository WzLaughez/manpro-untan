"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabase";

const REQUIRED_DOCS = [
  { key: "proposal", label: "Proposal Kerja Praktik" },
  { key: "kp_if_00", label: "KP_IF_00" },
  { key: "kp_if_01", label: "KP_IF_01" },
  { key: "ktm", label: "Kartu Tanda Mahasiswa" },
  { key: "lirs", label: "Lembar Isian Rencana Studi" },
  { key: "transkrip", label: "Transkrip Nilai" },
] as const;

function str(v: FormDataEntryValue | null) {
  return v == null ? null : String(v);
}
function num(v: FormDataEntryValue | null) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

async function uploadTtd(file: File, studentId: string): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = file.name.split(".").pop() ?? "png";
  const path = `ttd/${studentId}-${Date.now()}.${ext}`;
  const { error } = await supabaseAdmin.storage
    .from("kp-documents")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) {
    console.error("TTD upload failed:", error.message);
    return null;
  }
  const { data } = supabaseAdmin.storage.from("kp-documents").getPublicUrl(path);
  return data.publicUrl;
}

export async function saveKPForm(formData: FormData) {
  const studentId = await getCurrentUserId();

  const ttdFile = formData.get("ttd") as File | null;
  const ttdUrl = ttdFile ? await uploadTtd(ttdFile, studentId) : null;

  const payload: Record<string, unknown> = {
    student_id: studentId,
    judul: str(formData.get("judul")) ?? "",
    dosen_pa: str(formData.get("dosen_pa")),
    jumlah_sks: num(formData.get("jumlah_sks")),
    kelompok_keahlian: str(formData.get("kelompok_keahlian")),
    ringkasan: str(formData.get("ringkasan")),
    nama_instansi: str(formData.get("nama_instansi")),
    alamat_instansi: str(formData.get("alamat_instansi")),
    nama_narahubung: str(formData.get("nama_narahubung")),
    no_hp_narahubung: str(formData.get("no_hp_narahubung")),
    updated_at: new Date().toISOString(),
  };
  if (ttdUrl) payload.ttd_url = ttdUrl;

  // Upsert by student_id (each student has at most 1 KP for now)
  const { data: existing } = await supabaseAdmin
    .from("kp_registrations")
    .select("id")
    .eq("student_id", studentId)
    .maybeSingle();

  let kpId: string;

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("kp_registrations")
      .update(payload)
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error) throw error;
    kpId = data.id;
  } else {
    const { data, error } = await supabaseAdmin
      .from("kp_registrations")
      .insert({ ...payload, status: "draft" })
      .select("id")
      .single();
    if (error) throw error;
    kpId = data.id;

    // Pre-create the 6 required document slots
    await supabaseAdmin.from("kp_documents").insert(
      REQUIRED_DOCS.map((d) => ({
        kp_id: kpId,
        doc_key: d.key,
        label: d.label,
      })),
    );

    await supabaseAdmin.from("kp_activity").insert({
      kp_id: kpId,
      title: "Form Pendaftaran disimpan",
    });
  }

  revalidatePath("/student", "layout");
  redirect("/student/pendaftaran/upload");
}

export async function submitKP() {
  const studentId = await getCurrentUserId();

  const { data: kp } = await supabaseAdmin
    .from("kp_registrations")
    .select("id, status")
    .eq("student_id", studentId)
    .maybeSingle();

  if (!kp) return;

  await supabaseAdmin
    .from("kp_registrations")
    .update({
      status: "diajukan",
      tanggal_pengajuan: new Date().toISOString(),
    })
    .eq("id", kp.id);

  await supabaseAdmin.from("kp_activity").insert({
    kp_id: kp.id,
    title: "Proposal disubmit untuk verifikasi dosen",
  });

  revalidatePath("/student", "layout");
  redirect("/student/pendaftaran/status?submitted=1");
}
