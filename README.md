# Kaigo Strategist Academy (KSA)

Elite learning platform for the Japanese National Care Worker Exam (介護福祉士国家試験).  
Built with React 19, Vite, Tailwind CSS v4, Framer Motion, and Gemini AI.

## Features

- **Vocabulary List** — 5000+ JP↔Burmese caregiving terms
- **Flashcards** — Active recall with TTS pronunciation
- **Mindmaps** — Zoomable Mermaid-powered concept maps
- **Exam Hacks** — Subject-by-subject strategy playbooks
- **Mock Test** — Timed exam simulation with AI feedback

---

## Deploy on Vercel (recommended)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
gh repo create kaigo-strategist-academy --public --push
```

### 2. Import on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Vercel auto-detects Vite — no build settings to change
4. Before deploying, go to **Environment Variables** and add:
   - `GEMINI_API_KEY` → your Gemini API key

### 3. Deploy
Click **Deploy**. Your site will be live at `https://your-project.vercel.app`.

---

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY
```

### 3. Run locally
```bash
npm run dev:all   # Vite on :3000 + Express API proxy on :3001
```

---

## Architecture

```
Browser (React)
    └─ fetch('/api/ai-feedback')
            │
     ┌──────┴──────────────────────────┐
     │ Vercel (production)             │
     │   /api/ai-feedback.ts           │  ← GEMINI_API_KEY (env var, server-only)
     └─────────────────────────────────┘
            │
     ┌──────┴──────────────────────────┐
     │ Local dev                       │
     │   server.ts on :3001 (Express)  │  ← GEMINI_API_KEY (from .env)
     └─────────────────────────────────┘
            │
            └─ @google/genai SDK → Gemini API
```

The API key is **never** bundled into the client JavaScript.
