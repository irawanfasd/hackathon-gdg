import type { BadgeStatus } from '@/lib/types';

const MAP: Record<BadgeStatus, { label: string; cls: string }> = {
  PROCESSING: { label: 'Diproses AI', cls: 'bg-brand-soft text-brand' },
  PENDING_REVIEW: { label: 'Menunggu review', cls: 'bg-signal/20 text-ink' },
  APPROVED: { label: 'Tayang', cls: 'bg-ok/15 text-ok' },
  REJECTED: { label: 'Ditolak', cls: 'bg-danger/15 text-danger' },
  FAILED: { label: 'Gagal dibaca', cls: 'bg-danger/15 text-danger' },
  FORMING: { label: 'Mencari anggota', cls: 'bg-brand-soft text-brand' },
  READY: { label: 'Tim lengkap', cls: 'bg-ok/15 text-ok' },
  CLOSED: { label: 'Ditutup', cls: 'bg-line text-ink/70' },
  DRAFT_AI: { label: 'Draf AI', cls: 'bg-brand-soft text-brand' },
  STUDENT_CONFIRMED: { label: 'Menunggu verifikasi', cls: 'bg-signal/20 text-ink' },
  VERIFIED: { label: 'Terverifikasi', cls: 'bg-ok/15 text-ok' },
};

export default function StatusBadge({ status }: { status: BadgeStatus }) {
  const { label, cls } = MAP[status];
  return <span className={`inline-block rounded-sm px-2 py-0.5 text-sm font-semibold ${cls}`}>{label}</span>;
}
