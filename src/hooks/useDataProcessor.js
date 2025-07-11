import { useMemo, useCallback } from 'react';

/**
 * 데이터 처리 및 필터링을 위한 통합 훅
 * @param {Array} data - 처리할 데이터
 * @param {Object} options - 처리 옵션
 * @returns {Object} 처리된 데이터와 유틸리티 함수들
 */
export const useDataProcessor = (data, options = {}) => {
  const {
    filterKey = 'type',
    sortKey = 'year',
    sortOrder = 'desc',
    groupBy = null,
    searchKeys = ['title', 'description'],
    enableSearch = true,
    enableFilter = true,
    enableSort = true
  } = options;

  // 데이터 정렬
  const sortedData = useMemo(() => {
    if (!enableSort || !data || !Array.isArray(data)) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });
  }, [data, sortKey, sortOrder, enableSort]);

  // 데이터 그룹화
  const groupedData = useMemo(() => {
    if (!groupBy || !sortedData || !Array.isArray(sortedData)) return sortedData;
    
    const groups = {};
    sortedData.forEach(item => {
      const key = item[groupBy];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    
    return groups;
  }, [sortedData, groupBy]);

  // 필터링 함수
  const filterData = useCallback((filterValue) => {
    if (!enableFilter || !filterValue || filterValue === 'all') {
      return sortedData;
    }
    
    return sortedData.filter(item => 
      item[filterKey] === filterValue || 
      (Array.isArray(item[filterKey]) && item[filterKey].includes(filterValue))
    );
  }, [sortedData, filterKey, enableFilter]);

  // 검색 함수
  const searchData = useCallback((searchTerm, targetData = sortedData) => {
    if (!enableSearch || !searchTerm || !targetData) return targetData;
    
    const term = searchTerm.toLowerCase();
    return targetData.filter(item => 
      searchKeys.some(key => 
        item[key] && item[key].toLowerCase().includes(term)
      )
    );
  }, [sortedData, searchKeys, enableSearch]);

  // 고유 필터 값 추출
  const uniqueFilterValues = useMemo(() => {
    if (!enableFilter || !sortedData) return [];
    
    const values = new Set();
    sortedData.forEach(item => {
      const value = item[filterKey];
      if (Array.isArray(value)) {
        value.forEach(v => values.add(v));
      } else if (value) {
        values.add(value);
      }
    });
    
    return Array.from(values).sort();
  }, [sortedData, filterKey, enableFilter]);

  // 데이터 통계
  const dataStats = useMemo(() => {
    if (!sortedData || !Array.isArray(sortedData)) {
      return {
        total: 0,
        byType: {},
        byYear: {},
        latest: null,
        oldest: null
      };
    }

    const stats = {
      total: sortedData.length,
      byType: {},
      byYear: {},
      latest: null,
      oldest: null
    };

    sortedData.forEach(item => {
      // 타입별 통계
      const type = item[filterKey] || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      // 연도별 통계
      if (item.year) {
        stats.byYear[item.year] = (stats.byYear[item.year] || 0) + 1;
      }

      // 최신/최오래된 항목
      if (item.year) {
        if (!stats.latest || item.year > stats.latest.year) {
          stats.latest = item;
        }
        if (!stats.oldest || item.year < stats.oldest.year) {
          stats.oldest = item;
        }
      }
    });

    return stats;
  }, [sortedData, filterKey]);

  // 페이지네이션
  const paginateData = useCallback((targetData, page = 1, itemsPerPage = 10) => {
    if (!targetData || !Array.isArray(targetData)) return [];
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      data: targetData.slice(startIndex, endIndex),
      totalPages: Math.ceil(targetData.length / itemsPerPage),
      currentPage: page,
      totalItems: targetData.length,
      hasNext: endIndex < targetData.length,
      hasPrev: page > 1
    };
  }, []);

  // 복합 필터링 및 검색
  const processData = useCallback((filters = {}) => {
    const { 
      filterValue, 
      searchTerm, 
      customFilter,
      page,
      itemsPerPage 
    } = filters;

    let processed = sortedData;

    // 필터 적용
    if (filterValue) {
      processed = filterData(filterValue);
    }

    // 검색 적용
    if (searchTerm) {
      processed = searchData(searchTerm, processed);
    }

    // 커스텀 필터 적용
    if (customFilter && typeof customFilter === 'function') {
      processed = processed.filter(customFilter);
    }

    // 페이지네이션 적용
    if (page && itemsPerPage) {
      return paginateData(processed, page, itemsPerPage);
    }

    return processed;
  }, [sortedData, filterData, searchData, paginateData]);

  return {
    // 처리된 데이터
    data: sortedData,
    groupedData,
    
    // 유틸리티 함수들
    filterData,
    searchData,
    paginateData,
    processData,
    
    // 메타데이터
    uniqueFilterValues,
    dataStats,
    
    // 설정
    options: {
      filterKey,
      sortKey,
      sortOrder,
      groupBy,
      searchKeys,
      enableSearch,
      enableFilter,
      enableSort
    }
  };
};

/**
 * 작품 데이터 전용 훅
 * @param {Object} siteData - 사이트 데이터
 * @returns {Object} 처리된 작품 데이터
 */
export const useWorksData = (siteData) => {
  const allWorks = useMemo(() => {
    if (!siteData?.works) return [];
    
    return [
      ...(siteData.works.music?.albums || []),
      ...(siteData.works.visual?.photography || []),
      ...(siteData.works.visual?.videos || []),
      ...(siteData.works.writing || []),
      ...(siteData.works.performance || [])
    ];
  }, [siteData]);

  const processor = useDataProcessor(allWorks, {
    filterKey: 'type',
    sortKey: 'year',
    sortOrder: 'desc',
    searchKeys: ['title', 'description', 'tags'],
    enableSearch: true,
    enableFilter: true,
    enableSort: true
  });

  // 카테고리별 데이터 분리
  const categorizedData = useMemo(() => {
    if (!processor.data) return {};
    
    return {
      music: processor.data.filter(item => item.type === 'music' || item.cover),
      visual: processor.data.filter(item => ['photography', 'videos'].includes(item.type) || item.images),
      writing: processor.data.filter(item => item.type === 'writing' || item.publication),
      performance: processor.data.filter(item => item.type === 'performance' || item.setlist),
      all: processor.data
    };
  }, [processor.data]);

  return {
    ...processor,
    categorizedData,
    getWorksByCategory: (category) => categorizedData[category] || []
  };
};

/**
 * 타임라인 데이터 전용 훅 - 통합 timeline 데이터 처리
 * @param {Array} timelineData - 타임라인 데이터
 * @returns {Object} 처리된 타임라인 데이터
 */
export const useTimelineData = (timelineData) => {
  const processor = useDataProcessor(timelineData, {
    sortKey: 'year',
    sortOrder: 'desc',
    groupBy: 'year',
    searchKeys: ['title', 'description'],
    enableSearch: true,
    enableFilter: false,
    enableSort: true
  });

  // 이벤트들을 평면화하여 카드 렌더링에 적합한 형태로 변환
  const flattenedEvents = useMemo(() => {
    if (!processor.data) return [];
    
    const events = [];
    processor.data.forEach(yearData => {
      yearData.events?.forEach(event => {
        events.push({
          ...event,
          year: yearData.year, // 연도 정보 추가
          // CardRenderer에서 기대하는 필드들 추가
          type: event.type || 'other',
          featured: event.featured || false
        });
      });
    });
    
    return events.sort((a, b) => b.year - a.year); // 최신순 정렬
  }, [processor.data]);

  // 연도별 이벤트 통계
  const yearlyStats = useMemo(() => {
    if (!processor.data) return {};
    
    const stats = {};
    processor.data.forEach(yearData => {
      stats[yearData.year] = {
        total: yearData.events?.length || 0,
        byType: {}
      };
      
      yearData.events?.forEach(event => {
        const type = event.type || 'unknown';
        stats[yearData.year].byType[type] = (stats[yearData.year].byType[type] || 0) + 1;
      });
    });
    
    return stats;
  }, [processor.data]);

  // 타입별 필터링
  const getEventsByType = useCallback((type) => {
    if (!type || type === 'all') return flattenedEvents;
    return flattenedEvents.filter(event => event.type === type);
  }, [flattenedEvents]);

  // 연도별 필터링 (기존 호환성 유지)
  const getEventsByYear = useCallback((year) => {
    return processor.data.find(item => item.year === year)?.events || [];
  }, [processor.data]);

  // 통합 검색 함수
  const searchEvents = useCallback((searchTerm) => {
    if (!searchTerm) return flattenedEvents;
    
    const term = searchTerm.toLowerCase();
    return flattenedEvents.filter(event => 
      event.title?.toLowerCase().includes(term) ||
      event.description?.toLowerCase().includes(term) ||
      event.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  }, [flattenedEvents]);

  return {
    ...processor,
    flattenedEvents,
    yearlyStats,
    getEventsByYear,
    getEventsByType,
    searchEvents
  };
};

export default useDataProcessor;