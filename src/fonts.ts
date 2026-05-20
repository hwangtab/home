import localFont from 'next/font/local';

export const bombaram = localFont({
  src: './fonts/HSBombaram3_Regular.woff',
  variable: '--font-bombaram',
  display: 'swap',
});

export const myungjo = localFont({
  src: [
    { path: './fonts/BookkMyungjo-Lt.woff2', weight: '400' },
    { path: './fonts/BookkMyungjo-Bd.woff2', weight: '700' },
  ],
  variable: '--font-myungjo',
  display: 'swap',
  preload: true,
});

export const santokki = localFont({
  src: './fonts/SF_HambakSnow.woff',
  variable: '--font-santokki',
  display: 'swap',
});
