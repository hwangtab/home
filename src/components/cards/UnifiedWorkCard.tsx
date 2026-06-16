import React, { useState, memo, useCallback, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Calendar, ExternalLink, Play, BookOpen, Eye, Mic, Video, Flame, LucideIcon } from 'lucide-react';
import DefaultImageComponent from './DefaultImageComponent';
import { Work, WorkCategory, PrimaryAction, WritingWork } from '../../types/data.types';
import { useLanguage } from '../../i18n';
import { getLocaleFromPathname, withLocalePrefix } from '../../utils/localePath';
import { getWorkCoverUrl } from '../../lib/works';

// 설정 객체들
// Lazy-evaluate base path to avoid stale values in dev/HMR scenarios.
const DEFAULT_BASE_PATH = typeof process !== 'undefined'
    ? (process.env.NEXT_PUBLIC_BASE_PATH || '')
    : '';

const getAssetPath = (path: string): string => {
    return DEFAULT_BASE_PATH ? `${DEFAULT_BASE_PATH}${path}` : path;
};

interface CategoryConfigItem {
    icon: LucideIcon;
    color: string;
    defaultSvg: string;
}

const CATEGORY_CONFIG: Record<WorkCategory, CategoryConfigItem> = {
    music: { icon: Play, color: 'bg-brand-primary-600', defaultSvg: getAssetPath('/images/defaults/music-default.svg') },
    writing: { icon: BookOpen, color: 'bg-brand-earth-600', defaultSvg: getAssetPath('/images/defaults/writing-default.svg') },
    visual: { icon: Eye, color: 'bg-brand-harmony-600', defaultSvg: getAssetPath('/images/defaults/visual-default.svg') },
    performance: { icon: Mic, color: 'bg-brand-solidarity-600', defaultSvg: getAssetPath('/images/defaults/performance-default.svg') },
    struggle: { icon: Flame, color: 'bg-brand-solidarity-700', defaultSvg: getAssetPath('/images/defaults/performance-default.svg') }
};

const toWorkCategory = (category: string | undefined): WorkCategory => {
    return category === 'music' ||
        category === 'visual' ||
        category === 'writing' ||
        category === 'performance' ||
        category === 'struggle'
        ? category
        : 'music';
};

const ACTION_CONFIG: Record<string, LucideIcon> = {
    play: Play,
    read: BookOpen,
    view: Eye,
    watch: Video,
    link: ExternalLink
};

// 스타일 상수
const STYLES = {
    cardContainer: "group bg-gray-800 hover:bg-gray-750 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition-[background-color,border-color] duration-300 cursor-pointer h-full flex flex-col min-h-touch",
    imageContainer: "relative w-full aspect-square bg-gray-800 rounded-t-lg overflow-hidden",
    image: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
    gradient: "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20",
    badge: "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-sm min-h-touch",
    actionButton: "inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 hover:from-brand-primary-500 hover:to-brand-primary-600 text-white text-base font-medium rounded-lg transition-[transform,background-image] duration-200 transform hover:scale-105 min-h-touch min-w-touch",
    tag: "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-200 px-3 py-1.5 rounded-full text-sm transition-[background-color,border-color,color] duration-200 border border-gray-600 hover:border-brand-primary-500/30 min-h-touch"
};

// 이미지 폴백 로직 커스텀 훅
interface ImageFallbackResult {
    type: 'component' | 'svg' | 'image';
    component?: ReactNode;
    src?: string;
    onError?: () => void;
}

const useImageFallback = (cover: string | undefined, category: WorkCategory | string = 'music', title: string): ImageFallbackResult => {
    const [imageError, setImageError] = useState(false);
    const [svgError, setSvgError] = useState(false);

    const config = CATEGORY_CONFIG[toWorkCategory(category)];
    const defaultSvg = config.defaultSvg;

    // 폴백 우선순위: cover → SVG → CSS 컴포넌트
    if (!cover || (imageError && svgError)) {
        return {
            type: 'component',
            component: <DefaultImageComponent category={category} title={title} />
        };
    }

    if (imageError && !svgError) {
        return {
            type: 'svg',
            src: defaultSvg,
            onError: () => setSvgError(true)
        };
    }

    return {
        type: 'image',
        src: cover,
        onError: () => setImageError(true)
    };
};

const getCategoryLabel = (category: WorkCategory, t: (key: string) => string): string => {
    if (category === 'music') return '';
    return t(`works.${category}`);
};

const TypeBadge: React.FC<{ type: string; category?: string }> = ({ type, category = 'music' }) => {
    const { t } = useLanguage();
    const normalizedCategory = toWorkCategory(category);
    const config = CATEGORY_CONFIG[normalizedCategory];

    // visual 카테고리에서 video 타입 처리
    const IconComponent = (normalizedCategory === 'visual' && (type === 'video' || type === '다큐멘터리'))
        ? Video
        : config.icon;

    const label = normalizedCategory === 'music'
        ? (type === 'album' ? t('works.album') : t('works.single'))
        : getCategoryLabel(normalizedCategory, t);

    return (
        <div className={`${STYLES.badge} ${config.color}`}>
            {IconComponent && <IconComponent size={12} />}
            <span>{label}</span>
        </div>
    );
};

const CardImage: React.FC<{ cover?: string; title: string; category?: string; type: string }> = ({ cover, title, category, type }) => {
    const normalizedCategory: WorkCategory =
        category === 'music' ||
        category === 'visual' ||
        category === 'writing' ||
        category === 'performance' ||
        category === 'struggle'
            ? category
            : 'music';
    const normalizedCover = cover ? getWorkCoverUrl(cover, normalizedCategory) : undefined;
    const imageProps = useImageFallback(normalizedCover, category, title);
    const [isLoaded, setIsLoaded] = useState(false);
    const isVideo = type === 'video' || type === '다큐멘터리';

    if (imageProps.type === 'component') {
        return <>{imageProps.component}</>;
    }

    return (
        <div className={STYLES.imageContainer}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
                </div>
            )}

            {imageProps.src && (
                <Image
                    src={imageProps.src}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`${STYLES.image} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    onLoad={() => setIsLoaded(true)}
                    onError={imageProps.onError}
                    unoptimized={imageProps.src.endsWith('.svg')}
                />
            )}

            <div className={STYLES.gradient} />

            {isVideo && isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                    <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <div className="bg-white bg-opacity-90 rounded-full p-3">
                            <Play className="text-gray-900" size={24} fill="currentColor" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ActionButton: React.FC<{ action?: PrimaryAction; category?: string }> = ({ action, category }) => {
    if (!action || !action.url) return null;

    const IconComponent = ACTION_CONFIG[action.type] || ExternalLink;
    const normalizedCategory = toWorkCategory(category);
    const categoryConfig = CATEGORY_CONFIG[normalizedCategory];
    const primaryColor = categoryConfig.color;

    const getHoverColor = (cat?: string) => {
        switch (cat) {
            case 'music': return 'hover:bg-brand-primary-500';
            case 'writing': return 'hover:bg-brand-earth-500';
            case 'visual': return 'hover:bg-brand-harmony-500';
            case 'performance': return 'hover:bg-brand-solidarity-500';
            case 'struggle': return 'hover:bg-brand-solidarity-600';
            default: return 'hover:bg-brand-primary-500';
        }
    };

    const buttonClasses = `inline-flex items-center gap-2 px-3 py-2 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${primaryColor} ${getHoverColor(normalizedCategory)} hover:scale-105`;

    return (
        <a href={action.url} target="_blank" rel="noopener noreferrer" className={buttonClasses}>
            <IconComponent size={14} />
            <span>{action.label}</span>
        </a>
    );
};

export interface UnifiedWorkCardProps {
    work: Work;
}

const UnifiedWorkCard: React.FC<UnifiedWorkCardProps> = ({ work }) => {
    const { t } = useLanguage();
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname);
    const {
        title,
        year,
        type,
        archiveCategory: category,
        cover,
        description,
        shortDescription,
        primaryAction,
    } = work;

    const publication = (work.archiveCategory === 'writing') ? (work as WritingWork).publication : undefined;

    const displayDescription = shortDescription || description || '';
    const detailHref = withLocalePrefix(`/works/${work.id}`, locale);

    return (
        <div
            className={`${STYLES.cardContainer} relative transform-gpu hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-300`}
            data-cursor="card"
            data-cursor-text={t('works.clickDetail')}
        >
            <CardImage cover={cover} title={title} category={category} type={type || ''} />

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <TypeBadge type={type || ''} category={category} />
                    <div className="flex items-center gap-1 text-gray-400 text-base">
                        <Calendar size={16} />
                        <span>{year}{t('common.year')}</span>
                    </div>
                </div>

                <h3 className="text-gray-50 group-hover:text-white font-bold text-xl mb-4 line-clamp-2 font-santokki transition-colors duration-300" id={`card-title-${work.id}`}>
                    {title}
                </h3>

                {publication && <p className="text-gray-400 text-sm mb-2">{publication}</p>}

                <p className="text-gray-300 group-hover:text-gray-200 text-base mb-4 line-clamp-2 leading-[1.6] flex-1 transition-colors duration-300">
                    {displayDescription}
                </p>

                <div className="flex justify-end mt-auto pt-2 border-t border-gray-700/50 group-hover:border-brand-primary-500/20 transition-colors duration-300">
                    <div className="relative z-10 flex items-center gap-2">
                        <Link
                            href={detailHref}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-600 text-gray-200 hover:border-brand-primary-400 hover:text-brand-primary-300 transition-colors"
                        >
                            {t('common.readMore')}
                        </Link>
                        <ActionButton action={primaryAction} category={category} />
                    </div>
                </div>
            </div>
            <Link
                href={detailHref}
                aria-label={`${title} (${year}${t('common.year')}) - ${category === 'music' ? t('works.music') : category === 'writing' ? t('works.writing') : category === 'visual' ? t('works.visual') : category === 'struggle' ? t('works.struggle') : t('works.performance')} ${t('works.detailLabel')}`}
                className="absolute inset-0 z-0 focus:outline-none focus-visible:ring-a11y focus-visible:ring-brand-primary-400"
                tabIndex={-1}
            />
        </div>
    );
};

export default memo(UnifiedWorkCard);
