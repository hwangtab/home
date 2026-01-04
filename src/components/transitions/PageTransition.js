import React, { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAnimation } from '../../context/AnimationContext';

// Ultra-fast variants to eliminate flicker
const variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.1, ease: 'linear' }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.05, ease: 'linear' }
  }
};

/**
 * Simplified Page Transition Component
 * Uses fade-only to avoid conflicting with inner component animations
 */
const PageTransition = memo(({ children }) => {
  const location = useLocation();
  const { startPageTransition, endPageTransition } = useAnimation();

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
        variants={variants}
        className="w-full"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
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

export default PageTransition;