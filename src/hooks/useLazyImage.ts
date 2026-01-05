import { useState, useEffect, useRef, RefObject } from 'react';

interface IntersectionObserverOptions {
    threshold?: number;
    rootMargin?: string;
}

interface UseLazyImageReturn {
    imgRef: RefObject<HTMLImageElement | null>;
    isLoaded: boolean;
    isInView: boolean;
    error: boolean;
    shouldLoad: boolean;
}

/**
 * 이미지 레이지 로딩을 위한 커스텀 훅
 */
const useLazyImage = (
    src: string | null | undefined,
    options: IntersectionObserverOptions = {}
): UseLazyImageReturn => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const currentRef = imgRef.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(currentRef);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '20px',
                ...options
            }
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [options]);

    useEffect(() => {
        if (!isInView || !src) return;

        const img = new Image();

        const loadingTimer = setTimeout(() => {
            if (!isLoaded && !error) {
                setIsLoaded(true);
            }
        }, 100);

        img.onload = () => {
            clearTimeout(loadingTimer);
            setIsLoaded(true);
            setError(false);
        };

        img.onerror = () => {
            clearTimeout(loadingTimer);
            setError(true);
            setIsLoaded(false);
        };

        img.src = src;

        return () => {
            clearTimeout(loadingTimer);
            img.onload = null;
            img.onerror = null;
        };
    }, [isInView, src, isLoaded, error]);

    return {
        imgRef,
        isLoaded,
        isInView,
        error,
        shouldLoad: isInView
    };
};

export default useLazyImage;
