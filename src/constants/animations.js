// 최적화된 애니메이션 타이밍 상수
export const TIMING = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.4,
  PAGE_TRANSITION: 0.4
};

// 표준화된 이징 커브
export const EASING = {
  EASE_OUT: [0.25, 0.1, 0.25, 1],
  EASE_IN_OUT: [0.25, 0.1, 0.25, 1],
  SPRING: { type: "spring", stiffness: 300, damping: 30 },
  SMOOTH: [0.165, 0.84, 0.44, 1]
};

// 공통 애니메이션 설정 - 성능 최적화
export const COMMON_ANIMATIONS = {
  // 페이드 인/아웃
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: TIMING.NORMAL, ease: EASING.EASE_OUT }
  },

  // 아래에서 위로 페이드 인
  fadeInUp: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: TIMING.NORMAL, ease: EASING.EASE_OUT }
  },

  // 위에서 아래로 페이드 인
  fadeInDown: {
    initial: { opacity: 0, y: -15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: TIMING.NORMAL, ease: EASING.EASE_OUT }
  },

  // 왼쪽에서 오른쪽으로 슬라이드
  slideInLeft: {
    initial: { opacity: 0, x: -15 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: TIMING.NORMAL, ease: EASING.EASE_OUT }
  },

  // 오른쪽에서 왼쪽으로 슬라이드
  slideInRight: {
    initial: { opacity: 0, x: 15 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: TIMING.NORMAL, ease: EASING.EASE_OUT }
  },

  // 스케일 애니메이션
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: TIMING.FAST, ease: EASING.EASE_OUT }
  },

  // 호버 효과 - 성능 최적화
  hover: {
    scale: 1.02,
    transition: { duration: TIMING.FAST, ease: EASING.EASE_OUT }
  },

  // 탭 효과
  tap: {
    scale: 0.98
  },

  // 스태거 애니메이션 (순차적 등장)
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.06
        }
      }
    },
    item: {
      initial: { opacity: 0, y: 15 },
      animate: { opacity: 1, y: 0 }
    }
  }
};

// 카드 애니메이션 프리셋 - 성능 최적화
export const CARD_ANIMATIONS = {
  default: {
    whileHover: COMMON_ANIMATIONS.hover,
    whileTap: COMMON_ANIMATIONS.tap,
    layout: true,
    transition: { duration: TIMING.FAST }
  },
  
  disabled: {
    whileHover: { scale: 1 },
    whileTap: { scale: 1 }
  },

  // 성능 최적화된 GPU 가속 버전
  optimized: {
    whileHover: { 
      scale: 1.02,
      transition: { duration: TIMING.FAST }
    },
    whileTap: { scale: 0.98 },
    style: {
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      transform: 'translateZ(0)'
    }
  }
};

// 페이지 전환 애니메이션 - 최적화
export const PAGE_ANIMATIONS = {
  fadeTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: TIMING.PAGE_TRANSITION, ease: EASING.EASE_OUT }
  },

  slideTransition: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: TIMING.PAGE_TRANSITION, ease: EASING.EASE_OUT }
  }
};

// 애니메이션 유틸리티 함수 - 성능 최적화
export const createStaggeredAnimation = (delayPerItem = 0.06) => ({
  container: {
    animate: {
      transition: {
        staggerChildren: delayPerItem
      }
    }
  },
  item: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: TIMING.NORMAL, ease: EASING.EASE_OUT }
  }
});

export const createDelayedAnimation = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: TIMING.NORMAL, delay, ease: EASING.EASE_OUT }
});

// GPU 가속 최적화 스타일
export const GPU_OPTIMIZED_STYLE = {
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  transform: 'translateZ(0)',
  WebkitTransform: 'translateZ(0)'
};

// 성능 최적화된 애니메이션 설정
export const PERFORMANCE_SETTINGS = {
  // 모바일에서 애니메이션 감소
  shouldReduceMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
           window.innerWidth < 768;
  },
  
  // 배터리 수준이 낮을 때 애니메이션 감소
  shouldReduceForBattery: () => {
    return navigator.getBattery ? 
           navigator.getBattery().then(battery => battery.level < 0.2) : 
           false;
  }
};