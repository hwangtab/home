import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  supportsWebP, 
  getResponsiveImageSources,
  createSrcSet,
  createWebPSrcSet,
  getSizesAttribute 
} from '../utils/imageOptimization';
import { useLazyLoading } from '../hooks/useIntersectionObserver';

const OptimizedImage = memo(({
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  
  // Intersection Observer 훅 사용
  const [imgRef, isInView] = useLazyLoading({ 
    rootMargin: '100px' 
  });

  // 메모이제이션된 계산값들
  const webpSupported = useMemo(() => supportsWebP(), []);
  const shouldUseWebP = useMemo(() => webp && webpSupported, [webp, webpSupported]);

  // Generate responsive sources
  const sources = useMemo(() => 
    responsive ? getResponsiveImageSources(src, sizes) : [], 
    [responsive, src, sizes]
  );
  const sizesAttr = useMemo(() => 
    breakpoints ? getSizesAttribute(breakpoints) : getSizesAttribute(), 
    [breakpoints]
  );

  // lazy가 false면 즉시 로드
  const shouldLoad = !lazy || isInView;

  useEffect(() => {
    if (shouldLoad && src) {
      setImageSrc(src);
    }
  }, [shouldLoad, src]);

  // 콜백 함수들 메모이제이션
  const handleLoad = useCallback((e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  }, [onLoad]);

  const handleError = useCallback((e) => {
    setHasError(true);
    if (onError) onError(e);
  }, [onError]);

  // Fallback for when image fails to load
  if (hasError) {
    return (
      <div 
        className={`bg-gray-700 flex items-center justify-center ${className}`}
        {...props}
      >
        <span className="text-gray-400 text-sm">이미지 로드 실패</span>
      </div>
    );
  }

  // Placeholder while loading or not in view
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

  // Render responsive image with WebP support
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
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
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

  // Render simple optimized image
  return (
    <motion.img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
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

// Pre-configured variants for common use cases
export const HeroImage = (props) => (
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

export const ThumbnailImage = (props) => (
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

export const GalleryImage = (props) => (
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