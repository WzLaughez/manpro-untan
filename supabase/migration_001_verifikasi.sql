-- ============================================================
-- Migration 001 — Teacher Verifikasi Proposal flow
-- Run this in Supabase Dashboard → SQL Editor (one shot)
-- ============================================================

-- 1. Add 'revisi' status (asks student to revise; not the same as ditolak)
alter type kp_status add value if not exists 'revisi' before 'ditolak';

-- 2. Comments table (separate from catatan_dosen — supports multiple comments)
drop table if exists kp_comments cascade;
create table kp_comments (
  id         uuid primary key default gen_random_uuid(),
  kp_id      uuid not null references kp_registrations(id) on delete cascade,
  author_id  uuid not null references profiles(id),
  body       text not null,
  created_at timestamptz default now()
);
create index kp_comments_kp_idx on kp_comments(kp_id, created_at desc);
alter table kp_comments disable row level security;

-- 3. Add Azril Pratama as a second teacher
insert into profiles (id, role, name, email, nip)
values (
  '22222222-2222-2222-2222-222222222222',
  'teacher',
  'Azril Pratama, S.Kom., M.T',
  'azril@untan.ac.id',
  '199001152015011001'
)
on conflict (id) do nothing;

-- 4. Reassign Ifdal's seeded proposal to Azril so the demo flow works:
--    switch to Azril in the role switcher → see 1 pending verifikasi
update kp_registrations
set dosen_pembimbing_id = '22222222-2222-2222-2222-222222222222',
    dosen_pa = 'Azril Pratama, S.Kom., M.T'
where id = '33333333-3333-3333-3333-333333333331';
