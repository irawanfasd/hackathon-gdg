import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14213D',
        paper: '#F5F6F8',
        line: '#D9DDE5',
        brand: { DEFAULT: '#2F5BFF', soft: '#E4EAFF' },
        signal: '#F2A900',
        danger: '#C8372D',
        ok: '#1E8E5A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
} satisfies Config;
