-- ============================================================
-- Migration 003 — Bimbingan flow
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

drop type if exists bimbingan_status cascade;
create type bimbingan_status as enum ('diajukan', 'disetujui', 'revisi');

drop table if exists bimbingan cascade;
create table bimbingan (
  id            uuid primary key default gen_random_uuid(),
  kp_id         uuid not null references kp_registrations(id) on delete cascade,
  student_id    uuid not null references profiles(id) on delete cascade,
  tanggal       date not null,
  jenis         text not null,
  ringkasan     text,
  file_name     text,
  file_url      text,
  status        bimbingan_status not null default 'diajukan',
  catatan_dosen text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index bimbingan_kp_idx on bimbingan(kp_id, created_at desc);
create index bimbingan_student_idx on bimbingan(student_id);
alter table bimbingan disable row level security;

-- Seed: 6 sample bimbingan entries for Ifdal
-- (his KP must be 'disetujui' first — run migration_001 approval or set manually)

-- First set Ifdal's KP to disetujui so the dashboard shows the green banner
update kp_registrations
set status = 'disetujui',
    catatan_dosen = 'Proposal disetujui oleh dosen pembimbing.'
where id = '33333333-3333-3333-3333-333333333331';

insert into bimbingan (kp_id, student_id, tanggal, jenis, ringkasan, status, catatan_dosen) values
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '2025-11-20', 'Review Project',        'Review keseluruhan progress project.', 'disetujui', null),
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '2025-11-19', 'Tambahan Fitur',         'Diskusi fitur dashboard analytics.', 'disetujui', null),
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '2025-07-10', 'Penentuan Scope',        'Menentukan scope pengerjaan project.', 'disetujui', 'Scope sudah sesuai.'),
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '2025-07-05', 'Pengajuan Judul Awal',   'Mengajukan judul awal KP.', 'revisi', 'Revisi scope pengerjaannya, tanyakan lebih lanjut kepada mitra, tujuan akhir dari project tersebut apa?'),
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '2025-08-15', 'Revisi Teknis',          'Revisi arsitektur backend.', 'revisi', 'Pertimbangkan ulang arsitekturnya.'),
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '2025-08-10', 'Progres Bab 1',          'Progress penulisan bab 1.', 'diajukan', null);
