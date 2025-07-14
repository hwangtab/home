import React, { useState, useCallback } from 'react';
import Section from '../components/Section';
import Lightbox from '../components/Lightbox';
import MusicPlayer from '../components/MusicPlayer';
import CardRenderer from '../components/CardRenderer';
import WorksHeader from '../components/WorksHeader';
import WorksGrid from '../components/WorksGrid';
import { ScrollReveal } from '../components/ui/AnimatedComponents';
import { useWorksData } from '../hooks/useDataProcessor';
import { useCardActions } from '../hooks/useCardActions';
import MetaDataManager from '../components/SEO/MetaDataManager';
import { usePageSEO } from '../hooks/useSEO';
import siteData from '../data';


const Works = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // SEO 메타데이터
  const seoData = usePageSEO({
    title: '작품 - 황경하',
    description: '황경하의 음악 작품들을 만나보세요. 젠트리피케이션, 민중음악 선곡집, 몸의 중심 등 사회적 메시지를 담은 음반과 글들을 소개합니다.',
    keywords: ['황경하', '음반', '앨범', '민중음악', '연대', '작품', '젠트리피케이션', '몸의중심'],
    image: '/images/og/works-og.jpg'
  });

  // 통합 데이터 처리 훅 사용
  const { categorizedData, getWorksByCategory } = useWorksData(siteData.works, 'works');
  
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
    <>
      <MetaDataManager {...seoData} />
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
    </>
  );
};

export default Works;