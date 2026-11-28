import { GoogleGenAI } from '@google/genai';
import {
  PosterExtractionSchema,
  posterGeminiSchema,
  PosterExtractionResult,
} from '@/lib/schemas/poster-extraction';
import {
  CertificateExtractionSchema,
  certificateGeminiSchema,
  CertificateExtractionResult,
} from '@/lib/schemas/certificate-extraction';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = process.env.GEMINI_VISION_MODEL || 'gemini-2.5-flash';

export async function extractPosterData(
  fileBuffer: Buffer,
  mimeType: string
): Promise<{
  parsed: PosterExtractionResult;
  raw_extraction: unknown;
}> {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType,
        },
      },
      'Ekstrak informasi poster kompetisi mahasiswa ini secara akurat. Patuhi aturan zona waktu WIB (+07:00) untuk deadline dan catat field yang kurang jelas ke dalam needs_review_fields.',
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: posterGeminiSchema,
      temperature: 0.1, // Rendah agar ekstraksi faktual dan konsisten
    },
  });

  if (!response.text) {
    throw new Error('Gemini mengembalikan respons kosong untuk poster.');
  }

  const rawJson = JSON.parse(response.text);
  const validation = PosterExtractionSchema.safeParse(rawJson);

  if (!validation.success) {
    throw new Error(`Validasi Zod poster gagal: ${validation.error.message}`);
  }

  return {
    parsed: validation.data,
    raw_extraction: rawJson,
  };
}

export async function extractCertificateData(
  fileBuffer: Buffer,
  mimeType: string
): Promise<{
  parsed: CertificateExtractionResult;
  raw_extraction: unknown;
}> {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType,
        },
      },
      'Ekstrak data prestasi dari sertifikat kejuaraan ini. Tentukan level kompetisi (campus/regional/national/international) secara objektif dan tandai field yang meragukan pada needs_review_fields.',
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: certificateGeminiSchema,
      temperature: 0.1,
    },
  });

  if (!response.text) {
    throw new Error('Gemini mengembalikan respons kosong untuk sertifikat.');
  }

  const rawJson = JSON.parse(response.text);
  const validation = CertificateExtractionSchema.safeParse(rawJson);

  if (!validation.success) {
    throw new Error(`Validasi Zod sertifikat gagal: ${validation.error.message}`);
  }

  return {
    parsed: validation.data,
    raw_extraction: rawJson,
  };
}