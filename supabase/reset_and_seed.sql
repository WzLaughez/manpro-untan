-- ============================================================
-- MANPRO UNTAN — Full reset + seed 8 users
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================
-- Wipes ALL data and reseeds 4 students + 4 teachers.
-- Table structures, enums, and storage buckets are preserved.
-- ============================================================

-- 1. Wipe all data (children first, cascades handle the rest)
delete from penilaian_berkas;
delete from penilaian_kp;
delete from seminar_documents;
delete from seminar;
delete from laporan_akhir;
delete from logbook;
delete from bimbingan;
delete from kp_comments;
delete from kp_activity;
delete from kp_documents;
delete from kp_registrations;
delete from profiles;

-- 2. Seed 4 students
--    Login: NIM + password "123456"
insert into profiles (id, role, name, email, nim, semester, ipk, password) values
  ('11111111-1111-1111-1111-111111111111', 'student', 'Muhammad Ifdal',   'ifdal@student.untan.ac.id',   '11111', 7, 3.62, '123456'),
  ('11111111-1111-1111-1111-111111111112', 'student', 'Siti Nurhaliza',   'siti@student.untan.ac.id',    '22222', 7, 3.78, '123456'),
  ('11111111-1111-1111-1111-111111111113', 'student', 'Bagas Pradana',    'bagas@student.untan.ac.id',   '33333', 7, 3.45, '123456'),
  ('11111111-1111-1111-1111-111111111114', 'student', 'Dewi Kartika',     'dewi@student.untan.ac.id',    '44444', 7, 3.55, '123456');

-- 3. Seed 4 teachers
--    Login: NIP + password "123456"
insert into profiles (id, role, name, email, nip, password) values
  -- Pembimbing
  ('22222222-2222-2222-2222-222222222221', 'teacher', 'Anggi Perwitasari, S.T., M.T.',     'anggi@untan.ac.id',  '55555', '123456'),
  ('22222222-2222-2222-2222-222222222222', 'teacher', 'Dr. Ir. Yus Sholva, S.T., M.T.',    'yus@untan.ac.id',    '66666', '123456'),
  -- Penguji
  ('22222222-2222-2222-2222-222222222223', 'teacher', 'H. Hengky Anra, S.T., M.Kom.',      'hengky@untan.ac.id', '77777', '123456'),
  ('22222222-2222-2222-2222-222222222224', 'teacher', 'Rifqi Anugrah, S.Kom., M.Kom.',     'rifqi@untan.ac.id',  '88888', '123456');

-- 4. Verify
select id, role, name, nim, nip from profiles order by role desc, name;

-- ============================================================
-- LOGIN CHEATSHEET (semua password: 123456)
-- ============================================================
-- Students:
--   11111 → Muhammad Ifdal
--   22222 → Siti Nurhaliza
--   33333 → Bagas Pradana
--   44444 → Dewi Kartika
--
-- Teachers (Pembimbing):
--   55555 → Anggi Perwitasari, S.T., M.T.
--   66666 → Dr. Ir. Yus Sholva, S.T., M.T.
--
-- Teachers (Penguji):
--   77777 → H. Hengky Anra, S.T., M.Kom.
--   88888 → Rifqi Anugrah, S.Kom., M.Kom.
-- ============================================================
