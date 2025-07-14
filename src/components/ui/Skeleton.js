import React, { memo } from 'react';
import { motion } from 'framer-motion';

// 기본 스켈레톤 컴포넌트
export const Skeleton = memo(({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  variant = 'rounded',
  animate = true
}) => {
  const variants = {
    rounded: 'rounded',
    circle: 'rounded-full',
    rectangular: 'rounded-none'
  };

  const skeletonClasses = [
    'bg-gray-700',
    'animate-pulse',
    variants[variant],
    width,
    height,
    className
  ].filter(Boolean).join(' ');

  if (animate) {
    return (
      <motion.div
        className={skeletonClasses}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  }

  return <div className={skeletonClasses} />;
});

// 카드 스켈레톤
export const CardSkeleton = memo(({ className = '' }) => (
  <div className={`bg-gray-800 rounded-lg p-5 ${className}`}>
    {/* 이미지 영역 */}
    <Skeleton 
      width="w-full" 
      height="h-48" 
      variant="rounded" 
      className="mb-4"
    />
    
    {/* 헤더 영역 */}
    <div className="flex items-center justify-between mb-3">
      <Skeleton width="w-16" height="h-5" variant="rounded" />
      <Skeleton width="w-12" height="h-4" variant="rounded" />
    </div>
    
    {/* 제목 */}
    <Skeleton width="w-3/4" height="h-6" className="mb-3" />
    
    {/* 설명 */}
    <div className="space-y-2 mb-4">
      <Skeleton width="w-full" height="h-4" />
      <Skeleton width="w-5/6" height="h-4" />
    </div>
    
    {/* 태그들 */}
    <div className="flex gap-2 mb-4">
      <Skeleton width="w-12" height="h-6" variant="rounded" />
      <Skeleton width="w-16" height="h-6" variant="rounded" />
      <Skeleton width="w-14" height="h-6" variant="rounded" />
    </div>
    
    {/* 액션 버튼 */}
    <div className="flex justify-end pt-2 border-t border-gray-700/50">
      <Skeleton width="w-20" height="h-8" variant="rounded" />
    </div>
  </div>
));

// 텍스트 스켈레톤
export const TextSkeleton = memo(({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index}
        width={index === lines - 1 ? 'w-3/4' : 'w-full'} 
        height="h-4" 
      />
    ))}
  </div>
));

// 이미지 스켈레톤
export const ImageSkeleton = memo(({ 
  aspectRatio = 'aspect-square',
  className = ''
}) => (
  <div className={`relative ${aspectRatio} ${className}`}>
    <Skeleton 
      width="w-full" 
      height="h-full" 
      variant="rounded"
      className="absolute inset-0"
    />
    
    {/* 중앙 아이콘 */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 bg-gray-600 rounded animate-pulse">
        <svg 
          className="w-full h-full text-gray-500" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
    </div>
  </div>
));

// 버튼 스켈레톤
export const ButtonSkeleton = memo(({ 
  size = 'md',
  variant = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-28'
  };

  return (
    <Skeleton 
      width={sizeClasses[size].split(' ')[1]} 
      height={sizeClasses[size].split(' ')[0]}
      variant="rounded"
      className={className}
    />
  );
});

// 리스트 스켈레톤
export const ListSkeleton = memo(({ 
  items = 5,
  showAvatar = false,
  className = ''
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3">
        {showAvatar && (
          <Skeleton width="w-10" height="h-10" variant="circle" />
        )}
        <div className="flex-1">
          <Skeleton width="w-1/2" height="h-4" className="mb-2" />
          <Skeleton width="w-3/4" height="h-3" />
        </div>
      </div>
    ))}
  </div>
));

// 그리드 스켈레톤
export const GridSkeleton = memo(({ 
  items = 6,
  columns = 3,
  className = ''
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
});

// 페이지 헤더 스켈레톤
export const HeaderSkeleton = memo(({ className = '' }) => (
  <div className={`mb-8 ${className}`}>
    <Skeleton width="w-48" height="h-8" className="mb-4" />
    <Skeleton width="w-96" height="h-5" />
  </div>
));

Skeleton.displayName = 'Skeleton';
CardSkeleton.displayName = 'CardSkeleton';
TextSkeleton.displayName = 'TextSkeleton';
ImageSkeleton.displayName = 'ImageSkeleton';
ButtonSkeleton.displayName = 'ButtonSkeleton';
ListSkeleton.displayName = 'ListSkeleton';
GridSkeleton.displayName = 'GridSkeleton';
HeaderSkeleton.displayName = 'HeaderSkeleton';