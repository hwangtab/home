import { useCallback, useState } from 'react';

/**
 * 카드 액션들을 위한 재사용 가능한 훅
 * @param {Object} options - 옵션 설정
 * @returns {Object} 카드 액션 함수들과 상태
 */
export const useCardActions = (options = {}) => {
  const {
    enableLightbox = true,
    enableMusicPlayer = true,
    enableModal = false
  } = options;

  // Lightbox 관련 상태
  const [selectedImages, setSelectedImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Music Player 관련 상태
  const [musicPlayerVisible, setMusicPlayerVisible] = useState(false);
  const [playlist, setPlaylist] = useState([]);

  // Modal 관련 상태
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lightbox 열기
  const openLightbox = useCallback((work) => {
    if (!enableLightbox) return;
    
    if (work.images && work.images.length > 0) {
      setSelectedImages(work.images);
      setLightboxIndex(0);
      setIsLightboxOpen(true);
    }
  }, [enableLightbox]);

  // Lightbox 닫기
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setSelectedImages([]);
    setLightboxIndex(0);
  }, []);

  // Lightbox 이미지 변경
  const changeLightboxImage = useCallback((index) => {
    setLightboxIndex(index);
  }, []);

  // Music Player 열기
  const openMusicPlayer = useCallback((works) => {
    if (!enableMusicPlayer) return;
    
    const playableWorks = Array.isArray(works) 
      ? works.filter(work => work.audioUrl || work.links)
      : [works].filter(work => work.audioUrl || work.links);
    
    if (playableWorks.length > 0) {
      setPlaylist(playableWorks);
      setMusicPlayerVisible(true);
    }
  }, [enableMusicPlayer]);

  // Music Player 닫기
  const closeMusicPlayer = useCallback(() => {
    setMusicPlayerVisible(false);
    setPlaylist([]);
  }, []);

  // Modal 열기
  const openModal = useCallback((item) => {
    if (!enableModal) return;
    
    setSelectedItem(item);
    setIsModalOpen(true);
  }, [enableModal]);

  // Modal 닫기
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
  }, []);

  // 카드 클릭 핸들러 (타입에 따라 적절한 액션 실행)
  const handleCardClick = useCallback((work) => {
    if (!work) return;

    // Visual 타입이고 이미지가 있으면 Lightbox 열기
    if ((work.type === 'visual' || work.images) && enableLightbox) {
      openLightbox(work);
      return;
    }

    // Music 타입이고 오디오가 있으면 Music Player 열기
    if ((work.type === 'music' || work.audioUrl || work.links) && enableMusicPlayer) {
      openMusicPlayer(work);
      return;
    }

    // 기본적으로 Modal 열기
    if (enableModal) {
      openModal(work);
    }
  }, [openLightbox, openMusicPlayer, openModal, enableLightbox, enableMusicPlayer, enableModal]);

  // 외부 링크 열기
  const openExternalLink = useCallback((url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // 공유 기능
  const shareWork = useCallback(async (work) => {
    if (!work) return;

    const shareData = {
      title: work.title,
      text: work.description || '',
      url: work.url || window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Sharing cancelled or failed:', error);
      }
    } else {
      // Fallback: 클립보드에 복사
      try {
        await navigator.clipboard.writeText(shareData.url);
        // 사용자에게 알림 (토스트 등)
        console.log('URL copied to clipboard');
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  }, []);

  // 즐겨찾기 토글 (로컬 스토리지 사용)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((work) => {
    if (!work || !work.id) return;

    setFavorites(prev => {
      const newFavorites = prev.includes(work.id)
        ? prev.filter(id => id !== work.id)
        : [...prev, work.id];
      
      try {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
      
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((workId) => {
    return favorites.includes(workId);
  }, [favorites]);

  return {
    // Lightbox 관련
    lightbox: {
      selectedImages,
      lightboxIndex,
      isLightboxOpen,
      openLightbox,
      closeLightbox,
      changeLightboxImage
    },

    // Music Player 관련
    musicPlayer: {
      playlist,
      musicPlayerVisible,
      openMusicPlayer,
      closeMusicPlayer
    },

    // Modal 관련
    modal: {
      selectedItem,
      isModalOpen,
      openModal,
      closeModal
    },

    // 일반 액션들
    actions: {
      handleCardClick,
      openExternalLink,
      shareWork,
      toggleFavorite,
      isFavorite
    },

    // 즐겨찾기 상태
    favorites
  };
};

/**
 * 검색 기능을 위한 훅
 * @param {Array} data - 검색할 데이터
 * @param {Array} searchKeys - 검색할 키들
 * @returns {Object} 검색 관련 상태와 함수
 */
export const useSearch = (data, searchKeys = ['title', 'description']) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const performSearch = useCallback((term) => {
    if (!term || !data) {
      setSearchResults([]);
      return;
    }

    const results = data.filter(item => 
      searchKeys.some(key => 
        item[key] && item[key].toLowerCase().includes(term.toLowerCase())
      )
    );

    setSearchResults(results);
  }, [data, searchKeys]);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    performSearch(term);
  }, [performSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
  }, []);

  return {
    searchTerm,
    searchResults,
    handleSearchChange,
    clearSearch,
    performSearch,
    hasResults: searchResults.length > 0
  };
};

/**
 * 필터 기능을 위한 훅
 * @param {Array} data - 필터링할 데이터
 * @param {string} filterKey - 필터링 기준 키
 * @returns {Object} 필터 관련 상태와 함수
 */
export const useFilter = (data, filterKey = 'type') => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const availableFilters = useState(() => {
    if (!data || !Array.isArray(data)) return [];
    
    const filters = new Set();
    data.forEach(item => {
      const value = item[filterKey];
      if (Array.isArray(value)) {
        value.forEach(v => filters.add(v));
      } else if (value) {
        filters.add(value);
      }
    });
    
    return ['all', ...Array.from(filters)];
  })[0];

  const filteredData = useState(() => {
    if (!data || activeFilter === 'all') return data;
    
    return data.filter(item => {
      const value = item[filterKey];
      if (Array.isArray(value)) {
        return value.includes(activeFilter);
      }
      return value === activeFilter;
    });
  })[0];

  const setFilter = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  const clearFilter = useCallback(() => {
    setActiveFilter('all');
  }, []);

  return {
    activeFilter,
    availableFilters,
    filteredData,
    setFilter,
    clearFilter,
    isFiltered: activeFilter !== 'all'
  };
};

export default useCardActions;