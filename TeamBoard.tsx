'use client';
import { useRef, useState, type FormEvent } from 'react';
import type { Competition, TeamRequest } from '@/lib/types';
import { ApiError } from '@/lib/api';
import StatusBadge from './StatusBadge';
import { btnGhost, btnPrimary, inputCls } from './ui';

type Props = {
  competition: Competition;
  teams: TeamRequest[];
  onApply: (requestId: string, role: string, message: string) => Promise<void>;
};

export default function TeamBoard({ competition, teams, onApply }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [target, setTarget] = useState<TeamRequest | null>(null);
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (competition.max_team_size <= 1) return null; // lomba individu: modul tim disembunyikan

  const roles = target?.required_roles.length ? target.required_roles : ['Anggota'];

  function open(t: TeamRequest) {
    setTarget(t);
    setRole(t.required_roles[0] ?? 'Anggota');
    setMessage('');
    setError('');
    dialog.current?.showModal();
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!target) return;
    setBusy(true);
    setError('');
    try {
      await onApply(target.id, role, message);
      dialog.current?.close();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Lamaran gagal dikirim. Coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="team-board">
      <h2 id="team-board" className="font-display text-2xl">Cari tim untuk lomba ini</h2>
      {teams.length === 0 ? (
        <p className="mt-4 text-ink/70">Belum ada tim yang membuka lowongan. Buat permintaan tim pertama.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {teams.map((t) => {
            const slots = competition.max_team_size - t.members.length;
            const ready = t.status === 'READY';
            return (
              <li key={t.id} className="grid gap-4 py-5 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg">{t.title}</h3>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink/70">Leader mengambil peran {t.leader_role}</p>
                  {!ready && t.required_roles.length > 0 && (
                    <p className="mt-1 text-sm">
                      Mencari {t.required_roles.join(', ')}. Skill: {t.required_skills.join(', ')}
                    </p>
                  )}
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    {t.members.map((m) => (
                      <li key={m.user_id}>
                        {m.full_name}
                        {m.is_leader && ' (Leader)'}
                        {ready && m.contact_info && <span className="ml-2 font-semibold">{m.contact_info}</span>}
                      </li>
                    ))}
                  </ul>
                  {!ready && <p className="mt-2 text-sm text-ink/60">Kontak anggota terbuka setelah tim lengkap.</p>}
                </div>
                {t.status === 'FORMING' && (
                  <div className="md:text-right">
                    <p className="text-sm">{slots > 0 ? `${slots} slot kosong` : 'Slot penuh'}</p>
                    <button disabled={slots <= 0} onClick={() => open(t)} className={`mt-2 ${btnPrimary}`}>
                      Ajukan bergabung
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <dialog ref={dialog} className="w-full max-w-md rounded-sm p-6 backdrop:bg-ink/50">
        <form onSubmit={submit} className="space-y-4">
          <h3 className="font-display text-xl">Gabung ke {target?.title}</h3>
          <label className="block text-sm font-semibold">
            Peran yang kamu ambil
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputCls}>
              {roles.map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Pesan singkat untuk leader
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={inputCls} />
          </label>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => dialog.current?.close()} className={btnGhost}>Batal</button>
            <button type="submit" disabled={busy} className={btnPrimary}>{busy ? 'Mengirim...' : 'Kirim lamaran'}</button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
