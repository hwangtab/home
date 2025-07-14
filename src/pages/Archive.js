import React, { useState, useCallback, useMemo } from 'react';
import Section from '../components/Section';
import Lightbox from '../components/Lightbox';
import MusicPlayer from '../components/MusicPlayer';
import SearchBar from '../components/SearchBar';
import TimelineSlider from '../components/archive/TimelineSlider';
import YearlyView from '../components/archive/YearlyView';
import OverallTimeline from '../components/archive/OverallTimeline';
import { useWorksData } from '../hooks/useDataProcessor';
import { useCardActions } from '../hooks/useCardActions';
import { BodyText } from '../components/ui/Typography';
import { Container, Flex, Stack } from '../components/ui/Layout';
import Button, { ButtonGroup } from '../components/ui/Button';
import siteData from '../data';

const Archive = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [viewMode, setViewMode] = useState('yearly'); // 'yearly' or 'timeline'
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { flattenedEvents, getEventsByType, searchEvents } = useWorksData(siteData.works, 'archive');
  const { lightbox, musicPlayer } = useCardActions({
    enableLightbox: true,
    enableMusicPlayer: true
  });

  const filteredEvents = useMemo(() => {
    let events = flattenedEvents;
    if (activeFilter !== 'all') {
      events = getEventsByType(activeFilter);
    }
    if (searchTerm.trim()) {
      events = searchEvents(searchTerm);
    }
    return events;
  }, [flattenedEvents, activeFilter, searchTerm, getEventsByType, searchEvents]);

  const filterOptions = useMemo(() => [
    { value: 'all', label: '전체', count: flattenedEvents.length },
    { value: 'music', label: '음악', count: getEventsByType('music').length },
    { value: 'visual', label: '영상/사진', count: getEventsByType('visual').length },
    { value: 'writing', label: '글쓰기', count: getEventsByType('writing').length },
    { value: 'performance', label: '공연', count: getEventsByType('performance').length }
  ], [flattenedEvents, getEventsByType]);

  const handleCardClick = useCallback((work) => {
    if (work.archiveCategory === 'visual' || work.images) {
      lightbox.openLightbox(work);
    } else if (work.archiveCategory === 'music' || work.links) {
      // 추후 기능 추가
    }
  }, [lightbox]);

  const handleSearchResult = useCallback((result) => {
    setSearchTerm(result.item.title);
  }, []);

  return (
    <div>
      <Section 
        title="아카이브"
        titleAlign="center"
      >
        <Flex justify="center" gap="default" className="mb-8">
          <ButtonGroup spacing="sm">
            <Button
              onClick={() => setViewMode('yearly')}
              variant={viewMode === 'yearly' ? 'primary' : 'outline'}
              size="lg"
              animation="bounce"
            >
              연도별 보기
            </Button>
            <Button
              onClick={() => setViewMode('timeline')}
              variant={viewMode === 'timeline' ? 'primary' : 'outline'}
              size="lg"
              animation="bounce"
            >
              전체 보기
            </Button>
          </ButtonGroup>
        </Flex>

        {viewMode === 'yearly' ? (
          <>
            <TimelineSlider 
              selectedYear={selectedYear} 
              setSelectedYear={setSelectedYear} 
            />
            <YearlyView selectedYear={selectedYear} onCardClick={handleCardClick} />
          </>
        ) : (
          <Stack spacing="lg" className="mb-8">
            <Container size="sm">
              <SearchBar
                data={flattenedEvents}
                onResult={handleSearchResult}
                placeholder="작품이나 활동을 검색하세요..."
                searchKeys={['title', 'description', 'tags']}
              />
            </Container>
            
            <Flex justify="center" gap="sm" wrap={true}>
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => setActiveFilter(option.value)}
                  variant={activeFilter === option.value ? 'primary' : 'outline'}
                  size="md"
                  animation="bounce"
                >
                  {option.label} ({option.count})
                </Button>
              ))}
            </Flex>
            
            <BodyText color="secondary" align="center">
              {searchTerm ? `"${searchTerm}" 검색 결과: ` : ''}{filteredEvents.length}개의 결과
            </BodyText>
            
            <OverallTimeline flattenedEvents={filteredEvents} onCardClick={handleCardClick} />
          </Stack>
        )}
      </Section>

      <Lightbox
        images={lightbox.selectedImages}
        currentIndex={lightbox.lightboxIndex}
        isOpen={lightbox.isLightboxOpen}
        onClose={lightbox.closeLightbox}
        onImageChange={lightbox.changeLightboxImage}
      />

      <MusicPlayer
        playlist={musicPlayer.playlist}
        isVisible={musicPlayer.musicPlayerVisible}
        onClose={musicPlayer.closeMusicPlayer}
      />
    </div>
  );
};

export default Archive;
