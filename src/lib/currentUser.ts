import { cookies } from "next/headers";
import { SEED_IDS, supabaseAdmin } from "./supabase";

const COOKIE = "manpro_uid";

export async function getCurrentUserId(): Promise<string> {
  const store = await cookies();
  return store.get(COOKIE)?.value ?? SEED_IDS.studentIfdal;
}

export async function getCurrentUser() {
  const id = await getCurrentUserId();

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (data) return data;

  // Fall back to Ifdal if cookie is stale
  const { data: fallback } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", SEED_IDS.studentIfdal)
    .maybeSingle();
  if (fallback) return fallback;

  throw new Error(
    "No profiles found in Supabase. Did you run supabase/schema.sql in the SQL Editor? " +
      "Open the file, copy-paste into Dashboard → SQL Editor → Run.",
  );
}

export async function listProfiles() {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id, name, role, nim, nip")
    .order("role")
    .order("name");
  return data ?? [];
}

export const ROLE_COOKIE = COOKIE;
