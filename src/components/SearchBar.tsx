"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse, { type FuseResult, type FuseResultMatch } from 'fuse.js';
import { Search, X, Music, Calendar, FileText, Mic, Hash } from 'lucide-react';
import { WORK_CATEGORIES, type Events, type Work, type WorkCategory, type Works } from '../types/data.types';
import { useLanguage } from '../i18n';

const FUSE_OPTIONS = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'year', weight: 0.1 }
  ],
  threshold: 0.3,
  includeMatches: true,
  includeScore: true,
  minMatchCharLength: 2,
  shouldSort: true
};

export interface SearchResultItem {
  id?: string;
  title: string;
  year?: string | number;
  description?: string;
  type?: string;
  archiveCategory?: WorkCategory | 'event' | 'work' | 'unknown';
}

export type SearchSource =
  | SearchResultItem[]
  | {
      works?: Partial<Works>;
      events?: Events;
    };

interface SearchResultProps {
  result: FuseResult<SearchResultItem>;
  onClick: (result: FuseResult<SearchResultItem>) => void;
  type: string;
}

interface SearchBarProps {
  data: SearchSource;
  onResultClick: (result: FuseResult<SearchResultItem>) => void;
  placeholder?: string;
}

const getIcon = (itemType: string): React.ReactNode => {
  switch (itemType) {
    case 'music':
      return <Music size={16} />;
    case 'event':
      return <Calendar size={16} />;
    case 'writing':
      return <FileText size={16} />;
    case 'performance':
      return <Mic size={16} />;
    default:
      return <Hash size={16} />;
  }
};

const highlightMatches = (text: string, indices: ReadonlyArray<readonly [number, number]>): React.ReactNode => {
  if (indices.length === 0) {
    return text;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  indices.forEach(([start, end]) => {
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <mark key={`${start}-${end}`} className="rounded bg-yellow-400 px-1 text-gray-900">
        {text.slice(start, end + 1)}
      </mark>
    );
    lastIndex = end + 1;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

const getMatchedIndices = (
  matches: readonly FuseResultMatch[] | undefined,
  key: string
): ReadonlyArray<readonly [number, number]> => {
  const match = matches?.find((item) => item.key === key);
  return match?.indices ?? [];
};

const toSearchItems = (data: SearchSource): SearchResultItem[] => {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      ...item,
      type: item.type ?? item.archiveCategory ?? 'unknown'
    }));
  }

  const items: SearchResultItem[] = [];

  data.events?.concerts.forEach((concert) => {
    items.push({
      id: concert.id,
      title: concert.title,
      year: concert.date,
      description: concert.location,
      type: 'event',
      archiveCategory: 'event'
    });
  });

  WORK_CATEGORIES.forEach((category) => {
    const works = data.works?.[category as WorkCategory];

    if (!works) {
      return;
    }

    works.forEach((work) => {
      items.push({
        id: work.id,
        title: work.title,
        year: work.year,
        description: work.description,
        type: work.type ?? work.archiveCategory ?? 'work',
        archiveCategory: work.archiveCategory ?? 'unknown'
      });
    });
  });

  return items;
};

const SearchResult: React.FC<SearchResultProps> = ({ result, onClick, type }) => {
  const { t } = useLanguage();
  const titleMatches = getMatchedIndices(result.matches, 'title');

  return (
    <motion.div
      className="flex cursor-pointer items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-700"
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(result)}
    >
      <div className="mt-1 text-gray-400">{getIcon(type)}</div>

      <div className="min-w-0 flex-1">
        <h4 className="mb-1 font-wanted-sans font-medium text-gray-200">
          {highlightMatches(result.item.title, titleMatches)}
        </h4>

        {result.item.year ? <p className="text-sm text-gray-400">{result.item.year}{t('common.year')}</p> : null}

        {result.item.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-gray-400">{result.item.description}</p>
        ) : null}
      </div>

      <div className="mt-1 text-xs text-gray-500">{type}</div>
    </motion.div>
  );
};

const SearchBar: React.FC<SearchBarProps> = ({ data, onResultClick, placeholder }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FuseResult<SearchResultItem>[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Cache search data using ref to prevent Fuse.js rebuild on every render
  const initialItems = toSearchItems(data);
  const searchDataRef = useRef<SearchResultItem[]>(initialItems);
  const fuseRef = useRef<Fuse<SearchResultItem>>(new Fuse(initialItems, FUSE_OPTIONS));

  // Compare all properties of two SearchResultItem arrays for index rebuild detection
  const itemsEqual = (a: SearchResultItem[], b: SearchResultItem[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((item, i) => {
      const other = b[i];
      if (!other) return false;
      // Compare every field that affects search relevance
      return item.id === other.id
        && item.title === other.title
        && item.year === other.year
        && item.description === other.description
        && item.type === other.type
        && item.archiveCategory === other.archiveCategory;
    });
  };

  // Only rebuild search index when the underlying data actually changes
  useEffect(() => {
    const newData = toSearchItems(data);
    const prevData = searchDataRef.current;
    if (!itemsEqual(newData, prevData)) {
      searchDataRef.current = newData;
      fuseRef.current = new Fuse(newData, FUSE_OPTIONS);
    }
  }, [data]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    setResults(fuseRef.current.search(query).slice(0, 8));
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current?.contains(event.target as Node) ||
        resultsRef.current?.contains(event.target as Node)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: FuseResult<SearchResultItem>) => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
    onResultClick(result);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen && results.length > 0}
          aria-autocomplete="list"
          aria-controls="search-listbox"
          aria-activedescendant={selectedIndex >= 0 ? `search-option-${selectedIndex}` : undefined}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="block w-full rounded-lg border border-gray-600 bg-gray-700 py-3 pl-10 pr-10 text-gray-200 placeholder-gray-400 transition-[border-color,box-shadow] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder || t('common.searchPlaceholder')}
        />

        {query ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-200"
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={resultsRef}
            id="search-listbox"
            role="listbox"
            className="absolute z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-gray-600 bg-gray-800 shadow-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => (
                  <div
                    key={`${result.item.id ?? result.item.title}-${index}`}
                    id={`search-option-${index}`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    className={selectedIndex === index ? 'rounded-lg bg-gray-700' : ''}
                  >
                    <SearchResult
                      result={result}
                      onClick={handleResultClick}
                      type={result.item.type ?? 'unknown'}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-400">{t('common.noResults')}</div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
