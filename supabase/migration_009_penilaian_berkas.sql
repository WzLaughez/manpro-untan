-- ============================================================
-- Migration 009 — Penilaian Berkas (dosen uploads filled-in templates)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

drop type if exists penilaian_doc_key cascade;
create type penilaian_doc_key as enum (
  'form_penilaian',
  'berita_acara',
  'lembar_observasi',
  'form_revisi'
);

drop table if exists penilaian_berkas cascade;
create table penilaian_berkas (
  id           uuid primary key default gen_random_uuid(),
  kp_id        uuid not null references kp_registrations(id) on delete cascade,
  doc_key      penilaian_doc_key not null,
  label        text not null,
  file_name    text,
  file_url     text,
  uploaded_at  timestamptz,
  uploaded_by  uuid references profiles(id),
  unique (kp_id, doc_key)
);

create index penilaian_berkas_kp_idx on penilaian_berkas(kp_id);
alter table penilaian_berkas disable row level security;

-- Storage bucket for dosen-uploaded filled berkas
insert into storage.buckets (id, name, public)
values ('kp-penilaian', 'kp-penilaian', true)
on conflict (id) do nothing;
