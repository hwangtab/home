import { useCallback, useState } from 'react';
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


export default useCardActions;
