import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * 동적 배경 효과 컴포넌트
 * 음악 웨이브폼과 파티클 효과를 결합한 시각적 배경
 */
const DynamicBackground = ({ className = '' }) => {
  const [particles, setParticles] = useState([]);
  const [waveforms, setWaveforms] = useState([]);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // 패럴랙스 효과를 위한 transform
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  // 파티클 생성
  useEffect(() => {
    const generateParticles = () => {
      const particleCount = window.innerWidth >= 768 ? 80 : 40;
      const newParticles = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.5 + 0.2,
          speed: Math.random() * 0.5 + 0.2,
          direction: Math.random() * Math.PI * 2,
          color: `hsl(${200 + Math.random() * 60}, 70%, ${50 + Math.random() * 30}%)`,
          pulse: Math.random() * 2 + 1
        });
      }
      
      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener('resize', generateParticles);
    
    return () => window.removeEventListener('resize', generateParticles);
  }, []);

  // 음악 웨이브폼 생성
  useEffect(() => {
    const generateWaveforms = () => {
      const waveCount = 5;
      const newWaveforms = [];
      
      for (let i = 0; i < waveCount; i++) {
        const points = [];
        for (let j = 0; j < 50; j++) {
          points.push({
            x: j * 2,
            y: Math.sin(j * 0.1 + i) * 20 + Math.random() * 10
          });
        }
        
        newWaveforms.push({
          id: i,
          points,
          color: `rgba(${59 + i * 20}, ${130 + i * 10}, 246, ${0.3 - i * 0.05})`,
          strokeWidth: 2 + i * 0.5,
          animationDelay: i * 0.2
        });
      }
      
      setWaveforms(newWaveforms);
    };

    generateWaveforms();
    
    // 웨이브폼 애니메이션 업데이트
    const interval = setInterval(() => {
      setWaveforms(prev => prev.map(wave => ({
        ...wave,
        points: wave.points.map((point, index) => ({
          ...point,
          y: Math.sin(index * 0.1 + wave.id + Date.now() * 0.001) * 20 + Math.random() * 10
        }))
      })));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // 파티클 애니메이션
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + Math.cos(particle.direction) * particle.speed) % 100,
        y: (particle.y + Math.sin(particle.direction) * particle.speed) % 100,
        opacity: 0.2 + Math.sin(Date.now() * 0.001 * particle.pulse) * 0.3
      })));
    };

    const interval = setInterval(animateParticles, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ y, opacity }}
    >
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      
      {/* 브랜드 컬러 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-900/20 via-transparent to-brand-solidarity-900/20" />
      
      {/* 파티클 레이어 */}
      <div className="absolute inset-0">
        {particles.map(particle => (
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
              filter: 'blur(1px)',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity]
            }}
            transition={{
              duration: particle.pulse,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* 음악 웨이브폼 레이어 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100" 
          className="absolute inset-0"
          preserveAspectRatio="none"
        >
          {waveforms.map(wave => {
            const pathData = wave.points.reduce((path, point, index) => {
              const command = index === 0 ? 'M' : 'L';
              return `${path} ${command} ${point.x} ${50 + point.y}`;
            }, '');
            
            return (
              <motion.path
                key={wave.id}
                d={pathData}
                stroke={wave.color}
                strokeWidth={wave.strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.6}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  delay: wave.animationDelay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </svg>
      </div>
      
      {/* 중앙 집중 조명 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-brand-primary-500/20 via-brand-primary-500/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-brand-solidarity-500/15 via-brand-solidarity-500/3 to-transparent rounded-full blur-2xl animate-pulse" 
             style={{ animationDelay: '1s' }} />
      </div>
      
      {/* 노이즈 텍스처 */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* 최종 어두운 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40" />
    </motion.div>
  );
};

export default DynamicBackground;