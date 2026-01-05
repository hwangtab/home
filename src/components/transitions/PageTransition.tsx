// @ts-nocheck
import React, { memo, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAnimation } from '../../context/AnimationContext';

const variants: Variants = {
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

interface PageTransitionProps {
    children: ReactNode;
}

const PageTransition = memo(({ children }: PageTransitionProps) => {
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
                } as React.CSSProperties}
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
