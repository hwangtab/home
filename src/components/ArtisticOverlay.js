import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * 아티스틱한 오버레이 효과 컴포넌트
 * 실험적이고 예술적인 시각 효과들을 제공
 */
const ArtisticOverlay = ({ className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glitchActive, setGlitchActive] = useState(false);

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

  // 랜덤 글리치 효과
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% 확률
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* 그라디언트 노이즈 오버레이 */}
      <div 
        className="absolute inset-0 opacity-15 mix-blend-overlay"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(255,255,255,0.1) 0%, 
              transparent 50%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )
          `
        }}
      />

      {/* 필름 그레인 효과 */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-multiply animate-pulse"
        style={{
          backgroundImage: `
            radial-gradient(circle, transparent 1px, rgba(255,255,255,0.1) 1px),
            radial-gradient(circle, transparent 1px, rgba(0,0,0,0.1) 1px)
          `,
          backgroundSize: '3px 3px, 7px 7px',
          backgroundPosition: '0 0, 3px 3px'
        }}
      />

      {/* 동적 색상 스플래시 */}
      <motion.div
        className="absolute inset-0 mix-blend-color-dodge opacity-8"
        animate={{
          background: [
            'radial-gradient(ellipse at 20% 80%, rgba(120,119,198,0.3) 0%, transparent 70%)',
            'radial-gradient(ellipse at 80% 20%, rgba(255,119,48,0.3) 0%, transparent 70%)',
            'radial-gradient(ellipse at 40% 40%, rgba(200,50,50,0.3) 0%, transparent 70%)',
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />

      {/* 글리치 효과 */}
      {glitchActive && (
        <motion.div
          className="absolute inset-0 mix-blend-difference"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0, 0.2, 0],
            x: [0, -2, 2, -1, 0],
          }}
          transition={{ duration: 0.15 }}
          style={{
            background: `
              linear-gradient(90deg, 
                transparent 0%, 
                rgba(255,0,0,0.1) 10%, 
                transparent 20%,
                rgba(0,255,0,0.1) 30%,
                transparent 40%,
                rgba(0,0,255,0.1) 50%,
                transparent 60%
              )
            `
          }}
        />
      )}

      {/* 빈티지 비네팅 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at center, 
              transparent 30%, 
              rgba(0,0,0,0.1) 70%, 
              rgba(0,0,0,0.4) 100%
            )
          `
        }}
      />

      {/* 아날로그 스캔라인 - 비활성화 (잔상 방지) */}

      {/* 인터랙티브 라이트 */}
      <motion.div
        className="absolute w-96 h-96 opacity-15 mix-blend-screen rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default ArtisticOverlay;