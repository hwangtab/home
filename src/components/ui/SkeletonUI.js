import React, { memo } from 'react';
import { motion } from 'framer-motion';

// 기본 스켈레톤 컴포넌트
const Skeleton = memo(({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  variant = 'default',
  animate = true
}) => {
  const baseClasses = 'bg-gray-700 rounded';
  const animationClasses = animate ? 'animate-pulse' : '';
  
  const variants = {
    default: 'bg-gray-700',
    lighter: 'bg-gray-600',
    darker: 'bg-gray-800',
    gradient: 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'
  };

  const shimmerAnimation = {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear'
    }
  };

  if (variant === 'gradient' && animate) {
    return (
      <motion.div
        className={`${baseClasses} ${width} ${height} ${className} bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]`}
        animate={shimmerAnimation}
      />
    );
  }

  return (
    <div
      className={`${baseClasses} ${variants[variant] || variants.default} ${width} ${height} ${animationClasses} ${className}`}
    />
  );
});

// 텍스트 스켈레톤
export const TextSkeleton = memo(({ 
  lines = 1, 
  lineHeight = 'h-4',
  spacing = 'space-y-2',
  lastLineWidth = 'w-3/4',
  className = ''
}) => (
  <div className={`${spacing} ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        width={index === lines - 1 && lines > 1 ? lastLineWidth : 'w-full'}
        height={lineHeight}
        variant="gradient"
      />
    ))}
  </div>
));

// 카드 스켈레톤
export const CardSkeleton = memo(({ 
  showImage = true, 
  imageHeight = 'h-48',
  className = ''
}) => (
  <div className={`bg-gray-800 p-6 rounded-lg shadow-lg ${className}`}>
    {showImage && (
      <Skeleton 
        width="w-full" 
        height={imageHeight} 
        className="mb-4 rounded" 
        variant="gradient"
      />
    )}
    
    {/* 제목 */}
    <Skeleton 
      width="w-3/4" 
      height="h-6" 
      className="mb-3" 
      variant="lighter"
    />
    
    {/* 설명 텍스트 */}
    <TextSkeleton 
      lines={3} 
      lineHeight="h-3"
      lastLineWidth="w-2/3"
      className="mb-4"
    />
    
    {/* 태그들 */}
    <div className="flex gap-2 mb-4">
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          width="w-16"
          height="h-6"
          className="rounded-full"
          variant="darker"
        />
      ))}
    </div>
    
    {/* 버튼들 */}
    <div className="flex gap-2">
      {[1, 2].map((i) => (
        <Skeleton
          key={i}
          width="w-20"
          height="h-8"
          className="rounded-full"
          variant="gradient"
        />
      ))}
    </div>
  </div>
));

// 그리드 스켈레톤
export const GridSkeleton = memo(({ 
  count = 6, 
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  gap = 'gap-6',
  cardProps = {},
  className = ''
}) => (
  <div className={`grid ${columns} ${gap} ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <CardSkeleton key={index} {...cardProps} />
    ))}
  </div>
));

// 리스트 스켈레톤
export const ListSkeleton = memo(({ 
  count = 5, 
  showAvatar = false,
  spacing = 'space-y-4',
  className = ''
}) => (
  <div className={`${spacing} ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
        {showAvatar && (
          <Skeleton 
            width="w-12" 
            height="h-12" 
            className="rounded-full flex-shrink-0" 
            variant="gradient"
          />
        )}
        <div className="flex-1">
          <Skeleton 
            width="w-1/2" 
            height="h-5" 
            className="mb-2" 
            variant="lighter"
          />
          <TextSkeleton 
            lines={2} 
            lineHeight="h-3"
            lastLineWidth="w-3/4"
          />
        </div>
      </div>
    ))}
  </div>
));

// 프로필 스켈레톤
export const ProfileSkeleton = memo(({ 
  layout = 'horizontal',
  className = ''
}) => (
  <div className={`bg-gray-800 p-8 rounded-lg shadow-lg ${className}`}>
    <div className={`flex ${layout === 'horizontal' ? 'flex-col md:flex-row' : 'flex-col'} gap-8`}>
      {/* 이미지 */}
      <div className={layout === 'horizontal' ? 'w-full md:w-1/3' : 'w-full'}>
        <Skeleton 
          width="w-full" 
          height="h-64" 
          className="rounded-lg" 
          variant="gradient"
        />
      </div>
      
      {/* 텍스트 */}
      <div className={layout === 'horizontal' ? 'w-full md:w-2/3' : 'w-full'}>
        <TextSkeleton 
          lines={6} 
          lineHeight="h-4"
          spacing="space-y-4"
          lastLineWidth="w-5/6"
        />
      </div>
    </div>
  </div>
));

// 타임라인 스켈레톤
export const TimelineSkeleton = memo(({ 
  count = 3,
  className = ''
}) => (
  <div className={`space-y-8 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="relative">
        <div className="flex items-center mb-4">
          <Skeleton 
            width="w-4" 
            height="h-4" 
            className="rounded-full mr-4 flex-shrink-0" 
            variant="darker"
          />
          <Skeleton 
            width="w-20" 
            height="h-6" 
            variant="lighter"
          />
        </div>
        <div className="ml-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-700 p-4 rounded-lg">
              <Skeleton 
                width="w-2/3" 
                height="h-5" 
                className="mb-2" 
                variant="gradient"
              />
              <TextSkeleton 
                lines={2} 
                lineHeight="h-3"
                lastLineWidth="w-4/5"
              />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
));

// 네비게이션 스켈레톤
export const NavigationSkeleton = memo(({ className = '' }) => (
  <div className={`flex items-center justify-between p-4 bg-gray-800 ${className}`}>
    {/* 로고 */}
    <Skeleton 
      width="w-32" 
      height="h-8" 
      variant="gradient"
    />
    
    {/* 메뉴 아이템들 */}
    <div className="flex space-x-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton
          key={i}
          width="w-16"
          height="h-6"
          variant="lighter"
        />
      ))}
    </div>
  </div>
));

Skeleton.displayName = 'Skeleton';
TextSkeleton.displayName = 'TextSkeleton';
CardSkeleton.displayName = 'CardSkeleton';
GridSkeleton.displayName = 'GridSkeleton';
ListSkeleton.displayName = 'ListSkeleton';
ProfileSkeleton.displayName = 'ProfileSkeleton';
TimelineSkeleton.displayName = 'TimelineSkeleton';
NavigationSkeleton.displayName = 'NavigationSkeleton';

export default Skeleton;