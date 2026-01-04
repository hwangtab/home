import React, { useState, useCallback, useMemo } from 'react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
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
import { useCachedPageData } from '../hooks/usePageData';
import { GridSkeleton } from '../components/ui/Skeleton';
import MetaDataManager from '../components/SEO/MetaDataManager';
import { usePageSEO } from '../hooks/useSEO';

const Archive = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [viewMode, setViewMode] = useState('yearly'); // 'yearly' or 'timeline'
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: siteData, loading, error } = useCachedPageData('archive');

  // SEO 메타데이터
  const seoData = usePageSEO({
    title: '아카이브 - 황경하',
    description: '황경하의 20년간의 활동 기록을 시간순으로 정리한 아카이브입니다. 음악, 글, 사진, 공연 등 다양한 작업들을 한눈에 볼 수 있습니다.',
    keywords: ['황경하', '아카이브', '타임라인', '활동기록', '연표', '20년간'],
    image: '/images/og/archive-og.jpg'
  });

  // hooks를 최상위에서 호출 - siteData가 null일 때 빈 객체 전달
  const { flattenedEvents, getEventsByType, searchEvents } = useWorksData(siteData?.works || {}, 'archive');
  const { lightbox, musicPlayer } = useCardActions({
    enableLightbox: true,
    enableMusicPlayer: true
  });

  // 모든 hooks를 최상위에서 호출 - 의존성이 null일 때 안전하게 처리
  const filteredEvents = useMemo(() => {
    if (!flattenedEvents || !getEventsByType || !searchEvents) {
      return [];
    }
    let events = flattenedEvents;
    if (activeFilter !== 'all') {
      events = getEventsByType(activeFilter);
    }
    if (searchTerm.trim()) {
      events = searchEvents(searchTerm);
    }
    return events;
  }, [flattenedEvents, activeFilter, searchTerm, getEventsByType, searchEvents]);

  const filterOptions = useMemo(() => {
    if (!flattenedEvents || !getEventsByType) {
      return [
        { value: 'all', label: '전체', count: 0 },
        { value: 'music', label: '음악', count: 0 },
        { value: 'visual', label: '영상/사진', count: 0 },
        { value: 'writing', label: '글쓰기', count: 0 },
        { value: 'performance', label: '공연', count: 0 }
      ];
    }
    return [
      { value: 'all', label: '전체', count: flattenedEvents.length },
      { value: 'music', label: '음악', count: getEventsByType('music').length },
      { value: 'visual', label: '영상/사진', count: getEventsByType('visual').length },
      { value: 'writing', label: '글쓰기', count: getEventsByType('writing').length },
      { value: 'performance', label: '공연', count: getEventsByType('performance').length }
    ];
  }, [flattenedEvents, getEventsByType]);

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

  if (loading) {
    return (
      <div>
        <MetaDataManager {...seoData} />
        <div className="container mx-auto py-8">
          <GridSkeleton count={4} columns="grid-cols-1 md:grid-cols-2" />
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div>
        <MetaDataManager {...seoData} />
        <div className="container mx-auto py-8 text-center">
          <p className="text-gray-300">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <MetaDataManager {...seoData} />
      <PageHero
        title="아카이브"
        subtitle="기록된 순간들의 모음"
        imagePath="/images/hwang/5.png"
      />

      <Section
        titleAlign="center"
        containerSize="default"
        className="mt-8"
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
                searchKeys={['title', 'description']}
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

export default React.memo(Archive);
