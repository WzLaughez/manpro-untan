-- ============================================================
-- Migration 002 — Simple login (NIM/NIP + password)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Add password column (plain text — prototype only, NOT production-safe)
alter table profiles add column if not exists password text not null default '123456';

-- Set demo passwords
update profiles set password = '123456' where password = '123456';

-- Quick reference:
--   Muhammad Ifdal     → NIM: H1101201001 / password: 123456
--   Siti Rahmawati     → NIM: H1101201002 / password: 123456
--   Anggi S.M.S.       → NIP: 198501012010012001 / password: 123456
--   Azril Pratama      → NIP: 199001152015011001 / password: 123456