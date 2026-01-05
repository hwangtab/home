import { useState, useEffect } from 'react';
import type { SiteData } from '../types/data.types';

interface PageDataReturn<T = unknown> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

/**
 * 페이지별 최적화된 데이터 로딩 훅
 */
export const usePageData = <T = SiteData>(pageType: string): PageDataReturn<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadPageData = async (): Promise<void> => {
            try {
                setLoading(true);
                setError(null);

                const basePath = process.env.NODE_ENV === 'development' ? '' : process.env.PUBLIC_URL || '';
                const dataUrl = `${basePath}/data/${pageType}.json`;

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(dataUrl, {
                    signal: controller.signal,
                    headers: {
                        'Cache-Control': 'public, max-age=300'
                    }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`Failed to load ${pageType} data: ${response.status}`);
                }

                const pageData = await response.json();
                setData(pageData as T);
            } catch (err) {
                console.error(`Error loading ${pageType} data:`, err);
                setError(err as Error);

                try {
                    const siteData = await import('../data/siteData.json');
                    setData(siteData.default as T);
                } catch (fallbackErr) {
                    console.error('Fallback data loading failed:', fallbackErr);
                    setError(fallbackErr as Error);
                }
            } finally {
                setLoading(false);
            }
        };

        if (pageType) {
            loadPageData();
        }
    }, [pageType]);

    return { data, loading, error };
};

/**
 * 캐시된 데이터를 사용하는 고급 버전
 */
const dataCache = new Map<string, unknown>();

export const useCachedPageData = <T = SiteData>(pageType: string): PageDataReturn<T> => {
    const [data, setData] = useState<T | null>(() => (dataCache.get(pageType) as T) || null);
    const [loading, setLoading] = useState(() => !dataCache.has(pageType));
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadPageData = async (): Promise<void> => {
            if (dataCache.has(pageType)) {
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const basePath = process.env.NODE_ENV === 'development' ? '' : process.env.PUBLIC_URL || '';
                const dataUrl = `${basePath}/data/${pageType}.json`;

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(dataUrl, {
                    signal: controller.signal,
                    headers: {
                        'Cache-Control': 'public, max-age=300'
                    }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`Failed to load ${pageType} data: ${response.status}`);
                }

                const pageData = await response.json();

                dataCache.set(pageType, pageData);
                setData(pageData as T);
            } catch (err) {
                console.error(`Error loading ${pageType} data:`, err);
                setError(err as Error);

                try {
                    const siteData = await import('../data/siteData.json');
                    const fallbackData = siteData.default;
                    dataCache.set(pageType, fallbackData);
                    setData(fallbackData as T);
                } catch (fallbackErr) {
                    console.error('Fallback data loading failed:', fallbackErr);
                    setError(fallbackErr as Error);
                }
            } finally {
                setLoading(false);
            }
        };

        if (pageType) {
            loadPageData();
        }
    }, [pageType]);

    return { data, loading, error };
};

export default usePageData;
