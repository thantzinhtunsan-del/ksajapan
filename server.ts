import express from 'express';
import { GoogleGenAI } from '@google/genai';

const ALLOWED_ORIGINS = ['https://ksajapan.jp', 'https://www.ksajapan.jp'];

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
