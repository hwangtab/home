// 공통 애니메이션 설정
export const COMMON_ANIMATIONS = {
  // 페이드 인/아웃
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },

  // 아래에서 위로 페이드 인
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },

  // 위에서 아래로 페이드 인
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },

  // 왼쪽에서 오른쪽으로 슬라이드
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  },

  // 오른쪽에서 왼쪽으로 슬라이드
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  },

  // 스케일 애니메이션
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  },

  // 호버 효과
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300 }
  },

  // 탭 효과
  tap: {
    scale: 0.95
  },

  // 스태거 애니메이션 (순차적 등장)
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    }
  }
};

// 카드 애니메이션 프리셋
export const CARD_ANIMATIONS = {
  default: {
    whileHover: COMMON_ANIMATIONS.hover,
    whileTap: COMMON_ANIMATIONS.tap,
    layout: true
  },
  
  disabled: {
    whileHover: { scale: 1 },
    whileTap: { scale: 1 }
  }
};

// 페이지 전환 애니메이션
export const PAGE_ANIMATIONS = {
  fadeTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  },

  slideTransition: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

// 애니메이션 유틸리티 함수
export const createStaggeredAnimation = (delayPerItem = 0.1) => ({
  container: {
    animate: {
      transition: {
        staggerChildren: delayPerItem
      }
    }
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }
});

export const createDelayedAnimation = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay }
});