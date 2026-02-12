import { useState, useCallback } from 'react';

// Search hook
interface SearchReturn<T> {
    searchTerm: string;
    searchResults: T[];
    handleSearchChange: (term: string) => void;
    clearSearch: () => void;
    performSearch: (term: string) => void;
    hasResults: boolean;
}

export const useSearch = <T extends Record<string, unknown>>(
    data: T[],
    searchKeys: (keyof T)[] = ['title' as keyof T, 'description' as keyof T]
): SearchReturn<T> => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<T[]>([]);

    const performSearch = useCallback((term: string) => {
        if (!term || !data) { setSearchResults([]); return; }
        const results = data.filter(item =>
            searchKeys.some(key => {
                const val = item[key];
                return typeof val === 'string' && val.toLowerCase().includes(term.toLowerCase());
            })
        );
        setSearchResults(results);
    }, [data, searchKeys]);

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
        performSearch(term);
    }, [performSearch]);

    const clearSearch = useCallback(() => { setSearchTerm(''); setSearchResults([]); }, []);

    return { searchTerm, searchResults, handleSearchChange, clearSearch, performSearch, hasResults: searchResults.length > 0 };
};
