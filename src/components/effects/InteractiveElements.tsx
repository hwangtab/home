'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface InteractiveElementsProps {
    className?: string;
}

/**
 * 느와르 스타일 인터랙티브 효과 컴포넌트
 * 마우스 움직임에 반응하는 은은한 필름 조명 효과
 */
const InteractiveElements: React.FC<InteractiveElementsProps> = ({ className = '' }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

    const springConfig = { stiffness: 50, damping: 20 };
    const mouseX = useSpring(mousePosition.x, springConfig);
    const mouseY = useSpring(mousePosition.y, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                setMousePosition({ x, y });
            }
        };

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseenter', handleMouseEnter);
            container.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseenter', handleMouseEnter);
                container.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, []);

    return (
        <motion.div
            ref={containerRef}
            className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
            style={{ scale, opacity, y }}
        >
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    left: mouseX, top: mouseY, x: '-50%', y: '-50%',
                    background: 'radial-gradient(ellipse 80% 60%, rgba(120, 110, 100, 0.05) 0%, rgba(100, 90, 80, 0.02) 40%, transparent 70%)',
                    filter: 'blur(40px)', opacity: isHovered ? 0.6 : 0.2, scale: isHovered ? 1.2 : 0.9
                }}
                transition={{ type: 'spring', stiffness: 60, damping: 40 }}
            />

            <motion.div
                className="absolute w-80 h-80 rounded-full pointer-events-none"
                style={{
                    left: mouseX, top: mouseY, x: '-50%', y: '-50%',
                    background: 'radial-gradient(circle, rgba(90, 85, 80, 0.04) 0%, rgba(70, 65, 60, 0.015) 60%, transparent 80%)',
                    filter: 'blur(25px)', opacity: isHovered ? 0.4 : 0.15, scale: isHovered ? 1.1 : 0.8
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 30 }}
            />

            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gray-400/8 rounded-full pointer-events-none"
                    style={{
                        left: `${30 + i * 20}%`, top: `${40 + (i % 2) * 20}%`, filter: 'blur(1px)'
                    }}
                    animate={{ y: [0, -10, 0], opacity: [0.05, 0.15, 0.05], x: [0, 5, 0] }}
                    transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
                />
            ))}

            {isHovered && (
                <motion.div
                    className="absolute pointer-events-none"
                    style={{ left: mouseX, top: mouseY, x: '-50%', y: '-50%' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-gray-300/12 rounded-full"
                            style={{ left: 0, top: 0, filter: 'blur(1px)' }}
                            animate={{
                                x: Math.cos(i * Math.PI / 2) * 20, y: Math.sin(i * Math.PI / 2) * 20,
                                opacity: [0.3, 0], scale: [1, 0.3]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        />
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default InteractiveElements;
