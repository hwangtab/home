import React, { memo } from 'react';
import { Music, Video, FileText, Grid, Flame, Mic } from 'lucide-react';
import { ToggleButton, ButtonGroup } from './ui/Button';
import { Flex } from './ui/Layout';
import type { WorkCategory } from '../types/data.types';
import { useLanguage } from '../i18n';

interface WorksFilterProps {
  activeFilter: WorkCategory | 'all';
  setActiveFilter: (filter: WorkCategory | 'all') => void;
}

const WorksFilter: React.FC<WorksFilterProps> = memo(({ activeFilter, setActiveFilter }) => {
  const { t } = useLanguage();
  const filters: Array<{ id: WorkCategory | 'all'; name: string; icon: React.ComponentType<{ size?: number }> }> = [
    { id: 'all', name: t('works.all'), icon: Grid },
    { id: 'music', name: t('works.music'), icon: Music },
    { id: 'visual', name: t('works.visual'), icon: Video },
    { id: 'writing', name: t('works.writing'), icon: FileText },
    { id: 'performance', name: t('works.performance'), icon: Mic },
    { id: 'struggle', name: t('works.struggle'), icon: Flame }
  ];

  return (
    <Flex wrap={true} gap="sm">
      <ButtonGroup spacing="sm" className="flex-wrap">
        {filters.map((filter) => {
          const Icon = filter.icon;

          return (
            <ToggleButton
              key={filter.id}
              pressed={activeFilter === filter.id}
              onPressedChange={() => setActiveFilter(filter.id)}
              variant="outline"
              size="md"
              leftIcon={<Icon size={20} />}
              animation="bounce"
            >
              {filter.name}
            </ToggleButton>
          );
        })}
      </ButtonGroup>
    </Flex>
  );
});

WorksFilter.displayName = 'WorksFilter';

export default WorksFilter;
