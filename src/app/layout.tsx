import './globals.css';
import type { ReactNode } from 'react';
import { Bricolage_Grotesque, Source_Sans_3 } from 'next/font/google';
import SiteHeader from '@/components/SiteHeader';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Source_Sans_3({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata = {
  title: 'From Poster to Portfolio',
  description: 'Temukan lomba, bentuk tim, dan ubah setiap prestasi menjadi portofolio yang terverifikasi.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper font-body text-ink antialiased">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Lewati ke konten
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
