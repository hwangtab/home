import React, { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAnimation, ANIMATION_PRIORITY } from '../../context/AnimationContext';

// 애니메이션 easing 함수 통일
const EASING = {
  standard: [0.4, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1]
};

// 애니메이션 지속시간 통일
const DURATION = {
  enter: 0.5,
  exit: 0.25
};

// 페이지별 전환 효과 설정 - 메모화로 성능 최적화
const getTransitionVariant = (pathname) => {
  switch (pathname) {
    case '/': return 'home';
    case '/about': return 'slideLeft';
    case '/works': return 'scale';
    case '/archive': return 'slideUp';
    case '/news': return 'fade';
    case '/contact': return 'slideRight';
    default: return 'default';
  }
};

// variants 객체를 컴포넌트 외부로 이동하여 재생성 방지
const variants = {
    default: {
      initial: { 
        opacity: 0, 
        y: 20,
        scale: 0.99
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          duration: DURATION.enter,
          ease: EASING.standard,
          staggerChildren: 0.05
        }
      },
      exit: { 
        opacity: 0, 
        y: -10,
        scale: 0.99,
        transition: {
          duration: DURATION.exit,
          ease: EASING.exit
        }
      }
    },
    home: {
      initial: { 
        opacity: 0, 
        scale: 0.98,
        rotateY: 4
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        rotateY: 0,
        transition: {
          duration: DURATION.enter,
          ease: [0.4, 0, 0.2, 1],
          staggerChildren: 0.08
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.99,
        rotateY: -2,
        transition: {
          duration: DURATION.exit,
          ease: EASING.exit
        }
      }
    },
    slideLeft: {
      initial: { 
        opacity: 0, 
        x: 40,
        scale: 0.98
      },
      animate: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
          duration: DURATION.enter,
          ease: [0.4, 0, 0.2, 1],
          staggerChildren: 0.08
        }
      },
      exit: { 
        opacity: 0, 
        x: -30,
        scale: 0.99,
        transition: {
          duration: DURATION.exit,
          ease: EASING.exit
        }
      }
    },
    slideRight: {
      initial: { 
        opacity: 0, 
        x: -40,
        scale: 0.98
      },
      animate: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
          duration: DURATION.enter,
          ease: [0.4, 0, 0.2, 1],
          staggerChildren: 0.08
        }
      },
      exit: { 
        opacity: 0, 
        x: 30,
        scale: 0.99,
        transition: {
          duration: DURATION.exit,
          ease: EASING.exit
        }
      }
    },
    slideUp: {
      initial: { 
        opacity: 0, 
        y: 30,
        filter: 'blur(2px)'
      },
      animate: { 
        opacity: 1, 
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration: DURATION.enter,
          ease: [0.4, 0, 0.2, 1],
          staggerChildren: 0.08
        }
      },
      exit: { 
        opacity: 0, 
        y: -20,
        filter: 'blur(1px)',
        transition: {
          duration: DURATION.exit,
          ease: EASING.exit
        }
      }
    },
    scale: {
      initial: { 
        opacity: 0, 
        scale: 0.9,
        rotateX: 8
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        rotateX: 0,
        transition: {
          duration: DURATION.enter,
          ease: EASING.standard,
          staggerChildren: 0.08
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.99,
        rotateX: -3,
        transition: {
          duration: DURATION.exit,
          ease: EASING.exit
        }
      }
    },
    fade: {
      initial: { 
        opacity: 0,
        scale: 0.99,
        filter: 'blur(3px)'
      },
      animate: { 
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
          duration: DURATION.enter,
          ease: EASING.standard,
          staggerChildren: 0.05
        }
      },
      exit: { 
        opacity: 0,
        scale: 1.01,
        filter: 'blur(2px)',
        transition: {
          duration: DURATION.exit,
          ease: EASING.exit
        }
      }
    }
};

/**
 * 고품질 페이지 전환 컴포넌트
 * 다양한 전환 효과와 깜빡임 방지 기능 제공
 */
const PageTransition = memo(({ children, variant = 'default' }) => {
  const location = useLocation();
  const { startPageTransition, endPageTransition } = useAnimation();

  const currentVariant = variant === 'default' ? getTransitionVariant(location.pathname) : variant;

  // 애니메이션 콜백 최적화
  const handleAnimationStart = useCallback(() => {
    startPageTransition();
  }, [startPageTransition]);

  const handleAnimationComplete = useCallback(() => {
    endPageTransition();
  }, [endPageTransition]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants[currentVariant]}
        className="w-full"
        style={{ 
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          contain: 'layout style paint',
          isolation: 'isolate',
          willChange: 'transform, opacity'
        }}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

PageTransition.displayName = 'PageTransition';

// 특정 페이지용 전환 컴포넌트들
export const HomeTransition = ({ children }) => (
  <PageTransition variant="home">{children}</PageTransition>
);

export const AboutTransition = ({ children }) => (
  <PageTransition variant="slideLeft">{children}</PageTransition>
);

export const WorksTransition = ({ children }) => (
  <PageTransition variant="scale">{children}</PageTransition>
);

export const ArchiveTransition = ({ children }) => (
  <PageTransition variant="slideUp">{children}</PageTransition>
);

export const NewsTransition = ({ children }) => (
  <PageTransition variant="fade">{children}</PageTransition>
);

export const ContactTransition = ({ children }) => (
  <PageTransition variant="slideRight">{children}</PageTransition>
);

// 디스플레이 네임 설정
HomeTransition.displayName = 'HomeTransition';
AboutTransition.displayName = 'AboutTransition';
WorksTransition.displayName = 'WorksTransition';
ArchiveTransition.displayName = 'ArchiveTransition';
NewsTransition.displayName = 'NewsTransition';
ContactTransition.displayName = 'ContactTransition';

export default PageTransition;