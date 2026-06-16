import type { Metadata } from 'next';
import { SupportedLocale, withLocalePrefix } from '../utils/localePath';

const normalizeSiteUrl = (value: string): string => {
  const withProtocol = /^https?:\/\//.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, '');
};

let hasWarnedMissingSiteUrl = false;
const DEFAULT_SITE_URL = 'https://hwangtab.github.io';

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
      // Keep builds runnable while matching the documented production URL.
      console.warn(`[seo] NEXT_PUBLIC_SITE_URL is not set. Falling back to ${DEFAULT_SITE_URL}.`);
      hasWarnedMissingSiteUrl = true;
    }
  }

  return process.env.NODE_ENV === 'production' ? DEFAULT_SITE_URL : 'http://localhost:3000';
};

export const SITE_URL = resolveSiteUrl();
const siteUrl = new URL(SITE_URL);
const siteBasePath = siteUrl.pathname.replace(/\/+$/, '');

export const toAbsoluteUrl = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const pathname = `${siteBasePath}${normalized === '/' ? '' : normalized}` || '/';
  return new URL(pathname, siteUrl.origin).toString();
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
