-- ============================================================
-- MANPRO UNTAN — Reset all data EXCEPT profiles (users)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================
-- This wipes:
--   • bimbingan (all entries)
--   • kp_comments
--   • kp_activity
--   • kp_documents
--   • kp_registrations
-- Keeps:
--   • profiles (Ifdal, Siti, Anggi, Azril + any added)
--   • enums, tables, buckets
-- ============================================================

-- FK cascades handle this automatically if you delete kp_registrations,
-- but explicit is safer / clearer:
delete from bimbingan;
delete from kp_comments;
delete from kp_activity;
delete from kp_documents;
delete from kp_registrations;

-- Verify
select 'profiles' as table_name, count(*) from profiles
union all select 'kp_registrations', count(*) from kp_registrations
union all select 'kp_documents', count(*) from kp_documents
union all select 'kp_activity', count(*) from kp_activity
union all select 'kp_comments', count(*) from kp_comments
union all select 'bimbingan', count(*) from bimbingan;
