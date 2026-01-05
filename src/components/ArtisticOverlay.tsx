// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ArtisticOverlayProps {
    className?: string;
}

const ArtisticOverlay: React.FC<ArtisticOverlayProps> = ({ className = '' }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [shadowIntensity, setShadowIntensity] = useState(0.6);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Use e.target as fallback if currentTarget is null, but specific logic uses Hero Section
            // Actually e.currentTarget works on event listener attached element
            // But we attach to document.querySelector('[data-hero-section]')

            const target = e.currentTarget as HTMLElement;
            if (!target) return;

            const rect = target.getBoundingClientRect();
            setMousePosition({
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height,
            });
        };

        const heroElement = document.querySelector('[data-hero-section]');
        if (heroElement) {
            // @ts-ignore - EventListener type mismatch for mousemove vs Event
            heroElement.addEventListener('mousemove', handleMouseMove);
            // @ts-ignore
            return () => heroElement.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    useEffect(() => {
        const shadowInterval = setInterval(() => {
            setShadowIntensity(0.6 + Math.random() * 0.2);
        }, 8000);

        return () => clearInterval(shadowInterval);
    }, []);

    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`}>
            {/* Noir shadow overlay */}
            <div
                className="absolute inset-0 opacity-40 mix-blend-multiply"
                style={{
                    background: `
            radial-gradient(ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              transparent 20%, 
              rgba(0,0,0,0.3) 60%,
              rgba(0,0,0,0.7) 100%),
            linear-gradient(
              135deg,
              rgba(0,0,0,0.2) 0%,
              transparent 30%,
              rgba(0,0,0,0.1) 100%
            )
          `
                }}
            />

            {/* Film grain effect */}
            <div
                className="absolute inset-0 opacity-25 mix-blend-overlay"
                style={{
                    backgroundImage: `
            radial-gradient(circle, transparent 0.5px, rgba(0,0,0,0.2) 1px),
            radial-gradient(circle, transparent 0.5px, rgba(255,255,255,0.03) 1px)
          `,
                    backgroundSize: '2px 2px, 5px 5px',
                    backgroundPosition: '0 0, 2.5px 2.5px'
                }}
            />

            {/* Chromatic aberration / Noir tint */}
            <motion.div
                className="absolute inset-0 mix-blend-soft-light opacity-15"
                animate={{
                    background: [
                        'radial-gradient(ellipse at 30% 70%, rgba(139,69,19,0.15) 0%, transparent 80%)',
                        'radial-gradient(ellipse at 70% 30%, rgba(160,82,45,0.12) 0%, transparent 80%)',
                        'radial-gradient(ellipse at 50% 50%, rgba(101,67,33,0.18) 0%, transparent 80%)',
                    ]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            />

            {/* Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    opacity: shadowIntensity,
                    background: `
            radial-gradient(ellipse at center, 
              transparent 15%, 
              rgba(0,0,0,0.3) 60%, 
              rgba(0,0,0,0.8) 95%
            )
          `
                }}
            />

            {/* Film overlay */}
            <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                    background: `
            linear-gradient(
              180deg,
              rgba(0,0,0,0.1) 0%,
              transparent 20%,
              transparent 80%,
              rgba(0,0,0,0.3) 100%
            )
          `
                }}
            />

            {/* Interactive shadow */}
            <motion.div
                className="absolute w-64 h-64 opacity-20 mix-blend-multiply rounded-full blur-2xl"
                style={{
                    background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, transparent 70%)',
                    left: `${mousePosition.x * 100}%`,
                    top: `${mousePosition.y * 100}%`,
                    transform: 'translate(-50%, -50%)'
                }}
                animate={{
                    scale: [0.8, 1, 0.8],
                    opacity: [0.15, 0.25, 0.15]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
};

export default ArtisticOverlay;
