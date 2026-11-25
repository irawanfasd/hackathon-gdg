'use client';
import { useState, type ReactNode } from 'react';
import { btnGhost, btnPrimary } from './ui';

// Satu pola untuk antrean poster dan antrean sertifikat di dashboard admin.
export function DocumentPreview({ src, alt, type = 'image', onReload }: {
  src: string; alt: string; type?: 'image' | 'pdf'; onReload?: () => void;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div className="grid min-h-64 place-items-center gap-3 border border-dashed border-line p-6 text-center">
        <p className="text-ink/70">Dokumen tidak bisa dimuat. Tautan mungkin sudah kedaluwarsa.</p>
        <button className={btnGhost} onClick={() => { setFailed(false); onReload?.(); }}>Muat ulang dokumen</button>
      </div>
    );
  return type === 'pdf' ? (
    <iframe src={src} title={alt} className="h-[70vh] w-full border border-line" />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={() => setFailed(true)} className="w-full border border-line" />
  );
}

// flagged = kolom ada di needs_review_fields; hint = mis. raw_deadline_text dari poster.
export function ReviewField({ label, hint, flagged, children }: {
  label: string; hint?: string; flagged?: boolean; children: ReactNode;
}) {
  return (
    <label className={`block rounded-sm p-3 ${flagged ? 'bg-signal/15 ring-1 ring-signal' : ''}`}>
      <span className="text-sm font-semibold">
        {label}
        {flagged && <span className="ml-2 font-normal text-ink/70">perlu dicek</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-sm text-ink/60">{hint}</span>}
    </label>
  );
}

type Props = {
  left: ReactNode;
  right: ReactNode;
  approveLabel: string;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
};

export default function SideBySideReview({ left, right, approveLabel, onApprove, onReject }: Props) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>) => { setBusy(true); try { await fn(); } finally { setBusy(false); } };

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="md:sticky md:top-4 md:self-start">{left}</div>
      <div className="space-y-3">
        {right}
        <label className="block p-3 text-sm font-semibold">
          Alasan penolakan (opsional)
          <input value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 w-full rounded-sm border border-line px-3 py-2 font-normal" />
        </label>
        <div className="flex gap-2 p-3">
          <button disabled={busy} onClick={() => run(onApprove)} className={btnPrimary}>{approveLabel}</button>
          <button disabled={busy} onClick={() => run(() => onReject(reason))} className={btnGhost}>Tolak</button>
        </div>
      </div>
    </section>
  );
}
