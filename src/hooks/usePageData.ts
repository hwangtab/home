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
        let isActive = true;
        let controller: AbortController | null = null;
        let timeoutId: number | undefined;

        const loadPageData = async (): Promise<void> => {
            try {
                if (!isActive) return;
                setLoading(true);
                setError(null);

                const basePath = process.env.NODE_ENV === 'development'
                    ? ''
                    : process.env.NEXT_PUBLIC_BASE_PATH || process.env.PUBLIC_URL || '';
                const dataUrl = `${basePath}/data/${pageType}.json`;
                controller = new AbortController();
                timeoutId = window.setTimeout(() => controller?.abort(), 5000);

                const response = await fetch(dataUrl, {
                    signal: controller.signal,
                    headers: {
                        'Cache-Control': 'public, max-age=300'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to load ${pageType} data: ${response.status}`);
                }

                const pageData = await response.json();
                if (!isActive) return;
                setData(pageData as T);
            } catch (err) {
                if (!isActive) return;
                console.error(`Error loading ${pageType} data:`, err);
                setError(err as Error);

                try {
                    const siteData = await import('../data/siteData.json');
                    if (!isActive) return;
                    setData(siteData.default as T);
                } catch (fallbackErr) {
                    if (!isActive) return;
                    console.error('Fallback data loading failed:', fallbackErr);
                    setError(fallbackErr as Error);
                }
            } finally {
                if (timeoutId !== undefined) clearTimeout(timeoutId);
                if (!isActive) return;
                setLoading(false);
            }
        };

        if (pageType) {
            loadPageData();
        }

        return () => {
            isActive = false;
            controller?.abort();
            if (timeoutId !== undefined) clearTimeout(timeoutId);
        };
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
        let isActive = true;
        let controller: AbortController | null = null;
        let timeoutId: number | undefined;

        const loadPageData = async (): Promise<void> => {
            if (dataCache.has(pageType)) {
                return;
            }

            try {
                if (!isActive) return;
                setLoading(true);
                setError(null);

                const basePath = process.env.NODE_ENV === 'development'
                    ? ''
                    : process.env.NEXT_PUBLIC_BASE_PATH || process.env.PUBLIC_URL || '';
                const dataUrl = `${basePath}/data/${pageType}.json`;
                controller = new AbortController();
                timeoutId = window.setTimeout(() => controller?.abort(), 5000);

                const response = await fetch(dataUrl, {
                    signal: controller.signal,
                    headers: {
                        'Cache-Control': 'public, max-age=300'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to load ${pageType} data: ${response.status}`);
                }

                const pageData = await response.json();
                if (!isActive) return;

                dataCache.set(pageType, pageData);
                setData(pageData as T);
            } catch (err) {
                if (!isActive) return;
                console.error(`Error loading ${pageType} data:`, err);
                setError(err as Error);

                try {
                    const siteData = await import('../data/siteData.json');
                    if (!isActive) return;
                    const fallbackData = siteData.default;
                    dataCache.set(pageType, fallbackData);
                    setData(fallbackData as T);
                } catch (fallbackErr) {
                    if (!isActive) return;
                    console.error('Fallback data loading failed:', fallbackErr);
                    setError(fallbackErr as Error);
                }
            } finally {
                if (timeoutId !== undefined) clearTimeout(timeoutId);
                if (!isActive) return;
                setLoading(false);
            }
        };

        if (pageType) {
            loadPageData();
        }

        return () => {
            isActive = false;
            controller?.abort();
            if (timeoutId !== undefined) clearTimeout(timeoutId);
        };
    }, [pageType]);

    return { data, loading, error };
};

export default usePageData;
