'use client';

import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n';
import {
    supportsWebP,
    getResponsiveImageSources,
    createSrcSet,
    createWebPSrcSet,
    getSizesAttribute
} from '../utils/imageOptimization';
import { useLazyLoading } from '../hooks/useIntersectionObserver';

interface ResponsiveBreakpoints {
    mobile: string;
    tablet: string;
    desktop: string;
}

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'sizes'> {
    src?: string;
    alt?: string;
    className?: string;
    lazy?: boolean;
    responsive?: boolean;
    webp?: boolean;
    placeholder?: string | null;
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    imageSizes?: number[];
    breakpoints?: ResponsiveBreakpoints;
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
    src,
    alt = '',
    className = '',
    lazy = true,
    responsive = true,
    webp = true,
    placeholder = null,
    onLoad,
    onError,
    imageSizes = [400, 800, 1200],
    breakpoints,
    ...props
}) => {
    const { t } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>(placeholder ?? '');

    const [imgRef, isInView] = useLazyLoading({
        rootMargin: '100px'
    });

    const webpSupported = useMemo(() => supportsWebP(), []);
    const shouldUseWebP = useMemo(() => webp && webpSupported, [webp, webpSupported]);

    const sources = useMemo(() =>
        responsive ? getResponsiveImageSources(src, imageSizes) : [],
        [responsive, src, imageSizes]
    );
    const sizesAttr = useMemo(() =>
        breakpoints ? getSizesAttribute(breakpoints) : getSizesAttribute(),
        [breakpoints]
    );

    const shouldLoad = !lazy || isInView;

    useEffect(() => {
        if (src) {
            // Reset loading state and set src in a single effect to prevent
            // a flash of empty/past image when src changes while visible.
            if (shouldLoad) setIsLoaded(false);
            setImageSrc(src);
        }
    }, [shouldLoad, src]);

    const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setIsLoaded(true);
        onLoad?.(e);
    }, [onLoad]);

    const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        onError?.(e);
    }, [onError]);

    if (hasError) {
        return (
            <div
                className={`bg-gray-700 flex items-center justify-center ${className}`}
                {...props}
            >
                <span className="text-gray-400 text-sm">{t('common.imageLoadFailed')}</span>
            </div>
        );
    }

    if (!shouldLoad || (!isLoaded && !imageSrc)) {
        return (
            <div
                ref={imgRef as React.Ref<HTMLDivElement>}
                className={`bg-gray-700 animate-pulse ${className}`}
                {...props}
            >
                {placeholder && (
                    <img
                        src={placeholder}
                        alt={alt}
                        className="w-full h-full object-cover opacity-50 blur-sm"
                    />
                )}
            </div>
        );
    }

    if (responsive && sources.length > 0) {
        return (
            <picture ref={imgRef as React.Ref<HTMLPictureElement>} className={className}>
                {shouldUseWebP && (
                    <source
                        srcSet={createWebPSrcSet(sources)}
                        sizes={sizesAttr}
                        type="image/webp"
                    />
                )}
                <source
                    srcSet={createSrcSet(sources)}
                    sizes={sizesAttr}
                    type="image/jpeg"
                />
                <motion.img
                    src={imageSrc}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={handleLoad}
                    onError={handleError}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    {...(props as Record<string, unknown>)}
                />
            </picture>
        );
    }

    return (
        <motion.img
            ref={imgRef as React.Ref<HTMLImageElement>}
            src={imageSrc}
            alt={alt}
            className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                } ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            {...(props as Record<string, unknown>)}
        />
    );
});

OptimizedImage.displayName = 'OptimizedImage';

export const HeroImage: React.FC<Partial<OptimizedImageProps>> = (props) => (
    <OptimizedImage
        {...props}
        responsive
        webp
        lazy={false}
        imageSizes={[800, 1200, 1600, 2000]}
        breakpoints={{
            mobile: '100vw',
            tablet: '100vw',
            desktop: '100vw'
        }}
    />
);

export const ThumbnailImage: React.FC<Partial<OptimizedImageProps>> = (props) => (
    <OptimizedImage
        {...props}
        responsive
        webp
        lazy
        imageSizes={[200, 400, 600]}
        breakpoints={{
            mobile: '50vw',
            tablet: '33vw',
            desktop: '25vw'
        }}
    />
);

export const GalleryImage: React.FC<Partial<OptimizedImageProps>> = (props) => (
    <OptimizedImage
        {...props}
        responsive
        webp
        lazy
        imageSizes={[400, 800, 1200]}
        breakpoints={{
            mobile: '100vw',
            tablet: '50vw',
            desktop: '33vw'
        }}
    />
);

export default OptimizedImage;
