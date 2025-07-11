import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * 재사용 가능한 Intersection Observer 훅
 * @param {Object} options - IntersectionObserver 옵션
 * @param {string} options.rootMargin - 루트 마진 (기본값: '50px')
 * @param {number|number[]} options.threshold - 임계값 (기본값: 0.1)
 * @param {boolean} options.once - 한 번만 트리거할지 여부 (기본값: true)
 * @param {Element} options.root - 루트 엘리먼트 (기본값: null)
 * @returns {Array} [ref, isIntersecting, entry]
 */
export const useIntersectionObserver = ({
  rootMargin = '50px',
  threshold = 0.1,
  once = true,
  root = null
} = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const ref = useRef(null);
  const observerRef = useRef(null);

  const handleIntersection = useCallback((entries) => {
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

    // IntersectionObserver 지원 여부 확인
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
 * @param {Object} options - 옵션
 * @returns {Array} [ref, isVisible]
 */
export const useLazyLoading = (options = {}) => {
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
 * @param {Object} options - 옵션
 * @returns {Array} [ref, shouldAnimate]
 */
export const useAnimationTrigger = (options = {}) => {
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
 * @param {Function} callback - 교차점에 도달했을 때 실행할 콜백
 * @param {Object} options - 옵션
 * @returns {Object} ref
 */
export const useInfiniteScroll = (callback, options = {}) => {
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
 * @param {Object} options - 옵션
 * @returns {Array} [ref, isVisible, visibilityRatio]
 */
export const useVisibilityTracker = (options = {}) => {
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