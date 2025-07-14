import React, { useState, useEffect, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * 커스텀 커서 컴포넌트
 * 인터랙티브한 마우스 팔로우 효과 제공
 */
const CustomCursor = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState('default');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // 스프링 애니메이션으로 부드러운 움직임
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // 호버 가능한 요소들 감지
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"]');
      if (target) {
        setIsHovering(true);
        
        // 요소별 커서 스타일 설정
        if (target.hasAttribute('data-cursor')) {
          setCursorVariant(target.getAttribute('data-cursor'));
        } else if (target.tagName === 'A') {
          setCursorVariant('link');
        } else if (target.tagName === 'BUTTON' || target.hasAttribute('role')) {
          setCursorVariant('button');
        }

        // 커서 텍스트 설정
        if (target.hasAttribute('data-cursor-text')) {
          setCursorText(target.getAttribute('data-cursor-text'));
        } else {
          setCursorText('');
        }
      } else {
        setIsHovering(false);
        setCursorVariant('default');
        setCursorText('');
      }
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // 커서 변형 스타일
  const variants = {
    default: {
      scale: 1,
      opacity: 1,
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      border: '2px solid rgba(59, 130, 246, 0.5)',
    },
    link: {
      scale: 1.5,
      opacity: 1,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      border: '2px solid rgba(59, 130, 246, 0.8)',
    },
    button: {
      scale: 1.2,
      opacity: 1,
      backgroundColor: 'rgba(201, 63, 55, 0.2)',
      border: '2px solid rgba(201, 63, 55, 0.8)',
    },
    card: {
      scale: 2,
      opacity: 0.8,
      backgroundColor: 'rgba(72, 201, 176, 0.2)',
      border: '2px solid rgba(72, 201, 176, 0.6)',
    }
  };

  // 모바일에서는 커서 숨김
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* 메인 커서 */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={variants[cursorVariant]}
        initial={variants.default}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 400,
          mass: 0.5
        }}
        className={`${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* 커서 텍스트 */}
        {cursorText && (
          <motion.div
            className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap font-wanted-sans"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {cursorText}
          </motion.div>
        )}
      </motion.div>

      {/* 커서 트레일 효과 */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 rounded-full pointer-events-none z-40 bg-brand-primary-400"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 0.5 : 1,
          opacity: isVisible ? 0.6 : 0,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 500,
        }}
      />
    </>
  );
});

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;