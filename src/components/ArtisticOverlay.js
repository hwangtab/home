import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * 느와르 스타일 아티스틱 오버레이 컴포넌트
 * 어둡고 세련된 필름 느와르 감성의 시각 효과
 */
const ArtisticOverlay = ({ className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shadowIntensity, setShadowIntensity] = useState(0.6);

  // 마우스 위치 추적
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    const heroElement = document.querySelector('[data-hero-section]');
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // 미묘한 그림자 강도 변화
  useEffect(() => {
    const shadowInterval = setInterval(() => {
      setShadowIntensity(0.6 + Math.random() * 0.2); // 0.6~0.8 사이에서 미세한 변화
    }, 8000); // 8초마다 서서히 변화

    return () => clearInterval(shadowInterval);
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* 느와르 그림자 오버레이 */}
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

      {/* 필름 그레인 효과 - 더 거칠고 빈티지한 */}
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

      {/* 느와르 색차 효과 - 어둡고 은은한 */}
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


      {/* 강화된 느와르 비네팅 */}
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

      {/* 필름 오버레이 - 느와르 스타일 */}
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

      {/* 미세한 인터랙티브 그림자 */}
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