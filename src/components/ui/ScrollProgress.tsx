import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress, useScrollDirection } from '../../hooks/useScrollAnimation';

interface ScrollProgressProps {
    className?: string;
}

const ScrollProgress = memo<ScrollProgressProps>(({ className = '' }) => {
    const scrollProgress = useScrollProgress();
    const scrollDirection = useScrollDirection();

    const progressWidth = `${scrollProgress * 100}%`;

    return (
        <motion.div
            className={`fixed top-0 left-0 right-0 z-50 h-1 bg-gray-800/50 backdrop-blur-sm ${className}`}
            initial={{ opacity: 0 }}
            animate={{
                opacity: scrollProgress > 0.01 ? 1 : 0,
                y: scrollDirection === 'down' ? -4 : 0
            }}
            transition={{ duration: 0.3 }}
        >
            {/* Progress bar - using style only for immediate response */}
            <div
                className="h-full bg-gradient-to-r from-brand-primary-500 via-brand-solidarity-500 to-brand-harmony-500 shadow-lg transition-[width] duration-100 ease-linear"
                style={{ width: progressWidth }}
            />

            {/* Glow effect */}
            <motion.div
                className="absolute top-0 h-full w-20 bg-gradient-to-l from-brand-primary-400/30 to-transparent blur-sm"
                style={{ right: `${100 - scrollProgress * 100}%` }}
                animate={{ opacity: scrollProgress > 0.1 ? 0.8 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
});

ScrollProgress.displayName = 'ScrollProgress';

export default ScrollProgress;
