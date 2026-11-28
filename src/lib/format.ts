import type { AchievementLevel, Competition } from './types';

const DAY = 86_400_000;

export type Tone = 'closed' | 'urgent' | 'soon' | 'normal';

// Selisih hari dihitung per tanggal kalender WIB, bukan per 24 jam,
// supaya "10 Desember" dan "N hari lagi" selalu konsisten.
const wibDay = (ms: number) => Math.floor((ms + 7 * 3_600_000) / DAY);

export function countdown(deadline: string): { text: string; tone: Tone; closed: boolean } {
  const end = new Date(deadline).getTime();
  const now = Date.now();
  if (end < now) return { text: 'Sudah tutup', tone: 'closed', closed: true };
  const d = wibDay(end) - wibDay(now);
  if (d <= 0) return { text: 'Berakhir hari ini', tone: 'urgent', closed: false };
  return { text: `${d} hari lagi`, tone: d <= 3 ? 'urgent' : d <= 7 ? 'soon' : 'normal', closed: false };
}

const TZ = 'Asia/Jakarta';

export function formatDate(deadline: string) {
  return new Date(deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
}

export function formatDeadline(deadline: string) {
  const time = new Date(deadline).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TZ,
  });
  return `${formatDate(deadline)} · ${time} WIB`;
}

export const teamSize = (c: Competition) =>
  c.max_team_size === 1 ? 'Individu' : `Tim ${c.min_team_size}–${c.max_team_size} orang`;

const LEVEL: Record<AchievementLevel, string> = {
  campus: 'Tingkat kampus',
  regional: 'Tingkat regional',
  national: 'Tingkat nasional',
  international: 'Tingkat internasional',
};
export const levelLabel = (l?: AchievementLevel) => (l ? LEVEL[l] : '');
