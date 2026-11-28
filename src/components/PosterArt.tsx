import type { Competition } from '@/lib/types';
import { countdown, formatDate, type Tone } from '@/lib/format';

const BADGE: Record<Tone, string> = {
  closed: 'bg-ink/70 text-white',
  urgent: 'bg-danger text-white',
  soon: 'bg-signal text-ink',
  normal: 'bg-ink text-white',
};

// Poster otomatis bergaya Figma. Ukuran teks memakai satuan cqw, jadi tampilannya
// sama di kartu kecil maupun di halaman detail.
export default function PosterArt({ c }: { c: Competition }) {
  const cd = countdown(c.deadline);
  const copy = c.poster ?? { no: '01', tagline: c.title, label: c.field };

  return (
    <div className="[container-type:inline-size]">
      <div
        className={`relative aspect-[4/5] overflow-hidden text-white ${cd.closed ? 'bg-[#6b7388]' : 'bg-brand'}`}
        role={c.poster_url ? undefined : 'img'}
        aria-label={c.poster_url ? undefined : `Poster ${c.title}`}
      >
        {c.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.poster_url} alt={`Poster ${c.title}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col p-[7cqw]" aria-hidden="true">
            <p className="truncate border-b border-white/50 pb-[4cqw] text-[5.2cqw] font-semibold leading-tight">
              {c.organizer}
            </p>
            <span
              className={`-ml-[7cqw] mt-[5cqw] w-fit px-[7cqw] py-[1.8cqw] text-[4.6cqw] font-semibold leading-tight ${BADGE[cd.tone]}`}
              suppressHydrationWarning
            >
              {cd.text}
            </span>
            <p className="mt-[3cqw] font-display text-[32cqw] font-bold leading-[0.95] tracking-tight">{copy.no}</p>
            <p className="mt-[3cqw] font-display text-[10cqw] font-bold leading-[1.08] tracking-tight">{copy.tagline}</p>
            <div className="mt-auto">
              <p className="truncate text-[4.6cqw] font-semibold">{copy.label}</p>
              <p className="text-[4cqw] text-white/80">{formatDate(c.deadline)}</p>
            </div>
          </div>
        )}
        {c.poster_url && (
          <span
            className={`absolute left-0 top-4 px-3 py-1.5 text-sm font-semibold ${BADGE[cd.tone]}`}
            suppressHydrationWarning
          >
            {cd.text}
          </span>
        )}
      </div>
    </div>
  );
}
