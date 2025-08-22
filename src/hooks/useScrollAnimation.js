import { useEffect, useState, useCallback, useRef } from 'react';
import { useAnimation } from 'framer-motion';
import { useAnimation as useAnimationContext } from '../context/AnimationContext';

/**
 * 스크롤 기반 애니메이션 훅
 * 스크롤 위치에 따른 패럴랙스 및 reveal 애니메이션 제공
 */
const useScrollAnimation = (options = {}) => {
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
  const elementRef = useRef(null);
  const controls = useAnimation();
  const observerRef = useRef(null);
  const animationFrameId = useRef(null);
  const { isAnimationAllowed, registerAnimation, unregisterAnimation } = useAnimationContext();
  const animationId = useRef(`scroll-animation-${Date.now()}`);

  // 스크롤 위치 업데이트 - 성능 최적화
  const updateScrollY = useCallback(() => {
    // 페이지 전환 중에는 스크롤 애니메이션 비활성화
    if (!isAnimationAllowed()) {
      return;
    }
    
    // 이전 애니메이션 프레임 취소
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    animationFrameId.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
      animationFrameId.current = null;
    });
  }, [isAnimationAllowed]);

  // Intersection Observer로 요소 가시성 감지 - 메모리 누수 방지
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 애니메이션 등록
    registerAnimation(animationId.current);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 페이지 전환 중에는 애니메이션 비활성화
        if (!isAnimationAllowed()) {
          return;
        }
        
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting && (!isVisible || !triggerOnce)) {
          setIsVisible(true);
          controls.start('visible');
        } else if (!triggerOnce && !isIntersecting) {
          setIsVisible(false);
          controls.start('hidden');
        }
      },
      {
        threshold,
        rootMargin: `${offset}px`
      }
    );

    observer.observe(element);
    observerRef.current = observer;

    // 초기 요소 위치 저장
    const rect = element.getBoundingClientRect();
    setElementTop(rect.top + window.scrollY);

    // 정리 함수
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      unregisterAnimation(animationId.current);
    };
  }, [threshold, offset, triggerOnce, isVisible, controls, isAnimationAllowed, registerAnimation, unregisterAnimation]);

  // 패럴랙스 효과를 위한 스크롤 이벤트 - 메모리 누수 방지
  useEffect(() => {
    if (!enableParallax) return;

    window.addEventListener('scroll', updateScrollY, { passive: true });
    
    // 정리 이벤트 리스너
    const handleCleanup = () => {
      window.removeEventListener('scroll', updateScrollY);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
    
    document.addEventListener('cleanupAnimations', handleCleanup);
    
    return () => {
      handleCleanup();
      document.removeEventListener('cleanupAnimations', handleCleanup);
    };
  }, [enableParallax, updateScrollY]);

  // 패럴랙스 변환값 계산
  const parallaxY = enableParallax 
    ? (scrollY - elementTop) * parallaxSpeed 
    : 0;

  // 기본 애니메이션 variants
  const variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  };

  // 스태거 애니메이션을 위한 컨테이너 variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  // 스태거 아이템 variants
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  };

  return {
    elementRef,
    isVisible,
    controls,
    variants,
    containerVariants,
    itemVariants,
    parallaxY,
    scrollY
  };
};

/**
 * 스크롤 진행률 훅 - 메모리 누수 방지
 * 페이지 스크롤 진행률을 0-1 사이 값으로 제공
 */
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const animationFrameId = useRef(null);
  const { isAnimationAllowed, registerAnimation, unregisterAnimation } = useAnimationContext();
  const animationId = useRef(`scroll-progress-${Date.now()}`);

  useEffect(() => {
    // 애니메이션 등록
    registerAnimation(animationId.current);
    
    const updateScrollProgress = () => {
      // 페이지 전환 중에는 스크롤 애니메이션 비활성화
      if (!isAnimationAllowed()) {
        return;
      }
      
      // 이전 애니메이션 프레임 취소
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      animationFrameId.current = requestAnimationFrame(() => {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = scrollPx / winHeightPx;
        
        setScrollProgress(Math.min(Math.max(scrolled, 0), 1));
        animationFrameId.current = null;
      });
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress(); // 초기값 설정
    
    // 정리 이벤트 리스너
    const handleCleanup = () => {
      window.removeEventListener('scroll', updateScrollProgress);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
    
    document.addEventListener('cleanupAnimations', handleCleanup);

    return () => {
      handleCleanup();
      document.removeEventListener('cleanupAnimations', handleCleanup);
      unregisterAnimation(animationId.current);
    };
  }, [isAnimationAllowed, registerAnimation, unregisterAnimation]);

  return scrollProgress;
};

/**
 * 스크롤 방향 감지 훅 - 메모리 누수 방지
 */
export const useScrollDirection = (threshold = 10) => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const animationFrameId = useRef(null);
  const { isAnimationAllowed, registerAnimation, unregisterAnimation } = useAnimationContext();
  const animationId = useRef(`scroll-direction-${Date.now()}`);

  useEffect(() => {
    // 애니메이션 등록
    registerAnimation(animationId.current);
    
    const updateScrollDirection = () => {
      // 페이지 전환 중에는 스크롤 애니메이션 비활성화
      if (!isAnimationAllowed()) {
        return;
      }
      
      // 이전 애니메이션 프레임 취소
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      animationFrameId.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const direction = scrollY > lastScrollY ? 'down' : 'up';
        
        if (Math.abs(scrollY - lastScrollY) > threshold) {
          setScrollDirection(direction);
          setLastScrollY(scrollY);
        }
        animationFrameId.current = null;
      });
    };

    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    
    // 정리 이벤트 리스너
    const handleCleanup = () => {
      window.removeEventListener('scroll', updateScrollDirection);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
    
    document.addEventListener('cleanupAnimations', handleCleanup);
    
    return () => {
      handleCleanup();
      document.removeEventListener('cleanupAnimations', handleCleanup);
      unregisterAnimation(animationId.current);
    };
  }, [lastScrollY, threshold, isAnimationAllowed, registerAnimation, unregisterAnimation]);

  return scrollDirection;
};

export default useScrollAnimation;