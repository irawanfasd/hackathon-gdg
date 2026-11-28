import { z } from 'zod';
import { Type, Schema } from '@google/genai';

// 1. Validasi Zod (Sesuai constraint tabel `achievements`)
export const AchievementLevelEnum = z.enum([
  'campus',
  'regional',
  'national',
  'international',
]);

export const CertificateExtractionSchema = z.object({
  competition_name: z.string().nullable(),
  organizer: z.string().nullable(),
  achievement_rank: z.string().nullable(),
  level: AchievementLevelEnum.nullable(),
  // Tanggal terbit sertifikat (YYYY-MM-DD atau ISO-8601 WIB)
  issue_date: z.string().nullable(),
  needs_review_fields: z.array(z.string()).default([]),
});

export type CertificateExtractionResult = z.infer<typeof CertificateExtractionSchema>;

// 2. Gemini Structured Outputs Schema
export const certificateGeminiSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    competition_name: {
      type: Type.STRING,
      nullable: true,
      description: 'Nama lengkap kompetisi/acara yang tercantum pada sertifikat.',
    },
    organizer: {
      type: Type.STRING,
      nullable: true,
      description: 'Instansi atau panitia resmi yang menerbitkan sertifikat.',
    },
    achievement_rank: {
      type: Type.STRING,
      nullable: true,
      description:
        'Predikat atau peringkat juara yang diraih (contoh: "Juara 1", "2nd Winner", "Best Innovation", "Finalis").',
    },
    level: {
      type: Type.STRING,
      nullable: true,
      enum: ['campus', 'regional', 'national', 'international'],
      description:
        'Tingkat kompetisi berdasarkan cakupan penyelenggara/peserta: campus (internal kampus), regional (kota/provinsi/wilayah), national (nasional), atau international (internasional).',
    },
    issue_date: {
      type: Type.STRING,
      nullable: true,
      description:
        'Tanggal penerbitan sertifikat dalam format ISO-8601 YYYY-MM-DD (contoh: "2026-11-20"). Isi null jika tidak tercantum.',
    },
    needs_review_fields: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        'Daftar nama field yang tidak terbaca jelas, kosong (null), atau tingkat lombanya (level) harus ditebak dari konteks nama acara.',
    },
  },
  required: [
    'competition_name',
    'organizer',
    'achievement_rank',
    'level',
    'issue_date',
    'needs_review_fields',
  ],
};