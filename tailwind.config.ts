import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        paper: '#faf9f6',
        ink: '#18181b',
        line: '#e4e4e7',
        brand: '#2563eb',
        'brand-soft': '#eff6ff',
        signal: '#facc15',
        danger: '#dc2626',
        ok: '#16a34a',
      },
    },
  },
  plugins: [],
};

export default config;
