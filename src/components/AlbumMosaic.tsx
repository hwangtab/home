// @ts-nocheck
import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MusicWork, MusicType } from '../types/data.types';

// We can define a generic CoverItem type that unifies Album and Single
interface CoverItem {
    id: string;
    cover?: string;
    title: string;
    year: number;
    type: 'album' | 'single';
}

interface Tile extends CoverItem {
    id: string; // Unique ID for tile
    originalId: string;
    gridColumn: number;
    gridRow: number;
    gridColumnSpan: number;
    gridRowSpan: number;
    opacity: number;
    rotation: number;
    delay: number;
    blur: number;
    scale: number;
    brightness: number;
}

interface AlbumMosaicProps {
    albums?: MusicWork[];
    singles?: MusicWork[];
    className?: string;
    opacity?: number;
    animationDelay?: number;
    enableHover?: boolean;
    enableClick?: boolean;
}

const AlbumMosaic: React.FC<AlbumMosaicProps> = ({
    albums = [],
    singles = [],
    className = '',
    opacity = 0.3,
    animationDelay = 0.1,
    enableHover = true,
    enableClick = true
}) => {
    const navigate = useNavigate();
    const [mosaicTiles, setMosaicTiles] = useState<Tile[]>([]);

    useEffect(() => {
        // Correctly mapping MusicWork to CoverItem
        const allCovers: CoverItem[] = [
            ...albums.filter(album => album.cover).map(album => ({
                id: album.id,
                cover: album.cover,
                title: album.title,
                year: album.year,
                type: 'album' as const
            })),
            ...singles.filter(single => single.cover).map(single => ({
                id: single.id,
                cover: single.cover,
                title: single.title,
                year: single.year,
                type: 'single' as const
            }))
        ];

        const shuffleArray = <T,>(array: T[]): T[] => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };

        const generateMosaicTiles = () => {
            const gridSize = window.innerWidth >= 768 ? 12 : 8;
            const totalTiles = window.innerWidth >= 768 ? 80 : 40;
            const tiles: Tile[] = [];

            const extendedCovers: CoverItem[] = [];
            const loops = Math.ceil(totalTiles / allCovers.length) + 1;
            for (let repeat = 0; repeat < loops; repeat++) {
                extendedCovers.push(...shuffleArray(allCovers));
            }

            const occupiedCells = new Set<string>();

            const sizeVariants = [
                { width: 1, height: 1, weight: 60 },
                { width: 2, height: 1, weight: 15 },
                { width: 1, height: 2, weight: 15 },
                { width: 2, height: 2, weight: 10 }
            ];

            for (let i = 0; i < totalTiles && i < extendedCovers.length; i++) {
                const cover = extendedCovers[i];

                const random = Math.random() * 100;
                let cumulativeWeight = 0;
                let selectedSize = sizeVariants[0];

                for (const variant of sizeVariants) {
                    cumulativeWeight += variant.weight;
                    if (random <= cumulativeWeight) {
                        selectedSize = variant;
                        break;
                    }
                }

                let attempts = 0;
                let validPosition = false;
                let gridColumn = 0, gridRow = 0;

                while (!validPosition && attempts < 50) {
                    gridColumn = Math.floor(Math.random() * (gridSize - selectedSize.width + 1)) + 1;
                    gridRow = Math.floor(Math.random() * (gridSize - selectedSize.height + 1)) + 1;

                    let isAreaFree = true;
                    for (let col = gridColumn; col < gridColumn + selectedSize.width; col++) {
                        for (let row = gridRow; row < gridRow + selectedSize.height; row++) {
                            if (occupiedCells.has(`${col}-${row}`)) {
                                isAreaFree = false;
                                break;
                            }
                        }
                        if (!isAreaFree) break;
                    }

                    if (isAreaFree) {
                        for (let col = gridColumn; col < gridColumn + selectedSize.width; col++) {
                            for (let row = gridRow; row < gridRow + selectedSize.height; row++) {
                                occupiedCells.add(`${col}-${row}`);
                            }
                        }
                        validPosition = true;
                    }
                    attempts++;
                }

                if (validPosition) {
                    tiles.push({
                        ...cover,
                        id: `${cover.id}-${i}-${Date.now()}`,
                        originalId: cover.id,
                        gridColumn,
                        gridRow,
                        gridColumnSpan: selectedSize.width,
                        gridRowSpan: selectedSize.height,
                        opacity: Math.random() * 0.5 + 0.5,
                        rotation: (Math.random() - 0.5) * 8,
                        delay: Math.random() * 2,
                        blur: Math.random() * 0.5,
                        scale: 0.95 + Math.random() * 0.1,
                        brightness: 0.8 + Math.random() * 0.4
                    });
                }
            }

            return tiles;
        };

        if (allCovers.length > 0) {
            setMosaicTiles(generateMosaicTiles());
        }
    }, [albums, singles]);

    const handleTileClick = (tile: Tile) => {
        if (!enableClick) return;

        if (tile.type === 'album') {
            navigate('/works/music');
        } else {
            navigate('/works/music');
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setMosaicTiles(prevTiles =>
                prevTiles.length > 0 ? prevTiles.map(tile => ({
                    ...tile,
                    opacity: Math.random() * 0.4 + 0.6,
                    rotation: (Math.random() - 0.5) * 8,
                    delay: Math.random() * 0.5,
                    blur: Math.random() * 0.3,
                    brightness: 0.8 + Math.random() * 0.4
                })) : prevTiles
            );
        }, 15000);
        return () => clearInterval(interval);
    }, []); // Remove dependency on mosaicTiles.length to avoid unnecessary re-set intervals if length changes often, though here it's static after init.

    return (
        <div className={`absolute inset-0 overflow-hidden ${className}`}>
            <div
                className="absolute inset-0 grid grid-cols-8 md:grid-cols-12 grid-rows-8 md:grid-rows-12 gap-1 p-2 md:p-4"
                style={{ transform: 'scale(1.1)', opacity: opacity }}
            >
                {mosaicTiles.map((tile) => (
                    <motion.div
                        key={tile.id}
                        className={`relative overflow-hidden rounded-sm ${enableClick ? 'cursor-pointer' : ''}`}
                        style={{
                            gridColumn: `${tile.gridColumn} / span ${tile.gridColumnSpan}`,
                            gridRow: `${tile.gridRow} / span ${tile.gridRowSpan}`,
                        }}
                        initial={{ opacity: 0, scale: 0.8, rotate: tile.rotation }}
                        animate={{ opacity: tile.opacity, scale: 1, rotate: tile.rotation }}
                        transition={{ duration: 0.8, delay: tile.delay, ease: "easeOut" }}
                        whileHover={enableHover ? {
                            scale: (tile.scale || 1) * 1.15,
                            opacity: 1,
                            rotate: tile.rotation + 3,
                            zIndex: 10,
                            filter: 'blur(0px) brightness(1.1) saturate(1.3)',
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                            transition: { duration: 0.2 }
                        } : {}}
                        onClick={() => handleTileClick(tile)}
                    >
                        <img
                            src={tile.cover}
                            alt={`${tile.title} (${tile.year})`}
                            className="w-full h-full object-cover transition-all duration-300"
                            style={{
                                filter: `blur(${tile.blur || 0}px) saturate(1.4) contrast(1.2) brightness(${tile.brightness || 1})`,
                                transform: `scale(${tile.scale || 1})`
                            }}
                            loading="lazy"
                            // @ts-ignore
                            decoding="async"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        {enableHover && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-end justify-center opacity-0"
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center text-white p-2 w-full">
                                    <div className="mb-1">
                                        <div className="w-6 h-6 mx-auto mb-1 bg-brand-primary-500/20 rounded-full flex items-center justify-center border border-brand-primary-400/40">
                                            <div className="w-0 h-0 border-l-[6px] border-r-0 border-t-[3px] border-b-[3px] border-l-white border-t-transparent border-b-transparent ml-0.5" />
                                        </div>
                                    </div>
                                    <p className="font-wanted-sans text-xs font-bold truncate">
                                        {tile.title}
                                    </p>
                                    <p className="font-wanted-sans text-xs opacity-75">
                                        {tile.year} · {tile.type === 'album' ? '앨범' : '싱글'}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
        </div>
    );
};

export default memo(AlbumMosaic);
