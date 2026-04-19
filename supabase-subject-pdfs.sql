-- Run this in your Supabase SQL Editor
-- ─── Table ────────────────────────────────────────────────────────────────────
create table if not exists subject_pdfs (
  id           uuid        primary key default gen_random_uuid(),
  subject_slug text        not null unique,
  file_path    text        not null,
  file_name    text        not null,
  uploaded_at  timestamptz default now()
);

alter table subject_pdfs enable row level security;

-- Anyone logged-in (users) can read
create policy "Anyone can read subject_pdfs"
  on subject_pdfs for select using (true);

-- Only authenticated users (admin) can insert / update / delete
create policy "Authenticated can manage subject_pdfs"
  on subject_pdfs for all using (auth.role() = 'authenticated');

-- ─── Storage bucket ───────────────────────────────────────────────────────────
-- Run this AFTER creating the table.
-- In Supabase dashboard → Storage → New bucket:
--   Name: subject-pdfs
--   Public: OFF  (private — access via signed URLs only)
--
-- Then add these storage policies in the Storage policy editor:
--
-- Policy 1: Allow authenticated users to upload
--   Bucket: subject-pdfs | Operation: INSERT
--   Policy: (auth.role() = 'authenticated')
--
-- Policy 2: Allow authenticated users to download (for signed URL generation)
--   Bucket: subject-pdfs | Operation: SELECT
--   Policy: (auth.role() = 'authenticated')
--
-- Policy 3: Allow authenticated users to delete
--   Bucket: subject-pdfs | Operation: DELETE
--   Policy: (auth.role() = 'authenticated')
