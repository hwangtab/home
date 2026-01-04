import React, { useState, memo, useCallback } from 'react';
import { Calendar, ExternalLink, Play, BookOpen, Eye, Mic, Video } from 'lucide-react';
import DefaultImageComponent from './DefaultImageComponent';
import useLazyImage from '../../hooks/useLazyImage';


// 설정 객체들
const getAssetPath = (path) => {
  const publicUrl = process.env.PUBLIC_URL || '';
  return `${publicUrl}${path}`;
};

const CATEGORY_CONFIG = {
  music: { icon: Play, color: 'bg-brand-primary-600', defaultSvg: getAssetPath('/images/defaults/music-default.svg') },
  writing: { icon: BookOpen, color: 'bg-brand-earth-600', defaultSvg: getAssetPath('/images/defaults/writing-default.svg') },
  visual: { icon: Eye, color: 'bg-brand-harmony-600', defaultSvg: getAssetPath('/images/defaults/visual-default.svg') },
  performance: { icon: Mic, color: 'bg-brand-solidarity-600', defaultSvg: getAssetPath('/images/defaults/performance-default.svg') }
};

const ACTION_CONFIG = {
  play: Play,
  read: BookOpen,
  view: Eye,
  watch: Video,
  link: ExternalLink
};

// 스타일 상수 - 모바일 최적화된 카드 디자인
const STYLES = {
  cardContainer: "group bg-gray-800 hover:bg-gray-750 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer h-full flex flex-col backdrop-blur-sm perspective-1000 min-h-touch",
  imageContainer: "relative w-full aspect-square bg-gray-800 rounded-t-lg overflow-hidden",
  image: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
  gradient: "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20",
  badge: "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-sm backdrop-blur-sm min-h-touch", // 모바일 터치 영역 확대
  actionButton: "inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 hover:from-brand-primary-500 hover:to-brand-primary-600 text-white text-base font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 min-h-touch min-w-touch", // 터치 영역 보장
  tag: "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-200 px-3 py-1.5 rounded-full text-sm transition-all duration-200 border border-gray-600 hover:border-brand-primary-500/30 min-h-touch" // 터치 영역 확대
};

// 이미지 폴백 로직 커스텀 훅
const useImageFallback = (cover, category, title) => {
  const [imageError, setImageError] = useState(false);
  const [svgError, setSvgError] = useState(false);

  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.music;
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

const TypeBadge = ({ type, category }) => {
  const config = CATEGORY_CONFIG[category] || { icon: null, color: 'bg-gray-600' };

  // visual 카테고리에서 video 타입 처리
  const IconComponent = (category === 'visual' && (type === 'video' || type === '다큐멘터리'))
    ? Video
    : config.icon;

  const label = category === 'music' ? (type === 'album' ? '앨범' : '싱글')
    : category === 'performance' ? '공연'
      : type;

  return (
    <div className={`${STYLES.badge} ${config.color}`}>
      {IconComponent && <IconComponent size={12} />}
      <span>{label}</span>
    </div>
  );
};

const CardImage = ({ cover, title, category, type }) => {
  const imageProps = useImageFallback(cover, category, title);
  const { imgRef, isLoaded, shouldLoad } = useLazyImage(imageProps.src);
  const isVideo = type === 'video' || type === '다큐멘터리';

  // CSS 컴포넌트 폴백
  if (imageProps.type === 'component') {
    return imageProps.component;
  }

  return (
    <div ref={imgRef} className={STYLES.imageContainer}>
      {/* 스켈레톤 로딩 */}
      {!isLoaded && shouldLoad && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
        </div>
      )}

      {/* 이미지 로드 완료 시에만 표시 */}
      {shouldLoad && (
        <img
          src={imageProps.src}
          alt={title}
          className={`${STYLES.image} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={() => {/* 이미 useLazyImage에서 처리됨 */ }}
          onError={imageProps.onError}
          loading="lazy"
        />
      )}

      <div className={STYLES.gradient} />

      {/* Video play overlay */}
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

const ActionButton = ({ action, category }) => {
  if (!action) return null;

  const IconComponent = ACTION_CONFIG[action.type] || ExternalLink;

  // Get category-specific colors from CATEGORY_CONFIG
  const categoryConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.music;
  const primaryColor = categoryConfig.color;

  // Generate hover color class based on category using brand colors
  const getHoverColor = (category) => {
    switch (category) {
      case 'music': return 'hover:bg-brand-primary-500';
      case 'writing': return 'hover:bg-brand-earth-500';
      case 'visual': return 'hover:bg-brand-harmony-500';
      case 'performance': return 'hover:bg-brand-solidarity-500';
      default: return 'hover:bg-brand-primary-500';
    }
  };

  const buttonClasses = `inline-flex items-center gap-2 px-3 py-2 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${primaryColor} ${getHoverColor(category)} hover:scale-105`;

  return (
    <a
      href={action.url}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses}
    >
      <IconComponent size={14} />
      <span>{action.label}</span>
    </a>
  );
};

const UnifiedWorkCard = ({ work, onClick }) => {
  const {
    title,
    year,
    type,
    archiveCategory: category,
    cover,
    description,
    shortDescription,
    primaryAction,
    publication
  } = work;

  const displayDescription = shortDescription || description || '';
  const truncatedDescription = displayDescription.length > 100
    ? displayDescription.substring(0, 100) + '...'
    : displayDescription;

  const handleCardClick = useCallback((e) => {
    // Don't trigger card click if clicking on action button
    if (e.target.closest('a')) return;

    // If primaryAction has a URL, navigate to it directly
    if (primaryAction?.url) {
      window.open(primaryAction.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Fallback to onClick handler
    if (onClick) onClick(work);
  }, [onClick, work, primaryAction]);

  return (
    <article
      className={`${STYLES.cardContainer} transform-gpu hover:-translate-y-2 hover:scale-105 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-a11y focus:ring-brand-primary-400 focus:ring-offset-a11y focus:ring-offset-gray-900 focus-visible:ring-a11y focus-visible:ring-brand-primary-400`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
      tabIndex="0"
      role="button"
      aria-label={`${title} (${year}년) - ${category === 'music' ? '음악' : category === 'writing' ? '글' : category === 'visual' ? '시각' : '공연'} 작품 상세보기`}
      data-cursor="card"
      data-cursor-text="클릭하여 상세보기"
    >
      <CardImage cover={cover} title={title} category={category} type={type} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header with badge and year */}
        <div className="flex items-center justify-between mb-4"> {/* 모바일에서 더 큰 마진 */}
          <TypeBadge type={type} category={category} />
          <div className="flex items-center gap-1 text-gray-400 text-base"> {/* 모바일에서 더 큰 텍스트 */}
            <Calendar size={16} />
            <span>{year}년</span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-gray-50 group-hover:text-white font-bold text-xl mb-4 line-clamp-2 font-santokki transition-colors duration-300"
          id={`card-title-${work.id}`}
        >
          {title}
        </h3>

        {/* Publication info for writing */}
        {publication && (
          <p className="text-gray-400 text-sm mb-2">{publication}</p>
        )}

        {/* Description */}
        <p className="text-gray-300 group-hover:text-gray-200 text-base mb-4 line-clamp-2 leading-[1.6] flex-1 transition-colors duration-300"> {/* 모바일에서 더 큰 텍스트 */}
          {truncatedDescription}
        </p>

        {/* Tags */}


        {/* Action Button */}
        <div className="flex justify-end mt-auto pt-2 border-t border-gray-700/50 group-hover:border-brand-primary-500/20 transition-colors duration-300">
          <ActionButton action={primaryAction} category={category} />
        </div>
      </div>
    </article>
  );
};

export default memo(UnifiedWorkCard);