import Link from 'next/link';
import type { Competition } from '@/lib/types';
import { teamSize } from '@/lib/format';
import PosterArt from './PosterArt';

export default function CompetitionCard({ c }: { c: Competition }) {
  return (
    <Link
      href={`/competitions/${c.id}`}
      className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
    >
      <div className="overflow-hidden rounded-md shadow-sm ring-1 ring-line transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <PosterArt c={c} />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold leading-snug text-ink group-hover:text-brand">{c.title}</h3>
      <p className="mt-0.5 text-sm text-muted">{c.organizer}</p>
      <p className="mt-1 text-sm text-muted">
        {c.field} · {teamSize(c)}
      </p>
    </Link>
  );
}
