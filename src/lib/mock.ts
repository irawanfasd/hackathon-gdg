import type { Competition } from './types';

const daysFromNow = (days: number) =>
  new Date(Date.now() + days * 86_400_000).toISOString();

export const competitions: Competition[] = [
  {
    id: 'gemastik-2026',
    title: 'GEMASTIK XIX — Pengembangan Perangkat Lunak',
    organizer: 'Puspresnas Kemendikbudristek',
    field: 'Teknologi',
    deadline: daysFromNow(2),
    min_team_size: 2,
    max_team_size: 3,
  },
  {
    id: 'bmc-nasional-2026',
    title: 'National Business Model Canvas Competition',
    organizer: 'BEM FEB Universitas Indonesia',
    field: 'Bisnis',
    deadline: daysFromNow(6),
    min_team_size: 2,
    max_team_size: 4,
  },
  {
    id: 'uiux-challenge-2026',
    title: 'Nusantara UI/UX Design Challenge',
    organizer: 'HMTI Institut Teknologi Bandung',
    field: 'Desain',
    deadline: daysFromNow(14),
    min_team_size: 1,
    max_team_size: 3,
  },
  {
    id: 'esai-ilmiah-2026',
    title: 'Lomba Esai Ilmiah Nasional',
    organizer: 'UKM Penalaran Universitas Gadjah Mada',
    field: 'Karya Tulis',
    deadline: daysFromNow(-3),
    min_team_size: 1,
    max_team_size: 1,
  },
];
