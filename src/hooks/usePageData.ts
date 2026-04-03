import { useMemo } from 'react';
import { getPageData } from '../data/siteContent';
import type { PageDataMap, SitePageKey } from '../data/siteContent';
import type { PageDataReturn } from '../types/hook.types';
import type { SupportedLocale } from '../utils/localePath';

export interface ResolvedPageDataReturn<T> extends PageDataReturn<T> {
  data: T;
  loading: false;
  error: null;
}

export type { PageDataMap, SitePageKey } from '../data/siteContent';
export type {
  AboutPageData,
  ContactPageData,
  HomePageData,
  NewsPageData,
  NormalizedSiteData,
  WorksPageData
} from '../data/siteContent';

const createResolvedResult = <T,>(data: T): ResolvedPageDataReturn<T> => ({
  data,
  loading: false,
  error: null
});

export const usePageData = <K extends SitePageKey>(
  pageType: K,
  language: SupportedLocale = 'ko'
): ResolvedPageDataReturn<PageDataMap[K]> => {
  const data = useMemo(() => getPageData(pageType, language), [pageType, language]);
  return createResolvedResult(data);
};

export const useCachedPageData = usePageData;

export const useHomePageData = (language: SupportedLocale = 'ko') => usePageData('home', language);
export const useAboutPageData = (language: SupportedLocale = 'ko') => usePageData('about', language);
export const useWorksPageData = (language: SupportedLocale = 'ko') => usePageData('works', language);
export const useNewsPageData = (language: SupportedLocale = 'ko') => usePageData('news', language);
export const useContactPageData = (language: SupportedLocale = 'ko') => usePageData('contact', language);

export default usePageData;
