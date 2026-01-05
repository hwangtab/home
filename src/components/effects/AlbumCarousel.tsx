// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, PanInfo } from 'framer-motion';

export interface Album {
    id: string;
    title: string;
    year: number;
    cover: string;
    description?: string;
    shortDescription?: string;
    primaryAction?: {
        url?: string;
        label?: string;
    };
}

interface AlbumCarouselProps {
    albums: Album[];
    className?: string;
}

interface Theme {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
}

/**
 * 3D 앨범 커버 카루셀 컴포넌트
 * 대표 앨범들을 3D 효과로 회전 표시
 */
const AlbumCarousel: React.FC<AlbumCarouselProps> = ({ albums, className = '' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (albums.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % albums.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [albums.length]);

    const handlePrevious = () => {
        setCurrentIndex(prev => (prev - 1 + albums.length) % albums.length);
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev + 1) % albums.length);
    };

    const handleAlbumClick = (album: Album) => {
        if (album.primaryAction?.url) {
            window.open(album.primaryAction.url, '_blank', 'noopener,noreferrer');
        } else {
            navigate('/works');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent, album: Album) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleAlbumClick(album);
        }
    };

    const handleArrowKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                handlePrevious();
                break;
            case 'ArrowRight':
                event.preventDefault();
                handleNext();
                break;
        }
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50;
        if (Math.abs(info.offset.x) > threshold) {
            if (info.offset.x > 0) handlePrevious();
            else handleNext();
        }
    };

    if (!albums || albums.length === 0) return null;

    const getAlbumTheme = (album: Album): Theme => {
        const themes: Record<string, Theme> = {
            'gentrification-2016': {
                primary: 'from-brand-solidarity-600 to-brand-earth-600',
                secondary: 'from-brand-solidarity-500/20 to-brand-earth-500/20',
                accent: 'text-brand-solidarity-400',
                glow: 'shadow-brand-solidarity-500/30'
            },
            'new-minjung-vol3-2017': {
                primary: 'from-brand-primary-600 to-brand-harmony-600',
                secondary: 'from-brand-primary-500/20 to-brand-harmony-500/20',
                accent: 'text-brand-primary-400',
                glow: 'shadow-brand-primary-500/30'
            },
            'melting-snow-2024': {
                primary: 'from-brand-primary-600 to-brand-solidarity-600',
                secondary: 'from-brand-primary-500/20 to-brand-solidarity-500/20',
                accent: 'text-brand-primary-400',
                glow: 'shadow-brand-primary-500/30'
            }
        };
        return themes[album.id] || themes['melting-snow-2024'];
    };

    const theme = getAlbumTheme(albums[currentIndex]);

    return (
        <div
            className={`relative w-full max-w-3xl mx-auto ${className}`}
            role="region" aria-label="주요 앨범 캐러셀" aria-roledescription="carousel"
            onKeyDown={handleArrowKeyDown} tabIndex={0}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.secondary} rounded-3xl blur-3xl scale-110 opacity-60`} />
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {`${albums.length}개의 앨범 중 ${currentIndex + 1}번째: ${albums[currentIndex]?.title}`}
            </div>

            <div className="relative h-64 sm:h-80 lg:h-96 flex items-center justify-center">
                {albums.map((album, index) => (
                    <motion.div
                        key={album.id} role="button" tabIndex={index === currentIndex ? 0 : -1}
                        aria-label={`${album.title} 앨범 보기. ${album.year}년 발매. ${album.shortDescription || album.description}`}
                        aria-hidden={index !== currentIndex}
                        className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-3xl ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => handleAlbumClick(album)}
                        onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, album)}
                        drag={index === currentIndex && albums.length > 1 ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
                        onDragEnd={handleDragEnd} whileDrag={{ scale: 0.95 }}
                    >
                        <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-br ${getAlbumTheme(album).primary} rounded-2xl blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-500 transform rotate-3 scale-105 ${index === currentIndex && albums.length > 1 ? 'animate-pulse' : ''}`} />
                            <div className="relative transform-gpu group-hover:scale-110 group-hover:-rotate-2 group-active:scale-95 transition-all duration-500">
                                <div className="w-48 h-48 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                                    <img
                                        src={album.cover} alt={album.title} className="w-full h-full object-cover"
                                        loading={index === currentIndex ? 'eager' : 'lazy'}
                                        // @ts-ignore - fetchpriority is not yet in standard React types
                                        fetchpriority={index === currentIndex ? 'high' : 'low'}
                                        // @ts-ignore - decoding is not yet in standard React types
                                        decoding={index === currentIndex ? 'sync' : 'async'}
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-2xl" />
                                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 rounded-2xl ${index === currentIndex && albums.length > 1 ? 'group-hover:animate-none' : ''}`}>
                                    <div className="bg-white/90 rounded-full p-4 transform scale-0 group-hover:scale-100 group-active:scale-90 transition-transform duration-300 shadow-lg hover:shadow-xl">
                                        <Play className="w-8 h-8 text-gray-950 fill-current" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 mb-8 text-center">
                <div className="h-40 flex items-center justify-center relative">
                    {albums.map((album, index) => (
                        <div key={album.id} className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="relative space-y-3 bg-black/50 rounded-2xl px-3 sm:px-4 md:px-6 py-5 w-full max-w-full min-h-28 shadow-xl border border-white/20">
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-santokki text-white mb-2">{album.title}</h2>
                                <div className="flex items-center justify-center gap-2 text-gray-300 mb-3">
                                    <Calendar className="w-4 h-4" />
                                    <span className="font-wanted-sans text-sm sm:text-base">{album.year}년</span>
                                </div>
                                <p className="text-sm sm:text-base text-gray-200 font-wanted-sans max-w-full mx-auto leading-relaxed line-clamp-4 sm:line-clamp-3 mb-3">
                                    {album.shortDescription || album.description}
                                </p>
                                <div className="text-center">
                                    <span className="inline-flex items-center gap-2 text-brand-primary-400 text-sm font-semibold hover:text-brand-primary-300 transition-colors">
                                        <Play className="w-3 h-3" />
                                        {album.primaryAction?.label || '음악 듣기'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {albums.length > 1 && (
                <>
                    <button onClick={handlePrevious} aria-label="이전 앨범 보기" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 z-10">
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button onClick={handleNext} aria-label="다음 앨범 보기" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 z-10">
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                </>
            )}

            {albums.length > 1 && (
                <div className="flex justify-center mt-6 space-x-2 relative z-20" role="group" aria-label="앨범 선택">
                    {albums.map((album, index) => (
                        <button
                            key={index} onClick={() => setCurrentIndex(index)}
                            aria-label={`${index + 1}번째 앨범: ${album.title} 선택`}
                            aria-current={index === currentIndex ? 'true' : 'false'}
                            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${index === currentIndex ? `bg-white ${theme.glow}` : 'bg-white/30 hover:bg-white/50'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default React.memo(AlbumCarousel);
