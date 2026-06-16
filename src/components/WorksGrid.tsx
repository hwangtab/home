import React, { memo } from 'react';
import { StaggerContainer, StaggerItem } from './ui/AnimatedComponents';
import type { Work, WorkCategory } from '../types/data.types';
import { useLanguage } from '../i18n';

interface WorksGridProps {
  filteredWorks: Work[];
  activeFilter: WorkCategory | 'all';
  renderWork: (work: Work, index: number) => React.ReactNode;
  emptyMessage?: string;
}

const WorksGrid: React.FC<WorksGridProps> = memo(
  ({
    filteredWorks,
    activeFilter,
    renderWork,
    emptyMessage,
  }) => {
      const { t } = useLanguage();
      const categoryLabel = activeFilter === 'all' ? '' : t(`works.${activeFilter}`);

    if (filteredWorks.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="font-wanted-sans text-gray-400">
            {emptyMessage ||
              (activeFilter === 'all'
                ? t('works.noWorks')
                : t('works.noWorksByCategory').replace('{category}', categoryLabel))}
          </p>
        </div>
      );
    }

  return (
      <StaggerContainer
        className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3"
        staggerDelay={0.03}
      >
        {filteredWorks.map((work, index) => (
          <StaggerItem key={work.id || `${work.type}-${index}`} direction="up">
            {renderWork(work, index)}
          </StaggerItem>
        ))}
      </StaggerContainer>
    );
  }
);

WorksGrid.displayName = 'WorksGrid';

export default WorksGrid;
