import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * 느와르 스타일 동적 배경 효과 컴포넌트
 * 어둡고 세련된 필름 느와르 감성의 시각적 배경
 */
const DynamicBackground = ({ className = '' }) => {
  const [smokeParticles, setSmokeParticles] = useState([]);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // 패럴랙스 효과를 위한 transform
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.4]);

  // 연기/먼지 파티클 생성
  useEffect(() => {
    const generateSmokeParticles = () => {
      const particleCount = window.innerWidth >= 768 ? 40 : 25; // 은은하지만 눈에 띄는 연기
      const newParticles = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 16 + 12, // 훨씬 더 큰 연기 입자 (12~28px)
          opacity: Math.random() * 0.4 + 0.2, // 더 진한 연기 (0.2~0.6)
          speed: Math.random() * 0.3 + 0.1, // 느린 움직임
          direction: Math.random() * Math.PI * 2,
          color: `rgba(${180 + Math.random() * 40}, ${170 + Math.random() * 30}, ${160 + Math.random() * 30}, ${0.3 + Math.random() * 0.2})`, // 더 밝고 진한 회색 톤 (0.3~0.5 알파)
          drift: Math.random() * 0.02 + 0.01 // 천천히 위로 떠오르는 효과
        });
      }
      
      setSmokeParticles(newParticles);
    };

    generateSmokeParticles();
    window.addEventListener('resize', generateSmokeParticles);
    
    return () => window.removeEventListener('resize', generateSmokeParticles);
  }, []);

  // 연기 파티클 애니메이션
  useEffect(() => {
    const animateSmoke = () => {
      setSmokeParticles(prev => prev.map(particle => {
        // 새로운 위치 계산
        let newX = particle.x + Math.cos(particle.direction) * particle.speed;
        let newY = particle.y - particle.drift;
        
        // 화면 경계 처리 - x축 (좌우로 순환)
        if (newX > 100) newX = 0;
        if (newX < 0) newX = 100;
        
        // 화면 경계 처리 - y축 (위로 사라지면 아래에서 다시 등장)
        if (newY < -10) {
          newY = 110; // 화면 아래에서 다시 시작
          newX = Math.random() * 100; // 새로운 x 위치
        }
        
        return {
          ...particle,
          x: newX,
          y: newY,
          opacity: Math.max(0.1, Math.min(0.4, particle.opacity + (Math.random() - 0.5) * 0.05)) // 더 안정적인 투명도 변화
        };
      }));
    };

    const interval = setInterval(animateSmoke, 150); // 더 느린 업데이트
    return () => clearInterval(interval);
  }, []);


  return (
    <motion.div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden z-10 ${className}`}
      style={{ y, opacity }}
    >
      {/* 느와르 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
      
      {/* 느와르 톤 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/5 via-transparent to-orange-900/5" />
      
      {/* 연기/먼지 파티클 레이어 - 최상단 */}
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
              filter: 'blur(3px)', // 더 진한 연기 효과
            }}
            animate={{
              scale: [1, 1.1, 0.9, 1],
              opacity: [particle.opacity, particle.opacity * 0.7, particle.opacity]
            }}
            transition={{
              duration: 8 + Math.random() * 4, // 더 느린 애니메이션
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      
      {/* 느와르 영화 스타일 조명 효과 */}
      <div className="absolute inset-0">
        {/* 메인 필름 조명 - 한쪽에서 들어오는 따뜻한 조명 */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-amber-600/8 via-orange-700/3 to-transparent rounded-full blur-3xl" />
        
        {/* 보조 조명 - 반대편 은은한 조명 */}
        <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gradient-radial from-yellow-800/5 via-amber-900/2 to-transparent rounded-full blur-2xl" />
      </div>
      
      {/* 필름 그레인 텍스처 */}
      <div 
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='filmGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23filmGrain)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      />
      
      {/* 느와르 비네팅 및 어두운 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
      
      {/* 강한 비네팅 효과 */}
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