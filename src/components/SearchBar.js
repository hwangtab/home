import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { Search, X, Music, Calendar, FileText, Mic, Hash } from 'lucide-react';

const SearchResult = ({ result, onClick, type }) => {
  const getIcon = (itemType) => {
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

  const highlightMatches = (text, indices) => {
    if (!indices || indices.length === 0) return text;

    const parts = [];
    let lastIndex = 0;

    indices.forEach(([start, end]) => {
      if (start > lastIndex) {
        parts.push(text.slice(lastIndex, start));
      }
      parts.push(
        <mark key={`${start}-${end}`} className="bg-yellow-400 text-gray-900 px-1 rounded">
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

  return (
    <motion.div
      className="flex items-start space-x-3 p-3 hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(result)}
    >
      <div className="text-gray-400 mt-1">
        {getIcon(type)}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-gray-200 font-wanted-sans font-medium mb-1">
          {result.matches?.find(m => m.key === 'title')?.indices ?
            highlightMatches(result.item.title, result.matches.find(m => m.key === 'title').indices) :
            result.item.title
          }
        </h4>

        {result.item.year && (
          <p className="text-gray-400 text-sm">
            {result.item.year}년
          </p>
        )}

        {result.item.description && (
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {result.matches?.find(m => m.key === 'description')?.indices ?
              highlightMatches(
                result.item.description.slice(0, 100) + (result.item.description.length > 100 ? '...' : ''),
                result.matches.find(m => m.key === 'description').indices
              ) :
              result.item.description.slice(0, 100) + (result.item.description.length > 100 ? '...' : '')
            }
          </p>
        )}


      </div>

      <div className="text-xs text-gray-500 mt-1">
        {type}
      </div>
    </motion.div>
  );
};

const SearchBar = ({ data, onResultClick, placeholder = "작품, 연도 검색..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Prepare search data from the flattened data array
  const searchData = React.useMemo(() => {
    // If data is already flattened (like from archive page), use it directly
    if (Array.isArray(data)) {
      return data.map(item => ({
        ...item,
        type: item.archiveCategory || item.type || 'unknown'
      }));
    }

    // Otherwise, flatten the data structure
    const items = [];

    // Add events from concerts
    if (data.events?.concerts) {
      data.events.concerts.forEach(item => {
        items.push({ ...item, type: 'event' });
      });
    }

    return items;
  }, [data]);

  // Configure Fuse.js
  const fuse = React.useMemo(() => {
    const options = {
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

    return new Fuse(searchData, options);
  }, [searchData]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const searchResults = fuse.search(query).slice(0, 8);
      setResults(searchResults);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [query, fuse]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
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

  const handleResultClick = (result) => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();

    if (onResultClick) {
      onResultClick(result);
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
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder={placeholder}
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            ref={resultsRef}
            className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="py-2">
              <div className="px-3 py-2 text-xs text-gray-400 font-wanted-sans border-b border-gray-700">
                {results.length}개 결과
              </div>

              {results.map((result, index) => (
                <div
                  key={`${result.item.id || result.item.title}-${index}`}
                  className={`${index === selectedIndex ? 'bg-gray-700' : ''
                    }`}
                >
                  <SearchResult
                    result={result}
                    onClick={handleResultClick}
                    type={result.item.type}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && results.length === 0 && query.trim().length >= 2 && (
        <motion.div
          className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 text-center text-gray-400 font-wanted-sans">
            검색 결과가 없습니다.
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;