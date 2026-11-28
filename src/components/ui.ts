const focus =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2';

export const btnPrimary = `rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 ${focus}`;

export const btnDark = `rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:opacity-50 ${focus}`;

export const btnGhost = `rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper disabled:opacity-50 ${focus}`;

export const inputCls =
  'mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm font-normal text-ink placeholder:text-muted focus-visible:border-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20';
