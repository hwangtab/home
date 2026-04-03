import React, { memo } from 'react';
import type { FuseResult } from 'fuse.js';
import { Play } from 'lucide-react';
import WorksFilter from './WorksFilter';
import SearchBar, { type SearchResultItem, type SearchSource } from './SearchBar';
import Button from './ui/Button';
import { Flex, Stack } from './ui/Layout';
import type { MusicWork, WorkCategory } from '../types/data.types';
import { useLanguage } from '../i18n';

interface WorksHeaderProps {
  activeFilter: WorkCategory | 'all';
  setActiveFilter: (filter: WorkCategory | 'all') => void;
  siteData: SearchSource;
  handleSearchResult: (result: FuseResult<SearchResultItem>) => void;
  musicWorks: MusicWork[];
  openMusicPlayer: (tracks: MusicWork[]) => void;
}

const WorksHeader: React.FC<WorksHeaderProps> = memo(
  ({ activeFilter, setActiveFilter, siteData, handleSearchResult, musicWorks, openMusicPlayer }) => {
    const { t } = useLanguage();

    return (
      <Stack spacing="lg" className="mb-8">
        <Flex direction="col" gap="lg" className="lg:flex-row lg:items-center lg:justify-between">
          <WorksFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

          <Flex align="center" gap="default">
            <SearchBar
              data={siteData}
              onResultClick={handleSearchResult}
              placeholder={t('common.searchPlaceholder')}
            />

            {activeFilter === 'music' && musicWorks.length > 0 ? (
              <Button
                onClick={() => openMusicPlayer(musicWorks)}
                variant="primary"
                size="md"
                leftIcon={<Play size={16} />}
                animation="bounce"
              >
                {t('works.playAll')}
              </Button>
            ) : null}
          </Flex>
        </Flex>
      </Stack>
    );
  }
);

WorksHeader.displayName = 'WorksHeader';

export default WorksHeader;
