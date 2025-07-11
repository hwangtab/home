import React, { memo, forwardRef } from 'react';
import { motion } from 'framer-motion';

// 타이포그래피 스케일 정의
const TYPOGRAPHY_SCALES = {
  // 헤딩
  h1: {
    fontSize: 'text-4xl md:text-5xl lg:text-6xl',
    fontWeight: 'font-bold',
    lineHeight: 'leading-tight',
    letterSpacing: 'tracking-tight',
    fontFamily: 'font-bombaram'
  },
  h2: {
    fontSize: 'text-3xl md:text-4xl lg:text-5xl',
    fontWeight: 'font-bold',
    lineHeight: 'leading-tight',
    letterSpacing: 'tracking-tight',
    fontFamily: 'font-santokki'
  },
  h3: {
    fontSize: 'text-2xl md:text-3xl lg:text-4xl',
    fontWeight: 'font-bold',
    lineHeight: 'leading-snug',
    letterSpacing: 'tracking-normal',
    fontFamily: 'font-santokki'
  },
  h4: {
    fontSize: 'text-xl md:text-2xl lg:text-3xl',
    fontWeight: 'font-bold',
    lineHeight: 'leading-snug',
    letterSpacing: 'tracking-normal',
    fontFamily: 'font-santokki'
  },
  h5: {
    fontSize: 'text-lg md:text-xl lg:text-2xl',
    fontWeight: 'font-semibold',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-normal',
    fontFamily: 'font-wanted-sans'
  },
  h6: {
    fontSize: 'text-base md:text-lg lg:text-xl',
    fontWeight: 'font-semibold',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-normal',
    fontFamily: 'font-wanted-sans'
  },
  
  // 본문
  body1: {
    fontSize: 'text-base md:text-lg',
    fontWeight: 'font-normal',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-normal',
    fontFamily: 'font-wanted-sans'
  },
  body2: {
    fontSize: 'text-sm md:text-base',
    fontWeight: 'font-normal',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-normal',
    fontFamily: 'font-wanted-sans'
  },
  
  // 캡션
  caption: {
    fontSize: 'text-xs md:text-sm',
    fontWeight: 'font-normal',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-wide',
    fontFamily: 'font-wanted-sans'
  },
  
  // 오버라인
  overline: {
    fontSize: 'text-xs',
    fontWeight: 'font-medium',
    lineHeight: 'leading-none',
    letterSpacing: 'tracking-widest',
    fontFamily: 'font-wanted-sans',
    textTransform: 'uppercase'
  },
  
  // 버튼 텍스트
  button: {
    fontSize: 'text-sm md:text-base',
    fontWeight: 'font-medium',
    lineHeight: 'leading-none',
    letterSpacing: 'tracking-wide',
    fontFamily: 'font-wanted-sans'
  }
};

// 색상 변형
const COLOR_VARIANTS = {
  primary: 'text-gray-100',
  secondary: 'text-gray-300',
  muted: 'text-gray-400',
  accent: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
  white: 'text-white',
  disabled: 'text-gray-500'
};

// 정렬 옵션
const ALIGN_VARIANTS = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify'
};

// 메인 타이포그래피 컴포넌트
const Typography = memo(forwardRef(({
  variant = 'body1',
  color = 'primary',
  align = 'left',
  component: Component = 'p',
  className = '',
  children,
  animate = false,
  ...props
}, ref) => {
  const scale = TYPOGRAPHY_SCALES[variant] || TYPOGRAPHY_SCALES.body1;
  const colorClass = COLOR_VARIANTS[color] || COLOR_VARIANTS.primary;
  const alignClass = ALIGN_VARIANTS[align] || ALIGN_VARIANTS.left;
  
  const classes = [
    scale.fontSize,
    scale.fontWeight,
    scale.lineHeight,
    scale.letterSpacing,
    scale.fontFamily,
    scale.textTransform,
    colorClass,
    alignClass,
    className
  ].filter(Boolean).join(' ');

  if (animate) {
    return (
      <motion.div
        ref={ref}
        className={classes}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
        {...props}
      >
        <Component className="w-full">
          {children}
        </Component>
      </motion.div>
    );
  }

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  );
}));

// 헤딩 컴포넌트들
export const Heading1 = memo(forwardRef((props, ref) => (
  <Typography ref={ref} variant="h1" component="h1" {...props} />
)));

export const Heading2 = memo(forwardRef((props, ref) => (
  <Typography ref={ref} variant="h2" component="h2" {...props} />
)));

export const Heading3 = memo(forwardRef((props, ref) => (
  <Typography ref={ref} variant="h3" component="h3" {...props} />
)));

export const Heading4 = memo(forwardRef((props, ref) => (
  <Typography ref={ref} variant="h4" component="h4" {...props} />
)));

export const Heading5 = memo(forwardRef((props, ref) => (
  <Typography ref={ref} variant="h5" component="h5" {...props} />
)));

export const Heading6 = memo(forwardRef((props, ref) => (
  <Typography ref={ref} variant="h6" component="h6" {...props} />
)));

// 본문 컴포넌트들
export const BodyText = memo(forwardRef((props, ref) => (
  <Typography ref={ref} variant="body1" component="p" {...props} />
)));

export const SmallText = memo(forwardRef((props, ref) => (
  <Typography ref={ref} variant="body2" component="p" {...props} />
)));

export const Caption = memo(forwardRef((props, ref) => (
  <Typography ref={ref} variant="caption" component="span" {...props} />
)));

export const Overline = memo(forwardRef((props, ref) => (
  <Typography ref={ref} variant="overline" component="span" {...props} />
)));

// 특수 텍스트 컴포넌트들
export const GradientText = memo(forwardRef(({
  from = 'from-blue-400',
  to = 'to-purple-400',
  className = '',
  children,
  ...props
}, ref) => (
  <span
    ref={ref}
    className={`bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent ${className}`}
    {...props}
  >
    {children}
  </span>
)));

export const HighlightText = memo(forwardRef(({
  highlight = 'bg-yellow-400',
  textColor = 'text-gray-900',
  className = '',
  children,
  ...props
}, ref) => (
  <span
    ref={ref}
    className={`${highlight} ${textColor} px-1 py-0.5 rounded ${className}`}
    {...props}
  >
    {children}
  </span>
)));

// 링크 컴포넌트
export const Link = memo(forwardRef(({
  variant = 'primary',
  underline = 'hover',
  className = '',
  children,
  ...props
}, ref) => {
  const variantClasses = {
    primary: 'text-blue-400 hover:text-blue-300',
    secondary: 'text-gray-300 hover:text-white',
    muted: 'text-gray-400 hover:text-gray-300'
  };

  const underlineClasses = {
    none: '',
    always: 'underline',
    hover: 'hover:underline'
  };

  const classes = [
    variantClasses[variant] || variantClasses.primary,
    underlineClasses[underline] || underlineClasses.hover,
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded',
    className
  ].filter(Boolean).join(' ');

  return (
    <a ref={ref} className={classes} {...props}>
      {children}
    </a>
  );
}));

// 코드 텍스트
export const CodeText = memo(forwardRef(({
  inline = true,
  className = '',
  children,
  ...props
}, ref) => {
  const baseClasses = 'font-mono bg-gray-800 text-gray-100 rounded';
  const classes = inline 
    ? `${baseClasses} px-1.5 py-0.5 text-sm ${className}`
    : `${baseClasses} p-4 text-sm block overflow-x-auto ${className}`;

  const Component = inline ? 'code' : 'pre';

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  );
}));

// 인용문
export const Blockquote = memo(forwardRef(({
  variant = 'default',
  className = '',
  children,
  author,
  ...props
}, ref) => {
  const variantClasses = {
    default: 'border-l-4 border-gray-600 pl-6 italic',
    accent: 'border-l-4 border-blue-400 pl-6 italic',
    highlight: 'bg-gray-800 border-l-4 border-yellow-400 p-6 rounded-r-lg'
  };

  return (
    <blockquote
      ref={ref}
      className={`${variantClasses[variant]} text-gray-300 ${className}`}
      {...props}
    >
      <Typography variant="body1" color="secondary">
        {children}
      </Typography>
      {author && (
        <footer className="mt-2">
          <Typography variant="caption" color="muted">
            — {author}
          </Typography>
        </footer>
      )}
    </blockquote>
  );
}));

// 리스트 컴포넌트
export const List = memo(forwardRef(({
  ordered = false,
  variant = 'default',
  className = '',
  children,
  ...props
}, ref) => {
  const Component = ordered ? 'ol' : 'ul';
  
  const variantClasses = {
    default: ordered ? 'list-decimal' : 'list-disc',
    none: 'list-none',
    check: 'list-none'
  };

  return (
    <Component
      ref={ref}
      className={`${variantClasses[variant]} pl-6 space-y-2 text-gray-300 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}));

export const ListItem = memo(forwardRef(({
  className = '',
  children,
  ...props
}, ref) => (
  <li ref={ref} className={`font-wanted-sans ${className}`} {...props}>
    {children}
  </li>
)));

Typography.displayName = 'Typography';
Heading1.displayName = 'Heading1';
Heading2.displayName = 'Heading2';
Heading3.displayName = 'Heading3';
Heading4.displayName = 'Heading4';
Heading5.displayName = 'Heading5';
Heading6.displayName = 'Heading6';
BodyText.displayName = 'BodyText';
SmallText.displayName = 'SmallText';
Caption.displayName = 'Caption';
Overline.displayName = 'Overline';
GradientText.displayName = 'GradientText';
HighlightText.displayName = 'HighlightText';
Link.displayName = 'Link';
CodeText.displayName = 'CodeText';
Blockquote.displayName = 'Blockquote';
List.displayName = 'List';
ListItem.displayName = 'ListItem';

export default Typography;