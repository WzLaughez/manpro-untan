import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const secret = process.env.SUPABASE_SECRET_KEY!;

// Browser / RSC client (respects RLS — currently disabled)
export const supabase = createClient(url, publishable, {
  auth: { persistSession: false },
});

// Server-only client with elevated privileges. NEVER import in client components.
export const supabaseAdmin = createClient(url, secret, {
  auth: { persistSession: false },
});

// Seed UUIDs (kept in sync with supabase/schema.sql + migrations)
export const SEED_IDS = {
  studentIfdal: "11111111-1111-1111-1111-111111111111",
  studentSiti: "11111111-1111-1111-1111-111111111112",
  teacherAnggi: "22222222-2222-2222-2222-222222222221",
  teacherAzril: "22222222-2222-2222-2222-222222222222",
} as const;
