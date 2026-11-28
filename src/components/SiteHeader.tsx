'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Jelajahi lomba', active: (p: string) => p === '/' || p.startsWith('/competitions') },
  { href: '/review-demo', label: 'Portofolio saya', active: (p: string) => p.startsWith('/review-demo') },
];

export default function SiteHeader() {
  const pathname = usePathname() ?? '/';
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-page grid-cols-[1fr_auto] items-center px-5 md:grid-cols-[1fr_auto_1fr] md:px-10">
        <Link
          href="/"
          className="col-start-1 row-start-1 py-4 font-display text-[17px] font-bold leading-[1.15] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:py-5"
        >
          <span className="block">From Poster</span>
          <span className="block">to Portfolio</span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="col-span-2 row-start-2 flex gap-8 md:col-span-1 md:col-start-2 md:row-start-1 md:self-stretch"
        >
          {NAV.map((n) => {
            const on = n.active(pathname);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={on ? 'page' : undefined}
                className={`flex items-center border-b-2 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:py-0 ${
                  on ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <span className="col-start-2 row-start-1 justify-self-end text-sm font-semibold text-brand md:col-start-3 md:text-ink">
          <span className="md:hidden">Akun</span>
          <span className="hidden md:inline">Nadia Putri</span>
        </span>
      </div>
    </header>
  );
}
