import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROLE_COOKIE } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabase";

export default async function Home() {
  const store = await cookies();
  const uid = store.get(ROLE_COOKIE)?.value;

  if (!uid) redirect("/login");

  const { data: user } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", uid)
    .maybeSingle();

  if (!user) redirect("/login");

  redirect(user.role === "teacher" ? "/teacher" : "/student");
}
