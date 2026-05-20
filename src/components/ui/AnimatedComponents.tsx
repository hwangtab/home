
import React, { memo, useRef, useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BaseProps {
    children?: ReactNode;
    className?: string;
}

export const PageTransition = memo<BaseProps>(({ children, className = '' }) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.25, 0.25, 0, 1] }}
    >
        {children}
    </motion.div>
));

interface ScrollRevealProps extends BaseProps {
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    duration?: number;
    distance?: number;
}

export const ScrollReveal = memo<ScrollRevealProps>(({
    children, direction = 'up', delay = 0, duration = 0.4, distance = 30, className = ''
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsInView(true);
        }, { threshold: 0.1, rootMargin: '-50px' });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const directions = {
        up: { y: distance }, down: { y: -distance }, left: { x: distance }, right: { x: -distance }
    };

    return (
        <motion.div
            ref={ref}
            className={`transform-gpu ${className}`}
            initial={{ opacity: 0, ...directions[direction] }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {children}
        </motion.div>
    );
});

interface StaggerContainerProps extends BaseProps {
    staggerDelay?: number;
}

export const StaggerContainer = memo<StaggerContainerProps>(({ children, staggerDelay = 0.1, className = '' }) => (
    <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: staggerDelay } }
        }}
    >
        {children}
    </motion.div>
));

interface StaggerItemProps extends BaseProps {
    direction?: 'up' | 'down' | 'left' | 'right';
}

export const StaggerItem = memo<StaggerItemProps>(({ children, direction = 'up', className = '' }) => {
    const directions = {
        up: { y: 15 }, down: { y: -15 }, left: { x: 15 }, right: { x: -15 }
    };

    return (
        <motion.div
            className={`transform-gpu ${className}`}
            variants={{
                hidden: { opacity: 0, ...directions[direction] },
                visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } }
            }}
        >
            {children}
        </motion.div>
    );
});


interface HoverCardProps extends BaseProps {
    scale?: number;
}

export const HoverCard = memo<HoverCardProps>(({ children, className = '', scale = 1.02 }) => (
    <motion.div
        className={className}
        whileHover={{ scale, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
    >
        {children}
    </motion.div>
));

PageTransition.displayName = 'PageTransition';
ScrollReveal.displayName = 'ScrollReveal';
StaggerContainer.displayName = 'StaggerContainer';
StaggerItem.displayName = 'StaggerItem';
HoverCard.displayName = 'HoverCard';
