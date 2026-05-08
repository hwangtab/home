import React, { useCallback, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import {
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Volume2,
    VolumeX,
    Shuffle,
    Repeat,
    Heart,
    ExternalLink,
    List
} from 'lucide-react';
import { Work } from '../types/data.types';
import { useLanguage } from '../i18n';
import { getWorkCoverUrl } from '../lib/works';

// Extend Work to include properties specific to the player
export type PlayableWork = Work & {
    audioUrl?: string;
    purchaseUrl?: string;
    price?: string;
    coverUrl?: string;
    publication?: string;
    excerpt?: string;
    location?: string;
    credits?: string[];
    images?: string[];
    primaryAction?: { type: string; url: string; label: string };
    // links는 BaseWork에 이미 정의됨
};

interface MusicPlayerProps {
    playlist: PlayableWork[];
    isVisible: boolean;
    onClose: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ playlist = [], isVisible = false, onClose }) => {
    const { t } = useLanguage();
    // ReactPlayer ref: HTMLVideoElement + seekTo (hls.js API)
    const playerRef = useRef<HTMLVideoElement & { seekTo?: (value: number, format?: string) => void }>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);

    const currentTrack = playlist[currentIndex];
    const currentTrackCover = currentTrack ? getWorkCoverUrl(currentTrack.cover, 'music') : '/images/defaults/music-default.svg';

    React.useEffect(() => {
        setCurrentIndex(0);
    }, [playlist]);

    // Reset state when track changes or playlist changes
    React.useEffect(() => {
        if (!currentTrack) {
            setIsPlaying(false);
            setProgress(0);
        }
    }, [currentTrack]);

    const playPrevious = useCallback(() => {
        if (playlist.length <= 1) return;
        setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }, [playlist.length]);

    // repeat/shuffle 상태를 ref로 추적하여 stale closure 방지
    const repeatRef = useRef(repeat);
    const shuffleRef = useRef(shuffle);

    useEffect(() => {
        repeatRef.current = repeat;
    }, [repeat]);

    useEffect(() => {
        shuffleRef.current = shuffle;
    }, [shuffle]);

    const playNext = useCallback(() => {
        if (playlist.length <= 1) return;
        if (shuffleRef.current) {
            const nextIndex = Math.floor(Math.random() * playlist.length);
            setCurrentIndex(nextIndex);
        } else {
            setCurrentIndex((prev) => (prev + 1) % playlist.length);
        }
    }, [playlist.length]);

    const handleEnded = useCallback(() => {
        if (repeatRef.current) {
            setProgress(0);
            setIsPlaying(true);
        } else {
            playNext();
        }
    }, [playNext]);

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentTrack || playlist.length === 0) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50 shadow-3xl"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="container mx-auto">
                        {/* Progress Bar */}
                        <div
                            className="w-full bg-gray-700 rounded-full h-1 mb-4 cursor-pointer group"
                            onClick={(e) => {
                                if (!duration || !playerRef.current) return;
                                const rect = e.currentTarget.getBoundingClientRect();
                                const ratio = (e.clientX - rect.left) / rect.width;
                                const clampedRatio = Math.min(Math.max(ratio, 0), 1);
                                playerRef.current.seekTo?.(clampedRatio, 'fraction');
                                setProgress(clampedRatio * duration);
                            }}
                        >
                            <div
                                className="bg-brand-primary-500 h-1 rounded-full transition-all duration-300 relative group-hover:h-1.5"
                                style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            {/* Track Info */}
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                                <div className="relative group">
                                    <img
                                        src={currentTrackCover}
                                        alt={currentTrack.title}
                                        className="w-12 h-12 rounded object-cover shadow-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/20 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-white font-santokki truncate text-lg">
                                        {currentTrack.title}
                                    </h4>
                                    <p className="text-gray-400 text-sm font-wanted-sans truncate">
                                        {currentTrack.year}
                                    </p>
                                </div>
                                <button className="text-gray-400 hover:text-brand-solidarity-500 transition-colors hidden sm:block">
                                    <Heart size={20} />
                                </button>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <button
                                    onClick={() => setShuffle(!shuffle)}
                                    className={`transition-colors p-2 rounded-full hover:bg-gray-800 hidden sm:block ${shuffle ? 'text-brand-primary-400' : 'text-gray-400 hover:text-white'}`}
                                    title={t('player.shuffle')}
                                >
                                    <Shuffle size={20} />
                                </button>

                                <button
                                    onClick={playPrevious}
                                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                                    title={t('player.previousTrack')}
                                >
                                    <SkipBack size={24} />
                                </button>

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="bg-brand-primary-500 hover:bg-brand-primary-600 text-white rounded-full p-3 transition-colors shadow-lg hover:shadow-brand-primary-500/30 hover:scale-105 transform active:scale-95"
                                    title={isPlaying ? t('player.pause') : t('player.play')}
                                >
                                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                </button>

                                <button
                                    onClick={playNext}
                                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                                    title={t('player.nextTrack')}
                                >
                                    <SkipForward size={24} />
                                </button>

                                <button
                                    onClick={() => setRepeat(!repeat)}
                                    className={`transition-colors p-2 rounded-full hover:bg-gray-800 hidden sm:block ${repeat ? 'text-brand-primary-400' : 'text-gray-400 hover:text-white'}`}
                                    title={t('player.repeat')}
                                >
                                    <Repeat size={20} />
                                </button>
                            </div>

                            {/* Volume & Additional Controls */}
                            <div className="flex items-center space-x-4 flex-1 justify-end">
                                <span className="text-gray-400 text-xs sm:text-sm font-wanted-sans min-w-[3rem] text-right hidden md:block">
                                    {formatTime(progress)} / {formatTime(duration)}
                                </span>

                                <div className="hidden lg:flex items-center space-x-2 group">
                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className="text-gray-400 hover:text-white transition-colors p-1"
                                        title={isMuted ? t('player.unmute') : t('player.mute')}
                                    >
                                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    <div className="w-0 group-hover:w-24 transition-all duration-300 overflow-hidden">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={isMuted ? 0 : volume}
                                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                                            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowPlaylist(!showPlaylist)}
                                    className={`transition-colors p-2 rounded-full hover:bg-gray-800 ${showPlaylist ? 'text-brand-primary-400' : 'text-gray-400 hover:text-white'}`}
                                    title={t('player.playlist')}
                                >
                                    <List size={20} />
                                </button>

                                {/* External Links - using proper typing */}
                                {currentTrack.links && typeof currentTrack.links === 'object' && Object.keys(currentTrack.links).length > 0 && (
                                    <div className="hidden xl:flex space-x-1">
                                        {Object.entries(currentTrack.links).slice(0, 2).map(([platform, url]) => (
                                            <a
                                                key={platform}
                                                href={url as string}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
                                                title={`${platform} ${t('player.listenOn')}`}
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800 ml-2"
                                    title={t('common.close')}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Hidden ReactPlayer for audio */}
                        {currentTrack.audioUrl && (
                            <ReactPlayer
                                ref={playerRef}
                                src={currentTrack.audioUrl}
                                playing={isPlaying}
                                volume={isMuted ? 0 : volume}
                                // @ts-expect-error react-player 타입이 onDuration/onEnded 누락 (HTMLMediaElement 이벤트)
                                onDuration={setDuration}
                                onEnded={handleEnded}
                                width={0}
                                height={0}
                                style={{ display: 'none' }}
                            />
                        )}
                    </div>

                    {/* Playlist Modal */}
                    <AnimatePresence>
                        {showPlaylist && (
                            <motion.div
                                className="absolute bottom-full right-0 w-full sm:w-96 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-t-lg sm:rounded-lg shadow-2xl overflow-hidden mb-2 sm:mr-4 max-h-[60vh] flex flex-col"
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            >
                                <div className="p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10 flex justify-between items-center">
                                    <h3 className="text-white font-santokki">{t('player.playlist')}</h3>
                                    <span className="text-xs text-gray-400 font-wanted-sans">{playlist.length}{t('player.tracks')}</span>
                                </div>
                                <div className="overflow-y-auto p-2 space-y-1">
                                    {playlist.map((track, index) => (
                                        <div
                                            key={track.id}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${index === currentIndex
                                                ? 'bg-brand-primary-500/20 border border-brand-primary-500/30'
                                                : 'hover:bg-gray-700/50 border border-transparent'
                                                }`}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={getWorkCoverUrl(track.cover, 'music')}
                                                    alt={track.title}
                                                    className={`w-10 h-10 rounded object-cover ${index === currentIndex ? 'opacity-100' : 'opacity-70'}`}
                                                />
                                                {index === currentIndex && isPlaying && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-3 h-3 bg-brand-primary-500 rounded-full animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-wanted-sans truncate text-sm ${index === currentIndex ? 'text-brand-primary-300 font-bold' : 'text-gray-300'}`}>
                                                    {track.title}
                                                </p>
                                                <p className="text-gray-500 text-xs truncate">
                                                    {track.year}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default React.memo(MusicPlayer);
