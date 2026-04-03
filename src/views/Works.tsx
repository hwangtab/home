"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { FuseResult } from 'fuse.js';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import Lightbox from '../components/Lightbox';
import MusicPlayer from '../components/MusicPlayer';
import CardRenderer from '../components/CardRenderer';
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

const isWorkFilter = (value: string | null): value is WorkCategory | 'all' => {
  return value !== null && WORK_FILTER_SET.has(value);
};

const Works: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<WorkCategory | 'all'>('all');
  const searchParams = useSearchParams();
  const { data: worksPageData } = useWorksPageData(language);

  useEffect(() => {
    const category = searchParams?.get('category') ?? null;

    if (isWorkFilter(category)) {
      setActiveFilter(category);
    }
  }, [searchParams]);

  useEffect(() => {
    const workId = searchParams?.get('id');

    if (!workId) {
      return;
    }

    const timer = window.setTimeout(() => {
      const element = document.getElementById(`work-${workId}`);

      if (!element) {
        return;
      }

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add(
        'ring-2',
        'ring-brand-primary-400',
        'ring-offset-2',
        'ring-offset-gray-900',
        'rounded-lg'
      );

      window.setTimeout(() => {
        element.classList.remove(
          'ring-2',
          'ring-brand-primary-400',
          'ring-offset-2',
          'ring-offset-gray-900',
          'rounded-lg'
        );
      }, 2000);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchParams, activeFilter]);

  const { categorizedData, getWorksByCategory } = useWorksData(worksPageData.works, 'works');
  const { lightbox, musicPlayer } = useCardActions({
    enableLightbox: true,
    enableMusicPlayer: true
  });

  const handleSearchResult = useCallback((result: FuseResult<SearchResultItem>) => {
    const category = result.item.archiveCategory;

    if (category && WORK_FILTER_SET.has(category)) {
      setActiveFilter(category as WorkCategory);
    }
  }, []);

  const renderWork = useCallback(
    (work: Work) => (
      <div id={`work-${work.id}`} className="h-full">
        <CardRenderer work={work} onClick={lightbox.openLightbox} />
      </div>
    ),
    [lightbox.openLightbox]
  );

  const filteredWorks = activeFilter === 'all' ? categorizedData.all : getWorksByCategory(activeFilter);
  const playableMusicWorks = (categorizedData.music as MusicWork[]).filter((work) => {
    const candidate = work as MusicWork & {
      audioUrl?: string;
      links?: string | Record<string, string>;
    };
    const links = candidate.links;
    const hasAudioUrl = typeof candidate.audioUrl === 'string' && candidate.audioUrl.length > 0;
    const hasLinks =
      typeof links === 'string' ? links.length > 0 : links !== undefined && Object.keys(links).length > 0;

    return hasAudioUrl || hasLinks;
  });

  return (
    <>
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
            openMusicPlayer={musicPlayer.openMusicPlayer as (tracks: MusicWork[]) => void}
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

      {/* @ts-ignore */}
      <Lightbox
        images={lightbox.selectedImages}
        currentIndex={lightbox.lightboxIndex}
        isOpen={lightbox.isLightboxOpen}
        onClose={lightbox.closeLightbox}
        onImageChange={lightbox.changeLightboxImage}
      />

      {/* @ts-ignore */}
      <MusicPlayer
        playlist={musicPlayer.playlist}
        isVisible={musicPlayer.musicPlayerVisible}
        onClose={musicPlayer.closeMusicPlayer}
      />
    </>
  );
};

export default React.memo(Works);
