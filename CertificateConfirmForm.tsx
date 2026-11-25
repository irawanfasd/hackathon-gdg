'use client';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { AchievementLevel } from '@/lib/types';
import { ApiError } from '@/lib/api';
import { ReviewField } from './SideBySideReview';
import { btnPrimary, inputCls } from './ui';

export type CertValues = {
  competition_name: string;
  organizer: string;
  achievement_rank: string;
  level: AchievementLevel | '';
  issue_date: string; // yyyy-mm-dd
};

const RANKS = ['Juara 1', 'Juara 2', 'Juara 3', 'Juara harapan', 'Finalis', 'Peserta'];
const LEVELS: { value: AchievementLevel; label: string }[] = [
  { value: 'campus', label: 'Kampus' },
  { value: 'regional', label: 'Regional' },
  { value: 'national', label: 'Nasional' },
  { value: 'international', label: 'Internasional' },
];

type Props = {
  initial: CertValues; // hasil Gemini (DRAFT_AI)
  flagged?: (keyof CertValues)[]; // dari needs_review_fields
  onConfirm: (v: CertValues) => Promise<void>; // status menjadi STUDENT_CONFIRMED
};

export default function CertificateConfirmForm({ initial, flagged = [], onConfirm }: Props) {
  const [v, setV] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof CertValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setV({ ...v, [k]: e.target.value });
  const ranks = !v.achievement_rank || RANKS.includes(v.achievement_rank) ? RANKS : [v.achievement_rank, ...RANKS];
  const hint = 'Diisi AI, mohon cek dengan sertifikat';

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try { await onConfirm(v); }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Data belum tersimpan. Coba lagi.'); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-1">
      <ReviewField label="Nama lomba" hint={hint} flagged={flagged.includes('competition_name')}>
        <input required value={v.competition_name} onChange={set('competition_name')} className={inputCls} />
      </ReviewField>
      <ReviewField label="Penyelenggara" hint={hint} flagged={flagged.includes('organizer')}>
        <input required value={v.organizer} onChange={set('organizer')} className={inputCls} />
      </ReviewField>
      <ReviewField label="Peringkat" hint={hint} flagged={flagged.includes('achievement_rank')}>
        <select required value={v.achievement_rank} onChange={set('achievement_rank')} className={inputCls}>
          <option value="" disabled>Pilih peringkat</option>
          {ranks.map((r) => <option key={r}>{r}</option>)}
        </select>
      </ReviewField>
      <ReviewField label="Tingkat lomba" hint={hint} flagged={flagged.includes('level')}>
        <select required value={v.level} onChange={set('level')} className={inputCls}>
          <option value="" disabled>Pilih tingkat</option>
          {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </ReviewField>
      <ReviewField label="Tanggal terbit" hint={hint} flagged={flagged.includes('issue_date')}>
        <input required type="date" value={v.issue_date} onChange={set('issue_date')} className={inputCls} />
      </ReviewField>
      {error && <p role="alert" className="p-3 text-sm text-danger">{error}</p>}
      <div className="p-3">
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy ? 'Menyimpan...' : 'Konfirmasi data prestasi'}
        </button>
      </div>
    </form>
  );
}
