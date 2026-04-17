-- ============================================================
-- KSA (Kaigo Strategist Academy) — Supabase Setup SQL
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. User profiles ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  plan        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'paid')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on new user sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- ── 2. Subject PDFs ───────────────────────────────────────────
-- Store PDF metadata; actual files go in Supabase Storage bucket "subject-pdfs"
CREATE TABLE IF NOT EXISTS public.subject_pdfs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject       TEXT NOT NULL,         -- e.g. '社会の理解'
  title         TEXT NOT NULL,
  file_url      TEXT NOT NULL,         -- Supabase Storage public URL
  is_premium    BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: anyone logged in can read; only service_role can insert/update/delete
ALTER TABLE public.subject_pdfs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read PDFs"
  ON public.subject_pdfs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role full access to subject_pdfs"
  ON public.subject_pdfs FOR ALL TO service_role USING (true);


-- ── 3. Vocabulary (extend existing table) ────────────────────
-- If the vocabulary table already exists, add the 3 new language columns.
-- If it does not exist yet, create it from scratch.

DO $$
BEGIN
  -- Add columns only if table exists and columns are missing
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vocabulary') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns
                   WHERE table_name = 'vocabulary' AND column_name = 'nepali') THEN
      ALTER TABLE public.vocabulary ADD COLUMN nepali TEXT;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns
                   WHERE table_name = 'vocabulary' AND column_name = 'vietnamese') THEN
      ALTER TABLE public.vocabulary ADD COLUMN vietnamese TEXT;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns
                   WHERE table_name = 'vocabulary' AND column_name = 'japanese_meaning') THEN
      ALTER TABLE public.vocabulary ADD COLUMN japanese_meaning TEXT;
    END IF;
  ELSE
    CREATE TABLE public.vocabulary (
      id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      word              TEXT NOT NULL,
      reading           TEXT,
      burmese           TEXT,
      nepali            TEXT,
      vietnamese        TEXT,
      japanese_meaning  TEXT,
      category          TEXT,
      created_at        TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
-- Allow any authenticated user to read vocabulary
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'vocabulary' AND policyname = 'Authenticated users can read vocabulary'
  ) THEN
    EXECUTE 'CREATE POLICY "Authenticated users can read vocabulary"
      ON public.vocabulary FOR SELECT TO authenticated USING (true)';
  END IF;
END $$;


-- ── 4. Supabase Storage bucket for PDFs ──────────────────────
-- Run this separately in the Storage section, OR via SQL:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'subject-pdfs',
  'subject-pdfs',
  false,                    -- NOT public — access via signed URLs
  52428800,                 -- 50 MB max per file
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: authenticated users can read; only service_role can upload/delete
CREATE POLICY "Authenticated users can read PDFs from storage"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'subject-pdfs');

CREATE POLICY "Service role can manage PDF storage"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'subject-pdfs');


-- ── 5. Flashcards (ensure exists for admin panel) ────────────
CREATE TABLE IF NOT EXISTS public.flashcards (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  front    TEXT NOT NULL,
  back     TEXT NOT NULL,
  reading  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'flashcards' AND policyname = 'Authenticated users can read flashcards'
  ) THEN
    EXECUTE 'CREATE POLICY "Authenticated users can read flashcards"
      ON public.flashcards FOR SELECT TO authenticated USING (true)';
  END IF;
END $$;
