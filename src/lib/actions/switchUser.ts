"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROLE_COOKIE } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabase";

export async function switchUser(formData: FormData) {
  const id = String(formData.get("uid") ?? "");
  if (!id) return;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", id)
    .single();

  const store = await cookies();
  store.set(ROLE_COOKIE, id, { path: "/", sameSite: "lax" });

  redirect(profile?.role === "teacher" ? "/teacher" : "/student");
}
