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
 * 통합 작품 데이터 전용 훅 - works 섹션의 모든 카테고리를 통합 처리
 * @param {Object} worksData - works 섹션 데이터
 * @param {string} pageType - 페이지 타입 ('works', 'archive', 'about', 'all')
 * @returns {Object} 처리된 작품 데이터
 */
export const useWorksData = (worksData, pageType = 'all') => {
  // 모든 works 카테고리를 하나로 flatten
  const allWorks = useMemo(() => {
    if (!worksData) return [];
    
    const works = [
      ...(worksData.music || []),
      ...(worksData.visual || []),
      ...(worksData.writing || []),
      ...(worksData.performance || [])
    ];
    
    // pageType별 필터링
    if (pageType === 'all') {
      return works;
    }
    
    return works.filter(work => 
      work.showInPages?.includes(pageType)
    );
  }, [worksData, pageType]);

  const processor = useDataProcessor(allWorks, {
    filterKey: 'archiveCategory',
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
      music: processor.data.filter(item => item.archiveCategory === 'music'),
      visual: processor.data.filter(item => item.archiveCategory === 'visual'),
      writing: processor.data.filter(item => item.archiveCategory === 'writing'),
      performance: processor.data.filter(item => item.archiveCategory === 'performance'),
      all: processor.data
    };
  }, [processor.data]);

  // 연도별 그룹화 (timeline 형태로 변환)
  const timelineData = useMemo(() => {
    if (!processor.data) return [];
    
    const yearGroups = {};
    processor.data.forEach(work => {
      if (!yearGroups[work.year]) {
        yearGroups[work.year] = {
          year: work.year,
          events: []
        };
      }
      yearGroups[work.year].events.push(work);
    });
    
    return Object.values(yearGroups).sort((a, b) => b.year - a.year);
  }, [processor.data]);

  // 연도별 이벤트 가져오기
  const getEventsByYear = useCallback((year) => {
    return processor.data.filter(work => work.year === year);
  }, [processor.data]);

  // 타입별 이벤트 가져오기
  const getEventsByType = useCallback((type) => {
    if (!type || type === 'all') return processor.data;
    return processor.data.filter(work => work.archiveCategory === type);
  }, [processor.data]);

  // 검색 함수 (기존 timeline 호환성)
  const searchEvents = useCallback((searchTerm) => {
    return processor.searchData(searchTerm, processor.data);
  }, [processor]);

  // 통계 데이터
  const yearlyStats = useMemo(() => {
    if (!processor.data) return {};
    
    const stats = {};
    processor.data.forEach(work => {
      if (!stats[work.year]) {
        stats[work.year] = {
          total: 0,
          byType: {}
        };
      }
      stats[work.year].total += 1;
      
      const type = work.archiveCategory || 'unknown';
      stats[work.year].byType[type] = (stats[work.year].byType[type] || 0) + 1;
    });
    
    return stats;
  }, [processor.data]);

  return {
    ...processor,
    categorizedData,
    timelineData,
    flattenedEvents: processor.data, // timeline 호환성을 위한 alias
    yearlyStats,
    getWorksByCategory: (category) => categorizedData[category] || [],
    getEventsByYear,
    getEventsByType,
    searchEvents
  };
};

/**
 * 타임라인 데이터 전용 훅 - 호환성을 위한 래퍼 (deprecated)
 * @param {Object} worksData - works 데이터 (새 구조)
 * @returns {Object} 처리된 타임라인 데이터
 * @deprecated useWorksData를 대신 사용하세요
 */
export const useTimelineData = (worksData) => {
  console.warn('useTimelineData is deprecated. Use useWorksData instead.');
  
  // 새로운 useWorksData를 사용하되 archive 페이지용으로 설정
  const worksProcessor = useWorksData(worksData, 'archive');
  
  return {
    ...worksProcessor,
    // 기존 API와의 호환성을 위한 aliases
    flattenedEvents: worksProcessor.flattenedEvents,
    yearlyStats: worksProcessor.yearlyStats,
    getEventsByYear: worksProcessor.getEventsByYear,
    getEventsByType: worksProcessor.getEventsByType,
    searchEvents: worksProcessor.searchEvents
  };
};

export default useDataProcessor;