import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * 모바일 스와이프 네비게이션 훅
 * 좌우 스와이프로 페이지 간 이동을 지원
 */
const useSwipeNavigation = (threshold = 100, velocity = 0.5) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);

  // 페이지 순서 정의 (스와이프 네비게이션용)
  const pages = [
    '/',
    '/about',
    '/works',
    '/news',
    '/contact'
  ];

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isScrolling = false;

    const handleTouchStart = (e) => {
      if (!isSwipeEnabled) return;

      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      isScrolling = false;
    };

    const handleTouchMove = (e) => {
      if (!isSwipeEnabled) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startX);
      const deltaY = Math.abs(touch.clientY - startY);

      // 세로 스크롤이 더 크면 스와이프 무시
      if (deltaY > deltaX) {
        isScrolling = true;
      }
    };

    const handleTouchEnd = (e) => {
      if (!isSwipeEnabled || isScrolling) return;

      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endTime = Date.now();

      const deltaX = endX - startX;
      const deltaTime = endTime - startTime;
      const velocityX = Math.abs(deltaX) / deltaTime;

      // 스와이프 조건 확인
      if (Math.abs(deltaX) > threshold && velocityX > velocity) {
        const currentIndex = pages.indexOf(location.pathname);

        if (currentIndex !== -1) {
          if (deltaX > 0 && currentIndex > 0) {
            // 오른쪽 스와이프 - 이전 페이지
            navigate(pages[currentIndex - 1]);
          } else if (deltaX < 0 && currentIndex < pages.length - 1) {
            // 왼쪽 스와이프 - 다음 페이지
            navigate(pages[currentIndex + 1]);
          }
        }
      }
    };

    // 터치 이벤트는 body에만 추가
    document.body.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.body.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.body.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.body.removeEventListener('touchstart', handleTouchStart);
      document.body.removeEventListener('touchmove', handleTouchMove);
      document.body.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSwipeEnabled, navigate, location.pathname, threshold, velocity, pages]);

  // 현재 페이지의 이전/다음 페이지 정보
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