// @ts-nocheck
import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n';
// @ts-ignore - utils might be JS
import {
    supportsWebP,
    getResponsiveImageSources,
    createSrcSet,
    createWebPSrcSet,
    getSizesAttribute
} from '../utils/imageOptimization';
// @ts-ignore - hooks might be JS or untyped
import { useLazyLoading } from '../hooks/useIntersectionObserver';

interface ResponsiveBreakpoints {
    mobile: string;
    tablet: string;
    desktop: string;
}

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement | HTMLDivElement> {
    src?: string;
    alt?: string;
    className?: string;
    lazy?: boolean;
    responsive?: boolean;
    webp?: boolean;
    placeholder?: string;
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    sizes?: number[];
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
    onLoad = null,
    onError = null,
    sizes = [400, 800, 1200],
    breakpoints = null,
    ...props
}) => {
    const { t } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    // @ts-ignore
    const [imageSrc, setImageSrc] = useState<string>(placeholder || '');

    const [imgRef, isInView] = useLazyLoading({
        rootMargin: '100px'
    });

    const webpSupported = useMemo(() => supportsWebP(), []);
    const shouldUseWebP = useMemo(() => webp && webpSupported, [webp, webpSupported]);

    const sources = useMemo(() =>
        responsive ? getResponsiveImageSources(src, sizes) : [],
        [responsive, src, sizes]
    );
    const sizesAttr = useMemo(() =>
        breakpoints ? getSizesAttribute(breakpoints) : getSizesAttribute(),
        [breakpoints]
    );

    const shouldLoad = !lazy || isInView;

    useEffect(() => {
        if (shouldLoad && src) {
            setImageSrc(src);
        }
    }, [shouldLoad, src]);

    const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setIsLoaded(true);
        if (onLoad) onLoad(e);
    }, [onLoad]);

    const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        if (onError) onError(e);
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
                ref={imgRef}
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
            <picture ref={imgRef} className={className}>
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
                    {...props}
                />
            </picture>
        );
    }

    return (
        <motion.img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                } ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            {...props}
        />
    );
});

OptimizedImage.displayName = 'OptimizedImage';

export const HeroImage: React.FC<Partial<OptimizedImageProps>> = (props) => (
    <OptimizedImage
        {...props}
        responsive={true}
        webp={true}
        lazy={false}
        sizes={[800, 1200, 1600, 2000]}
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
        responsive={true}
        webp={true}
        lazy={true}
        sizes={[200, 400, 600]}
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
        responsive={true}
        webp={true}
        lazy={true}
        sizes={[400, 800, 1200]}
        breakpoints={{
            mobile: '100vw',
            tablet: '50vw',
            desktop: '33vw'
        }}
    />
);

export default OptimizedImage;
