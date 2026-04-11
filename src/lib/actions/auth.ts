"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROLE_COOKIE } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabase";

export async function login(_prev: { error: string } | null, formData: FormData) {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return { error: "NIM/NIP dan password wajib diisi." };
  }

  // Match by NIM (student) or NIP (teacher)
  const { data: user } = await supabaseAdmin
    .from("profiles")
    .select("id, role, password")
    .or(`nim.eq.${identifier},nip.eq.${identifier}`)
    .maybeSingle();

  if (!user) {
    return { error: "NIM/NIP tidak ditemukan." };
  }

  if (user.password !== password) {
    return { error: "Password salah." };
  }

  const store = await cookies();
  store.set(ROLE_COOKIE, user.id, { path: "/", sameSite: "lax" });

  redirect(user.role === "teacher" ? "/teacher" : "/student");
}

export async function logout() {
  const store = await cookies();
  store.delete(ROLE_COOKIE);
  redirect("/login");
}
