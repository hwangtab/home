import React, { memo } from 'react';
import { Play } from 'lucide-react';
import WorksFilter from './WorksFilter';
import SearchBar from './SearchBar';
import Button from './ui/Button';
import { Flex, Stack } from './ui/Layout';

const WorksHeader = memo(({ 
  activeFilter, 
  setActiveFilter, 
  siteData, 
  handleSearchResult,
  musicWorks,
  openMusicPlayer 
}) => {
  return (
    <Stack spacing="lg" className="mb-8">
      <Flex 
        direction="col" 
        gap="lg" 
        className="lg:flex-row lg:items-center lg:justify-between"
      >
        <WorksFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        
        <Flex align="center" gap="default">
          <SearchBar 
            data={siteData} 
            onResultClick={handleSearchResult}
            placeholder="작품 검색..."
          />
          
          {activeFilter === 'music' && musicWorks.length > 0 && (
            <Button
              onClick={() => openMusicPlayer(musicWorks)}
              variant="primary"
              size="md"
              leftIcon={<Play size={16} />}
              animation="bounce"
            >
              전체 재생
            </Button>
          )}
        </Flex>
      </Flex>
    </Stack>
  );
});

WorksHeader.displayName = 'WorksHeader';

export default WorksHeader;