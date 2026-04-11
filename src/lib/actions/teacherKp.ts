"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabase";

async function logActivity(kpId: string, title: string) {
  await supabaseAdmin.from("kp_activity").insert({ kp_id: kpId, title });
}

export async function approveKP(formData: FormData) {
  const kpId = String(formData.get("kp_id") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (!kpId) return;

  const teacherId = await getCurrentUserId();

  // Claim the proposal: this teacher becomes the dosen pembimbing
  const { data: teacher } = await supabaseAdmin
    .from("profiles")
    .select("name")
    .eq("id", teacherId)
    .single();

  await supabaseAdmin
    .from("kp_registrations")
    .update({
      status: "disetujui",
      dosen_pembimbing_id: teacherId,
      dosen_pa: teacher?.name ?? null,
      catatan_dosen: note || "Proposal disetujui oleh dosen pembimbing.",
    })
    .eq("id", kpId);

  if (note) {
    await supabaseAdmin.from("kp_comments").insert({
      kp_id: kpId,
      author_id: teacherId,
      body: note,
    });
  }

  await logActivity(kpId, "Proposal disetujui oleh dosen");

  revalidatePath("/teacher", "layout");
  revalidatePath("/student", "layout");
  redirect("/teacher/verifikasi?action=approved");
}

export async function requestRevisionKP(formData: FormData) {
  const kpId = String(formData.get("kp_id") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (!kpId) return;

  const teacherId = await getCurrentUserId();

  // Claim the proposal: teacher who asks for revision owns the conversation
  const { data: teacher } = await supabaseAdmin
    .from("profiles")
    .select("name")
    .eq("id", teacherId)
    .single();

  await supabaseAdmin
    .from("kp_registrations")
    .update({
      status: "revisi",
      dosen_pembimbing_id: teacherId,
      dosen_pa: teacher?.name ?? null,
      catatan_dosen: note || "Mohon revisi proposal sesuai komentar.",
    })
    .eq("id", kpId);

  if (note) {
    await supabaseAdmin.from("kp_comments").insert({
      kp_id: kpId,
      author_id: teacherId,
      body: note,
    });
  }

  await logActivity(kpId, "Dosen meminta revisi proposal");

  revalidatePath("/teacher", "layout");
  revalidatePath("/student", "layout");
  redirect("/teacher/verifikasi?action=revisi");
}

export async function addKPComment(formData: FormData) {
  const kpId = String(formData.get("kp_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!kpId || !body) return;

  const teacherId = await getCurrentUserId();

  await supabaseAdmin.from("kp_comments").insert({
    kp_id: kpId,
    author_id: teacherId,
    body,
  });

  revalidatePath(`/teacher/verifikasi/${kpId}`);
}
