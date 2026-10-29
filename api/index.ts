import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini SDK with server-side environment key
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Al-Qiraah MA Kelas 10 Backend',
    geminiConfigured: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

/**
 * AI Tutor Q&A for Maharah Qira'ah MA Kelas 10
 */
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  try {
    const { question, contextText, title } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server environment.',
      });
    }

    const systemInstruction = `Anda adalah "Ustadz AI", tutor bahasa Arab interaktif spesialis Maharah Qiraah (kemampuan membaca & memahami teks) untuk siswa Madrasah Aliyah (MA) Kelas 10 di Indonesia.
Pedoman Anda:
1. Berikan penjelasan yang ramah, mendidik, santun, dan mudah dipahami siswa SMA/MA.
2. Jelaskan kosakata (mufradat), makna kata dalam konteks, harakat, serta kaidah qawaid/nahwu-sharaf dasar kelas 10 (seperti Mubtada-Khabar, Fiil-Fail, Dhomir, Isim Isyarah, Naat-Manut).
3. Jika menuliskan kalimat atau kata Arab, selalu sertakan HARAKAT lengkap yang benar.
4. Gunakan bahasa Indonesia sebagai bahasa pengantar, disertai teks Arab berharakat.
5. Format jawaban terstruktur dengan rapi menggunakan poin-poin yang mudah dibaca siswa.`;

    const prompt = `Materi Bacaan Qiraah: ${title || "Teks Qiraah MA 10"}
Teks Referensi:
"""
${contextText || "Tidak ada konteks teks khusus"}
"""

Pertanyaan Siswa:
${question}

Jawablah sesuai panduan tutor bahasa Arab MA Kelas 10.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    res.json({ answer: response.text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan pada AI server.';
    console.error('Error in /api/ai/ask:', err);
    res.status(500).json({ error: message });
  }
});

/**
 * AI Essay & Reading Comprehension Answer Grader
 */
app.post('/api/ai/check-essay', async (req: Request, res: Response) => {
  try {
    const { readingText, question, studentAnswer, referenceAnswer } = req.body;

    if (!question || !studentAnswer) {
      return res.status(400).json({ error: 'Pertanyaan dan jawaban siswa harus diisi.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server environment.',
      });
    }

    const systemInstruction = `Anda adalah guru penguji Maharah Qiraah MA Kelas 10.
Tugas Anda memeriksa pemahaman bacaan siswa berdasarkan pertanyaan teks Arab.
Berikan respon dalam format JSON murni:
{
  "score": 85,
  "isCorrect": true,
  "feedback": "Ulasan evaluasi dalam bahasa Indonesia",
  "arabicCorrection": "Koreksi tata bahasa atau harakat jawaban Arab siswa dengan harakat lengkap",
  "explanation": "Penjelasan letak jawabannya di teks qiraah"
}`;

    const prompt = `Teks Qiraah:
"""
${readingText || ""}
"""

Pertanyaan Pemahaman:
${question}

Kunci / Jawaban Acuan:
${referenceAnswer || "Sesuai pemahaman teks"}

Jawaban Siswa:
${studentAnswer}

Evaluasilah jawaban siswa tersebut dan kembalikan hanya objek JSON yang valid.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memeriksa jawaban.';
    console.error('Error in /api/ai/check-essay:', err);
    res.status(500).json({ error: message });
  }
});

/**
 * AI Sentence Analysis: Nahwu-Shorof & Harakat Breakdown
 */
app.post('/api/ai/analyze-sentence', async (req: Request, res: Response) => {
  try {
    const { sentence } = req.body;

    if (!sentence) {
      return res.status(400).json({ error: 'Kalimat harus diisi.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server environment.',
      });
    }

    const systemInstruction = `Anda adalah pakar linguistik bahasa Arab dan pengajar Maharah Qiraah tingkat MA Kelas 10.
Analisis kalimat bahasa Arab berikut dan kembalikan JSON murni:
{
  "vocalizedSentence": "kalimat dengan harakat sempurna",
  "translation": "terjemahan bahasa Indonesia yang wajar dan akurat",
  "tarkibStructure": "struktur kalimat umum, contoh: Jumlah Ismiyyah (Mubtada + Khabar) atau Jumlah Filiyyah",
  "words": [
    {
      "word": "kata berharakat",
      "translation": "arti kata",
      "pos": "Isim / Fiil / Harf",
      "grammaticalRole": "kedudukan nahwu, misal: Mubtada marfu / Khabar / Fail",
      "notes": "penjelasan singkat siswa MA 10"
    }
  ],
  "learningTips": "tip membaca tartil dan intonasi tanda waqaf"
}`;

    const prompt = `Analisis kalimat bahasa Arab ini untuk materi Maharah Qiraah MA Kelas 10:
"${sentence}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat menganalisis kalimat.';
    console.error('Error in /api/ai/analyze-sentence:', err);
    res.status(500).json({ error: message });
  }
});

// Export default app without app.listen (ready for Vercel Serverless and Vite integration)
export default app;
