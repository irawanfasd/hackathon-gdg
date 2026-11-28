'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PosterArt from '@/components/PosterArt';
import SiteFooter from '@/components/SiteFooter';
import TeamCard from '@/components/TeamCard';
import { countdown, formatDeadline, levelLabel, teamSize } from '@/lib/format';
import { ApiError, apiFetch } from '@/lib/api';
import type { Competition, Team } from '@/lib/types';

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <main id="konten" className="mx-auto w-full max-w-page flex-1 px-5 py-16 text-center md:px-10">
      <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
      <p className="mt-3 text-muted">{text}</p>
      <Link href="/" className="mt-6 inline-block font-semibold text-brand hover:underline">
        Kembali ke semua lomba
      </Link>
    </main>
  );
}

export default function CompetitionDetail({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<Competition | null>(null);
  const [list, setList] = useState<Team[]>([]);
  const [state, setState] = useState<'loading' | 'ok' | 'notfound' | 'error'>('loading');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    Promise.all([
      apiFetch<{ competition: Competition }>(`/api/competitions/${params.id}`),
      apiFetch<{ teams: Team[] }>(`/api/competitions/${params.id}/teams`),
    ])
      .then(([c, t]) => {
        if (cancelled) return;
        setItem(c.competition);
        setList(t.teams);
        setState('ok');
      })
      .catch((e) => {
        if (cancelled) return;
        if (e instanceof ApiError && e.status === 404) setState('notfound');
        else {
          setErrMsg(e?.message ?? 'Terjadi kesalahan.');
          setState('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (state === 'loading') return <Notice title="Memuat…" text="Sebentar, data lomba sedang diambil." />;
  if (state === 'notfound' || !item) return <Notice title="Lomba tidak ditemukan" text="Lomba ini tidak ada atau belum disetujui." />;
  if (state === 'error') return <Notice title="Gagal memuat" text={errMsg} />;

  const closed = countdown(item.deadline).closed;
  const forming = list.filter((t) => t.status === 'FORMING').length;
  const meta = [teamSize(item), levelLabel(item.level)].filter(Boolean).join(' · ');

  return (
    <>
      <main id="konten" className="mx-auto w-full max-w-page flex-1 px-5 pb-4 pt-6 md:px-10 md:pt-8">
        <nav aria-label="Jejak halaman" className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="font-semibold text-brand hover:underline">
            Semua lomba
          </Link>
          <span className="hidden text-muted md:inline" aria-hidden="true">/</span>
          <span className="hidden text-muted md:inline" aria-current="page">{item.title}</span>
        </nav>

        <section className="mt-6 grid gap-8 md:mt-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div>
            <PosterArt c={item} />
            <p className="mt-3 text-xs text-muted">Poster resmi dari penyelenggara</p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="rounded bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-dark">{item.field}</span>
              <span>{meta}</span>
            </div>
            <h1 className="mt-4 font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-ink md:text-5xl">
              {item.title}
            </h1>
            <p className="mt-3 text-muted">Diselenggarakan oleh {item.organizer}</p>
            {item.description && <p className="mt-5 text-lg leading-relaxed text-ink">{item.description}</p>}

            {item.eligibility && (
              <div className="mt-6 rounded-lg border border-line bg-white p-4">
                <h2 className="text-sm font-bold text-ink">Siapa yang bisa ikut?</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.eligibility}</p>
              </div>
            )}

            <p className="mt-8 text-sm text-muted">{closed ? 'Pendaftaran sudah ditutup' : 'Pendaftaran ditutup'}</p>
            <p className="mt-1 font-display text-xl font-bold text-ink md:text-2xl" suppressHydrationWarning>
              {formatDeadline(item.deadline)}
            </p>

            {closed || !item.registration_url ? (
              <span
                aria-disabled="true"
                className="mt-5 block rounded-md bg-line px-6 py-3.5 text-center font-semibold text-muted"
              >
                Pendaftaran sudah ditutup
              </span>
            ) : (
              <a
                href={item.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block rounded-md bg-brand px-6 py-3.5 text-center font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                Daftar di situs panitia
              </a>
            )}
            <p className="mt-2 text-xs text-muted">Pendaftaran dan ketentuan lengkap ada di situs panitia.</p>
          </div>
        </section>

        <section aria-labelledby="tim-heading" className="mt-12 border-t border-line pt-10 md:mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 id="tim-heading" className="font-display text-3xl font-bold tracking-tight text-ink">
              Cari tim untuk lomba ini
            </h2>
            {list.length > 0 && (
              <p className="text-sm text-muted">
                {forming > 0 ? `${forming} tim mencari anggota` : 'Semua tim sudah lengkap'}
              </p>
            )}
          </div>
          <p className="mt-2 text-muted">Temukan rekan dengan peran yang saling melengkapi.</p>

          <div className="mt-6">
            {list.length === 0 ? (
              <div className="border-t border-line py-10 text-center">
                <p className="font-display text-xl font-bold text-ink">Belum ada tim untuk lomba ini.</p>
                <p className="mt-1 text-muted">Jadilah yang pertama membuka tim dan ajak rekan dengan peran yang kamu butuhkan.</p>
              </div>
            ) : (
              list.map((t) => <TeamCard key={t.id} team={t} closed={closed} />)
            )}
          </div>

          {list.length > 0 && (
            <div className="rounded-lg bg-brand-soft p-4">
              <p className="text-sm font-bold text-ink">Kontak anggota terbuka setelah tim lengkap.</p>
              <p className="mt-0.5 text-sm text-muted">Nomor WhatsApp tetap privat selama tim mencari anggota.</p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter tagline="Satu kesempatan. Banyak kemungkinan." />
    </>
  );
}
