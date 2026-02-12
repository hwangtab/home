import { useEffect, useState, useCallback, useRef, RefObject } from 'react';
import { useAnimation } from 'framer-motion';
import { useAnimation as useAnimationContext } from '../context/AnimationContext';

interface ScrollAnimationOptions {
    threshold?: number;
    triggerOnce?: boolean;
    offset?: number;
    enableParallax?: boolean;
    parallaxSpeed?: number;
}

interface ScrollAnimationReturn {
    elementRef: RefObject<HTMLElement | null>;
    isVisible: boolean;
    controls: ReturnType<typeof useAnimation>;
    variants: Record<string, any>;
    containerVariants: Record<string, unknown>;
    itemVariants: Record<string, any>;
    parallaxY: number;
    scrollY: number;
}

/**
 * 스크롤 기반 애니메이션 훅
 */
const useScrollAnimation = (options: ScrollAnimationOptions = {}): ScrollAnimationReturn => {
    const {
        threshold = 0.1,
        triggerOnce = true,
        offset = 0,
        enableParallax = false,
        parallaxSpeed = 0.5
    } = options;

    const [isVisible, setIsVisible] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [elementTop, setElementTop] = useState(0);
    const elementRef = useRef<HTMLElement>(null);
    const controls = useAnimation();
    const observerRef = useRef<IntersectionObserver | null>(null);
    const animationFrameId = useRef<number | null>(null);
    const { isAnimationAllowed, registerAnimation, unregisterAnimation } = useAnimationContext();
    const animationIdRef = useRef<string>(`scroll-animation-${Date.now()}`);

    const updateScrollY = useCallback(() => {
        if (!isAnimationAllowed()) return;
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(() => {
            setScrollY(window.scrollY);
            animationFrameId.current = null;
        });
    }, [isAnimationAllowed]);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const currentAnimationId = animationIdRef.current;
        registerAnimation(currentAnimationId);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!isAnimationAllowed()) return;
                const isIntersecting = entry.isIntersecting;
                if (isIntersecting && (!isVisible || !triggerOnce)) {
                    setIsVisible(true);
                    controls.start('visible');
                } else if (!triggerOnce && !isIntersecting) {
                    setIsVisible(false);
                    controls.start('hidden');
                }
            },
            { threshold, rootMargin: `${offset}px` }
        );

        observer.observe(element);
        observerRef.current = observer;

        const rect = element.getBoundingClientRect();
        setElementTop(rect.top + window.scrollY);

        return () => {
            if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; }
            if (animationFrameId.current) { cancelAnimationFrame(animationFrameId.current); animationFrameId.current = null; }
            unregisterAnimation(currentAnimationId);
        };
    }, [threshold, offset, triggerOnce, isVisible, controls, isAnimationAllowed, registerAnimation, unregisterAnimation]);

    useEffect(() => {
        if (!enableParallax) return;
        window.addEventListener('scroll', updateScrollY, { passive: true });
        const handleCleanup = () => {
            window.removeEventListener('scroll', updateScrollY);
            if (animationFrameId.current) { cancelAnimationFrame(animationFrameId.current); animationFrameId.current = null; }
        };
        document.addEventListener('cleanupAnimations', handleCleanup);
        return () => { handleCleanup(); document.removeEventListener('cleanupAnimations', handleCleanup); };
    }, [enableParallax, updateScrollY]);

    const parallaxY = enableParallax ? (scrollY - elementTop) * parallaxSpeed : 0;

    const variants = {
        hidden: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.3 } },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] } }
    };

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, transition: { duration: 0.3 } },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.25, 0, 1] } }
    };

    return { elementRef, isVisible, controls, variants, containerVariants, itemVariants, parallaxY, scrollY };
};

/**
 * 스크롤 진행률 훅
 */
export const useScrollProgress = (): number => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const animationFrameId = useRef<number | null>(null);
    const { isAnimationAllowed, registerAnimation, unregisterAnimation } = useAnimationContext();
    const animationIdRef = useRef<string>(`scroll-progress-${Date.now()}`);

    useEffect(() => {
        const currentAnimationId = animationIdRef.current;
        registerAnimation(currentAnimationId);
        const updateScrollProgress = () => {
            if (!isAnimationAllowed()) return;
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = requestAnimationFrame(() => {
                const scrollPx = document.documentElement.scrollTop;
                const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = scrollPx / winHeightPx;
                setScrollProgress(Math.min(Math.max(scrolled, 0), 1));
                animationFrameId.current = null;
            });
        };
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();
        const handleCleanup = () => {
            window.removeEventListener('scroll', updateScrollProgress);
            if (animationFrameId.current) { cancelAnimationFrame(animationFrameId.current); animationFrameId.current = null; }
        };
        document.addEventListener('cleanupAnimations', handleCleanup);
        return () => { handleCleanup(); document.removeEventListener('cleanupAnimations', handleCleanup); unregisterAnimation(currentAnimationId); };
    }, [isAnimationAllowed, registerAnimation, unregisterAnimation]);

    return scrollProgress;
};

/**
 * 스크롤 방향 감지 훅
 */
export const useScrollDirection = (threshold = 10): 'up' | 'down' => {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
    const [lastScrollY, setLastScrollY] = useState(0);
    const animationFrameId = useRef<number | null>(null);
    const { isAnimationAllowed, registerAnimation, unregisterAnimation } = useAnimationContext();
    const animationIdRef = useRef<string>(`scroll-direction-${Date.now()}`);

    useEffect(() => {
        const currentAnimationId = animationIdRef.current;
        registerAnimation(currentAnimationId);
        const updateScrollDirection = () => {
            if (!isAnimationAllowed()) return;
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const direction = currentScrollY > lastScrollY ? 'down' : 'up';
                if (Math.abs(currentScrollY - lastScrollY) > threshold) {
                    setScrollDirection(direction);
                    setLastScrollY(currentScrollY);
                }
                animationFrameId.current = null;
            });
        };
        window.addEventListener('scroll', updateScrollDirection, { passive: true });
        const handleCleanup = () => {
            window.removeEventListener('scroll', updateScrollDirection);
            if (animationFrameId.current) { cancelAnimationFrame(animationFrameId.current); animationFrameId.current = null; }
        };
        document.addEventListener('cleanupAnimations', handleCleanup);
        return () => { handleCleanup(); document.removeEventListener('cleanupAnimations', handleCleanup); unregisterAnimation(currentAnimationId); };
    }, [lastScrollY, threshold, isAnimationAllowed, registerAnimation, unregisterAnimation]);

    return scrollDirection;
};

export default useScrollAnimation;
