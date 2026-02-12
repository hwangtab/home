import siteData from '../data/siteData.json';
import { translateSiteData } from '../utils/translateSiteData';
import { SiteData, Work, WorkCategory } from '../types/data.types';
import { SupportedLocale } from '../utils/localePath';

const WORK_CATEGORIES: WorkCategory[] = ['music', 'visual', 'writing', 'performance', 'struggle'];

export type WorkDetail = Work & {
  category: WorkCategory;
};

const toLocalizedSiteData = (locale: SupportedLocale): SiteData => {
  if (locale === 'en') {
    return translateSiteData(siteData as SiteData, 'en');
  }

  return siteData as SiteData;
};

export const getAllWorks = (locale: SupportedLocale): WorkDetail[] => {
  const data = toLocalizedSiteData(locale);

  return WORK_CATEGORIES.flatMap((category) => {
    const items = data.works[category] || [];
    return items.map((work) => ({ ...work, category }));
  });
};

export const getAllWorkSlugs = (): string[] => {
  return getAllWorks('ko').map((work) => work.id);
};

export const getWorkBySlug = (slug: string, locale: SupportedLocale): WorkDetail | null => {
  return getAllWorks(locale).find((work) => work.id === slug) || null;
};

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
