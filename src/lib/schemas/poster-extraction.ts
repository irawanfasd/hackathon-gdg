import { z } from 'zod';
import { Type, Schema } from '@google/genai';

// 1. Validasi Zod (Server-side guard sebelum masuk ke tabel `competitions`)
export const PosterExtractionSchema = z.object({
  title: z.string().nullable(),
  organizer: z.string().nullable(),
  field: z.string().nullable(),
  min_team_size: z.number().int().min(1).default(1),
  max_team_size: z.number().int().min(1).default(1),
  eligibility_note: z.string().nullable(),
  // ISO-8601 dengan offset WIB (+07:00), contoh: "2026-11-30T23:59:59+07:00"
  deadline: z.string().datetime({ offset: true }).nullable(),
  raw_deadline_text: z.string().nullable(),
  registration_url: z.string().nullable(),
  // Daftar nama field yang buram, ambigu, atau perlu dicek ulang oleh Admin
  needs_review_fields: z.array(z.string()).default([]),
});

export type PosterExtractionResult = z.infer<typeof PosterExtractionSchema>;

// 2. Gemini Structured Outputs Schema
export const posterGeminiSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      nullable: true,
      description: 'Judul resmi kompetisi atau lomba pada poster.',
    },
    organizer: {
      type: Type.STRING,
      nullable: true,
      description: 'Nama instansi, kampus, himpunan, atau organisasi penyelenggara.',
    },
    field: {
      type: Type.STRING,
      nullable: true,
      description:
        'Kategori/bidang utama lomba (contoh: UI/UX, Software Engineering, Business Case, Data Science, Essay).',
    },
    min_team_size: {
      type: Type.INTEGER,
      description:
        'Jumlah minimal anggota per tim. Isi 1 jika lomba individu atau tidak disebutkan batas minimal.',
    },
    max_team_size: {
      type: Type.INTEGER,
      description:
        'Jumlah maksimal anggota per tim. Isi 1 jika lomba bersifat individu (solo).',
    },
    eligibility_note: {
      type: Type.STRING,
      nullable: true,
      description:
        'Ringkasan syarat peserta dalam tepat 1 kalimat singkat (contoh: "Terbuka untuk mahasiswa aktif S1/D4 seluruh jurusan di Indonesia.").',
    },
    deadline: {
      type: Type.STRING,
      nullable: true,
      description:
        'Batas akhir pendaftaran dalam format ISO-8601 zona waktu WIB (+07:00), misal "2026-11-30T23:59:59+07:00". Jika jam tidak tertera, gunakan 23:59:59+07:00. Jika tahun tidak tertera, asumsikan tahun 2026. Isi null jika tidak ada tanggal.',
    },
    raw_deadline_text: {
      type: Type.STRING,
      nullable: true,
      description:
        'Teks mentah tanggal pendaftaran persis seperti yang tertulis di poster (contoh: "Close Reg: 30 Nov").',
    },
    registration_url: {
      type: Type.STRING,
      nullable: true,
      description: 'Tautan pendaftaran (bit.ly, s.id, Google Form, atau website) jika tertera.',
    },
    needs_review_fields: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        'Daftar nama key dari objek ini yang nilainya kosong (null), teksnya buram, atau tanggal/tahunnya hasil asumsi sehingga wajib diperiksa Admin.',
    },
  },
  required: [
    'title',
    'organizer',
    'field',
    'min_team_size',
    'max_team_size',
    'eligibility_note',
    'deadline',
    'raw_deadline_text',
    'registration_url',
    'needs_review_fields',
  ],
};