import type { Metadata } from 'next';
import { SupportedLocale, withLocalePrefix } from '../utils/localePath';

const DEFAULT_SITE_URL = 'https://hwang-gyeongha.vercel.app';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

export const toAbsoluteUrl = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
};

export const getLocalizedPath = (basePath: string, locale: SupportedLocale): string => {
  const normalized = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return withLocalePrefix(normalized, locale);
};

export const getAlternates = (
  basePath: string,
  currentLocale: SupportedLocale
): NonNullable<Metadata['alternates']> => {
  const koPath = getLocalizedPath(basePath, 'ko');
  const enPath = getLocalizedPath(basePath, 'en');

  return {
    canonical: getLocalizedPath(basePath, currentLocale),
    languages: {
      ko: koPath,
      en: enPath,
      'x-default': koPath
    }
  };
};
