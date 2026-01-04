import React, { memo } from 'react';
import { Music, Video, FileText, Grid } from 'lucide-react';
import { ToggleButton, ButtonGroup } from './ui/Button';
import { Flex } from './ui/Layout';

const WorksFilter = memo(({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: 'all', name: '전체', icon: Grid },
    { id: 'music', name: '음악', icon: Music },
    { id: 'visual', name: '영상', icon: Video },
    { id: 'writing', name: '글쓰기', icon: FileText }
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