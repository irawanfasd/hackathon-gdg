'use client';
import { useState } from 'react';
import Link from 'next/link';
import CertificateConfirmForm, { type CertValues } from '@/components/CertificateConfirmForm';
import SideBySideReview, { DocumentPreview } from '@/components/SideBySideReview';
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
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/" className="text-sm font-semibold text-brand hover:underline">
            ← Kembali ke katalog
          </Link>
          <h1 className="mt-2 font-display text-3xl">Demo Review Dokumen &amp; Sertifikat</h1>
        </div>
        <StatusBadge status={status} />
      </div>

      {message && (
        <div className="rounded-sm border border-line bg-white p-4 text-sm font-semibold">
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
        left={
          <DocumentPreview
            src="/poster-placeholder.svg"
            alt="Contoh Sertifikat / Poster"
          />
        }
        right={
          <div className="rounded-sm border border-line bg-white p-4">
            <h2 className="px-3 font-display text-xl">Konfirmasi Data Prestasi</h2>
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
    </main>
  );
}
