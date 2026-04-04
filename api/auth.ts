/**
 * api/auth.ts — Vercel serverless auth handler
 * POST /api/auth?action=signup  { name, email, password }
 * POST /api/auth?action=signin  { email, password }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';

const ALLOWED_ORIGINS = ['https://ksajapan.jp', 'https://www.ksajapan.jp'];

// In-memory user store — replace with a real database (Supabase, etc.)
interface StoredUser {
  name: string;
  email: string;
  passwordHash: string;
}

const users = new Map<string, StoredUser>();

const SALT_ROUNDS = 12;

function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers.origin as string) ?? '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const action = req.query.action as string;

  if (action === 'signup') {
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
  }

  if (action === 'signin') {
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
  }

  return res.status(400).json({ error: 'Invalid action. Use ?action=signup or ?action=signin.' });
}
