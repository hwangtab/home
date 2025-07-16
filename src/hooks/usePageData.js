import { useState, useEffect } from 'react';

/**
 * 페이지별 최적화된 데이터 로딩 훅
 * 각 페이지에 필요한 데이터만 로드하여 초기 번들 크기와 로딩 시간을 최적화
 */
export const usePageData = (pageType) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 개발 환경에서는 로컬 파일, 프로덕션에서는 public 폴더에서 로드
        const basePath = process.env.NODE_ENV === 'development' ? '' : process.env.PUBLIC_URL || '';
        const dataUrl = `${basePath}/data/${pageType}.json`;

        // 모바일 네트워크 환경을 고려한 5초 timeout 설정
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(dataUrl, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'public, max-age=300' // 5분 캐시
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to load ${pageType} data: ${response.status}`);
        }

        const pageData = await response.json();
        setData(pageData);
      } catch (err) {
        console.error(`Error loading ${pageType} data:`, err);
        setError(err);
        
        // Fallback: 전체 siteData 로드 시도
        try {
          const siteData = await import('../data/siteData.json');
          setData(siteData.default);
        } catch (fallbackErr) {
          console.error('Fallback data loading failed:', fallbackErr);
          setError(fallbackErr);
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
 * 이미 로드된 데이터는 메모리에 캐시하여 재사용
 */
const dataCache = new Map();

export const useCachedPageData = (pageType) => {
  // 캐시된 데이터가 있으면 초기 loading을 false로 설정
  const [data, setData] = useState(() => dataCache.get(pageType) || null);
  const [loading, setLoading] = useState(() => !dataCache.has(pageType));
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPageData = async () => {
      // 캐시된 데이터가 있으면 즉시 반환 (추가 상태 변경 없음)
      if (dataCache.has(pageType)) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const basePath = process.env.NODE_ENV === 'development' ? '' : process.env.PUBLIC_URL || '';
        const dataUrl = `${basePath}/data/${pageType}.json`;

        // 모바일 네트워크 환경을 고려한 5초 timeout 설정
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(dataUrl, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'public, max-age=300' // 5분 캐시
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to load ${pageType} data: ${response.status}`);
        }

        const pageData = await response.json();
        
        // 데이터를 캐시에 저장
        dataCache.set(pageType, pageData);
        setData(pageData);
      } catch (err) {
        console.error(`Error loading ${pageType} data:`, err);
        setError(err);
        
        // Fallback 로직
        try {
          const siteData = await import('../data/siteData.json');
          const fallbackData = siteData.default;
          dataCache.set(pageType, fallbackData);
          setData(fallbackData);
        } catch (fallbackErr) {
          console.error('Fallback data loading failed:', fallbackErr);
          setError(fallbackErr);
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