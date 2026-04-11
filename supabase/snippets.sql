-- ============================================================
-- MANPRO UNTAN — Quick SQL snippets (reminders)
-- Paste any block into Supabase Dashboard → SQL Editor → Run
-- ============================================================


-- ─────────────────────────────────────────────
-- 1. ADD A STUDENT
-- ─────────────────────────────────────────────
insert into profiles (role, name, email, nim, semester, ipk)
values ('student', 'Budi Setiawan', 'budi@student.untan.ac.id', 'H1101201003', 6, 3.45);


-- ─────────────────────────────────────────────
-- 2. ADD A TEACHER (DOSEN)
-- ─────────────────────────────────────────────
insert into profiles (role, name, email, nip)
values ('teacher', 'Dr. Rina Hartati, M.Kom', 'rina@untan.ac.id', '198803152012012003');


-- ─────────────────────────────────────────────
-- 3. ADD A STUDENT *AND* CREATE A DRAFT KP FOR THEM
--    (so the dashboard shows the KP flow immediately)
-- ─────────────────────────────────────────────
with new_student as (
  insert into profiles (role, name, email, nim, semester, ipk)
  values ('student', 'Dewi Lestari', 'dewi@student.untan.ac.id', 'H1101201004', 7, 3.55)
  returning id
),
new_kp as (
  insert into kp_registrations (
    student_id, judul, dosen_pa, jumlah_sks, kelompok_keahlian, ringkasan,
    nama_instansi, alamat_instansi, nama_narahubung, no_hp_narahubung, status
  )
  select
    id,
    'Aplikasi Inventaris Berbasis Web',
    'Dr. Rina Hartati, M.Kom',
    120,
    'Sistem Informasi',
    'Membangun aplikasi inventaris untuk UMKM lokal.',
    'CV Berkah Jaya',
    'Jl. Gajah Mada, Pontianak',
    'Hendra',
    '0813-1111-2222',
    'draft'
  from new_student
  returning id
)
-- pre-create the 6 required document slots
insert into kp_documents (kp_id, doc_key, label)
select id, key::doc_key, label from new_kp
cross join (values
  ('proposal',  'Proposal Kerja Praktik'),
  ('kp_if_00',  'KP_IF_00'),
  ('kp_if_01',  'KP_IF_01'),
  ('ktm',       'Kartu Tanda Mahasiswa'),
  ('lirs',      'Lembar Isian Rencana Studi'),
  ('transkrip', 'Transkrip Nilai')
) as docs(key, label);


-- ─────────────────────────────────────────────
-- 4. PROMOTE A KP THROUGH THE WORKFLOW
-- ─────────────────────────────────────────────
-- Submit (student → diajukan)
update kp_registrations
set status = 'diajukan', tanggal_pengajuan = now()
where student_id = (select id from profiles where nim = 'H1101201001');

-- Approve (dosen → disetujui)
update kp_registrations
set status = 'disetujui',
    catatan_dosen = 'Proposal disetujui. Silakan lanjut ke tahap bimbingan.'
where student_id = (select id from profiles where nim = 'H1101201001');

-- Reject (dosen → ditolak)
update kp_registrations
set status = 'ditolak',
    catatan_dosen = 'Mohon revisi judul agar lebih spesifik.'
where student_id = (select id from profiles where nim = 'H1101201001');

-- Reset to draft (so the dashboard shows the empty CTA cards)
update kp_registrations
set status = 'draft', tanggal_pengajuan = null, catatan_dosen = null
where student_id = (select id from profiles where nim = 'H1101201001');


-- ─────────────────────────────────────────────
-- 5. ADD AN ACTIVITY LOG ENTRY (timeline on Status page)
-- ─────────────────────────────────────────────
insert into kp_activity (kp_id, title)
select id, 'Dosen meminta revisi proposal'
from kp_registrations
where student_id = (select id from profiles where nim = 'H1101201001');


-- ─────────────────────────────────────────────
-- 6. MARK A DOCUMENT AS UPLOADED (without real file upload)
-- ─────────────────────────────────────────────
update kp_documents
set file_name = 'ktm-ifdal.pdf', uploaded_at = now()
where doc_key = 'ktm'
  and kp_id = (
    select id from kp_registrations
    where student_id = (select id from profiles where nim = 'H1101201001')
  );


-- ─────────────────────────────────────────────
-- 7. INSPECT — quick read queries
-- ─────────────────────────────────────────────
select id, role, name, nim, nip from profiles order by role, name;

select r.id, p.name as student, r.judul, r.status, r.tanggal_pengajuan
from kp_registrations r join profiles p on p.id = r.student_id
order by r.created_at desc;

select d.doc_key, d.label, d.file_name, d.uploaded_at
from kp_documents d
join kp_registrations r on r.id = d.kp_id
join profiles p on p.id = r.student_id
where p.nim = 'H1101201001'
order by d.doc_key;


-- ─────────────────────────────────────────────
-- 8. DELETE A USER (cascades to their KP, docs, activity)
-- ─────────────────────────────────────────────
delete from profiles where nim = 'H1101201003';


-- ─────────────────────────────────────────────
-- 9. WIPE ALL KP DATA (keep profiles)
-- ─────────────────────────────────────────────
-- delete from kp_activity;
-- delete from kp_documents;
-- delete from kp_registrations;
