import { useEffect, useRef, useState, useCallback, RefObject } from 'react';

interface IntersectionObserverOptions {
    rootMargin?: string;
    threshold?: number | number[];
    once?: boolean;
    root?: Element | null;
}

type UseIntersectionObserverReturn = [
    RefObject<HTMLElement | null>,
    boolean,
    IntersectionObserverEntry | null
];

/**
 * 재사용 가능한 Intersection Observer 훅
 */
export const useIntersectionObserver = ({
    rootMargin = '50px',
    threshold = 0.1,
    once = true,
    root = null
}: IntersectionObserverOptions = {}): UseIntersectionObserverReturn => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
    const ref = useRef<HTMLElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && once && observerRef.current) {
            observerRef.current.unobserve(entry.target);
        }
    }, [once]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        if (!window.IntersectionObserver) {
            setIsIntersecting(true);
            return;
        }

        observerRef.current = new IntersectionObserver(handleIntersection, {
            root,
            rootMargin,
            threshold
        });

        observerRef.current.observe(element);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleIntersection, root, rootMargin, threshold]);

    return [ref, isIntersecting, entry];
};

/**
 * 지연 로딩을 위한 특화된 훅
 */
export const useLazyLoading = (
    options: IntersectionObserverOptions = {}
): [RefObject<HTMLElement | null>, boolean] => {
    const [ref, isIntersecting] = useIntersectionObserver({
        rootMargin: '100px',
        threshold: 0,
        once: true,
        ...options
    });

    return [ref, isIntersecting];
};

/**
 * 애니메이션 트리거를 위한 훅
 */
export const useAnimationTrigger = (
    options: IntersectionObserverOptions = {}
): [RefObject<HTMLElement | null>, boolean] => {
    const [ref, isIntersecting] = useIntersectionObserver({
        rootMargin: '50px',
        threshold: 0.1,
        once: true,
        ...options
    });

    return [ref, isIntersecting];
};

/**
 * 무한 스크롤을 위한 훅
 */
export const useInfiniteScroll = (
    callback: () => void,
    options: IntersectionObserverOptions = {}
): RefObject<HTMLElement | null> => {
    const [ref, isIntersecting] = useIntersectionObserver({
        rootMargin: '100px',
        threshold: 0,
        once: false,
        ...options
    });

    useEffect(() => {
        if (isIntersecting && callback) {
            callback();
        }
    }, [isIntersecting, callback]);

    return ref;
};

/**
 * 요소의 가시성을 추적하는 훅
 */
export const useVisibilityTracker = (
    options: IntersectionObserverOptions = {}
): [RefObject<HTMLElement | null>, boolean, number] => {
    const [visibilityRatio, setVisibilityRatio] = useState(0);

    const [ref, isIntersecting, entry] = useIntersectionObserver({
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        once: false,
        ...options
    });

    useEffect(() => {
        if (entry) {
            setVisibilityRatio(entry.intersectionRatio);
        }
    }, [entry]);

    return [ref, isIntersecting, visibilityRatio];
};

export default useIntersectionObserver;
