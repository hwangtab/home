"use client";

import React, { Suspense, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { FuseResult } from 'fuse.js';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
const MusicPlayer = dynamic(() => import('../components/MusicPlayer'), { ssr: false });
import CardRenderer from '../components/CardRenderer';
import WorksQuerySync from '../components/WorksQuerySync';
import type { SearchResultItem } from '../components/SearchBar';
import WorksHeader from '../components/WorksHeader';
import WorksGrid from '../components/WorksGrid';
import { ScrollReveal } from '../components/ui/AnimatedComponents';
import { useWorksData } from '../hooks/useDataProcessor';
import { useCardActions } from '../hooks/useCardActions';
import { useWorksPageData } from '../hooks/usePageData';
import { useLanguage } from '../i18n';
import { WORK_CATEGORIES, type MusicWork, type Work, type WorkCategory } from '../types/data.types';

const WORK_FILTER_SET = new Set<string>(['all', ...WORK_CATEGORIES]);
const RING_HIGHLIGHT_DURATION_MS = 2000;
const HIGHLIGHT_CLASSES = [
  'ring-2',
  'ring-brand-primary-400',
  'ring-offset-2',
  'ring-offset-gray-900',
  'rounded-lg'
] as const;

// MusicWork 확장: audioUrl 필드 추가 (플레이어에서 사용)
interface PlayableMusicWork extends MusicWork {
  audioUrl?: string;
}

const Works: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<WorkCategory | 'all'>('all');
  const [highlightedWorkId, setHighlightedWorkId] = useState<string | null>(null);
  const [queryWorkId, setQueryWorkId] = useState<string | null>(null);
  const targetWorkId = queryWorkId || highlightedWorkId;

  const { data: worksPageData } = useWorksPageData(language);

  const handleQueryCategoryChange = useCallback((category: WorkCategory | 'all') => {
    setActiveFilter(category);
  }, []);

  const handleQueryWorkIdChange = useCallback((workId: string | null) => {
    setQueryWorkId(workId);
  }, []);

  useLayoutEffect(() => {
    if (!targetWorkId) return;

    const element = document.getElementById(`work-${targetWorkId}`);
    if (!element) {
      // DOM 렌더링 대기: 필터 변경 직후 element가 아직 없을 수 있음
      let highlightCleanup: (() => void) | undefined;
      const rafId = requestAnimationFrame(() => {
        const el = document.getElementById(`work-${targetWorkId}`);
        if (!el) return;
        highlightCleanup = startHighlight(el);
      });
      return () => {
        cancelAnimationFrame(rafId);
        highlightCleanup?.();
      };
    }

    return startHighlight(element);

    function startHighlight(el: HTMLElement) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add(...HIGHLIGHT_CLASSES);

      const removeHighlight = () => {
        el.classList.remove(...HIGHLIGHT_CLASSES);
      };

      const cleanupTimer = setTimeout(() => {
        removeHighlight();
      }, RING_HIGHLIGHT_DURATION_MS);

      return () => {
        clearTimeout(cleanupTimer);
        removeHighlight();
      };
    }
  }, [targetWorkId, activeFilter]);

  const { categorizedData, getWorksByCategory } = useWorksData(worksPageData.works);
  const { musicPlayer } = useCardActions({
    enableMusicPlayer: true
  });

  const handleSearchResult = useCallback((result: FuseResult<SearchResultItem>) => {
    const category = result.item.archiveCategory;

    if (category && WORK_FILTER_SET.has(category)) {
      setActiveFilter(category as WorkCategory);
    }

    setHighlightedWorkId(result.item.id ?? null);
  }, []);

  const renderWork = useCallback(
    (work: Work) => (
      <div id={`work-${work.id}`} className="h-full">
        <CardRenderer work={work} />
      </div>
    ),
    []
  );

  const filteredWorks = activeFilter === 'all' ? categorizedData.all : getWorksByCategory(activeFilter);

  const isPlayableMusicWork = (work: Work): work is PlayableMusicWork => {
    const musicWork = work as PlayableMusicWork;
    const hasAudioUrl = typeof musicWork.audioUrl === 'string' && musicWork.audioUrl.length > 0;
    const hasLinks = musicWork.links !== undefined && Object.keys(musicWork.links).length > 0;
    return hasAudioUrl || hasLinks;
  };
  
  const playableMusicWorks = (categorizedData.music as PlayableMusicWork[]).filter(isPlayableMusicWork);

  return (
    <>
      <Suspense fallback={null}>
        <WorksQuerySync
          onCategoryChange={handleQueryCategoryChange}
          onWorkIdChange={handleQueryWorkIdChange}
        />
      </Suspense>

      <PageHero
        title={t('works.title')}
        subtitle={t('works.heroSubtitle')}
        imagePath="/images/hwang/4.png"
      />

      <Section containerSize="default" className="mt-8">
        <ScrollReveal direction="up" delay={0.05}>
          <WorksHeader
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            siteData={worksPageData}
            handleSearchResult={handleSearchResult}
            musicWorks={playableMusicWorks}
            openMusicPlayer={musicPlayer.openMusicPlayer as (tracks: PlayableMusicWork[]) => void}
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

      <MusicPlayer
        playlist={musicPlayer.playlist}
        isVisible={musicPlayer.musicPlayerVisible}
        onClose={musicPlayer.closeMusicPlayer}
      />
    </>
  );
};

export default React.memo(Works);
