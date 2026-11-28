'use client';
import { useState } from 'react';
import type { Team } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import StatusBadge from './StatusBadge';
import { btnPrimary } from './ui';

export default function TeamCard({ team, closed = false }: { team: Team; closed?: boolean }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [role, setRole] = useState(team.roles[0] ?? '');
  const [note, setNote] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const full = team.status === 'READY';
  const slots = team.slots_remaining ?? Math.max(team.capacity - team.members.length, 0);

  const apply = async () => {
    setSending(true);
    setErr(null);
    try {
      await apiFetch(`/api/teams/${team.id}/apply`, {
        method: 'POST',
        body: JSON.stringify({ selected_role: role, message: note }),
      });
      setSent(true);
    } catch (e: any) {
      setErr(e?.status === 401 ? 'Masuk dulu untuk mengajukan lamaran.' : e?.message ?? 'Gagal mengirim lamaran.');
    } finally {
      setSending(false);
    }
  };

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
            
          </>
        ) : (
          <>
            <p className="mt-4 text-sm font-semibold text-ink">{slots} slot kosong</p>
            {!sent && !closed && (
              <>
                <label className="mt-4 block text-xs text-muted" htmlFor={`peran-${team.id}`}>
                  Peran yang kamu lamar
                </label>
                <select
                  id={`peran-${team.id}`}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
                >
                  {team.roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <label className="mt-3 block text-xs text-muted" htmlFor={`pesan-${team.id}`}>
                  Pesan untuk ketua (opsional)
                </label>
                <textarea
                  id={`pesan-${team.id}`}
                  value={note}
                  maxLength={500}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
                />
              </>
            )}
            <button
              type="button"
              onClick={apply}
              disabled={sent || closed || sending || !role}
              className={`${btnPrimary} mt-4 w-full disabled:!opacity-100 ${
                sent
                  ? 'disabled:!bg-ok'
                  : closed
                    ? 'disabled:!bg-line disabled:!text-muted'
                    : ''
              }`}
            >
              {sent ? 'Lamaran terkirim' : closed ? 'Lomba sudah ditutup' : sending ? 'Mengirim…' : 'Ajukan bergabung'}
            </button>
            <p className={`mt-2 text-xs ${err ? 'text-red-700' : 'text-muted'}`} aria-live="polite">
              {err ? err : sent ? 'Lamaranmu sudah masuk. Ketua tim akan meninjau lamaranmu.' : 'Ketua tim akan meninjau lamaranmu.'}
            </p>
          </>
        )}
      </div>
    </article>
  );
}
