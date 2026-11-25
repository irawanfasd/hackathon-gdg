import Link from 'next/link';
import type { Competition } from '@/lib/types';

function deadlineTag(deadline: string) {
  const ms = new Date(deadline).getTime() - Date.now();
  if (ms < 0) return { text: 'Sudah tutup', cls: 'bg-line text-ink/70' };
  const d = Math.ceil(ms / 86_400_000);
  const cls = d <= 3 ? 'bg-danger text-white' : d <= 7 ? 'bg-signal text-ink' : 'bg-ink text-white';
  return { text: `Sisa ${d} hari`, cls };
}

export default function CompetitionCard({ c }: { c: Competition }) {
  const tag = deadlineTag(c.deadline);
  const size = c.max_team_size === 1 ? 'Individu' : `Tim ${c.min_team_size}–${c.max_team_size} orang`;
  return (
    <Link
      href={`/competitions/${c.id}`}
      className="group block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-brand-soft">
        {c.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.poster_url} alt={`Poster ${c.title}`} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center p-6 text-center font-display text-lg text-ink/60">{c.title}</div>
        )}
        <span className={`absolute left-0 top-4 px-3 py-1.5 text-sm font-semibold ${tag.cls}`} suppressHydrationWarning>
          {tag.text}
        </span>
      </div>
      <h3 className="mt-3 font-display text-lg leading-snug group-hover:underline">{c.title}</h3>
      <p className="text-sm text-ink/70">{c.organizer}</p>
      <p className="mt-1 text-sm text-ink/70">{c.field}, {size}</p>
    </Link>
  );
}
