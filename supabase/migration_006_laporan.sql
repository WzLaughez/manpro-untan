-- ============================================================
-- Migration 006 — Laporan Akhir (final report)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

drop type if exists laporan_status cascade;
create type laporan_status as enum ('draft', 'diajukan', 'diterima', 'revisi');

drop table if exists laporan_akhir cascade;
create table laporan_akhir (
  id                  uuid primary key default gen_random_uuid(),
  kp_id               uuid not null unique references kp_registrations(id) on delete cascade,
  student_id          uuid not null references profiles(id) on delete cascade,
  file_name           text,
  file_url            text,
  lampiran_name       text,
  lampiran_url        text,
  catatan_mahasiswa   text,
  status              laporan_status not null default 'draft',
  catatan_dosen       text,
  verifikasi_oleh     uuid references profiles(id),
  tanggal_verifikasi  timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index laporan_akhir_student_idx on laporan_akhir(student_id);
alter table laporan_akhir disable row level security;

-- Storage bucket for laporan files
insert into storage.buckets (id, name, public)
values ('kp-laporan', 'kp-laporan', true)
on conflict (id) do nothing;
