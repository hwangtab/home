import type { MetadataRoute } from 'next';
import { getSiteData } from '../data/siteContent';
import { getAllWorkSlugs } from '../lib/works';
import { SITE_URL } from '../lib/seo';

type SitemapEntry = MetadataRoute.Sitemap[number];

type EntryOptions = {
  changeFrequency: SitemapEntry['changeFrequency'];
  priority: number;
};

const toAbsoluteUrl = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
};

const toEnglishPath = (basePath: string): string => {
  return basePath === '/' ? '/en' : `/en${basePath}`;
};

const toLocalizedEntries = (basePath: string, options: EntryOptions, lastModified: Date): SitemapEntry[] => {
  const koPath = basePath;
  const enPath = toEnglishPath(basePath);

  return [
    {
      url: toAbsoluteUrl(koPath),
      lastModified,
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates: {
        languages: {
          ko: toAbsoluteUrl(koPath),
          en: toAbsoluteUrl(enPath)
        }
      }
    },
    {
      url: toAbsoluteUrl(enPath),
      lastModified,
      changeFrequency: options.changeFrequency,
      priority: Math.max(0.1, Number((options.priority - 0.1).toFixed(1))),
      alternates: {
        languages: {
          ko: toAbsoluteUrl(koPath),
          en: toAbsoluteUrl(enPath)
        }
      }
    }
  ];
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(getSiteData('ko').metadata.lastUpdated);

  const staticEntries: SitemapEntry[] = [
    ...toLocalizedEntries('/', { changeFrequency: 'weekly', priority: 1.0 }, lastModified),
    ...toLocalizedEntries('/about', { changeFrequency: 'monthly', priority: 0.8 }, lastModified),
    ...toLocalizedEntries('/works', { changeFrequency: 'weekly', priority: 0.9 }, lastModified),
    ...toLocalizedEntries('/news', { changeFrequency: 'weekly', priority: 0.7 }, lastModified),
    ...toLocalizedEntries('/contact', { changeFrequency: 'monthly', priority: 0.6 }, lastModified)
  ];

  const workEntries = getAllWorkSlugs().flatMap((slug) =>
    toLocalizedEntries(`/works/${slug}`, { changeFrequency: 'monthly', priority: 0.8 }, lastModified)
  );

  return [...staticEntries, ...workEntries];
}
