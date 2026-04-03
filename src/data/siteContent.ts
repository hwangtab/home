import rawSiteDataJson from './siteData.json';
import { translateSiteData } from '../utils/translateSiteData';
import type {
  Artist,
  Events,
  MusicWork,
  NewsItem,
  PageType,
  SiteData,
  SiteMetadata,
  StruggleWork,
  Work,
  WorkCategory,
  Works
} from '../types/data.types';
import { WORK_CATEGORIES } from '../types/data.types';
import type { SupportedLocale } from '../utils/localePath';

export type SitePageKey = 'home' | 'about' | 'works' | 'news' | 'contact';

type NormalizedWorks = Omit<Works, 'struggle'> & {
  struggle: StruggleWork[];
};

export type NormalizedSiteData = Omit<SiteData, 'works'> & {
  works: NormalizedWorks;
};

export type WorkDetail = Work & {
  category: WorkCategory;
};

export interface HomePageData {
  metadata: SiteMetadata;
  artist: Pick<Artist, 'name' | 'bio'>;
  works: Pick<NormalizedWorks, 'music'>;
}

export interface AboutPageData {
  metadata: SiteMetadata;
  artist: Artist;
  works: NormalizedWorks;
}

export interface WorksPageData {
  metadata: SiteMetadata;
  works: NormalizedWorks;
}

export interface NewsPageData {
  metadata: SiteMetadata;
  news: NewsItem[];
  events: Events;
}

export interface ContactPageData {
  metadata: SiteMetadata;
  artist: Pick<Artist, 'name' | 'contact'>;
}

export interface PageDataMap {
  home: HomePageData;
  about: AboutPageData;
  works: WorksPageData;
  news: NewsPageData;
  contact: ContactPageData;
}

const normalizeWorks = (works: SiteData['works']): NormalizedWorks => ({
  music: works.music ?? [],
  visual: works.visual ?? [],
  writing: works.writing ?? [],
  performance: works.performance ?? [],
  struggle: works.struggle ?? []
});

const normalizeSiteData = (siteData: SiteData): NormalizedSiteData => ({
  ...siteData,
  works: normalizeWorks(siteData.works)
});

const rawSiteData = normalizeSiteData(rawSiteDataJson as unknown as SiteData);

const localizedSiteDataMap: Record<SupportedLocale, NormalizedSiteData> = {
  ko: rawSiteData,
  en: normalizeSiteData(translateSiteData(rawSiteData, 'en'))
};

const filterWorksByPage = (
  works: NormalizedWorks,
  pageType: Exclude<PageType, 'all'>
): NormalizedWorks => ({
  music: works.music.filter((work) => work.showInPages?.includes(pageType)),
  visual: works.visual.filter((work) => work.showInPages?.includes(pageType)),
  writing: works.writing.filter((work) => work.showInPages?.includes(pageType)),
  performance: works.performance.filter((work) => work.showInPages?.includes(pageType)),
  struggle: works.struggle.filter((work) => work.showInPages?.includes(pageType))
});

const buildPageDataMap = (siteData: NormalizedSiteData): PageDataMap => ({
  home: {
    metadata: siteData.metadata,
    artist: {
      name: siteData.artist.name,
      bio: siteData.artist.bio
    },
    works: {
      music: siteData.works.music.filter((work) => work.featured)
    }
  },
  about: {
    metadata: siteData.metadata,
    artist: siteData.artist,
    works: filterWorksByPage(siteData.works, 'about')
  },
  works: {
    metadata: siteData.metadata,
    works: siteData.works
  },
  news: {
    metadata: siteData.metadata,
    news: siteData.news,
    events: siteData.events
  },
  contact: {
    metadata: siteData.metadata,
    artist: {
      name: siteData.artist.name,
      contact: siteData.artist.contact
    }
  }
});

const localizedPageDataMap: Record<SupportedLocale, PageDataMap> = {
  ko: buildPageDataMap(localizedSiteDataMap.ko),
  en: buildPageDataMap(localizedSiteDataMap.en)
};

export const getSiteData = (locale: SupportedLocale = 'ko'): NormalizedSiteData => localizedSiteDataMap[locale];

export const getPageData = <K extends SitePageKey>(
  pageKey: K,
  locale: SupportedLocale = 'ko'
): PageDataMap[K] => localizedPageDataMap[locale][pageKey];

export const getWorksForPage = (
  pageType: PageType,
  locale: SupportedLocale = 'ko'
): NormalizedWorks => {
  const siteData = getSiteData(locale);

  if (pageType === 'all') {
    return siteData.works;
  }

  return filterWorksByPage(siteData.works, pageType);
};

export const getAllWorks = (locale: SupportedLocale = 'ko'): WorkDetail[] => {
  const siteData = getSiteData(locale);

  return WORK_CATEGORIES.flatMap((category) => {
    const works = siteData.works[category] ?? [];
    return works.map((work) => ({ ...work, category }));
  });
};

export const getFeaturedMusicWorks = (
  locale: SupportedLocale = 'ko',
  options: { excludedIds?: string[]; limit?: number } = {}
): MusicWork[] => {
  const { excludedIds = [], limit } = options;
  const excludedIdSet = new Set(excludedIds);
  const featuredWorks = getPageData('home', locale).works.music.filter((work) => !excludedIdSet.has(work.id));

  return typeof limit === 'number' ? featuredWorks.slice(0, limit) : featuredWorks;
};

export const getWorkBySlug = (slug: string, locale: SupportedLocale = 'ko'): WorkDetail | null => {
  return getAllWorks(locale).find((work) => work.id === slug) ?? null;
};

export const getAllWorkSlugs = (): string[] => getAllWorks('ko').map((work) => work.id);

export const flattenWorks = (works: Partial<Record<WorkCategory, Work[]>>): Work[] => {
  return WORK_CATEGORIES.flatMap((category) => works[category] ?? []);
};
