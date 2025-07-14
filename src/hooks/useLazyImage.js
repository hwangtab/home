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
        rootMargin: '50px', // 50px 미리 로드
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

    // 이미지 프리로드
    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setError(false);
    };
    
    img.onerror = () => {
      setError(true);
      setIsLoaded(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isInView, src]);

  return {
    imgRef,
    isLoaded,
    isInView,
    error,
    shouldLoad: isInView
  };
};

export default useLazyImage;