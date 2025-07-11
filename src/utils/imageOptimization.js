/**
 * Image optimization utilities for better performance
 */

// Generate WebP source URLs for images
export const getWebPUrl = (originalUrl) => {
  if (!originalUrl) return '';
  
  // For external URLs, we can't convert to WebP directly
  // This would typically be handled by a CDN or image service
  return originalUrl;
};

// Generate responsive image sources
export const getResponsiveImageSources = (baseUrl, sizes = [400, 800, 1200, 1600]) => {
  if (!baseUrl) return [];
  
  return sizes.map(size => ({
    size,
    url: `${baseUrl}?w=${size}&q=80`,
    webp: `${baseUrl}?w=${size}&q=80&f=webp`
  }));
};

// Create srcSet string for responsive images
export const createSrcSet = (sources) => {
  return sources.map(source => `${source.url} ${source.size}w`).join(', ');
};

// Create WebP srcSet string
export const createWebPSrcSet = (sources) => {
  return sources.map(source => `${source.webp} ${source.size}w`).join(', ');
};

// Generate sizes attribute for responsive images
export const getSizesAttribute = (breakpoints = {
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw'
}) => {
  return `(max-width: 768px) ${breakpoints.mobile}, (max-width: 1024px) ${breakpoints.tablet}, ${breakpoints.desktop}`;
};

// Lazy loading intersection observer
export const createLazyLoadObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  if (!window.IntersectionObserver) {
    // Fallback for browsers without IntersectionObserver
    return {
      observe: (element) => {
        if (element && callback) {
          callback([{ target: element, isIntersecting: true }]);
        }
      },
      unobserve: () => {},
      disconnect: () => {}
    };
  }

  return new IntersectionObserver(callback, defaultOptions);
};

// Preload critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (urls) => {
  try {
    const promises = urls.map(url => preloadImage(url));
    return await Promise.all(promises);
  } catch (error) {
    console.warn('Some images failed to preload:', error);
    return [];
  }
};

// Convert image to WebP using Canvas (for local images)
export const convertToWebP = (imageElement, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    
    ctx.drawImage(imageElement, 0, 0);
    
    canvas.toBlob(resolve, 'image/webp', quality);
  });
};

// Check WebP support
export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
};

// Image compression utility
export const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Progressive image loading with blur effect
export const createProgressiveImageLoader = (lowQualityUrl, highQualityUrl) => {
  return {
    lowQuality: lowQualityUrl,
    highQuality: highQualityUrl,
    loadHighQuality: () => preloadImage(highQualityUrl)
  };
};

export default {
  getWebPUrl,
  getResponsiveImageSources,
  createSrcSet,
  createWebPSrcSet,
  getSizesAttribute,
  createLazyLoadObserver,
  preloadImage,
  preloadImages,
  convertToWebP,
  supportsWebP,
  compressImage,
  createProgressiveImageLoader
};