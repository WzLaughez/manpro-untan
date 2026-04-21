-- ============================================================
-- Migration 008 — Penilaian KP (final grade)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

drop table if exists penilaian_kp cascade;
create table penilaian_kp (
  id                  uuid primary key default gen_random_uuid(),
  kp_id               uuid not null unique references kp_registrations(id) on delete cascade,
  seminar_id          uuid references seminar(id) on delete set null,
  student_id          uuid not null references profiles(id) on delete cascade,
  dosen_id            uuid not null references profiles(id),
  -- Scores (60-100, step 5)
  skor_laporan        int,
  skor_presentasi     int,
  skor_etika          int,
  -- Feedback per criterion
  feedback_laporan    text,
  feedback_presentasi text,
  feedback_etika      text,
  -- Additional
  komentar_tambahan   text,
  -- Computed final grade (weighted avg: 40/30/30)
  nilai_akhir         numeric(5,2),
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index penilaian_kp_student_idx on penilaian_kp(student_id);
alter table penilaian_kp disable row level security;
