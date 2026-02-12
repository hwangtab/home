export type SupportedLocale = 'ko' | 'en';

export const getLocaleFromPathname = (pathname: string | null | undefined): SupportedLocale => {
  if (!pathname) {
    return 'ko';
  }

  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ko';
};

export const stripLocalePrefix = (pathname: string | null | undefined): string => {
  if (!pathname) {
    return '/';
  }

  if (pathname === '/en') {
    return '/';
  }

  if (pathname.startsWith('/en/')) {
    return pathname.slice(3);
  }

  return pathname;
};

export const withLocalePrefix = (path: string, locale: SupportedLocale): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (locale === 'ko') {
    return normalized;
  }

  return normalized === '/' ? '/en' : `/en${normalized}`;
};
