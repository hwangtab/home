import type { Metadata } from 'next';
import { SupportedLocale, withLocalePrefix } from '../utils/localePath';

const normalizeSiteUrl = (value: string): string => {
  const withProtocol = /^https?:\/\//.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, '');
};

let hasWarnedMissingSiteUrl = false;

const resolveSiteUrl = (): string => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (configured) {
    return normalizeSiteUrl(configured);
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelUrl) {
    return normalizeSiteUrl(vercelUrl);
  }

  if (process.env.NODE_ENV === 'production') {
    if (!hasWarnedMissingSiteUrl) {
      // Keep builds runnable while making misconfiguration obvious in logs.
      console.warn('[seo] NEXT_PUBLIC_SITE_URL is not set. Falling back to http://localhost:3000.');
      hasWarnedMissingSiteUrl = true;
    }
  }

  return 'http://localhost:3000';
};

export const SITE_URL = resolveSiteUrl();

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
