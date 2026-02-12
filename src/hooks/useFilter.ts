import { useState, useMemo, useCallback } from 'react';

// Filter hook
interface FilterReturn<T> {
    activeFilter: string;
    availableFilters: string[];
    filteredData: T[];
    setFilter: (filter: string) => void;
    clearFilter: () => void;
    isFiltered: boolean;
}

export const useFilter = <T extends Record<string, unknown>>(
    data: T[],
    filterKey: keyof T = 'type' as keyof T
): FilterReturn<T> => {
    const [activeFilter, setActiveFilter] = useState('all');

    const availableFilters = useMemo(() => {
        if (!data || !Array.isArray(data)) return ['all'];
        const filters = new Set<string>();
        data.forEach(item => {
            const value = item[filterKey];
            if (Array.isArray(value)) value.forEach(v => filters.add(String(v)));
            else if (value !== undefined && value !== null) filters.add(String(value));
        });
        return ['all', ...Array.from(filters)];
    }, [data, filterKey]);

    const filteredData = useMemo(() => {
        if (!data || activeFilter === 'all') return data || [];
        return data.filter(item => {
            const value = item[filterKey];
            if (Array.isArray(value)) return value.map(v => String(v)).includes(activeFilter);
            if (value === undefined || value === null) return false;
            return String(value) === activeFilter;
        });
    }, [data, activeFilter, filterKey]);

    const setFilter = useCallback((filter: string) => setActiveFilter(filter), []);
    const clearFilter = useCallback(() => setActiveFilter('all'), []);

    return { activeFilter, availableFilters, filteredData, setFilter, clearFilter, isFiltered: activeFilter !== 'all' };
};
