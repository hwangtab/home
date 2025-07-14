import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * 페이지 전환 애니메이션 컴포넌트
 * 페이지 간 부드러운 전환 효과 제공
 */
const PageTransition = memo(({ children }) => {
  const location = useLocation();

  // 페이지별 커스텀 애니메이션 설정
  const getPageAnimation = (pathname) => {
    switch (pathname) {
      case '/':
        return {
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 1.05, y: -20 }
        };
      case '/about':
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 50 }
        };
      case '/works':
        return {
          initial: { opacity: 0, y: 30, rotateX: -5 },
          animate: { opacity: 1, y: 0, rotateX: 0 },
          exit: { opacity: 0, y: -30, rotateX: 5 }
        };
      case '/archive':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 }
        };
      case '/news':
        return {
          initial: { opacity: 0, x: 30 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -30 }
        };
      case '/contact':
        return {
          initial: { opacity: 0, y: 50, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -50, scale: 1.05 }
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 }
        };
    }
  };

  const animation = getPageAnimation(location.pathname);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={animation.initial}
        animate={animation.animate}
        exit={animation.exit}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.25, 0, 1], // cubic-bezier for smooth transitions
          opacity: { duration: 0.3 }
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

PageTransition.displayName = 'PageTransition';

export default PageTransition;