import { useState, useEffect, useRef } from 'react';

/**
 * 이미지 레이지 로딩을 위한 커스텀 훅
 * @param {string} src - 이미지 소스 URL
 * @param {Object} options - Intersection Observer 옵션
 * @returns {Object} { imgRef, isLoaded, isInView, error }
 */
const useLazyImage = (src, options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const currentRef = imgRef.current;
    if (!currentRef) return;

    // Intersection Observer 설정
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // 한번 보이면 더 이상 관찰하지 않음
          observer.unobserve(currentRef);
        }
      },
      {
        threshold: 0.1, // 10%만 보여도 로드 시작
        rootMargin: '20px', // 20px 미리 로드 (성능 최적화)
        ...options
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView || !src) return;

    // 이미지 프리로드 (성능 최적화)
    const img = new Image();
    
    // 즉시 로딩 상태 표시로 체감 성능 향상
    const loadingTimer = setTimeout(() => {
      if (!isLoaded && !error) {
        setIsLoaded(true); // 일단 로딩 상태 해제
      }
    }, 100); // 100ms 후 강제 로딩 완료
    
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