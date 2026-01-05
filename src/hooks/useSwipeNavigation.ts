import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseSwipeNavigationReturn {
    isSwipeEnabled: boolean;
    setIsSwipeEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    hasPrevious: boolean;
    hasNext: boolean;
    previousPage: string | null;
    nextPage: string | null;
    currentIndex: number;
    totalPages: number;
}

/**
 * 모바일 스와이프 네비게이션 훅
 */
const useSwipeNavigation = (
    threshold = 100,
    velocity = 0.5
): UseSwipeNavigationReturn => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);

    const pages = useMemo(() => [
        '/',
        '/about',
        '/works',
        '/news',
        '/contact'
    ], []);

    useEffect(() => {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        let isScrolling = false;

        const handleTouchStart = (e: TouchEvent) => {
            if (!isSwipeEnabled) return;

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
            isScrolling = false;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isSwipeEnabled) return;

            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - startX);
            const deltaY = Math.abs(touch.clientY - startY);

            if (deltaY > deltaX) {
                isScrolling = true;
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!isSwipeEnabled || isScrolling) return;

            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endTime = Date.now();

            const deltaX = endX - startX;
            const deltaTime = endTime - startTime;
            const velocityX = Math.abs(deltaX) / deltaTime;

            if (Math.abs(deltaX) > threshold && velocityX > velocity) {
                const currentIndex = pages.indexOf(location.pathname);

                if (currentIndex !== -1) {
                    if (deltaX > 0 && currentIndex > 0) {
                        navigate(pages[currentIndex - 1]);
                    } else if (deltaX < 0 && currentIndex < pages.length - 1) {
                        navigate(pages[currentIndex + 1]);
                    }
                }
            }
        };

        document.body.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.body.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.body.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.body.removeEventListener('touchstart', handleTouchStart);
            document.body.removeEventListener('touchmove', handleTouchMove);
            document.body.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isSwipeEnabled, navigate, location.pathname, threshold, velocity, pages]);

    const currentIndex = pages.indexOf(location.pathname);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < pages.length - 1;
    const previousPage = hasPrevious ? pages[currentIndex - 1] : null;
    const nextPage = hasNext ? pages[currentIndex + 1] : null;

    return {
        isSwipeEnabled,
        setIsSwipeEnabled,
        hasPrevious,
        hasNext,
        previousPage,
        nextPage,
        currentIndex,
        totalPages: pages.length
    };
};

export default useSwipeNavigation;
