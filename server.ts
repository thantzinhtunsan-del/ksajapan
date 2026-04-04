import express from 'express';
import bcrypt from 'bcryptjs';
import { GoogleGenAI } from '@google/genai';

const ALLOWED_ORIGINS = ['https://ksajapan.jp', 'https://www.ksajapan.jp'];

const SALT_ROUNDS = 12;

// In-memory user store — replace with a real database (Supabase, etc.)
interface StoredUser {
  name: string;
  email: string;
  passwordHash: string;
}
const users = new Map<string, StoredUser>();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin ?? '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// ─── Auth routes ──────────────────────────────────────────────────────────────

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required.' });
  }
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }
  if (users.has(email.toLowerCase())) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  users.set(email.toLowerCase(), { name, email: email.toLowerCase(), passwordHash });

  return res.status(201).json({ name, email: email.toLowerCase() });
});

app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required.' });
  }

  const user = users.get(email.toLowerCase());
  if (!user) {
    // Constant-time response to avoid user enumeration
    await bcrypt.hash(password, SALT_ROUNDS);
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  return res.status(200).json({ name: user.name, email: user.email });
});

// ─── AI feedback ──────────────────────────────────────────────────────────────

app.post('/api/ai-feedback', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  const { score, total, timeLeft } = req.body;
  if (score === undefined || total === undefined || timeLeft === undefined) {
    return res.status(400).json({ error: 'Missing required fields: score, total, timeLeft' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      A student just finished a Kaigo (Caregiving) mock test.
      Score: ${score} out of ${total}.
      Time left: ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s.
      
      Provide a brief, encouraging, and professional feedback in both Japanese and Burmese.
      Focus on their performance and suggest areas for improvement in caregiving concepts.
      Keep it concise and elite in tone.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    res.json({ feedback: response.text });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(502).json({ error: 'Failed to generate feedback from Gemini API.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API proxy server running on port ${PORT}`);
});
