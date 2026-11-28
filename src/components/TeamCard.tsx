'use client';
import { useState } from 'react';
import type { Team } from '@/lib/types';
import StatusBadge from './StatusBadge';
import { btnPrimary } from './ui';

export default function TeamCard({ team, closed = false }: { team: Team; closed?: boolean }) {
  const [sent, setSent] = useState(false);
  const full = team.status === 'READY';
  const slots = Math.max(team.capacity - team.members.length, 0);

  return (
    <article className="grid gap-6 border-t border-line py-8 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-16">
      <div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h3 className="font-display text-2xl font-bold text-ink">{team.name}</h3>
          <StatusBadge status={team.status} />
        </div>
        <p className="mt-2 text-sm text-muted">
          Ketua: {team.leader.name} · {team.leader.role}
        </p>
        <p className="mt-5 text-xs text-muted">{full ? 'Peran terisi' : 'Peran yang dicari'}</p>
        <p className="mt-1 font-medium text-ink">{team.roles.join(' · ')}</p>
        <p className="mt-1 text-sm font-medium text-brand">{team.skills.join(' · ')}</p>
      </div>

      <div>
        <p className="text-xs text-muted">Anggota</p>
        <p className="mt-1 text-sm text-ink">{team.members.map((m) => m.name).join(', ')}</p>

        {full ? (
          <>
            <p className="mt-4 text-sm font-semibold text-ok">
              {team.members.length} dari {team.capacity} anggota · Tidak ada slot kosong
            </p>
            <p className="mt-5 text-xs text-muted">Kontak WhatsApp</p>
            <ul className="mt-1 space-y-0.5 text-sm text-ink">
              {team.members.map((m) => (
                <li key={m.name}>
                  {m.name} · {m.whatsapp ?? '—'}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Nomor pada tampilan ini adalah contoh.</p>
          </>
        ) : (
          <>
            <p className="mt-4 text-sm font-semibold text-ink">{slots} slot kosong</p>
            <button
              type="button"
              onClick={() => setSent(true)}
              disabled={sent || closed}
              className={`${btnPrimary} mt-4 w-full disabled:!opacity-100 ${
                sent
                  ? 'disabled:!bg-ok'
                  : closed
                    ? 'disabled:!bg-line disabled:!text-muted'
                    : ''
              }`}
            >
              {sent ? 'Lamaran terkirim' : closed ? 'Lomba sudah ditutup' : 'Ajukan bergabung'}
            </button>
            <p className="mt-2 text-xs text-muted" aria-live="polite">
              {sent ? 'Lamaranmu sudah masuk. Ketua tim akan meninjau lamaranmu.' : 'Ketua tim akan meninjau lamaranmu.'}
            </p>
          </>
        )}
      </div>
    </article>
  );
}
