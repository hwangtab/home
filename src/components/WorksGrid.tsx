// @ts-nocheck
import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridSkeleton } from './ui/Skeleton';
import { StaggerContainer, StaggerItem } from './ui/AnimatedComponents';
import { Work } from '../types/data.types';
import { useLanguage } from '../i18n';

interface WorksGridProps {
    filteredWorks: Work[];
    activeFilter: string;
    renderWork: (work: Work, index: number) => React.ReactNode;
    emptyMessage?: string;
    isLoading?: boolean;
    skeletonCount?: number;
}

const WorksGrid: React.FC<WorksGridProps> = memo(({
    filteredWorks,
    activeFilter,
    renderWork,
    emptyMessage,
    isLoading = false,
    skeletonCount = 6
}) => {
    const { t } = useLanguage();
    // 점진적 로딩을 위한 상태
    const [visibleCount, setVisibleCount] = useState(6); // 첫 6개만 즉시 표시
    const [showAll, setShowAll] = useState(false);

    // 필터 변경 시 초기화
    useEffect(() => {
        setVisibleCount(6);
        setShowAll(false);

        // 0.2초 후 모든 카드 표시
        const timer = setTimeout(() => {
            setShowAll(true);
            setVisibleCount(filteredWorks.length);
        }, 200);

        return () => clearTimeout(timer);
    }, [activeFilter, filteredWorks.length]);

    if (isLoading) {
        return (
            <GridSkeleton
                items={skeletonCount}
                columns={3}
                cardProps={{ showImage: true }}
            />
        );
    }

    if (filteredWorks.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400 font-wanted-sans">
                    {emptyMessage || (activeFilter === 'all'
                        ? t('works.noWorks')
                        : t('works.noWorksByCategory').replace('{category}', activeFilter))}
                </p>
            </div>
        );
    }

    // 표시할 작품들 (점진적 로딩)
    const worksToShow = showAll ? filteredWorks : filteredWorks.slice(0, visibleCount);

    return (
        <AnimatePresence mode="wait">
            <StaggerContainer
                key={activeFilter}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
                staggerDelay={0.03}
            >
                {worksToShow.map((work, index) => (
                    <StaggerItem
                        key={work.id || `${work.type}-${index}`}
                        direction="up"
                    >
                        {renderWork(work, index)}
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {/* 나머지 카드들 점진적 로딩 */}
            {!showAll && filteredWorks.length > visibleCount && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mt-8"
                >
                    <div className="inline-flex items-center gap-2 text-gray-400 font-wanted-sans">
                        <div className="w-2 h-2 bg-brand-primary-400 rounded-full animate-pulse"></div>
                        <span>{t('works.loadingMore')}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

WorksGrid.displayName = 'WorksGrid';

export default WorksGrid;
