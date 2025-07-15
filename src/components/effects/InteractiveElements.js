import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * 인터랙티브 효과 컴포넌트
 * 마우스 움직임과 스크롤에 반응하는 시각적 효과
 */
const InteractiveElements = ({ className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // 스크롤 기반 변환
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  // 부드러운 스프링 애니메이션
  const springConfig = { stiffness: 50, damping: 20 };
  const mouseX = useSpring(mousePosition.x, springConfig);
  const mouseY = useSpring(mousePosition.y, springConfig);

  // 마우스 위치 추적
  useEffect(() => {
    const handleMouseMove = (e) => {
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
      {/* 마우스 따라다니는 조명 효과 */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          left: mouseX,
          top: mouseY,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%)',
          filter: 'blur(20px)',
          opacity: isHovered ? 1 : 0.3,
          scale: isHovered ? 1.5 : 1
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      />
      
      {/* 보조 조명 효과 */}
      <motion.div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          left: mouseX,
          top: mouseY,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, rgba(72, 201, 176, 0.1) 0%, rgba(72, 201, 176, 0.03) 50%, transparent 70%)',
          filter: 'blur(15px)',
          opacity: isHovered ? 0.8 : 0.2,
          scale: isHovered ? 1.2 : 0.8
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 25 }}
      />
      
      {/* 플로팅 요소들 */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full pointer-events-none"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2
          }}
        />
      ))}
      
      {/* 마우스 호버 시 파티클 효과 */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: mouseX,
            top: mouseY,
            x: '-50%',
            y: '-50%',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-brand-primary-400 rounded-full"
              style={{
                left: 0,
                top: 0,
              }}
              animate={{
                x: Math.cos(i * Math.PI / 4) * 30,
                y: Math.sin(i * Math.PI / 4) * 30,
                opacity: [1, 0],
                scale: [1, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>
      )}
      
    </motion.div>
  );
};

export default InteractiveElements;