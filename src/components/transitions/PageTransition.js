import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * 페이지 전환 애니메이션 컴포넌트
 * 페이지 간 부드러운 전환 효과 제공
 */
const PageTransition = memo(({ children }) => {
  const location = useLocation();

  // 통일된 애니메이션 설정 (깜빡임 최소화)
  const getPageAnimation = () => {
    return {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 }
    };
  };

  const animation = getPageAnimation();

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={location.pathname}
        initial={animation.initial}
        animate={animation.animate}
        exit={animation.exit}
        transition={{
          duration: 0.2,
          ease: [0.25, 0.25, 0, 1], // cubic-bezier for smooth transitions
          opacity: { duration: 0.15 }
        }}
        className="w-full transform-gpu"
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

PageTransition.displayName = 'PageTransition';

export default PageTransition;