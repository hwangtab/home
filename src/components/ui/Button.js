import React, { memo, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ButtonLoadingSpinner } from './LoadingSpinner';

// 버튼 변형 스타일 정의
const BUTTON_VARIANTS = {
  primary: {
    base: 'bg-blue-600 hover:bg-blue-700 text-white',
    disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed',
    loading: 'bg-blue-600 text-white cursor-wait'
  },
  secondary: {
    base: 'bg-gray-600 hover:bg-gray-700 text-white',
    disabled: 'bg-gray-700 text-gray-400 cursor-not-allowed',
    loading: 'bg-gray-600 text-white cursor-wait'
  },
  accent: {
    base: 'bg-purple-600 hover:bg-purple-700 text-white',
    disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed',
    loading: 'bg-purple-600 text-white cursor-wait'
  },
  outline: {
    base: 'border-2 border-gray-400 hover:border-gray-300 bg-transparent text-gray-300 hover:text-white hover:bg-gray-800',
    disabled: 'border-gray-600 text-gray-500 cursor-not-allowed',
    loading: 'border-gray-400 text-gray-300 cursor-wait'
  },
  ghost: {
    base: 'bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white',
    disabled: 'text-gray-500 cursor-not-allowed',
    loading: 'text-gray-300 cursor-wait'
  },
  danger: {
    base: 'bg-red-600 hover:bg-red-700 text-white',
    disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed',
    loading: 'bg-red-600 text-white cursor-wait'
  },
  success: {
    base: 'bg-green-600 hover:bg-green-700 text-white',
    disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed',
    loading: 'bg-green-600 text-white cursor-wait'
  }
};

// 크기 스타일 정의
const BUTTON_SIZES = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

// 애니메이션 변형
const buttonAnimations = {
  default: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.1 }
  },
  bounce: {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95, y: 0 },
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  slide: {
    whileHover: { x: 4 },
    whileTap: { x: 0 },
    transition: { duration: 0.2 }
  },
  pulse: {
    whileHover: { scale: [1, 1.05, 1] },
    transition: { duration: 0.3, repeat: Infinity }
  }
};

// 메인 버튼 컴포넌트
const Button = memo(forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  animation = 'default',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  loadingText = '',
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const isDisabled = disabled || loading;
  
  // 스타일 클래스 계산
  const variantStyles = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  const sizeStyles = BUTTON_SIZES[size] || BUTTON_SIZES.md;
  
  const getStateStyles = () => {
    if (loading) return variantStyles.loading;
    if (disabled) return variantStyles.disabled;
    return variantStyles.base;
  };

  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-wanted-sans font-medium',
    'rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
    'focus:ring-blue-500',
    sizeStyles,
    getStateStyles(),
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  const animationProps = !isDisabled ? buttonAnimations[animation] || buttonAnimations.default : {};

  const handleClick = (e) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={baseClasses}
      onClick={handleClick}
      disabled={isDisabled}
      {...animationProps}
      {...props}
    >
      {/* 왼쪽 아이콘 */}
      {leftIcon && !loading && (
        <span className="mr-2">
          {leftIcon}
        </span>
      )}
      
      {/* 로딩 스피너 */}
      {loading && (
        <ButtonLoadingSpinner size={size === 'xs' || size === 'sm' ? 'small' : 'medium'} />
      )}
      
      {/* 텍스트 컨텐츠 */}
      <span>
        {loading && loadingText ? loadingText : children}
      </span>
      
      {/* 오른쪽 아이콘 */}
      {rightIcon && !loading && (
        <span className="ml-2">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
}));

// 아이콘 버튼 컴포넌트
export const IconButton = memo(forwardRef(({
  icon,
  variant = 'ghost',
  size = 'md',
  animation = 'default',
  loading = false,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;
  
  const sizeMap = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4'
  };

  const iconSizeMap = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24
  };

  const variantStyles = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.ghost;
  const getStateStyles = () => {
    if (loading) return variantStyles.loading;
    if (disabled) return variantStyles.disabled;
    return variantStyles.base;
  };

  const baseClasses = [
    'inline-flex items-center justify-center',
    'rounded-full',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
    'focus:ring-blue-500',
    sizeMap[size],
    getStateStyles(),
    className
  ].filter(Boolean).join(' ');

  const animationProps = !isDisabled ? buttonAnimations[animation] || buttonAnimations.default : {};

  return (
    <motion.button
      ref={ref}
      className={baseClasses}
      disabled={isDisabled}
      aria-label={ariaLabel}
      {...animationProps}
      {...props}
    >
      {loading ? (
        <ButtonLoadingSpinner size="small" />
      ) : (
        React.cloneElement(icon, { size: iconSizeMap[size] })
      )}
    </motion.button>
  );
}));

// 버튼 그룹 컴포넌트
export const ButtonGroup = memo(({ 
  children, 
  orientation = 'horizontal',
  spacing = 'sm',
  className = ''
}) => {
  const spacingMap = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  const orientationClasses = orientation === 'vertical' ? 'flex-col' : 'flex-row';

  return (
    <div className={`flex ${orientationClasses} ${spacingMap[spacing]} ${className}`}>
      {children}
    </div>
  );
});

// 토글 버튼 컴포넌트
export const ToggleButton = memo(forwardRef(({
  children,
  pressed = false,
  onPressedChange,
  variant = 'outline',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const pressedVariant = pressed ? 'primary' : variant;

  return (
    <Button
      ref={ref}
      variant={pressedVariant}
      size={size}
      className={`${pressed ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''} ${className}`}
      onClick={() => onPressedChange && onPressedChange(!pressed)}
      aria-pressed={pressed}
      {...props}
    >
      {children}
    </Button>
  );
}));

// 플로팅 액션 버튼
export const FloatingActionButton = memo(forwardRef(({
  icon,
  onClick,
  variant = 'primary',
  size = 'lg',
  position = 'bottom-right',
  className = '',
  ...props
}, ref) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  return (
    <motion.div
      className={`${positionClasses[position]} z-50`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <IconButton
        ref={ref}
        icon={icon}
        variant={variant}
        size={size}
        animation="bounce"
        className={`shadow-lg hover:shadow-xl ${className}`}
        onClick={onClick}
        {...props}
      />
    </motion.div>
  );
}));

Button.displayName = 'Button';
IconButton.displayName = 'IconButton';
ButtonGroup.displayName = 'ButtonGroup';
ToggleButton.displayName = 'ToggleButton';
FloatingActionButton.displayName = 'FloatingActionButton';

export default Button;