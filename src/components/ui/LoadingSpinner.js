import React, { memo } from 'react';
import { motion } from 'framer-motion';

// 기본 스피너 컴포넌트
const LoadingSpinner = memo(({ 
  size = 'medium', 
  color = 'gray', 
  message = '',
  className = '',
  variant = 'default'
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  const colorClasses = {
    gray: 'border-gray-300',
    blue: 'border-blue-500',
    white: 'border-white',
    primary: 'border-gray-300'
  };

  const spinnerVariants = {
    default: {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderTopColor: 'transparent'
    },
    dots: {},
    pulse: {}
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${sizeClasses[size] || sizeClasses.medium} bg-gray-400 rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
        {message && (
          <span className="ml-3 text-gray-400 font-wanted-sans text-sm">
            {message}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <motion.div
          className={`${sizeClasses[size] || sizeClasses.medium} bg-gray-400 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
        />
        {message && (
          <span className="mt-3 text-gray-400 font-wanted-sans text-sm">
            {message}
          </span>
        )}
      </div>
    );
  }

  // 기본 스피너
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size] || sizeClasses.medium} ${colorClasses[color] || colorClasses.gray} rounded-full animate-spin`}
        style={spinnerVariants.default}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {message && (
        <span className="mt-3 text-gray-400 font-wanted-sans text-sm">
          {message}
        </span>
      )}
    </div>
  );
});

// 페이지 로딩 스피너
export const PageLoadingSpinner = memo(({ message = '페이지를 불러오는 중...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 transform-gpu">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.25, 0, 1] }}
      className="animate-optimized"
    >
      <LoadingSpinner 
        size="large" 
        color="primary" 
        message={message}
        variant="pulse"
      />
    </motion.div>
  </div>
));

// 인라인 로딩 스피너
export const InlineLoadingSpinner = memo(({ message = '로딩 중...', size = 'small' }) => (
  <div className="flex items-center justify-center py-8">
    <LoadingSpinner 
      size={size} 
      color="gray" 
      message={message}
      variant="dots"
    />
  </div>
));

// 버튼 로딩 스피너
export const ButtonLoadingSpinner = memo(({ size = 'small' }) => (
  <LoadingSpinner 
    size={size} 
    color="white" 
    variant="default"
    className="mr-2"
  />
));

// 오버레이 로딩 스피너
export const OverlayLoadingSpinner = memo(({ 
  message = '처리 중...', 
  isVisible = false,
  backdrop = true 
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        backdrop ? 'bg-black bg-opacity-50' : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-gray-800 p-8 rounded-lg shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <LoadingSpinner 
          size="large" 
          color="primary" 
          message={message}
          variant="default"
        />
      </motion.div>
    </motion.div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
PageLoadingSpinner.displayName = 'PageLoadingSpinner';
InlineLoadingSpinner.displayName = 'InlineLoadingSpinner';
ButtonLoadingSpinner.displayName = 'ButtonLoadingSpinner';
OverlayLoadingSpinner.displayName = 'OverlayLoadingSpinner';

export default LoadingSpinner;