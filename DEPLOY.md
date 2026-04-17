# Deployment Guide — Kaigo Strategist Academy

## 1. Supabase Setup

### a) Run the database migration
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **SQL Editor** → **New Query**
3. Paste the entire contents of `supabase/setup.sql` and click **Run**

This creates:
- `profiles` table (user plan: free/paid) + auto-create trigger
- `subject_pdfs` table (PDF metadata per subject)
- Adds `nepali`, `vietnamese`, `japanese_meaning` columns to `vocabulary`
- `flashcards` table (if missing)
- Storage bucket `subject-pdfs` for PDF files
- Row Level Security policies on all tables

### b) Enable Email Auth
Supabase Dashboard → Authentication → Providers → **Email** → Enable

### c) Set Password Reset Redirect URL
Supabase Dashboard → Authentication → URL Configuration  
Add to **Redirect URLs**: `https://ksajapan.jp/reset-password`

---

## 2. Vercel Deployment

### a) Connect repo to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo `thantzinhtunsan-del/ksajapan`
3. Vercel auto-detects Vite — keep all defaults

### b) Set Environment Variables
In Vercel → Project Settings → Environment Variables, add:

| Name | Value | Environments |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Production, Preview |
| `GEMINI_API_KEY` | `AIza...` | Production, Preview |
| `APP_URL` | `https://ksajapan.jp` | Production |

### c) Deploy
Click **Deploy**. Vercel will run `npm run build` and serve from `dist/`.

### d) Custom Domain
Vercel → Project → Settings → Domains → Add `ksajapan.jp` and `www.ksajapan.jp`  
Follow Vercel's DNS instructions to point your domain.

---

## 3. Upload PDF Textbooks (after deployment)

1. Supabase Dashboard → **Storage** → `subject-pdfs` bucket
2. Upload a PDF file (e.g. `shakai-no-rikai-text.pdf`)
3. Click the file → **Get URL** (copy the public URL)
4. Supabase Dashboard → **Table Editor** → `subject_pdfs` → **Insert Row**:

| Column | Value |
|---|---|
| `subject` | `社会の理解` |
| `title` | `社会の理解テキスト` |
| `file_url` | (paste URL from step 3) |
| `is_premium` | `false` (free) or `true` (paid only) |
| `display_order` | `1` |

Repeat for each subject.

---

## 4. Upload Vocabulary Translations

In Supabase → **Table Editor** → `vocabulary`, you can:
- Edit rows directly to add `nepali` and `vietnamese` meanings
- Or **Import CSV** with columns: `word, reading, burmese, nepali, vietnamese, japanese_meaning, category`

---

## 5. Admin Panel Access

Log in with an admin email (`admin@ksajapan.com` or `admin@ksa.com`) →  
Navigate to **My Page** → click **Admin Panel** button at the bottom.

The Admin Panel lets you:
- Add/edit/delete vocabulary words
- Add/edit/delete flashcards
- Manage questions

---

## 6. Make a User "Paid"

Until Stripe is integrated, manually upgrade users in Supabase:  
**Table Editor** → `profiles` → find user row → set `plan` = `paid`

---

## Branch
All changes are on branch: `claude/jlpt-study-platform-3FSYA`  
Merge to `main` when ready to go live.
