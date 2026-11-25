import Link from 'next/link';
import { notFound } from 'next/navigation';
import StatusBadge from '@/components/StatusBadge';
import { competitions } from '@/lib/mock';

export default function CompetitionDetail({ params }: { params: { id: string } }) {
  const item = competitions.find((c) => c.id === params.id);
  if (!item) return notFound();

  const isClosed = new Date(item.deadline).getTime() < Date.now();
  const size = item.max_team_size === 1 ? 'Individu' : `Tim ${item.min_team_size}–${item.max_team_size} orang`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/" className="text-sm font-semibold text-brand hover:underline">
        ← Kembali ke katalog
      </Link>
      <div className="mt-6 rounded-sm border border-line bg-white p-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={isClosed ? 'CLOSED' : 'APPROVED'} />
          <span className="text-sm text-ink/70">{item.field} • {size}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl">{item.title}</h1>
        <p className="mt-1 text-ink/70">Penyelenggara: {item.organizer}</p>
        <p className="mt-4 text-sm text-ink/70">
          Batas pendaftaran: {new Date(item.deadline).toLocaleDateString('id-ID', { dateStyle: 'long' })}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/review-demo"
            className="rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90"
          >
            Lihat Demo Review &amp; Konfirmasi Sertifikat
          </Link>
        </div>
      </div>
    </main>
  );
}
