import React, { useState, useCallback, useEffect } from 'react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
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
import { useCachedPageData } from '../hooks/usePageData';
import { GridSkeleton } from '../components/ui/Skeleton';


import { useLocation } from 'react-router-dom';

const Works = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const location = useLocation();
  const { data: siteData, loading, error } = useCachedPageData('works');

  // URL 파라미터 처리 및 스크롤
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const workId = params.get('id');

    if (category) {
      setActiveFilter(category);
    }

    if (workId) {
      // 데이터 로딩 및 애니메이션 시간을 고려하여 지연 실행
      const timer = setTimeout(() => {
        const element = document.getElementById(`work-${workId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 강조 효과 (선택적)
          element.classList.add('ring-2', 'ring-brand-primary-400', 'ring-offset-2', 'ring-offset-gray-900', 'rounded-lg');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-brand-primary-400', 'ring-offset-2', 'ring-offset-gray-900', 'rounded-lg');
          }, 2000);
        }
      }, 800); // WorksGrid 애니메이션 지연 고려
      return () => clearTimeout(timer);
    }
  }, [location.search, loading]);

  // SEO 메타데이터
  const seoData = usePageSEO({
    title: '작품 - 황경하',
    description: '황경하의 음악 작품들을 만나보세요. 젠트리피케이션, 민중음악 선곡집, 몸의 중심 등 사회적 메시지를 담은 음반과 글들을 소개합니다.',
    keywords: ['황경하', '음반', '앨범', '민중음악', '연대', '작품', '젠트리피케이션', '몸의중심'],
    image: '/images/og/works-og.jpg'
  });

  // hooks를 최상위에서 호출 - siteData가 null일 때 빈 객체 전달
  const { categorizedData, getWorksByCategory } = useWorksData(siteData?.works || {}, 'works');

  // 카드 액션 훅 사용
  const { lightbox, musicPlayer } = useCardActions({
    enableLightbox: true,
    enableMusicPlayer: true
  });

  // 콜백 함수들 메모이제이션 - 모든 hooks를 최상위에서 호출
  const handleSearchResult = useCallback((result) => {
    // Navigate to the specific work based on search result
    if (result.item.type === 'music') {
      setActiveFilter('music');
    } else if (['photography', 'videos'].includes(result.item.type)) {
      setActiveFilter('visual');
    } else if (result.item.type === 'writing') {
      setActiveFilter('writing');
    } else if (result.item.type === 'struggle') {
      setActiveFilter('struggle');
    }
  }, []);

  // 작품 렌더링 함수 메모이제이션
  const renderWork = useCallback((work, index) => {
    return (
      <div id={`work-${work.id}`} className="h-full">
        <CardRenderer work={work} onClick={lightbox.openLightbox} />
      </div>
    );
  }, [lightbox.openLightbox]);

  if (loading) {
    return (
      <div>
        <MetaDataManager {...seoData} />
        <div className="container mx-auto py-8">
          <GridSkeleton count={6} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
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

  // 필터링된 작품 목록
  const filteredWorks = getWorksByCategory(activeFilter);
  const musicWorks = categorizedData.music || [];

  return (
    <>
      <MetaDataManager {...seoData} />
      <PageHero
        title="작업"
        subtitle="황경하의 음악, 저술, 그리고 활동들"
        imagePath="/images/hwang/4.png"
      />

      <Section containerSize="default" className="mt-8">
        <ScrollReveal direction="up" delay={0.05}>
          <WorksHeader
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            siteData={siteData}
            handleSearchResult={handleSearchResult}
            musicWorks={musicWorks}
            openMusicPlayer={musicPlayer.openMusicPlayer}
          />
        </ScrollReveal>


        <ScrollReveal direction="up" delay={0.1}>
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

export default React.memo(Works);