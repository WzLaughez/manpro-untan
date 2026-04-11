-- ============================================================
-- MANPRO UNTAN — Schema (Pendaftaran KP flow)
-- Run this in Supabase Dashboard → SQL Editor
-- Safe to re-run: drops and recreates everything below.
-- ============================================================

-- Clean slate (only objects we own)
drop table if exists kp_activity cascade;
drop table if exists kp_documents cascade;
drop table if exists kp_registrations cascade;
drop table if exists profiles cascade;
drop type if exists user_role cascade;
drop type if exists kp_status cascade;
drop type if exists doc_key cascade;

-- ----------- Types -----------
create type user_role as enum ('student', 'teacher', 'admin');
create type kp_status as enum ('draft', 'diajukan', 'verifikasi', 'disetujui', 'ditolak', 'berjalan', 'selesai');
create type doc_key  as enum ('proposal', 'kp_if_00', 'kp_if_01', 'ktm', 'lirs', 'transkrip');

-- ----------- Profiles -----------
create table profiles (
  id          uuid primary key default gen_random_uuid(),
  role        user_role not null,
  name        text not null,
  email       text,
  -- student fields
  nim         text,
  semester    int,
  ipk         numeric(3,2),
  -- teacher fields
  nip         text,
  created_at  timestamptz default now()
);

create index profiles_role_idx on profiles(role);

-- ----------- KP Registrations -----------
create table kp_registrations (
  id                 uuid primary key default gen_random_uuid(),
  student_id         uuid not null references profiles(id) on delete cascade,
  -- form fields
  judul              text not null,
  dosen_pa           text,
  jumlah_sks         int,
  kelompok_keahlian  text,
  ringkasan          text,
  nama_instansi      text,
  alamat_instansi    text,
  nama_narahubung    text,
  no_hp_narahubung   text,
  ttd_url            text,
  mulai              date,
  selesai            date,
  -- workflow
  status             kp_status not null default 'draft',
  dosen_pembimbing_id uuid references profiles(id),
  catatan_dosen      text,
  tanggal_pengajuan  timestamptz,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

create index kp_registrations_student_idx on kp_registrations(student_id);
create index kp_registrations_status_idx  on kp_registrations(status);

-- ----------- KP Documents -----------
create table kp_documents (
  id          uuid primary key default gen_random_uuid(),
  kp_id       uuid not null references kp_registrations(id) on delete cascade,
  doc_key     doc_key not null,
  label       text not null,
  file_name   text,
  file_url    text,
  uploaded_at timestamptz,
  unique (kp_id, doc_key)
);

-- ----------- KP Activity Log -----------
create table kp_activity (
  id         uuid primary key default gen_random_uuid(),
  kp_id      uuid not null references kp_registrations(id) on delete cascade,
  title      text not null,
  created_at timestamptz default now()
);

create index kp_activity_kp_idx on kp_activity(kp_id, created_at desc);

-- ============================================================
-- RLS — DISABLED for now (no auth yet, role switcher mode)
-- We'll enable + write policies when we add real auth.
-- ============================================================
alter table profiles          disable row level security;
alter table kp_registrations  disable row level security;
alter table kp_documents      disable row level security;
alter table kp_activity       disable row level security;

-- ============================================================
-- SEED
-- Deterministic UUIDs so app code can reference them as constants.
-- ============================================================

-- Students
insert into profiles (id, role, name, email, nim, semester, ipk) values
  ('11111111-1111-1111-1111-111111111111', 'student', 'Muhammad Ifdal', 'ifdal@student.untan.ac.id', 'H1101201001', 7, 3.62),
  ('11111111-1111-1111-1111-111111111112', 'student', 'Siti Rahmawati', 'siti@student.untan.ac.id', 'H1101201002', 7, 3.78);

-- Teacher
insert into profiles (id, role, name, email, nip) values
  ('22222222-2222-2222-2222-222222222221', 'teacher', 'Anggi Sri Murdianti Sukamto, S.T., M.T', 'anggi@untan.ac.id', '198501012010012001');

-- KP for Ifdal — already submitted, awaiting dosen verification
insert into kp_registrations (
  id, student_id, judul, dosen_pa, jumlah_sks, kelompok_keahlian, ringkasan,
  nama_instansi, alamat_instansi, nama_narahubung, no_hp_narahubung,
  status, dosen_pembimbing_id, catatan_dosen, tanggal_pengajuan
) values (
  '33333333-3333-3333-3333-333333333331',
  '11111111-1111-1111-1111-111111111111',
  'Pengembangan Sistem Monitoring Internal',
  'Anggi Sri Murdianti Sukamto, S.T., M.T',
  124,
  'Rekayasa Perangkat Lunak',
  'Membangun sistem monitoring internal berbasis web untuk memantau status layanan dan log aktivitas tim engineering.',
  'PT Solusi Digital Khatulistiwa',
  'Jl. Ahmad Yani, Pontianak',
  'Rudi Hartono',
  '0812-3456-7890',
  'diajukan',
  '22222222-2222-2222-2222-222222222221',
  'Proposal kamu sedang diperiksa oleh dosen pembimbing akademik.',
  '2025-10-07 11:21:00+07'
);

-- 6 required documents (only proposal is uploaded)
insert into kp_documents (kp_id, doc_key, label, file_name, uploaded_at) values
  ('33333333-3333-3333-3333-333333333331', 'proposal', 'Proposal Kerja Praktik', 'proposal.pdf', '2025-10-07 11:21:00+07'),
  ('33333333-3333-3333-3333-333333333331', 'kp_if_00', 'KP_IF_00',                null, null),
  ('33333333-3333-3333-3333-333333333331', 'kp_if_01', 'KP_IF_01',                null, null),
  ('33333333-3333-3333-3333-333333333331', 'ktm',      'Kartu Tanda Mahasiswa',   null, null),
  ('33333333-3333-3333-3333-333333333331', 'lirs',     'Lembar Isian Rencana Studi', null, null),
  ('33333333-3333-3333-3333-333333333331', 'transkrip','Transkrip Nilai',         null, null);

-- Activity timeline
insert into kp_activity (kp_id, title, created_at) values
  ('33333333-3333-3333-3333-333333333331', 'Upload Proposal', '2025-10-07 11:21:00+07');

-- ============================================================
-- Storage bucket for uploaded files
-- ============================================================
insert into storage.buckets (id, name, public)
values ('kp-documents', 'kp-documents', true)
on conflict (id) do nothing;
