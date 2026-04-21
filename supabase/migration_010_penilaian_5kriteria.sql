-- ============================================================
-- Migration 010 — Penilaian KP: 5-criteria scoring
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================
-- Swaps the old 3-criteria columns (laporan/presentasi/etika)
-- for 5 new columns matching the student's Nilai page:
--   1. Kerajinan dan aktivitas di lapangan   (10%)
--   2. Kemampuan Mengemukakan Ide            (10%)
--   3. Kemampuan Menganalisa Persoalan       (15%)
--   4. Kemampuan Memberikan Solusi           (15%)
--   5. Hasil Penugasan                       (50%)
-- ============================================================

-- Existing test scores will be lost (columns dropped).
alter table penilaian_kp drop column if exists skor_laporan;
alter table penilaian_kp drop column if exists skor_presentasi;
alter table penilaian_kp drop column if exists skor_etika;
alter table penilaian_kp drop column if exists feedback_laporan;
alter table penilaian_kp drop column if exists feedback_presentasi;
alter table penilaian_kp drop column if exists feedback_etika;

-- New score columns
alter table penilaian_kp add column if not exists skor_kerajinan  int;
alter table penilaian_kp add column if not exists skor_ide        int;
alter table penilaian_kp add column if not exists skor_analisa    int;
alter table penilaian_kp add column if not exists skor_solusi     int;
alter table penilaian_kp add column if not exists skor_penugasan  int;

-- New feedback columns
alter table penilaian_kp add column if not exists feedback_kerajinan  text;
alter table penilaian_kp add column if not exists feedback_ide        text;
alter table penilaian_kp add column if not exists feedback_analisa    text;
alter table penilaian_kp add column if not exists feedback_solusi     text;
alter table penilaian_kp add column if not exists feedback_penugasan  text;
