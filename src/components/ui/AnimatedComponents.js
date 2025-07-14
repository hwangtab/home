import React, { memo, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// 페이지 트랜지션 래퍼
export const PageTransition = memo(({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.25, 0, 1] // cubic-bezier easing
      }}
    >
      {children}
    </motion.div>
  );
});

// 스크롤 기반 애니메이션
export const ScrollReveal = memo(({ 
  children, 
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = ''
}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '-100px'
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : {}}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.25, 0, 1]
      }}
    >
      {children}
    </motion.div>
  );
});

// 스태거 애니메이션
export const StaggerContainer = memo(({ 
  children, 
  staggerDelay = 0.1,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
});

export const StaggerItem = memo(({ 
  children, 
  direction = 'up',
  className = ''
}) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    scale: { scale: 0.8 }
  };

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { 
          opacity: 0, 
          ...directions[direction] 
        },
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.25, 0, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
});

// 패럴랙스 스크롤
export const ParallaxElement = memo(({ 
  children, 
  speed = 0.5,
  className = ''
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: smoothY }}
    >
      {children}
    </motion.div>
  );
});

// 마우스 추적 효과
export const MouseTracker = memo(({ 
  children, 
  scale = 1.05,
  rotate = 2,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale,
        rotate,
        transition: { 
          duration: 0.2,
          ease: "easeOut"
        }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { 
          duration: 0.1 
        }
      }}
    >
      {children}
    </motion.div>
  );
});

// 플로팅 애니메이션
export const FloatingElement = memo(({ 
  children, 
  intensity = 10,
  duration = 3,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -intensity, 0],
        rotate: [-1, 1, -1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
});

// 타이핑 애니메이션
export const TypewriterText = memo(({ 
  text, 
  speed = 50,
  className = '',
  onComplete = null
}) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  );
});

// 카운터 애니메이션
export const AnimatedCounter = memo(({ 
  from = 0, 
  to, 
  duration = 2,
  className = ''
}) => {
  const nodeRef = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = nodeRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <motion.span
      ref={nodeRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {inView && (
          <motion.span
            initial={from}
            animate={to}
            transition={{ duration, ease: "easeOut" }}
          >
            {({ value }) => Math.round(value)}
          </motion.span>
        )}
      </motion.span>
    </motion.span>
  );
});

// 모달 애니메이션
export const ModalAnimation = memo(({ 
  children, 
  isOpen,
  onClose,
  className = ''
}) => {
  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* 백드롭 */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0.5 : 0 }}
        exit={{ opacity: 0 }}
      />
      
      {/* 모달 컨텐츠 */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ 
          scale: isOpen ? 1 : 0.8, 
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : 20
        }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ 
          duration: 0.3,
          ease: [0.25, 0.25, 0, 1]
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
});

// 드롭다운 애니메이션
export const DropdownAnimation = memo(({ 
  children, 
  isOpen,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: isOpen ? 1 : 0,
        height: isOpen ? 'auto' : 0
      }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.25, 0, 1]
      }}
      style={{ overflow: 'hidden' }}
    >
      <motion.div
        initial={{ y: -10 }}
        animate={{ y: isOpen ? 0 : -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
});

// 호버 애니메이션
export const HoverCard = memo(({ 
  children, 
  className = '',
  scale = 1.02,
  shadowIntensity = 1
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale,
        boxShadow: `0 ${10 * shadowIntensity}px ${25 * shadowIntensity}px rgba(0, 0, 0, 0.3)`,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      {children}
    </motion.div>
  );
});

PageTransition.displayName = 'PageTransition';
ScrollReveal.displayName = 'ScrollReveal';
StaggerContainer.displayName = 'StaggerContainer';
StaggerItem.displayName = 'StaggerItem';
ParallaxElement.displayName = 'ParallaxElement';
MouseTracker.displayName = 'MouseTracker';
FloatingElement.displayName = 'FloatingElement';
TypewriterText.displayName = 'TypewriterText';
AnimatedCounter.displayName = 'AnimatedCounter';
ModalAnimation.displayName = 'ModalAnimation';
DropdownAnimation.displayName = 'DropdownAnimation';
HoverCard.displayName = 'HoverCard';