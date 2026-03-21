import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
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

    return res.status(200).json({ feedback: response.text });
  } catch (err) {
    console.error('Gemini API error:', err);
    return res.status(502).json({ error: 'Failed to generate feedback from Gemini API.' });
  }
}
