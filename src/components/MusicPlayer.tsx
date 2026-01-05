// @ts-nocheck
import React, { useState } from 'react';
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
import { MusicWork } from '../types/data.types';

// Extend MusicWork or define Track interface if MusicWork isn't exact
export interface Track extends Partial<MusicWork> {
    id: string;
    title: string;
    year: number;
    cover: string;
    audioUrl?: string; // specific to player
    links?: Record<string, string>; // specific to player
    // MusicWork has archiveCategory='music', etc.
}

interface MusicPlayerProps {
    playlist: Track[];
    isVisible: boolean;
    onClose: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ playlist = [], isVisible = false, onClose }) => {
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

    const playNext = () => {
        if (shuffle) {
            const nextIndex = Math.floor(Math.random() * playlist.length);
            setCurrentIndex(nextIndex);
        } else {
            setCurrentIndex((prev) => (prev + 1) % playlist.length);
        }
    };

    const playPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    };

    const handleEnded = () => {
        if (repeat) {
            setProgress(0);
        } else {
            playNext();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentTrack || playlist.length === 0) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="container mx-auto">
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-700 rounded-full h-1 mb-4">
                            <div
                                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${(progress / duration) * 100}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            {/* Track Info */}
                            <div className="flex items-center space-x-4 flex-1">
                                <img
                                    src={currentTrack.cover}
                                    alt={currentTrack.title}
                                    className="w-12 h-12 rounded object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-white font-santokki truncate">
                                        {currentTrack.title}
                                    </h4>
                                    <p className="text-gray-400 text-sm font-wanted-sans truncate">
                                        {currentTrack.year}
                                    </p>
                                </div>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    <Heart size={20} />
                                </button>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center space-x-4 mx-8">
                                <button
                                    onClick={() => setShuffle(!shuffle)}
                                    className={`transition-colors ${shuffle ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <Shuffle size={20} />
                                </button>

                                <button
                                    onClick={playPrevious}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <SkipBack size={24} />
                                </button>

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
                                >
                                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                </button>

                                <button
                                    onClick={playNext}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <SkipForward size={24} />
                                </button>

                                <button
                                    onClick={() => setRepeat(!repeat)}
                                    className={`transition-colors ${repeat ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <Repeat size={20} />
                                </button>
                            </div>

                            {/* Volume & Additional Controls */}
                            <div className="flex items-center space-x-4 flex-1 justify-end">
                                <span className="text-gray-400 text-sm font-wanted-sans">
                                    {formatTime(progress)} / {formatTime(duration)}
                                </span>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={isMuted ? 0 : volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                <button
                                    onClick={() => setShowPlaylist(!showPlaylist)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <List size={20} />
                                </button>

                                {/* External Links */}
                                {currentTrack.links && Object.keys(currentTrack.links).length > 0 && (
                                    <div className="flex space-x-1">
                                        {Object.entries(currentTrack.links).slice(0, 2).map(([platform, url]) => (
                                            <a
                                                key={platform}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-white transition-colors"
                                                title={`${platform}에서 듣기`}
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition-colors ml-4"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Hidden ReactPlayer for audio */}
                        {currentTrack.audioUrl && (
                            <ReactPlayer
                                url={currentTrack.audioUrl}
                                playing={isPlaying}
                                volume={isMuted ? 0 : volume}
                                onProgress={({ played, playedSeconds }: { played: number, playedSeconds: number }) => setProgress(playedSeconds)}
                                onDuration={setDuration}
                                onEnded={handleEnded}
                                width="0"
                                height="0"
                                style={{ display: 'none' }}
                            />
                        )}
                    </div>

                    {/* Playlist Modal */}
                    <AnimatePresence>
                        {showPlaylist && (
                            <motion.div
                                className="absolute bottom-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-t-lg max-h-64 overflow-y-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                <div className="p-4">
                                    <h3 className="text-white font-santokki mb-4">플레이리스트</h3>
                                    <div className="space-y-2">
                                        {playlist.map((track, index) => (
                                            <div
                                                key={track.id}
                                                onClick={() => setCurrentIndex(index)}
                                                className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${index === currentIndex ? 'bg-gray-700' : 'hover:bg-gray-700'
                                                    }`}
                                            >
                                                <img
                                                    src={track.cover}
                                                    alt={track.title}
                                                    className="w-10 h-10 rounded object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-wanted-sans truncate">
                                                        {track.title}
                                                    </p>
                                                    <p className="text-gray-400 text-sm truncate">
                                                        {track.year}
                                                    </p>
                                                </div>
                                                {index === currentIndex && (
                                                    <div className="text-blue-400">
                                                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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
