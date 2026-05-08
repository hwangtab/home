'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    direction: number;
    color: string;
    drift: number;
    animDuration: number;
    breathOffset: number;
}

interface DynamicBackgroundProps {
    className?: string;
}

/**
 * 느와르 스타일 동적 배경 효과 컴포넌트
 * 어둡고 세련된 필름 느와르 감성의 시각적 배경
 */
const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ className = '' }) => {
    const [smokeParticles, setSmokeParticles] = useState<Particle[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.4]);

    useEffect(() => {
        const generateSmokeParticles = () => {
            const particleCount = window.innerWidth >= 768 ? 40 : 25;
            const newParticles: Particle[] = [];

            for (let i = 0; i < particleCount; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 16 + 12,
                    opacity: Math.random() * 0.4 + 0.2,
                    speed: Math.random() * 0.3 + 0.1,
                    direction: Math.random() * Math.PI * 2,
                    color: `rgba(${180 + Math.random() * 40}, ${170 + Math.random() * 30}, ${160 + Math.random() * 30}, ${0.3 + Math.random() * 0.2})`,
                    drift: Math.random() * 0.02 + 0.01,
                    // Pre-computed animation params so we don't generate random values every frame
                    animDuration: 8 + Math.random() * 4,
                    breathOffset: Math.random() * Math.PI * 2
                });
            }

            setSmokeParticles(newParticles);
        };

        generateSmokeParticles();
        window.addEventListener('resize', generateSmokeParticles);
        return () => window.removeEventListener('resize', generateSmokeParticles);
    }, []);

    useEffect(() => {
        const animateSmoke = () => {
            setSmokeParticles(prev => prev.map(particle => {
                let newX = particle.x + Math.cos(particle.direction) * particle.speed;
                let newY = particle.y - particle.drift;

                if (newX > 100) newX = 0;
                if (newX < 0) newX = 100;

                if (newY < -10) {
                    newY = 110;
                    newX = particle.x;
                }

                return {
                    ...particle,
                    x: newX,
                    y: newY
                };
            }));
        };

        const interval = setInterval(animateSmoke, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden z-10 ${className}`}
            style={{ y, opacity }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/5 via-transparent to-orange-900/5" />

            <div className="absolute inset-0 z-20">
                {smokeParticles.map(particle => (
                    <motion.div
                        key={particle.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color,
                            opacity: particle.opacity,
                            filter: 'blur(3px)',
                        }}
                        animate={{
                            scale: [1, 1.1, 0.9, 1],
                        }}
                        transition={{
                            duration: particle.animDuration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: particle.breathOffset
                        }}
                    />
                ))}
            </div>

            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-amber-600/8 via-orange-700/3 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gradient-radial from-yellow-800/5 via-amber-900/2 to-transparent rounded-full blur-2xl" />
            </div>

            <div
                className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='filmGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23filmGrain)'/%3E%3C/svg%3E")`,
                    backgroundSize: '150px 150px'
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    background: `radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.8) 100%)`
                }}
            />
        </motion.div>
    );
};

export default DynamicBackground;
