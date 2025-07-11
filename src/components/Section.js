import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Heading2 } from './ui/Typography';
import { Container, Spacer } from './ui/Layout';

const Section = memo(({ 
  title, 
  subtitle,
  children, 
  className = "",
  containerSize = 'default',
  spacing = 'default',
  background = 'transparent',
  titleAlign = 'left'
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

  return (
    <motion.section 
      className={`${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
    >
      <Container size={containerSize}>
        {(title || subtitle) && (
          <div className={`mb-8 ${titleAlign === 'center' ? 'text-center' : ''}`}>
            {title && (
              <Heading2 
                color="primary" 
                align={titleAlign}
                animate={true}
              >
                {title}
              </Heading2>
            )}
            {subtitle && (
              <>
                <Spacer size="sm" />
                <motion.p 
                  className="text-lg text-gray-300 font-wanted-sans"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
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