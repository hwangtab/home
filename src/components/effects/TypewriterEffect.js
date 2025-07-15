import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * 타이핑 효과 컴포넌트
 * 텍스트를 글자 단위로 순차적으로 표시하는 애니메이션
 */
const TypewriterEffect = ({ 
  text, 
  speed = 150, 
  delay = 0, 
  className = '',
  showCursor = true,
  onComplete = null 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayText('');
      }, delay);
      
      return () => clearTimeout(delayTimer);
    }
  }, [delay]);

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