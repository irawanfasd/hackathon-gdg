import CatalogView from '@/components/CatalogView';
import SiteFooter from '@/components/SiteFooter';

// Hitungan "N hari lagi" harus dihitung saat diminta, bukan saat build.
export const dynamic = 'force-dynamic';

export default function Catalog() {
  return (
    <>
      <main id="konten" className="mx-auto w-full max-w-page flex-1 px-5 pb-4 pt-8 md:px-10 md:pt-12">
        <CatalogView />
      </main>
      <SiteFooter tagline="Kesempatan baru, langkah baru." note="Informasi lomba bersumber dari penyelenggara." />
    </>
  );
}
