// @ts-nocheck
import React, { memo } from 'react';
import { Play } from 'lucide-react';
import WorksFilter from './WorksFilter';
import SearchBar from './SearchBar';
import Button from './ui/Button';
import { Flex, Stack } from './ui/Layout';
import { MusicWork } from '../types/data.types';
import { FuseResult } from 'fuse.js';
import { useLanguage } from '../i18n';

interface WorksHeaderProps {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
    siteData: any;
    handleSearchResult: (result: FuseResult<any>) => void;
    musicWorks: MusicWork[];
    openMusicPlayer: (tracks: MusicWork[]) => void;
}

const WorksHeader: React.FC<WorksHeaderProps> = memo(({
    activeFilter,
    setActiveFilter,
    siteData,
    handleSearchResult,
    musicWorks,
    openMusicPlayer
}) => {
    const { t } = useLanguage();
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
                        placeholder={t('common.searchPlaceholder')}
                    />

                    {activeFilter === 'music' && musicWorks.length > 0 && (
                        <Button
                            onClick={() => openMusicPlayer(musicWorks)}
                            variant="primary"
                            size="md"
                            leftIcon={<Play size={16} />}
                            animation="bounce"
                        >
                            {t('works.playAll')}
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Stack>
    );
});

WorksHeader.displayName = 'WorksHeader';

export default WorksHeader;
