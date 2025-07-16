import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * 고품질 페이지 전환 컴포넌트
 * 다양한 전환 효과와 깜빡임 방지 기능 제공
 */
const PageTransition = memo(({ children, variant = 'default' }) => {
  const location = useLocation();

  // 페이지별 전환 효과 설정
  const getTransitionVariant = (pathname) => {
    if (pathname === '/') return 'home';
    if (pathname === '/about') return 'slideLeft';
    if (pathname === '/works') return 'scale';
    if (pathname === '/archive') return 'slideUp';
    if (pathname === '/news') return 'fade';
    if (pathname === '/contact') return 'slideRight';
    return 'default';
  };

  const currentVariant = variant === 'default' ? getTransitionVariant(location.pathname) : variant;

  // 전환 효과 변형들
  const variants = {
    default: {
      initial: { 
        opacity: 0, 
        y: 30,
        scale: 0.95
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
          staggerChildren: 0.1
        }
      },
      exit: { 
        opacity: 0, 
        y: -20,
        scale: 0.98,
        transition: {
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    home: {
      initial: { 
        opacity: 0, 
        scale: 0.9,
        rotateY: 15
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        rotateY: 0,
        transition: {
          duration: 0.6,
          ease: [0.165, 0.84, 0.44, 1],
          staggerChildren: 0.1
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.95,
        rotateY: -10,
        transition: {
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    slideLeft: {
      initial: { 
        opacity: 0, 
        x: 100,
        scale: 0.95
      },
      animate: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: [0.23, 1, 0.32, 1],
          staggerChildren: 0.1
        }
      },
      exit: { 
        opacity: 0, 
        x: -50,
        scale: 0.98,
        transition: {
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    slideRight: {
      initial: { 
        opacity: 0, 
        x: -100,
        scale: 0.95
      },
      animate: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: [0.23, 1, 0.32, 1],
          staggerChildren: 0.1
        }
      },
      exit: { 
        opacity: 0, 
        x: 50,
        scale: 0.98,
        transition: {
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    slideUp: {
      initial: { 
        opacity: 0, 
        y: 80,
        filter: 'blur(4px)'
      },
      animate: { 
        opacity: 1, 
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 0.6,
          ease: [0.165, 0.84, 0.44, 1],
          staggerChildren: 0.1
        }
      },
      exit: { 
        opacity: 0, 
        y: -30,
        filter: 'blur(2px)',
        transition: {
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    scale: {
      initial: { 
        opacity: 0, 
        scale: 0.8,
        rotateX: 15
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        rotateX: 0,
        transition: {
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.1
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.95,
        rotateX: -5,
        transition: {
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    fade: {
      initial: { 
        opacity: 0,
        scale: 0.98,
        filter: 'blur(8px)'
      },
      animate: { 
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
          staggerChildren: 0.1
        }
      },
      exit: { 
        opacity: 0,
        scale: 1.02,
        filter: 'blur(4px)',
        transition: {
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants[currentVariant]}
        className="w-full transform-gpu"
        style={{ 
          willChange: 'transform, opacity, filter',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
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