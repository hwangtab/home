"use client";

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
import { useCachedPageData } from '../hooks/usePageData';
import { GridSkeleton } from '../components/ui/Skeleton';
import { useSearchParams } from 'next/navigation';
import { Work, WorkCategory, MusicWork } from '../types/data.types';

const Works: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<WorkCategory | 'all'>('all');
    const searchParams = useSearchParams();
    const { data: siteData, loading, error } = useCachedPageData('works');

    // URL 파라미터 처리 및 스크롤
    useEffect(() => {
        if (!searchParams) return;

        const category = searchParams.get('category');
        const workId = searchParams.get('id');

        if (category) {
            setActiveFilter(category as WorkCategory | 'all');
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
    }, [searchParams, loading]);

    // hooks를 최상위에서 호출 - siteData가 null일 때 빈 객체 전달
    const { categorizedData, getWorksByCategory } = useWorksData(siteData?.works || {}, 'works');

    // 카드 액션 훅 사용
    const { lightbox, musicPlayer } = useCardActions({
        enableLightbox: true,
        enableMusicPlayer: true
    });

    // 콜백 함수들 메모이제이션 - 모든 hooks를 최상위에서 호출
    const handleSearchResult = useCallback((result: any) => {
        const category = result?.item?.archiveCategory || result?.item?.type;
        if (['music', 'visual', 'writing', 'performance', 'struggle'].includes(category)) {
            setActiveFilter(category as WorkCategory);
        }
    }, []);

    // 작품 렌더링 함수 메모이제이션
    const renderWork = useCallback((work: Work, index: number) => {
        return (
            <div id={`work-${work.id}`} className="h-full">
                <CardRenderer work={work} onClick={lightbox.openLightbox} />
            </div>
        );
    }, [lightbox.openLightbox]);

    if (loading) {
        return (
            <div>
                <div className="container mx-auto py-8">
                    <GridSkeleton items={6} columns={3} />
                </div>
            </div>
        );
    }

    if (error || !siteData) {
        return (
            <div>
                <div className="container mx-auto py-8 text-center">
                    <p className="text-gray-300">데이터를 불러오는 중 오류가 발생했습니다.</p>
                </div>
            </div>
        );
    }

    // 필터링된 작품 목록
    const filteredWorks = activeFilter === 'all' ? categorizedData.all : getWorksByCategory(activeFilter);
    const musicWorks = categorizedData.music || [];
    const playableMusicWorks = musicWorks.filter((work) => {
        const candidate = work as MusicWork & {
            audioUrl?: string;
            links?: string | Record<string, string>;
        };
        const hasAudioUrl = typeof candidate.audioUrl === 'string' && candidate.audioUrl.length > 0;
        const hasLinks =
            typeof candidate.links === 'string'
                ? candidate.links.length > 0
                : !!candidate.links && Object.keys(candidate.links).length > 0;
        return hasAudioUrl || hasLinks;
    });

    return (
        <>
            <PageHero
                title="작업"
                subtitle="황경하의 음악, 저술, 그리고 활동들"
                imagePath="/images/hwang/4.png"
            />

            <Section containerSize="default" className="mt-8">
                <ScrollReveal direction="up" delay={0.05}>
                    <WorksHeader
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter as (filter: string) => void}
                        siteData={siteData}
                        handleSearchResult={handleSearchResult}
                        musicWorks={playableMusicWorks as MusicWork[]}
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

            {/* Lightbox */}
            {/* @ts-ignore */}
            <Lightbox
                images={lightbox.selectedImages}
                currentIndex={lightbox.lightboxIndex}
                isOpen={lightbox.isLightboxOpen}
                onClose={lightbox.closeLightbox}
                onImageChange={lightbox.changeLightboxImage}
            />

            {/* Music Player */}
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
