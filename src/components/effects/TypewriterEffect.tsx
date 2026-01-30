import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TypewriterEffectProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    showCursor?: boolean;
    onComplete?: (() => void) | null;
}

/**
 * 타이핑 효과 컴포넌트
 * 텍스트를 글자 단위로 순차적으로 표시하는 애니메이션
 */
const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
    text,
    speed = 150,
    delay = 0,
    className = '',
    showCursor = true,
    onComplete = null
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isStarted, setIsStarted] = useState(delay === 0);
    const isCompleteRef = useRef(false);

    // Reset when text changes
    useEffect(() => {
        setCurrentIndex(0);
        setIsStarted(delay === 0);
        isCompleteRef.current = false;
    }, [text, delay]);

    // Handle delay before starting
    useEffect(() => {
        if (delay > 0) {
            const delayTimer = setTimeout(() => {
                setIsStarted(true);
            }, delay);
            return () => clearTimeout(delayTimer);
        }
    }, [delay]);

    // Typing animation
    useEffect(() => {
        if (!isStarted) return;

        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timer);
        } else if (!isCompleteRef.current && currentIndex === text.length) {
            isCompleteRef.current = true;
            onComplete?.();
        }
    }, [currentIndex, text.length, speed, isStarted, onComplete]);

    // Derived display text
    const displayText = text.slice(0, currentIndex);
    const isComplete = currentIndex >= text.length;

    return (
        <span className={className}>
            {displayText}
            {showCursor && !isComplete && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block ml-1 text-brand-primary-400"
                >
                    |
                </motion.span>
            )}
        </span>
    );
};

export default TypewriterEffect;
