-- ============================================================
-- Migration 005 — Logbook flow (student daily log)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

drop type if exists logbook_status cascade;
create type logbook_status as enum ('draft', 'diajukan', 'disetujui', 'revisi');

drop table if exists logbook cascade;
create table logbook (
  id            uuid primary key default gen_random_uuid(),
  kp_id         uuid not null references kp_registrations(id) on delete cascade,
  student_id    uuid not null references profiles(id) on delete cascade,
  tanggal       date not null,
  aktivitas     text not null,
  kendala       text,
  hasil         text,
  file_name     text,
  file_url      text,
  status        logbook_status not null default 'draft',
  catatan_dosen text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index logbook_kp_idx on logbook(kp_id, tanggal desc);
create index logbook_student_idx on logbook(student_id, tanggal desc);
alter table logbook disable row level security;

-- Storage bucket for logbook attachments
insert into storage.buckets (id, name, public)
values ('kp-logbook', 'kp-logbook', true)
on conflict (id) do nothing;
