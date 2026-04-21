-- ============================================================
-- Migration 007 — Seminar flow
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

drop type if exists seminar_status cascade;
create type seminar_status as enum ('diajukan', 'disetujui', 'revisi', 'ditolak', 'selesai');

drop type if exists seminar_doc_key cascade;
create type seminar_doc_key as enum ('laporan_kp', 'form_if_05', 'form_if_06', 'form_if_07');

drop table if exists seminar_documents cascade;
drop table if exists seminar cascade;

create table seminar (
  id                          uuid primary key default gen_random_uuid(),
  kp_id                       uuid not null unique references kp_registrations(id) on delete cascade,
  student_id                  uuid not null references profiles(id) on delete cascade,
  tanggal_pengajuan           date,
  lokasi                      text,
  pembimbing_lapangan         text,
  -- Set by dosen on approval
  tanggal_seminar             date,
  waktu_mulai                 time,
  waktu_selesai               time,
  ruang_seminar               text,
  -- Workflow
  status                      seminar_status not null default 'diajukan',
  catatan_dosen               text,
  -- Attendance
  kehadiran_konfirmasi        boolean not null default false,
  kehadiran_konfirmasi_pada   timestamptz,
  kehadiran_hadir             boolean not null default false,
  kehadiran_hadir_pada        timestamptz,
  kode_presensi               text,
  created_at                  timestamptz default now(),
  updated_at                  timestamptz default now()
);

create index seminar_student_idx on seminar(student_id);
alter table seminar disable row level security;

create table seminar_documents (
  id          uuid primary key default gen_random_uuid(),
  seminar_id  uuid not null references seminar(id) on delete cascade,
  doc_key     seminar_doc_key not null,
  label       text not null,
  file_name   text,
  file_url    text,
  uploaded_at timestamptz,
  unique (seminar_id, doc_key)
);

alter table seminar_documents disable row level security;

-- Storage bucket for seminar files
insert into storage.buckets (id, name, public)
values ('kp-seminar', 'kp-seminar', true)
on conflict (id) do nothing;
