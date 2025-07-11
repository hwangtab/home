import React, { useState, useCallback } from 'react';
import Section from '../components/Section';
import VideoGallery from '../components/VideoGallery';
import Lightbox from '../components/Lightbox';
import MusicPlayer from '../components/MusicPlayer';
import CardRenderer from '../components/CardRenderer';
import WorksHeader from '../components/WorksHeader';
import WorksGrid from '../components/WorksGrid';
import { GridSkeleton } from '../components/ui/SkeletonUI';
import { PageTransition, ScrollReveal } from '../components/ui/AnimatedComponents';
import { useWorksData } from '../hooks/useDataProcessor';
import { useCardActions } from '../hooks/useCardActions';
import siteData from '../data';


const Works = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // 통합 데이터 처리 훅 사용
  const { categorizedData, getWorksByCategory } = useWorksData(siteData);
  
  // 카드 액션 훅 사용
  const { lightbox, musicPlayer } = useCardActions({
    enableLightbox: true,
    enableMusicPlayer: true
  });
  
  // 필터링된 작품 목록
  const filteredWorks = getWorksByCategory(activeFilter);
  const musicWorks = categorizedData.music || [];

  // 콜백 함수들 메모이제이션
  const handleSearchResult = useCallback((result) => {
    // Navigate to the specific work based on search result
    if (result.item.type === 'music') {
      setActiveFilter('music');
    } else if (['photography', 'videos'].includes(result.item.type)) {
      setActiveFilter('visual');
    } else if (result.item.type === 'writing') {
      setActiveFilter('writing');
    } else if (result.item.type === 'performance') {
      setActiveFilter('performance');
    }
  }, []);

  // 작품 렌더링 함수 메모이제이션
  const renderWork = useCallback((work, index) => {
    return <CardRenderer work={work} onClick={lightbox.openLightbox} />;
  }, [lightbox.openLightbox]);

  return (
    <PageTransition>
      <Section title="작품">
        <ScrollReveal direction="up" delay={0.1}>
          <WorksHeader 
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            siteData={siteData}
            handleSearchResult={handleSearchResult}
            musicWorks={musicWorks}
            openMusicPlayer={musicPlayer.openMusicPlayer}
          />
        </ScrollReveal>

        {/* Video Gallery for Visual Filter */}
        {activeFilter === 'visual' && (
          <ScrollReveal direction="up" delay={0.2}>
            <div className="mb-12">
              <VideoGallery 
                videos={siteData.works.visual.videos || []} 
                title="비디오 작품"
              />
            </div>
          </ScrollReveal>
        )}
        
        <ScrollReveal direction="up" delay={0.3}>
          <WorksGrid 
            filteredWorks={filteredWorks}
            activeFilter={activeFilter}
            renderWork={renderWork}
          />
        </ScrollReveal>
      </Section>

      {/* Lightbox */}
      <Lightbox
        images={lightbox.selectedImages}
        currentIndex={lightbox.lightboxIndex}
        isOpen={lightbox.isLightboxOpen}
        onClose={lightbox.closeLightbox}
        onImageChange={lightbox.changeLightboxImage}
      />

      {/* Music Player */}
      <MusicPlayer
        playlist={musicPlayer.playlist}
        isVisible={musicPlayer.musicPlayerVisible}
        onClose={musicPlayer.closeMusicPlayer}
      />
    </PageTransition>
  );
};

export default Works;