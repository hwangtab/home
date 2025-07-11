import React, { memo, forwardRef } from 'react';
import { motion } from 'framer-motion';

// 컨테이너 컴포넌트
export const Container = memo(forwardRef(({
  size = 'default',
  padding = 'default',
  className = '',
  children,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4',
    default: 'px-4 md:px-6 lg:px-8',
    lg: 'px-6 md:px-8 lg:px-12'
  };

  const classes = [
    'mx-auto',
    sizeClasses[size] || sizeClasses.default,
    paddingClasses[padding] || paddingClasses.default,
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
}));

// 그리드 시스템
export const Grid = memo(forwardRef(({
  cols = 1,
  gap = 'default',
  responsive = true,
  className = '',
  children,
  ...props
}, ref) => {
  const getColsClass = () => {
    if (typeof cols === 'object') {
      const { sm = 1, md = 2, lg = 3, xl = 4 } = cols;
      return `grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl}`;
    }
    
    if (responsive) {
      const responsiveCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
      };
      return responsiveCols[cols] || `grid-cols-${cols}`;
    }
    
    return `grid-cols-${cols}`;
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    default: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const classes = [
    'grid',
    getColsClass(),
    gapClasses[gap] || gapClasses.default,
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
}));

// 플렉스 컴포넌트들
export const Flex = memo(forwardRef(({
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  gap = 'default',
  className = '',
  children,
  ...props
}, ref) => {
  const directionClasses = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    col: 'flex-col',
    'col-reverse': 'flex-col-reverse'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    default: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const classes = [
    'flex',
    directionClasses[direction] || directionClasses.row,
    alignClasses[align] || alignClasses.stretch,
    justifyClasses[justify] || justifyClasses.start,
    wrap ? 'flex-wrap' : '',
    gapClasses[gap] || gapClasses.default,
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
}));

// 스택 컴포넌트 (수직 배열)
export const Stack = memo(forwardRef(({
  spacing = 'default',
  align = 'stretch',
  className = '',
  children,
  ...props
}, ref) => {
  const spacingClasses = {
    none: 'space-y-0',
    sm: 'space-y-2',
    default: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const classes = [
    'flex flex-col',
    spacingClasses[spacing] || spacingClasses.default,
    alignClasses[align] || alignClasses.stretch,
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
}));

// 구분선 컴포넌트
export const Divider = memo(forwardRef(({
  orientation = 'horizontal',
  variant = 'default',
  spacing = 'default',
  className = '',
  children,
  ...props
}, ref) => {
  const variantClasses = {
    default: 'border-gray-600',
    accent: 'border-blue-400',
    muted: 'border-gray-700'
  };

  const spacingClasses = {
    none: '',
    sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    default: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    lg: orientation === 'horizontal' ? 'my-6' : 'mx-6',
    xl: orientation === 'horizontal' ? 'my-8' : 'mx-8'
  };

  const orientationClasses = orientation === 'horizontal' 
    ? 'border-t w-full' 
    : 'border-l h-full';

  if (children) {
    return (
      <div
        ref={ref}
        className={`relative flex items-center ${spacingClasses[spacing]} ${className}`}
        {...props}
      >
        <div className={`flex-grow ${orientationClasses} ${variantClasses[variant]}`} />
        <span className="mx-4 text-gray-400 text-sm font-wanted-sans">
          {children}
        </span>
        <div className={`flex-grow ${orientationClasses} ${variantClasses[variant]}`} />
      </div>
    );
  }

  const classes = [
    orientationClasses,
    variantClasses[variant] || variantClasses.default,
    spacingClasses[spacing] || spacingClasses.default,
    className
  ].filter(Boolean).join(' ');

  return <div ref={ref} className={classes} {...props} />;
}));

// 스페이서 컴포넌트
export const Spacer = memo(({
  size = 'default',
  direction = 'vertical'
}) => {
  const sizeClasses = {
    xs: direction === 'vertical' ? 'h-1' : 'w-1',
    sm: direction === 'vertical' ? 'h-2' : 'w-2',
    default: direction === 'vertical' ? 'h-4' : 'w-4',
    lg: direction === 'vertical' ? 'h-6' : 'w-6',
    xl: direction === 'vertical' ? 'h-8' : 'w-8',
    '2xl': direction === 'vertical' ? 'h-12' : 'w-12',
    '3xl': direction === 'vertical' ? 'h-16' : 'w-16'
  };

  return <div className={sizeClasses[size] || sizeClasses.default} />;
});

// 카드 컴포넌트
export const Card = memo(forwardRef(({
  variant = 'default',
  padding = 'default',
  shadow = 'default',
  border = false,
  hover = false,
  className = '',
  children,
  ...props
}, ref) => {
  const variantClasses = {
    default: 'bg-gray-800',
    accent: 'bg-gray-750',
    transparent: 'bg-transparent'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl'
  };

  const classes = [
    'rounded-lg',
    variantClasses[variant] || variantClasses.default,
    paddingClasses[padding] || paddingClasses.default,
    shadowClasses[shadow] || shadowClasses.default,
    border ? 'border border-gray-600' : '',
    hover ? 'transition-all duration-200 hover:shadow-xl hover:scale-[1.01]' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
}));

// 섹션 컴포넌트
export const Section = memo(forwardRef(({
  spacing = 'default',
  background = 'transparent',
  className = '',
  children,
  ...props
}, ref) => {
  const spacingClasses = {
    none: 'py-0',
    sm: 'py-8',
    default: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
    '2xl': 'py-24'
  };

  const backgroundClasses = {
    transparent: '',
    default: 'bg-gray-900',
    accent: 'bg-gray-800',
    muted: 'bg-gray-850'
  };

  const classes = [
    spacingClasses[spacing] || spacingClasses.default,
    backgroundClasses[background] || backgroundClasses.transparent,
    className
  ].filter(Boolean).join(' ');

  return (
    <section ref={ref} className={classes} {...props}>
      {children}
    </section>
  );
}));

// 애니메이션 래퍼
export const AnimatedBox = memo(forwardRef(({
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  className = '',
  children,
  ...props
}, ref) => {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 }
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 }
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 }
    },
    fadeInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    }
  };

  const selectedAnimation = animations[animation] || animations.fadeInUp;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.25, 0, 1]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}));

Container.displayName = 'Container';
Grid.displayName = 'Grid';
Flex.displayName = 'Flex';
Stack.displayName = 'Stack';
Divider.displayName = 'Divider';
Spacer.displayName = 'Spacer';
Card.displayName = 'Card';
Section.displayName = 'Section';
AnimatedBox.displayName = 'AnimatedBox';