import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Heading2 } from './ui/Typography';
import { Container, Spacer } from './ui/Layout';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Section = memo(({ 
  title, 
  subtitle,
  children, 
  className = "",
  containerSize = 'default',
  spacing = 'default',
  background = 'transparent',
  titleAlign = 'left',
  enableScrollAnimation = true,
  enableParallax = false
}) => {
  const spacingClasses = {
    none: 'mb-0',
    sm: 'mb-8',
    default: 'mb-16',
    lg: 'mb-20',
    xl: 'mb-24'
  };

  const backgroundClasses = {
    transparent: '',
    default: 'bg-gray-900',
    accent: 'bg-gray-800',
    muted: 'bg-gray-850'
  };

  // 스크롤 애니메이션 설정
  const { elementRef, variants, controls, parallaxY } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    enableParallax
  });

  return (
    <motion.section 
      ref={enableScrollAnimation ? elementRef : null}
      className={`${spacingClasses[spacing]} ${backgroundClasses[background]} transform-gpu ${className}`}
      initial={enableScrollAnimation ? 'hidden' : { opacity: 1 }}
      animate={enableScrollAnimation ? controls : { opacity: 1 }}
      variants={enableScrollAnimation ? variants : undefined}
      style={enableParallax ? { y: parallaxY } : undefined}
    >
      <Container size={containerSize}>
        {(title || subtitle) && (
          <div className={`mb-12 ${titleAlign === 'center' ? 'text-center' : ''}`}>
            {title && (
              <div className="relative inline-block">
                <Heading2 
                  color="primary" 
                  align={titleAlign}
                  animate={true}
                  className="relative z-10"
                >
                  {title}
                </Heading2>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand-primary-500 to-brand-solidarity-500 rounded-full transform-gpu"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                />
              </div>
            )}
            {subtitle && (
              <>
                <Spacer size="md" />
                <motion.p 
                  className="text-lg text-gray-200 font-wanted-sans leading-relaxed max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {subtitle}
                </motion.p>
              </>
            )}
          </div>
        )}
        {children}
      </Container>
    </motion.section>
  );
});

Section.displayName = 'Section';

export default Section;