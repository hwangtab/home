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
    skeletonCount = INITIAL_VISIBLE_COUNT
  }) => {
    const { t } = useLanguage();
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
      setVisibleCount(INITIAL_VISIBLE_COUNT);
      setShowAll(true);
      setVisibleCount(filteredWorks.length);
    }, [activeFilter, filteredWorks.length]);

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

    const worksToShow = showAll ? filteredWorks : filteredWorks.slice(0, visibleCount);

    return (
      <AnimatePresence mode="wait">
        <StaggerContainer
          key={activeFilter}
          className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.03}
        >
          {worksToShow.map((work, index) => (
            <StaggerItem key={work.id || `${work.type}-${index}`} direction="up">
              {renderWork(work, index)}
            </StaggerItem>
          ))}
        </StaggerContainer>

        {!showAll && filteredWorks.length > visibleCount ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 font-wanted-sans text-gray-400">
              <div className="h-2 w-2 animate-pulse rounded-full bg-brand-primary-400" />
              <span>{t('works.loadingMore')}</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }
);

WorksGrid.displayName = 'WorksGrid';

export default WorksGrid;
