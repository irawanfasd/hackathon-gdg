import type { Config } from 'tailwindcss';

// Token warna mengikuti frame Figma "From Poster to Portfolio".
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#f4f6fa', // latar halaman
        ink: '#0f1a33', // teks & tombol gelap (navy)
        muted: '#566079', // teks sekunder (kontras >= 5:1 di atas paper)
        line: '#e3e7ef',
        brand: '#2f5bff', // biru utama
        'brand-dark': '#2447d6',
        'brand-soft': '#e8eeff',
        signal: '#facc15',
        danger: '#dc2626',
        ok: '#15803d',
      },
      maxWidth: { page: '1240px' },
    },
  },
  plugins: [],
};

export default config;
