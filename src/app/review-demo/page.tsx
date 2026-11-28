'use client';
import { useState } from 'react';
import Link from 'next/link';
import CertificateConfirmForm, { type CertValues } from '@/components/CertificateConfirmForm';
import SideBySideReview, { DocumentPreview } from '@/components/SideBySideReview';
import SiteFooter from '@/components/SiteFooter';
import StatusBadge from '@/components/StatusBadge';
import type { BadgeStatus } from '@/lib/types';

export default function ReviewDemoPage() {
  const [status, setStatus] = useState<BadgeStatus>('DRAFT_AI');
  const [message, setMessage] = useState('');

  const sampleInitial: CertValues = {
    competition_name: 'GEMASTIK XIX — Pengembangan Perangkat Lunak',
    organizer: 'Puspresnas Kemendikbudristek',
    achievement_rank: 'Juara 1',
    level: 'national',
    issue_date: '2026-10-15',
  };

  return (
    <>
      <main id="konten" className="mx-auto w-full max-w-page flex-1 space-y-8 px-5 pb-4 pt-8 md:px-10 md:pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand">Portofolio saya</p>
            <h1 className="mt-2 font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-ink md:text-5xl">
              Review dokumen &amp; sertifikat
            </h1>
            <p className="mt-3 max-w-xl text-muted md:text-lg">
              Cocokkan data hasil bacaan AI dengan dokumen aslinya sebelum masuk ke portofolio.
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        {message && (
          <div role="status" className="rounded-lg border border-line bg-white p-4 text-sm font-semibold text-ink">
            {message}
          </div>
        )}

        <SideBySideReview
          approveLabel="Setujui & Verifikasi"
          onApprove={async () => {
            setStatus('VERIFIED');
            setMessage('Dokumen berhasil disetujui dan diverifikasi.');
          }}
          onReject={async (reason) => {
            setStatus('REJECTED');
            setMessage(reason ? `Dokumen ditolak: ${reason}` : 'Dokumen ditolak.');
          }}
          left={<DocumentPreview src="/poster-placeholder.svg" alt="Contoh Sertifikat / Poster" />}
          right={
            <div className="rounded-lg border border-line bg-white p-4">
              <h2 className="px-3 pt-1 font-display text-xl font-bold text-ink">Konfirmasi Data Prestasi</h2>
              <CertificateConfirmForm
                initial={sampleInitial}
                flagged={['achievement_rank', 'issue_date']}
                onConfirm={async (values) => {
                  setStatus('STUDENT_CONFIRMED');
                  setMessage(`Data "${values.competition_name}" (${values.achievement_rank}) dikonfirmasi mahasiswa.`);
                }}
              />
            </div>
          }
        />

        <Link href="/" className="inline-block text-sm font-semibold text-brand hover:underline">
          ← Kembali ke semua lomba
        </Link>
      </main>
      <SiteFooter tagline="Satu kesempatan. Banyak kemungkinan." />
    </>
  );
}
