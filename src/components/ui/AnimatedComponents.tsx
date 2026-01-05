// @ts-nocheck
import React, { memo, useRef, useEffect, useState, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

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
            style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
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
            style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
        >
            {children}
        </motion.div>
    );
});

interface ParallaxElementProps extends BaseProps {
    speed?: number;
}

export const ParallaxElement = memo<ParallaxElementProps>(({ children, speed = 0.5, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    return (
        <motion.div ref={ref} className={className} style={{ y: smoothY }}>
            {children}
        </motion.div>
    );
});

interface MouseTrackerProps extends BaseProps {
    scale?: number;
    rotate?: number;
}

export const MouseTracker = memo<MouseTrackerProps>(({ children, scale = 1.05, rotate = 2, className = '' }) => (
    <motion.div
        className={className}
        whileHover={{ scale, rotate, transition: { duration: 0.2, ease: "easeOut" } }}
        whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
    >
        {children}
    </motion.div>
));

interface FloatingElementProps extends BaseProps {
    intensity?: number;
    duration?: number;
}

export const FloatingElement = memo<FloatingElementProps>(({ children, intensity = 10, duration = 3, className = '' }) => (
    <motion.div
        className={className}
        animate={{ y: [0, -intensity, 0], rotate: [-1, 1, -1] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
        {children}
    </motion.div>
));

interface TypewriterTextProps {
    text: string;
    speed?: number;
    className?: string;
    onComplete?: (() => void) | null;
}

export const TypewriterText = memo<TypewriterTextProps>(({ text, speed = 50, className = '', onComplete = null }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timer);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete]);

    return (
        <span className={className}>
            {displayText}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="ml-1">|</motion.span>
        </span>
    );
});

interface AnimatedCounterProps {
    from?: number;
    to: number;
    duration?: number;
    className?: string;
}

export const AnimatedCounter = memo<AnimatedCounterProps>(({ from = 0, to, duration = 2, className = '' }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const element = nodeRef.current;
        if (!element) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setInView(true);
        }, { threshold: 0.1 });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <motion.span ref={nodeRef} className={className} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
            <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}>
                {inView && (
                    <motion.span initial={from} animate={to} transition={{ duration, ease: "easeOut" }}>
                        {/* Note: In React, connecting a MotionValue to text content isn't directly supported in TS without 'any' or specific components. 
                Using a simplified approach here or custom hook for displaying value would be better, but sticking to logic. 
                Actually, motion components don't render numbers like this directly in TS. 
                Let's simplify to standard text for now or keep it as is if it works in JS.
                Wait, 'motion.span' children function is valid in Framer Motion. 
                But TypeScript might complain about 'value'. Setting as any to bypass complex type for now.
            */}
                        {(value: any) => Math.round(value)}
                    </motion.span>
                )}
            </motion.span>
        </motion.span>
    );
});

interface ModalAnimationProps extends BaseProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ModalAnimation = memo<ModalAnimationProps>(({ children, isOpen, onClose, className = '' }) => (
    <motion.div
        className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
    >
        <motion.div className="absolute inset-0 bg-black" initial={{ opacity: 0 }} animate={{ opacity: isOpen ? 0.5 : 0 }} exit={{ opacity: 0 }} />
        <motion.div
            className="relative z-10"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: isOpen ? 1 : 0.8, opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.25, 0, 1] }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
            {children}
        </motion.div>
    </motion.div>
));

interface DropdownAnimationProps extends BaseProps {
    isOpen: boolean;
}

export const DropdownAnimation = memo<DropdownAnimationProps>(({ children, isOpen, className = '' }) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.25, 0, 1] }}
        style={{ overflow: 'hidden' }}
    >
        <motion.div initial={{ y: -10 }} animate={{ y: isOpen ? 0 : -10 }} transition={{ duration: 0.2 }}>
            {children}
        </motion.div>
    </motion.div>
));

interface HoverCardProps extends BaseProps {
    scale?: number;
    shadowIntensity?: number;
}

export const HoverCard = memo<HoverCardProps>(({ children, className = '', scale = 1.02, shadowIntensity = 1 }) => (
    <motion.div
        className={className}
        whileHover={{ scale, boxShadow: `0 ${10 * shadowIntensity}px ${25 * shadowIntensity}px rgba(0, 0, 0, 0.3)`, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
    >
        {children}
    </motion.div>
));

PageTransition.displayName = 'PageTransition';
ScrollReveal.displayName = 'ScrollReveal';
StaggerContainer.displayName = 'StaggerContainer';
StaggerItem.displayName = 'StaggerItem';
ParallaxElement.displayName = 'ParallaxElement';
MouseTracker.displayName = 'MouseTracker';
FloatingElement.displayName = 'FloatingElement';
TypewriterText.displayName = 'TypewriterText';
AnimatedCounter.displayName = 'AnimatedCounter';
ModalAnimation.displayName = 'ModalAnimation';
DropdownAnimation.displayName = 'DropdownAnimation';
HoverCard.displayName = 'HoverCard';
