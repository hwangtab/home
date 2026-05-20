import { useCallback, useState } from 'react';
import type { Work } from '../types/data.types';

interface CardActionsOptions {
    enableMusicPlayer?: boolean;
    enableModal?: boolean;
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
    musicPlayer: MusicPlayerState;
    modal: ModalState;
    actions: CardActions;
    favorites: string[];
}

/**
 * 카드 액션들을 위한 재사용 가능한 훅
 */
export const useCardActions = (options: CardActionsOptions = {}): CardActionsReturn => {
    const {
        enableMusicPlayer = true,
        enableModal = false
    } = options;

    const [musicPlayerVisible, setMusicPlayerVisible] = useState(false);
    const [playlist, setPlaylist] = useState<Work[]>([]);
    const [selectedItem, setSelectedItem] = useState<Work | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openMusicPlayer = useCallback((works: Work | Work[]) => {
        if (!enableMusicPlayer) return;
        const workArray = Array.isArray(works) ? works : [works];
        const playableWorks = workArray.filter(work => work.audioUrl || work.links);
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
        if ((work.type === 'music' || work.audioUrl || work.links) && enableMusicPlayer) {
            openMusicPlayer(work);
            return;
        }
        if (enableModal) openModal(work);
    }, [openMusicPlayer, openModal, enableMusicPlayer, enableModal]);

    const openExternalLink = useCallback((url: string) => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    const shareWork = useCallback(async (work: Work) => {
        if (!work) return;
        const shareData = {
            title: work.title,
            text: work.description || '',
            url: work.url || window.location.href
        };
        if (navigator.share && navigator.canShare(shareData)) {
            try { await navigator.share(shareData); } catch (_e) { /* share cancelled or failed */ }
        } else {
            try { await navigator.clipboard.writeText(shareData.url); } catch (_e) { /* clipboard unavailable */ }
        }
    }, []);

    const [favorites, setFavorites] = useState<string[]>(() => {
        // localStorage는 클라이언트에서만 사용 가능
        if (typeof window === 'undefined') return [];
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
            try { localStorage.setItem('favorites', JSON.stringify(newFavorites)); } catch (_e) { /* storage unavailable */ }
            return newFavorites;
        });
    }, []);

    const isFavorite = useCallback((workId: string) => favorites.includes(workId), [favorites]);

    return {
        musicPlayer: { playlist, musicPlayerVisible, openMusicPlayer, closeMusicPlayer },
        modal: { selectedItem, isModalOpen, openModal, closeModal },
        actions: { handleCardClick, openExternalLink, shareWork, toggleFavorite, isFavorite },
        favorites
    };
};


export default useCardActions;
