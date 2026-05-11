'use client';

import React, { useState, useEffect, memo, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorVariant = 'default' | 'link' | 'button' | 'card';

interface CustomCursorVariant {
    scale: number;
    opacity: number;
    backgroundColor: string;
    border: string;
    boxShadow: string;
}

const CustomCursor = memo(() => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [cursorText, setCursorText] = useState('');
    const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');
    const [isEnabled, setIsEnabled] = useState(true);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Refs to avoid stale closures in event listeners
    const isHoveringRef = React.useRef(isHovering);
    const cursorVariantRef = React.useRef(cursorVariant);
    const cursorTextRef = React.useRef(cursorText);

    React.useEffect(() => {
        isHoveringRef.current = isHovering;
    }, [isHovering]);

    React.useEffect(() => {
        cursorVariantRef.current = cursorVariant;
    }, [cursorVariant]);

    React.useEffect(() => {
        cursorTextRef.current = cursorText;
    }, [cursorText]);

    const springConfig = { damping: 30, stiffness: 500, mass: 0.1 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        let rafId: number;
        const moveCursor = (e: MouseEvent) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                cursorX.set(e.clientX - 16);
                cursorY.set(e.clientY - 16);
            });
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('a, button, [role="button"], [data-cursor]');
            if (target) {
                setIsHovering(true);
                if (target.hasAttribute('data-cursor')) {
                    setCursorVariant(target.getAttribute('data-cursor') as CursorVariant);
                } else if (target.tagName === 'A') {
                    setCursorVariant('link');
                } else if (target.tagName === 'BUTTON' || target.hasAttribute('role')) {
                    setCursorVariant('button');
                } else if (target.closest('.card, .hover-card')) {
                    setCursorVariant('card');
                }

                if (target.hasAttribute('data-cursor-text')) {
                    setCursorText(target.getAttribute('data-cursor-text') || '');
                } else {
                    setCursorText('');
                }
            } else {
                setIsHovering(false);
                setCursorVariant('default');
                setCursorText('');
            }
        };

        const options = { passive: true };

        if (isEnabled) {
            document.addEventListener('mousemove', moveCursor, options);
            document.addEventListener('mouseenter', handleMouseEnter, options);
            document.addEventListener('mouseleave', handleMouseLeave, options);
            document.addEventListener('mouseover', handleMouseOver, options);
        }

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            // Note: options are intentionally omitted in removeEventListener as TypeScript
            // strictly checks listener signatures. Modern browsers correctly remove listeners
            // even without passing the same options object.
            document.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY, isEnabled]);

    const variants: Record<CursorVariant, CustomCursorVariant> = {
        default: {
            scale: 1, opacity: 0.8, backgroundColor: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.4)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
        },
        link: {
            scale: 1.3, opacity: 0.9, backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '2px solid rgba(59, 130, 246, 0.6)', boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
        },
        button: {
            scale: 1.1, opacity: 0.9, backgroundColor: 'rgba(201, 63, 55, 0.15)',
            border: '2px solid rgba(201, 63, 55, 0.6)', boxShadow: '0 0 25px rgba(201, 63, 55, 0.4)',
        },
        card: {
            scale: 1.8, opacity: 0.7, backgroundColor: 'rgba(72, 201, 176, 0.15)',
            border: '2px solid rgba(72, 201, 176, 0.5)', boxShadow: '0 0 35px rgba(72, 201, 176, 0.3)',
        }
    };

    useEffect(() => {
        const isMobile = typeof window !== 'undefined' && ('ontouchstart' in window || window.innerWidth < 768);
        const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setIsEnabled(!isMobile && !isReducedMotion);
    }, []);

    if (!isEnabled) return null;

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50"
                style={{ x: cursorXSpring, y: cursorYSpring, mixBlendMode: 'difference' as 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity', willChange: 'transform', backfaceVisibility: 'hidden' }}
                animate={{
                    scale: variants[cursorVariant].scale,
                    opacity: isVisible ? variants[cursorVariant].opacity : 0,
                    backgroundColor: variants[cursorVariant].backgroundColor,
                    border: variants[cursorVariant].border,
                    boxShadow: variants[cursorVariant].boxShadow
                }}
                initial={{
                    scale: variants.default.scale,
                    opacity: variants.default.opacity,
                    backgroundColor: variants.default.backgroundColor,
                    border: variants.default.border,
                    boxShadow: variants.default.boxShadow
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.3 }}
            >
                {cursorText && (
                    <motion.div
                        className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs whitespace-nowrap font-wanted-sans border border-gray-700"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        {cursorText}
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-40 bg-brand-primary-400"
                style={{ x: cursorXSpring, y: cursorYSpring, willChange: 'transform', backfaceVisibility: 'hidden' }}
                animate={{ scale: isHovering ? 0.3 : 1, opacity: isVisible ? 0.5 : 0 }}
                transition={{ type: 'spring', damping: 35, stiffness: 600, mass: 0.1 }}
            />

            <motion.div
                className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-30 border border-brand-primary-400/20"
                style={{ x: cursorXSpring, y: cursorYSpring, willChange: 'transform', backfaceVisibility: 'hidden' }}
                animate={{ scale: isHovering ? 1.5 : 1, opacity: isVisible ? 0.3 : 0 }}
                transition={{ type: 'spring', damping: 40, stiffness: 300, mass: 0.2 }}
            />
        </>
    );
});

CustomCursor.displayName = 'CustomCursor';

interface CursorHelperProps {
    children: ReactNode;
    text?: string;
    variant?: CursorVariant;
}

export const CursorTextProvider: React.FC<CursorHelperProps> = ({ children, text, variant = 'default' }) => (
    <div data-cursor={variant} data-cursor-text={text} className="cursor-none">
        {children}
    </div>
);

export const CursorHoverArea: React.FC<CursorHelperProps> = ({ children, variant = 'default', text }) => (
    <div data-cursor={variant} data-cursor-text={text} className="cursor-none">
        {children}
    </div>
);

CursorTextProvider.displayName = 'CursorTextProvider';
CursorHoverArea.displayName = 'CursorHoverArea';

export default CustomCursor;
