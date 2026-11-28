'use client';
import { useEffect, useMemo, useState } from 'react';
import CompetitionCard from '@/components/CompetitionCard';
import { apiFetch } from '@/lib/api';
import type { Competition } from '@/lib/types';
import { btnPrimary } from '@/components/ui';

const FIELDS = ['Semua', 'IT', 'Design', 'Essay', 'Business'] as const;

export default function CatalogView() {
  const [field, setField] = useState<string>('Semua');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    const qs = field === 'Semua' ? '' : `?field=${encodeURIComponent(field)}`;
    apiFetch<{ competitions: Competition[] }>(`/api/competitions${qs}`, { signal: ctrl.signal })
      .then((r) => setItems(r.competitions))
      .catch((e) => {
        if (e?.name !== 'AbortError') setError(e?.message ?? 'Gagal memuat lomba.');
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [field]);

  const list = useMemo(() => {
    const now = Date.now();
    const t = (s: string) => new Date(s).getTime();
    const needle = q.trim().toLowerCase();
    return items
      .filter((c) => !needle || `${c.title} ${c.organizer} ${c.field}`.toLowerCase().includes(needle))
      .sort((a, b) => {
        const aClosed = t(a.deadline) < now;
        const bClosed = t(b.deadline) < now;
        return aClosed === bClosed ? t(a.deadline) - t(b.deadline) : aClosed ? 1 : -1;
      });
  }, [items, q]);

  const reset = () => {
    setField('Semua');
    setQ('');
  };

  return (
    <>
      <p className="text-sm font-semibold text-brand">Papan peluang mahasiswa</p>
      <h1 className="mt-2 max-w-2xl font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-ink md:text-5xl">
        Lomba yang sedang dibuka
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
        Temukan tantanganmu. Bertemu rekan sejalan. Mulai cerita yang layak masuk portofolio.
      </p>

      <div className="mt-8 max-w-xl">
        <label htmlFor="cari-lomba" className="block text-sm font-semibold text-ink">
          Cari lomba
        </label>
        <input
          id="cari-lomba"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Contoh: energi terbarukan"
          className="mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-muted focus-visible:border-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
        />
        <p className="mt-2 text-sm text-muted">Cari kesempatan yang sesuai minatmu.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 md:gap-3" role="group" aria-label="Filter bidang lomba">
        {FIELDS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={field === f}
            onClick={() => setField(f)}
            className={`rounded-md px-4 py-2.5 text-sm font-semibold transition-colors md:px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
              field === f ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:bg-brand-soft'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {loading ? 'Memuat lomba…' : error ? '' : `${list.length} lomba ditemukan`}
      </p>

      <div className="mt-6 border-t border-line pt-8">
        {error ? (
          <div role="alert" className="mx-auto max-w-md py-12 text-center">
            <h2 className="font-display text-2xl font-bold text-ink">Lomba belum bisa dimuat.</h2>
            <p className="mt-3 text-muted">{error}</p>
            <button type="button" onClick={() => window.location.reload()} className={`${btnPrimary} mt-6 px-8`}>
              Coba lagi
            </button>
          </div>
        ) : loading ? null : list.length === 0 ? (
          <div className="mx-auto max-w-md py-12 text-center">
            <p className="font-display text-6xl font-bold text-ink" aria-hidden="true">0</p>
            <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
              Belum ada lomba di bidang ini.
            </h2>
            <p className="mt-3 text-muted">
              Coba bidang lain atau kembali ke semua lomba. Kesempatan berikutnya bisa jadi milikmu.
            </p>
            <button type="button" onClick={reset} className={`${btnPrimary} mt-6 px-8`}>
              Lihat semua lomba
            </button>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((c) => (
              <CompetitionCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
