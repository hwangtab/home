import React, { memo } from 'react';
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
    <section 
      className={`${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`}
    >
      <Container size={containerSize}>
        {(title || subtitle) && (
          <div className={`mb-12 ${titleAlign === 'center' ? 'text-center' : ''}`}>
            {title && (
              <div className="relative inline-block">
                <Heading2 
                  color="primary" 
                  align={titleAlign}
                  className="relative z-10"
                >
                  {title}
                </Heading2>
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-brand-primary-500 to-brand-solidarity-500 rounded-full" />
              </div>
            )}
            {subtitle && (
              <>
                <Spacer size="md" />
                <p className="text-lg text-gray-200 font-wanted-sans leading-relaxed max-w-2xl mx-auto">
                  {subtitle}
                </p>
              </>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
});

Section.displayName = 'Section';

export default Section;