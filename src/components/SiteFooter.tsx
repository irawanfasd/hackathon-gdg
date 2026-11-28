export default function SiteFooter({ tagline, note }: { tagline: string; note?: string }) {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-page px-5 py-8 md:px-10">
        <p className="font-display text-base font-bold text-ink">{tagline}</p>
        {note && <p className="mt-1 text-sm text-muted">{note}</p>}
      </div>
    </footer>
  );
}
