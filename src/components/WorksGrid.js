import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridSkeleton } from './ui/SkeletonUI';
import { StaggerContainer, StaggerItem } from './ui/AnimatedComponents';

const WorksGrid = memo(({ 
  filteredWorks, 
  activeFilter, 
  renderWork,
  emptyMessage,
  isLoading = false,
  skeletonCount = 6
}) => {
  // 로딩 상태
  if (isLoading) {
    return (
      <GridSkeleton 
        count={skeletonCount}
        columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        cardProps={{ showImage: true }}
      />
    );
  }
  if (filteredWorks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 font-wanted-sans">
          {emptyMessage || (activeFilter === 'all' ? '작품이 없습니다.' : `'${activeFilter}' 카테고리의 작품이 없습니다.`)}
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <StaggerContainer 
        key={activeFilter}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
        staggerDelay={0.08}
      >
        {filteredWorks.map((work, index) => (
          <StaggerItem
            key={work.id || `${work.type}-${index}`}
            direction="up"
          >
            {renderWork(work, index)}
          </StaggerItem>
        ))}
      </StaggerContainer>
    </AnimatePresence>
  );
});

WorksGrid.displayName = 'WorksGrid';

export default WorksGrid;