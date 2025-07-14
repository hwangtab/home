import React from 'react';
import { motion } from 'framer-motion';

/**
 * 카드 로딩 중 스켈레톤 UI
 */
const SkeletonCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full flex flex-col animate-pulse">
      {/* 이미지 스켈레톤 */}
      <div className="relative w-full aspect-square bg-gray-700">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700" />
        
        {/* 로딩 애니메이션 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
        </div>
      </div>

      {/* 콘텐츠 스켈레톤 */}
      <div className="p-4 flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-16 h-6 bg-gray-700 rounded-full" />
          <div className="w-12 h-4 bg-gray-700 rounded" />
        </div>

        {/* 제목 */}
        <div className="space-y-2 mb-3">
          <div className="w-3/4 h-6 bg-gray-700 rounded" />
          <div className="w-1/2 h-6 bg-gray-700 rounded" />
        </div>

        {/* 설명 */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="w-full h-4 bg-gray-700 rounded" />
          <div className="w-5/6 h-4 bg-gray-700 rounded" />
          <div className="w-2/3 h-4 bg-gray-700 rounded" />
        </div>

        {/* 태그들 */}
        <div className="flex gap-2 mb-4">
          <div className="w-12 h-6 bg-gray-700 rounded-full" />
          <div className="w-16 h-6 bg-gray-700 rounded-full" />
          <div className="w-14 h-6 bg-gray-700 rounded-full" />
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end">
          <div className="w-20 h-8 bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

/**
 * 애니메이션이 포함된 스켈레톤 카드
 */
const AnimatedSkeletonCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SkeletonCard />
    </motion.div>
  );
};

/**
 * 여러 스켈레톤 카드를 그리드로 렌더링
 */
const SkeletonGrid = ({ count = 6, animated = true }) => {
  const CardComponent = animated ? AnimatedSkeletonCard : SkeletonCard;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <CardComponent key={`skeleton-${index}`} />
      ))}
    </div>
  );
};

export default SkeletonCard;
export { AnimatedSkeletonCard, SkeletonGrid };