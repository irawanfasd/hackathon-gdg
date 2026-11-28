import type { BadgeStatus } from '@/lib/types';

const MAP: Record<BadgeStatus, { label: string; cls: string }> = {
  PROCESSING: { label: 'Diproses AI', cls: 'bg-brand-soft text-brand-dark' },
  PENDING_REVIEW: { label: 'Menunggu review', cls: 'bg-signal/25 text-ink' },
  APPROVED: { label: 'Tayang', cls: 'bg-ok/15 text-ok' },
  REJECTED: { label: 'Ditolak', cls: 'bg-danger/15 text-danger' },
  FAILED: { label: 'Gagal dibaca', cls: 'bg-danger/15 text-danger' },
  FORMING: { label: 'Mencari anggota', cls: 'bg-brand-soft text-brand-dark' },
  READY: { label: 'Tim lengkap', cls: 'bg-ok/15 text-ok' },
  CLOSED: { label: 'Ditutup', cls: 'bg-line text-muted' },
  DRAFT_AI: { label: 'Draf AI', cls: 'bg-brand-soft text-brand-dark' },
  STUDENT_CONFIRMED: { label: 'Menunggu verifikasi', cls: 'bg-signal/25 text-ink' },
  VERIFIED: { label: 'Terverifikasi', cls: 'bg-ok/15 text-ok' },
};

export default function StatusBadge({ status }: { status: BadgeStatus }) {
  const { label, cls } = MAP[status];
  return <span className={`inline-block rounded px-2.5 py-1 text-xs font-semibold ${cls}`}>{label}</span>;
}
