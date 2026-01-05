import { useCallback, useState, useMemo } from 'react';
import type { Work } from '../types/data.types';

interface CardActionsOptions {
    enableLightbox?: boolean;
    enableMusicPlayer?: boolean;
    enableModal?: boolean;
}

interface LightboxState {
    selectedImages: string[];
    lightboxIndex: number;
    isLightboxOpen: boolean;
    openLightbox: (work: Work) => void;
    closeLightbox: () => void;
    changeLightboxImage: (index: number) => void;
}

interface MusicPlayerState {
    playlist: Work[];
    musicPlayerVisible: boolean;
    openMusicPlayer: (works: Work | Work[]) => void;
    closeMusicPlayer: () => void;
}

interface ModalState {
    selectedItem: Work | null;
    isModalOpen: boolean;
    openModal: (item: Work) => void;
    closeModal: () => void;
}

interface CardActions {
    handleCardClick: (work: Work) => void;
    openExternalLink: (url: string) => void;
    shareWork: (work: Work) => Promise<void>;
    toggleFavorite: (work: Work) => void;
    isFavorite: (workId: string) => boolean;
}

interface CardActionsReturn {
    lightbox: LightboxState;
    musicPlayer: MusicPlayerState;
    modal: ModalState;
    actions: CardActions;
    favorites: string[];
}

type WorkWithExtras = Work & {
    images?: string[];
    audioUrl?: string;
    links?: string;
    url?: string;
};

/**
 * 카드 액션들을 위한 재사용 가능한 훅
 */
export const useCardActions = (options: CardActionsOptions = {}): CardActionsReturn => {
    const {
        enableLightbox = true,
        enableMusicPlayer = true,
        enableModal = false
    } = options;

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [musicPlayerVisible, setMusicPlayerVisible] = useState(false);
    const [playlist, setPlaylist] = useState<Work[]>([]);
    const [selectedItem, setSelectedItem] = useState<Work | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openLightbox = useCallback((work: Work) => {
        if (!enableLightbox) return;
        const w = work as WorkWithExtras;
        if (w.images && w.images.length > 0) {
            setSelectedImages(w.images);
            setLightboxIndex(0);
            setIsLightboxOpen(true);
        }
    }, [enableLightbox]);

    const closeLightbox = useCallback(() => {
        setIsLightboxOpen(false);
        setSelectedImages([]);
        setLightboxIndex(0);
    }, []);

    const changeLightboxImage = useCallback((index: number) => {
        setLightboxIndex(index);
    }, []);

    const openMusicPlayer = useCallback((works: Work | Work[]) => {
        if (!enableMusicPlayer) return;
        const workArray = Array.isArray(works) ? works : [works];
        const playableWorks = workArray.filter(work => {
            const w = work as WorkWithExtras;
            return w.audioUrl || w.links;
        });
        if (playableWorks.length > 0) {
            setPlaylist(playableWorks);
            setMusicPlayerVisible(true);
        }
    }, [enableMusicPlayer]);

    const closeMusicPlayer = useCallback(() => {
        setMusicPlayerVisible(false);
        setPlaylist([]);
    }, []);

    const openModal = useCallback((item: Work) => {
        if (!enableModal) return;
        setSelectedItem(item);
        setIsModalOpen(true);
    }, [enableModal]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedItem(null);
    }, []);

    const handleCardClick = useCallback((work: Work) => {
        if (!work) return;
        const w = work as WorkWithExtras;
        if ((work.type === 'visual' || w.images) && enableLightbox) {
            openLightbox(work);
            return;
        }
        if ((work.type === 'music' || w.audioUrl || w.links) && enableMusicPlayer) {
            openMusicPlayer(work);
            return;
        }
        if (enableModal) openModal(work);
    }, [openLightbox, openMusicPlayer, openModal, enableLightbox, enableMusicPlayer, enableModal]);

    const openExternalLink = useCallback((url: string) => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    const shareWork = useCallback(async (work: Work) => {
        if (!work) return;
        const w = work as WorkWithExtras;
        const shareData = {
            title: work.title,
            text: work.description || '',
            url: w.url || window.location.href
        };
        if (navigator.share && navigator.canShare(shareData)) {
            try { await navigator.share(shareData); } catch (e) { console.log('Sharing cancelled:', e); }
        } else {
            try { await navigator.clipboard.writeText(shareData.url); console.log('URL copied'); } catch (e) { console.error('Copy failed:', e); }
        }
    }, []);

    const [favorites, setFavorites] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('favorites');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const toggleFavorite = useCallback((work: Work) => {
        if (!work || !work.id) return;
        setFavorites(prev => {
            const newFavorites = prev.includes(work.id)
                ? prev.filter(id => id !== work.id)
                : [...prev, work.id];
            try { localStorage.setItem('favorites', JSON.stringify(newFavorites)); } catch (e) { console.error('Save failed:', e); }
            return newFavorites;
        });
    }, []);

    const isFavorite = useCallback((workId: string) => favorites.includes(workId), [favorites]);

    return {
        lightbox: { selectedImages, lightboxIndex, isLightboxOpen, openLightbox, closeLightbox, changeLightboxImage },
        musicPlayer: { playlist, musicPlayerVisible, openMusicPlayer, closeMusicPlayer },
        modal: { selectedItem, isModalOpen, openModal, closeModal },
        actions: { handleCardClick, openExternalLink, shareWork, toggleFavorite, isFavorite },
        favorites
    };
};

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
            else if (value) filters.add(String(value));
        });
        return ['all', ...Array.from(filters)];
    }, [data, filterKey]);

    const filteredData = useMemo(() => {
        if (!data || activeFilter === 'all') return data || [];
        return data.filter(item => {
            const value = item[filterKey];
            if (Array.isArray(value)) return value.includes(activeFilter);
            return value === activeFilter;
        });
    }, [data, activeFilter, filterKey]);

    const setFilter = useCallback((filter: string) => setActiveFilter(filter), []);
    const clearFilter = useCallback(() => setActiveFilter('all'), []);

    return { activeFilter, availableFilters, filteredData, setFilter, clearFilter, isFiltered: activeFilter !== 'all' };
};

export default useCardActions;
