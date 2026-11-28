import type { Competition, Team } from './types';

// Tenggat selalu pukul 23.59 WIB (16.59 UTC) supaya demo tidak pernah basi.
const deadlineIn = (days: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(16, 59, 0, 0);
  return d.toISOString();
};

export const FIELDS = ['Semua', 'IT', 'Design', 'Essay', 'Business'] as const;

export function getCompetitions(): Competition[] {
  return [
    {
      id: 'lomba-inovasi-digital-2026',
      title: 'Lomba inovasi digital 2026',
      organizer: 'Universitas Indonesia',
      field: 'IT',
      level: 'national',
      deadline: deadlineIn(12),
      min_team_size: 2,
      max_team_size: 3,
      description: 'Ubah persoalan sehari-hari di kampus menjadi solusi digital yang bermanfaat bagi banyak orang.',
      eligibility: 'Mahasiswa aktif D3, D4, atau S1 di Indonesia. Anggota tim boleh berasal dari kampus berbeda.',
      registration_url: 'https://example.com/lomba-inovasi-digital-2026',
      poster: { no: '01', tagline: 'Ide hari ini. Dampak esok hari.', label: 'Lomba inovasi digital' },
    },
    {
      id: 'gemastik-2026',
      title: 'GEMASTIK XIX — Pengembangan Perangkat Lunak',
      organizer: 'Puspresnas Kemendikbudristek',
      field: 'IT',
      level: 'national',
      deadline: deadlineIn(2),
      min_team_size: 2,
      max_team_size: 3,
      description: 'Bangun perangkat lunak yang menjawab tantangan nyata dan bersaing di panggung nasional.',
      eligibility: 'Mahasiswa aktif program sarjana dan diploma dari perguruan tinggi di Indonesia.',
      registration_url: 'https://example.com/gemastik-2026',
      poster: { no: '19', tagline: 'Kodemu. Panggung nasional.', label: 'GEMASTIK XIX' },
    },
    {
      id: 'bmc-nasional-2026',
      title: 'National Business Model Canvas Competition',
      organizer: 'BEM FEB Universitas Indonesia',
      field: 'Business',
      level: 'national',
      deadline: deadlineIn(6),
      min_team_size: 2,
      max_team_size: 4,
      description: 'Rancang model bisnis yang layak dijalankan dan presentasikan di depan praktisi.',
      eligibility: 'Mahasiswa aktif dari semua program studi. Satu tim boleh lintas jurusan.',
      registration_url: 'https://example.com/bmc-nasional-2026',
      poster: { no: '07', tagline: 'Model bisnis. Hasil nyata.', label: 'National BMC' },
    },
    {
      id: 'uiux-challenge-2026',
      title: 'Nusantara UI/UX Design Challenge',
      organizer: 'HMTI Institut Teknologi Bandung',
      field: 'Design',
      level: 'national',
      deadline: deadlineIn(14),
      min_team_size: 1,
      max_team_size: 3,
      description: 'Rancang pengalaman digital yang mudah dipakai oleh siapa saja, dari ide sampai prototipe.',
      eligibility: 'Mahasiswa aktif S1 dan D4 dari seluruh Indonesia.',
      registration_url: 'https://example.com/uiux-challenge-2026',
      poster: { no: '03', tagline: 'Rancang rasa. Bangun pengalaman.', label: 'UI/UX Challenge' },
    },
    {
      id: 'esai-ilmiah-2026',
      title: 'Lomba Esai Ilmiah Nasional',
      organizer: 'UKM Penalaran Universitas Gadjah Mada',
      field: 'Essay',
      level: 'national',
      deadline: deadlineIn(-3),
      min_team_size: 1,
      max_team_size: 1,
      description: 'Tuangkan gagasan ilmiahmu dalam esai yang tajam dan berbasis data.',
      eligibility: 'Mahasiswa aktif S1 dan D4 dari seluruh Indonesia. Peserta individu.',
      registration_url: 'https://example.com/esai-ilmiah-2026',
      poster: { no: '12', tagline: 'Tulis gagasanmu. Ubah cara pandang.', label: 'Esai Ilmiah Nasional' },
    },
  ];
}

// Nomor WhatsApp di bawah ini hanya contoh.
export const teams: Team[] = [
  {
    id: 'ruang-tumbuh',
    competition_id: 'lomba-inovasi-digital-2026',
    name: 'Ruang tumbuh',
    status: 'FORMING',
    leader: { name: 'Nadia Putri', role: 'Desainer produk' },
    roles: ['Pengembang web', 'Periset data'],
    skills: ['React', 'Python', 'Analisis data'],
    members: [{ name: 'Nadia Putri' }],
    capacity: 3,
  },
  {
    id: 'akar-digital',
    competition_id: 'lomba-inovasi-digital-2026',
    name: 'Akar digital',
    status: 'FORMING',
    leader: { name: 'Raka Wibowo', role: 'Pengembang web' },
    roles: ['Periset pengguna'],
    skills: ['Wawancara', 'Riset', 'Penulisan'],
    members: [{ name: 'Raka Wibowo' }, { name: 'Dinda Sari' }],
    capacity: 3,
  },
  {
    id: 'kode-kolektif',
    competition_id: 'gemastik-2026',
    name: 'Kode kolektif',
    status: 'FORMING',
    leader: { name: 'Bagas Pratama', role: 'Pengembang backend' },
    roles: ['Pengembang antarmuka'],
    skills: ['TypeScript', 'PostgreSQL', 'Figma'],
    members: [{ name: 'Bagas Pratama' }, { name: 'Salsa Amelia' }],
    capacity: 3,
  },
  {
    id: 'ruang-tumbuh-bmc',
    competition_id: 'bmc-nasional-2026',
    name: 'Ruang tumbuh',
    status: 'READY',
    leader: { name: 'Nadia Putri', role: 'Desainer produk' },
    roles: ['Desain produk', 'Pengembangan web', 'Riset data'],
    skills: ['Figma', 'React', 'Python'],
    members: [
      { name: 'Nadia Putri', whatsapp: '0812-0000-0001' },
      { name: 'Raka Wibowo', whatsapp: '0812-0000-0002' },
      { name: 'Dinda Sari', whatsapp: '0812-0000-0003' },
    ],
    capacity: 3,
  },
];
