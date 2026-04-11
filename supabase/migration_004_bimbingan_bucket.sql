-- ============================================================
-- Migration 004 — Bimbingan storage bucket
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Create dedicated bucket for bimbingan files
insert into storage.buckets (id, name, public)
values ('kp-bimbingan', 'kp-bimbingan', true)
on conflict (id) do nothing;
