import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridSkeleton } from './ui/Skeleton';
import { StaggerContainer, StaggerItem } from './ui/AnimatedComponents';
import type { Work, WorkCategory } from '../types/data.types';
import { useLanguage } from '../i18n';

interface WorksGridProps {
  filteredWorks: Work[];
  activeFilter: WorkCategory | 'all';
  renderWork: (work: Work, index: number) => React.ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

const INITIAL_VISIBLE_COUNT = 6;

const WorksGrid: React.FC<WorksGridProps> = memo(
  ({
    filteredWorks,
    activeFilter,
    renderWork,
    emptyMessage,
    isLoading = false,
    skeletonCount = INITIAL_VISIBLE_COUNT,
  }) => {
    const { t } = useLanguage();

    if (isLoading) {
      return <GridSkeleton items={skeletonCount} columns={3} cardProps={{ showImage: true }} />;
    }

    if (filteredWorks.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="font-wanted-sans text-gray-400">
            {emptyMessage ||
              (activeFilter === 'all'
                ? t('works.noWorks')
                : t('works.noWorksByCategory').replace('{category}', activeFilter))}
          </p>
        </div>
      );
    }

  return (
      <AnimatePresence mode="wait">
        <StaggerContainer
          key={activeFilter}
          className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.03}
        >
          {filteredWorks.map((work, index) => (
            <StaggerItem key={work.id || `${work.type}-${index}`} direction="up">
              {renderWork(work, index)}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </AnimatePresence>
    );
  }
);

WorksGrid.displayName = 'WorksGrid';

export default WorksGrid;
