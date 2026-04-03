import {
  getAllWorkSlugs as getAllWorkSlugsFromData,
  getAllWorks,
  getWorkBySlug as getWorkBySlugFromData
} from '../data/siteContent';
import type { WorkCategory } from '../types/data.types';
import type { SupportedLocale } from '../utils/localePath';

export type { WorkDetail } from '../data/siteContent';

export const getAllWorkSlugs = (): string[] => getAllWorkSlugsFromData();

export const getWorkBySlug = (slug: string, locale: SupportedLocale) => {
  return getWorkBySlugFromData(slug, locale);
};

export const getLocalizedWorks = (locale: SupportedLocale) => getAllWorks(locale);

export const getWorkCoverUrl = (cover: string | undefined, category: WorkCategory): string => {
  if (!cover) {
    const defaultCoverByCategory: Record<WorkCategory, string> = {
      music: '/images/defaults/music-default.svg',
      visual: '/images/defaults/visual-default.svg',
      writing: '/images/defaults/writing-default.svg',
      performance: '/images/defaults/performance-default.svg',
      struggle: '/images/defaults/performance-default.svg'
    };

    return defaultCoverByCategory[category];
  }

  if (cover.startsWith('http://') || cover.startsWith('https://')) {
    return cover;
  }

  return cover.startsWith('/') ? cover : `/${cover}`;
};
