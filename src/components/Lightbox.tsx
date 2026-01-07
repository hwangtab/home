import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface LightboxImage {
    src: string;
    title?: string;
    alt?: string;
    description?: string;
}

interface LightboxProps {
    images: (string | LightboxImage)[];
    currentIndex?: number;
    isOpen: boolean;
    onClose: () => void;
    onImageChange: (index: number) => void;
}

const normalizeImage = (img: string | LightboxImage): LightboxImage => {
    if (typeof img === 'string') {
        return { src: img };
    }
    return img;
};

const Lightbox: React.FC<LightboxProps> = ({ images = [], currentIndex = 0, isOpen = false, onClose, onImageChange }) => {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const normalizedImages = images.map(normalizeImage);
    const currentImage = normalizedImages[currentIndex];

    const goToNext = useCallback(() => {
        if (currentIndex < images.length - 1) onImageChange(currentIndex + 1);
    }, [currentIndex, images.length, onImageChange]);

    const goToPrevious = useCallback(() => {
        if (currentIndex > 0) onImageChange(currentIndex - 1);
    }, [currentIndex, onImageChange]);

    const zoomIn = useCallback(() => setZoom(prev => Math.min(prev + 0.25, 3)), []);

    const zoomOut = useCallback(() => {
        setZoom(prev => {
            const newZoom = Math.max(prev - 0.25, 0.5);
            if (newZoom <= 1) setPosition({ x: 0, y: 0 });
            return newZoom;
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape': onClose(); break;
                case 'ArrowLeft': goToPrevious(); break;
                case 'ArrowRight': goToNext(); break;
                case '+':
                case '=': zoomIn(); break;
                case '-': zoomOut(); break;
                default: break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, goToNext, goToPrevious, zoomIn, zoomOut, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, [currentIndex]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else zoomOut();
    };

    const downloadImage = () => {
        if (currentImage) {
            const link = document.createElement('a');
            link.href = currentImage.src;
            link.download = currentImage.title || `image-${currentIndex + 1}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!currentImage) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {/* Header Controls */}
                    <div className="absolute top-0 left-0 right-0 z-60 p-4 bg-gradient-to-b from-black to-transparent">
                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center space-x-4">
                                <span className="font-wanted-sans">{currentIndex + 1} / {images.length}</span>
                                {currentImage.title && <h3 className="font-santokki text-lg">{currentImage.title}</h3>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <button onClick={(e) => { e.stopPropagation(); zoomOut(); }} className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all" disabled={zoom <= 0.5}>
                                    <ZoomOut size={20} />
                                </button>
                                <span className="px-2 py-1 bg-black bg-opacity-50 rounded text-sm">{Math.round(zoom * 100)}%</span>
                                <button onClick={(e) => { e.stopPropagation(); zoomIn(); }} className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all" disabled={zoom >= 3}>
                                    <ZoomIn size={20} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); downloadImage(); }} className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all">
                                    <Download size={20} />
                                </button>
                                <button onClick={onClose} className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {currentIndex > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); goToPrevious(); }} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all">
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    {currentIndex < images.length - 1 && (
                        <button onClick={(e) => { e.stopPropagation(); goToNext(); }} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all">
                            <ChevronRight size={24} />
                        </button>
                    )}

                    {/* Main Image */}
                    <motion.div
                        className="relative max-w-full max-h-full overflow-hidden"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img
                            src={currentImage.src}
                            alt={currentImage.title || currentImage.alt}
                            className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                            style={{
                                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                                transformOrigin: 'center',
                                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onWheel={handleWheel}
                            draggable={false}
                        />
                    </motion.div>

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                        <div className="absolute bottom-0 left-0 right-0 z-60 p-4 bg-gradient-to-t from-black to-transparent">
                            <div className="flex justify-center space-x-2 overflow-x-auto max-w-full">
                                {normalizedImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => { e.stopPropagation(); onImageChange(index); }}
                                        className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${index === currentIndex ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={image.src} alt={image.title || image.alt} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Image Description */}
                    {currentImage.description && (
                        <div className="absolute bottom-20 left-4 right-4 z-60">
                            <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-md mx-auto">
                                <p className="font-wanted-sans text-sm leading-relaxed">{currentImage.description}</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default React.memo(Lightbox);
