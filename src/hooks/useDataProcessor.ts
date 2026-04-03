import { useMemo, useCallback } from 'react';
import { WORK_CATEGORIES, type Work, type WorkCategory } from '../types/data.types';

interface DataProcessorOptions<T> {
    filterKey?: keyof T;
    sortKey?: keyof T;
    sortOrder?: 'asc' | 'desc';
    groupBy?: keyof T | null;
    searchKeys?: (keyof T)[];
    enableSearch?: boolean;
    enableFilter?: boolean;
    enableSort?: boolean;
}

interface DataStats {
    total: number;
    byType: Record<string, number>;
    byYear: Record<number, number>;
    latest: Work | null;
    oldest: Work | null;
}

interface PaginationResult<T> {
    data: T[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
}

interface ProcessFilters<T> {
    filterValue?: string;
    searchTerm?: string;
    customFilter?: (item: T) => boolean;
    page?: number;
    itemsPerPage?: number;
}

/**
 * 데이터 처리 및 필터링을 위한 통합 훅
 */
export const useDataProcessor = <T extends Record<string, unknown>>(
    data: T[] | null,
    options: DataProcessorOptions<T> = {}
) => {
    const {
        filterKey = 'type' as keyof T,
        sortKey = 'year' as keyof T,
        sortOrder = 'desc',
        groupBy = null,
        searchKeys = ['title', 'description'] as (keyof T)[],
        enableSearch = true,
        enableFilter = true,
        enableSort = true
    } = options;

    const sortedData = useMemo(() => {
        if (!enableSort || !data || !Array.isArray(data)) return data || [];
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

    const groupedData = useMemo(() => {
        if (!groupBy || !sortedData) return sortedData;
        const groups: Record<string, T[]> = {};
        sortedData.forEach(item => {
            const key = String(item[groupBy] || 'unknown');
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });
        return groups;
    }, [sortedData, groupBy]);

    const filterData = useCallback((filterValue: string) => {
        if (!enableFilter || !filterValue || filterValue === 'all') return sortedData;
        return sortedData.filter(item => {
            const val = item[filterKey];
            return val === filterValue || (Array.isArray(val) && val.includes(filterValue));
        });
    }, [sortedData, filterKey, enableFilter]);

    const searchData = useCallback((searchTerm: string, targetData: T[] = sortedData) => {
        if (!enableSearch || !searchTerm || !targetData) return targetData;
        const term = searchTerm.toLowerCase();
        return targetData.filter(item =>
            searchKeys.some(key => {
                const val = item[key];
                return typeof val === 'string' && val.toLowerCase().includes(term);
            })
        );
    }, [sortedData, searchKeys, enableSearch]);

    const uniqueFilterValues = useMemo(() => {
        if (!enableFilter || !sortedData) return [];
        const values = new Set<string>();
        sortedData.forEach(item => {
            const value = item[filterKey];
            if (Array.isArray(value)) value.forEach(v => values.add(String(v)));
            else if (value) values.add(String(value));
        });
        return Array.from(values).sort();
    }, [sortedData, filterKey, enableFilter]);

    const dataStats = useMemo((): DataStats => {
        if (!sortedData || !Array.isArray(sortedData)) {
            return { total: 0, byType: {}, byYear: {}, latest: null, oldest: null };
        }
        const stats: DataStats = { total: sortedData.length, byType: {}, byYear: {}, latest: null, oldest: null };
        sortedData.forEach(item => {
            const type = String(item[filterKey] || 'unknown');
            stats.byType[type] = (stats.byType[type] || 0) + 1;
            const year = item['year' as keyof T];
            if (typeof year === 'number') {
                stats.byYear[year] = (stats.byYear[year] || 0) + 1;
                const workItem = item as unknown as Work;
                if (!stats.latest || year > stats.latest.year) stats.latest = workItem;
                if (!stats.oldest || year < stats.oldest.year) stats.oldest = workItem;
            }
        });
        return stats;
    }, [sortedData, filterKey]);

    const paginateData = useCallback(<U>(targetData: U[], page = 1, itemsPerPage = 10): PaginationResult<U> => {
        if (!targetData || !Array.isArray(targetData)) return { data: [], totalPages: 0, currentPage: 1, totalItems: 0, hasNext: false, hasPrev: false };
        const startIndex = (page - 1) * itemsPerPage;
        return {
            data: targetData.slice(startIndex, startIndex + itemsPerPage),
            totalPages: Math.ceil(targetData.length / itemsPerPage),
            currentPage: page, totalItems: targetData.length,
            hasNext: startIndex + itemsPerPage < targetData.length, hasPrev: page > 1
        };
    }, []);

    const processData = useCallback((filters: ProcessFilters<T> = {}) => {
        const { filterValue, searchTerm, customFilter, page, itemsPerPage } = filters;
        let processed = sortedData;
        if (filterValue) processed = filterData(filterValue);
        if (searchTerm) processed = searchData(searchTerm, processed);
        if (customFilter && typeof customFilter === 'function') processed = processed.filter(customFilter);
        if (page && itemsPerPage) return paginateData(processed, page, itemsPerPage);
        return processed;
    }, [sortedData, filterData, searchData, paginateData]);

    return {
        data: sortedData, groupedData, filterData, searchData, paginateData, processData,
        uniqueFilterValues, dataStats,
        options: { filterKey, sortKey, sortOrder, groupBy, searchKeys, enableSearch, enableFilter, enableSort }
    };
};

// Works Data types
interface CategorizedData {
    music: Work[];
    visual: Work[];
    writing: Work[];
    performance: Work[];
    struggle: Work[];
    all: Work[];
}

interface TimelineYear {
    year: number;
    events: Work[];
}

interface YearlyStats {
    [year: number]: { total: number; byType: Record<string, number> };
}

type WorksCollection = Partial<Record<WorkCategory, Work[]>>;

/**
 * 통합 작품 데이터 전용 훅
 */
export const useWorksData = (worksData: WorksCollection | null, pageType: 'works' | 'archive' | 'about' | 'all' = 'all') => {
    const allWorks = useMemo(() => {
        if (!worksData) return [];
        const works = WORK_CATEGORIES.flatMap((category) => worksData[category] || []);
        if (pageType === 'all') return works;
        return works.filter(work => work.showInPages?.includes(pageType));
    }, [worksData, pageType]);

    const processor = useDataProcessor(allWorks as unknown as Record<string, unknown>[], {
        filterKey: 'archiveCategory' as keyof Work,
        sortKey: 'year' as keyof Work, sortOrder: 'desc',
        searchKeys: ['title', 'description'] as (keyof Work)[], enableSearch: true, enableFilter: true, enableSort: true
    });

    const categorizedData = useMemo((): CategorizedData => {
        const data = processor.data as unknown as Work[];
        if (!data) return { music: [], visual: [], writing: [], performance: [], struggle: [], all: [] };
        return {
            music: data.filter(item => item.archiveCategory === 'music'),
            visual: data.filter(item => item.archiveCategory === 'visual'),
            writing: data.filter(item => item.archiveCategory === 'writing'),
            performance: data.filter(item => item.archiveCategory === 'performance'),
            struggle: data.filter(item => item.archiveCategory === 'struggle'),
            all: data
        };
    }, [processor.data]);

    const timelineData = useMemo((): TimelineYear[] => {
        const data = processor.data as unknown as Work[];
        if (!data) return [];
        const yearGroups: Record<number, TimelineYear> = {};
        data.forEach(work => {
            if (!yearGroups[work.year]) yearGroups[work.year] = { year: work.year, events: [] };
            yearGroups[work.year].events.push(work);
        });
        return Object.values(yearGroups).sort((a, b) => b.year - a.year);
    }, [processor.data]);

    const getEventsByYear = useCallback((year: number) => (processor.data as unknown as Work[]).filter(work => work.year === year), [processor.data]);
    const getEventsByType = useCallback((type: string) => {
        const data = processor.data as unknown as Work[];
        if (!type || type === 'all') return data;
        return data.filter(work => work.archiveCategory === type);
    }, [processor.data]);
    const searchEvents = useCallback((searchTerm: string) => processor.searchData(searchTerm, processor.data as unknown as Record<string, unknown>[]) as unknown as Work[], [processor]);

    const yearlyStats = useMemo((): YearlyStats => {
        const data = processor.data as unknown as Work[];
        if (!data) return {};
        const stats: YearlyStats = {};
        data.forEach(work => {
            if (!stats[work.year]) stats[work.year] = { total: 0, byType: {} };
            stats[work.year].total += 1;
            const type = work.archiveCategory || 'unknown';
            stats[work.year].byType[type] = (stats[work.year].byType[type] || 0) + 1;
        });
        return stats;
    }, [processor.data]);

    return {
        ...processor, categorizedData, timelineData, flattenedEvents: processor.data as unknown as Work[], yearlyStats,
        getWorksByCategory: (category: WorkCategory) => categorizedData[category] || [],
        getEventsByYear, getEventsByType, searchEvents
    };
};

/** @deprecated Use useWorksData instead */
export const useTimelineData = (worksData: WorksCollection | null) => {
    console.warn('useTimelineData is deprecated. Use useWorksData instead.');
    return useWorksData(worksData, 'archive');
};

export default useDataProcessor;
