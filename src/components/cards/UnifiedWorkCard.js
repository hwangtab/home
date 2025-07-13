import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Play, BookOpen, Eye, Mic, Video } from 'lucide-react';
import DefaultImageComponent from './DefaultImageComponent';

// 설정 객체들
const CATEGORY_CONFIG = {
  music: { icon: Play, color: 'bg-blue-600', defaultSvg: `${process.env.PUBLIC_URL}/images/defaults/music-default.svg` },
  writing: { icon: BookOpen, color: 'bg-green-600', defaultSvg: `${process.env.PUBLIC_URL}/images/defaults/writing-default.svg` },
  visual: { icon: Eye, color: 'bg-purple-600', defaultSvg: `${process.env.PUBLIC_URL}/images/defaults/visual-default.svg` },
  performance: { icon: Mic, color: 'bg-red-600', defaultSvg: `${process.env.PUBLIC_URL}/images/defaults/performance-default.svg` }
};

const ACTION_CONFIG = {
  play: Play,
  read: BookOpen,
  view: Eye,
  watch: Video,
  link: ExternalLink
};

// 스타일 상수
const STYLES = {
  cardContainer: "group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col",
  imageContainer: "relative w-full aspect-square bg-gray-800 rounded-t-lg overflow-hidden",
  image: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
  gradient: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent",
  badge: "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white",
  actionButton: "inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors",
  tag: "bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs"
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
  const isVideo = type === 'video' || type === '다큐멘터리';

  // CSS 컴포넌트 폴백
  if (imageProps.type === 'component') {
    return imageProps.component;
  }

  return (
    <div className={STYLES.imageContainer}>
      <img
        src={imageProps.src}
        alt={title}
        className={STYLES.image}
        onError={imageProps.onError}
      />
      <div className={STYLES.gradient} />
      
      {/* Video play overlay */}
      {isVideo && (
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

const ActionButton = ({ action }) => {
  if (!action) return null;

  const IconComponent = ACTION_CONFIG[action.type] || ExternalLink;

  return (
    <a
      href={action.url}
      target="_blank"
      rel="noopener noreferrer"
      className={STYLES.actionButton}
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
    tags = [],
    primaryAction,
    publication
  } = work;

  const displayDescription = shortDescription || description || '';
  const truncatedDescription = displayDescription.length > 100 
    ? displayDescription.substring(0, 100) + '...' 
    : displayDescription;

  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on action button
    if (e.target.closest('a')) return;
    if (onClick) onClick(work);
  };

  return (
    <motion.div
      className={STYLES.cardContainer}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
    >
      <CardImage cover={cover} title={title} category={category} type={type} />
      
      <div className="p-4 flex-1 flex flex-col">
        {/* Header with badge and year */}
        <div className="flex items-center justify-between mb-3">
          <TypeBadge type={type} category={category} />
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Calendar size={14} />
            <span>{year}년</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 font-santokki">
          {title}
        </h3>

        {/* Publication info for writing */}
        {publication && (
          <p className="text-gray-400 text-sm mb-2">{publication}</p>
        )}

        {/* Description */}
        <p className="text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
          {truncatedDescription}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={STYLES.tag}>
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-gray-400 text-xs">+{tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end mt-auto">
          <ActionButton action={primaryAction} />
        </div>
      </div>
    </motion.div>
  );
};

export default UnifiedWorkCard;