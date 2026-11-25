'use client';
import { useMemo, useState } from 'react';
import CompetitionCard from '@/components/CompetitionCard';
import { competitions } from '@/lib/mock';

export default function Catalog() {
  const [field, setField] = useState('Semua');
  const fields = useMemo(() => ['Semua', ...Array.from(new Set(competitions.map((c) => c.field)))], []);

  const list = useMemo(() => {
    const now = Date.now();
    const t = (s: string) => new Date(s).getTime();
    return competitions
      .filter((c) => field === 'Semua' || c.field === field)
      .sort((a, b) => {
        const aClosed = t(a.deadline) < now;
        const bClosed = t(b.deadline) < now;
        return aClosed === bClosed ? t(a.deadline) - t(b.deadline) : aClosed ? 1 : -1;
      });
  }, [field]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl">Lomba yang sedang dibuka</h1>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter bidang lomba">
        {fields.map((f) => (
          <button
            key={f}
            aria-pressed={field === f}
            onClick={() => setField(f)}
            className={`rounded-sm border px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              field === f ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:bg-paper'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="mt-10 text-ink/70">Belum ada lomba di bidang ini. Coba pilih bidang lain.</p>
      ) : (
        <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((c) => <CompetitionCard key={c.id} c={c} />)}
        </div>
      )}
    </main>
  );
}
