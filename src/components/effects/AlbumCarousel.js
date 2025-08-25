import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * 3D 앨범 커버 카루셀 컴포넌트
 * 대표 앨범들을 3D 효과로 회전 표시
 */
const AlbumCarousel = ({ albums, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();


  // 자동 회전 효과
  useEffect(() => {
    if (albums.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % albums.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [albums.length]);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + albums.length) % albums.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % albums.length);
  };

  const handleAlbumClick = (album) => {
    if (album.primaryAction && album.primaryAction.url) {
      // 음원 플랫폼으로 새 탭에서 이동
      window.open(album.primaryAction.url, '_blank', 'noopener,noreferrer');
    } else {
      // primaryAction이 없는 경우 Works 페이지로 이동
      navigate('/works');
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event, album) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAlbumClick(album);
    }
  };

  const handleArrowKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        handlePrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        handleNext();
        break;
    }
  };

  // 드래그 및 스와이프 핸들러
  const handleDragEnd = (event, info) => {
    const threshold = 50; // 드래그 임계값
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
  };

  if (!albums || albums.length === 0) return null;

  // 앨범별 테마 색상 팔레트
  const getAlbumTheme = (album) => {
    const themes = {
      'gentrification-2016': {
        primary: 'from-brand-solidarity-600 to-brand-earth-600',
        secondary: 'from-brand-solidarity-500/20 to-brand-earth-500/20',
        accent: 'text-brand-solidarity-400',
        glow: 'shadow-brand-solidarity-500/30'
      },
      'new-minjung-vol3-2017': {
        primary: 'from-brand-primary-600 to-brand-harmony-600',
        secondary: 'from-brand-primary-500/20 to-brand-harmony-500/20',
        accent: 'text-brand-primary-400',
        glow: 'shadow-brand-primary-500/30'
      },
      'melting-snow-2024': {
        primary: 'from-brand-primary-600 to-brand-solidarity-600',
        secondary: 'from-brand-primary-500/20 to-brand-solidarity-500/20',
        accent: 'text-brand-primary-400',
        glow: 'shadow-brand-primary-500/30'
      }
    };
    
    return themes[album.id] || themes['melting-snow-2024'];
  };

  const theme = getAlbumTheme(albums[currentIndex]);

  return (
    <div 
      className={`relative w-full max-w-3xl mx-auto ${className}`}
      role="region"
      aria-label="주요 앨범 캐러셀"
      aria-roledescription="carousel"
      onKeyDown={handleArrowKeyDown}
      tabIndex="0"
    >
      {/* 동적 배경 그라데이션 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.secondary} rounded-3xl blur-3xl scale-110 opacity-60`} />
      
      {/* 스크린 리더용 현재 상태 안내 */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`${albums.length}개의 앨범 중 ${currentIndex + 1}번째: ${albums[currentIndex]?.title}`}
      </div>
      
      {/* 메인 앨범 커버 */}
      <div className="relative h-64 sm:h-80 lg:h-96 flex items-center justify-center">
        {albums.map((album, index) => (
          <motion.div
            key={album.id}
            role="button"
            tabIndex={index === currentIndex ? 0 : -1}
            aria-label={`${album.title} 앨범 보기. ${album.year}년 발매. ${album.shortDescription || album.description}`}
            aria-hidden={index !== currentIndex}
            className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-3xl ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => handleAlbumClick(album)}
            onKeyDown={(e) => handleKeyDown(e, album)}
            // 드래그 및 스와이프 속성
            drag={index === currentIndex && albums.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 0.95 }}
          >
            {/* 3D 앨범 커버 */}
            <div className="relative group">
              {/* 앨범 커버 그림자 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getAlbumTheme(album).primary} rounded-2xl blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-500 transform rotate-3 scale-105 ${
                index === currentIndex && albums.length > 1 ? 'animate-pulse' : ''
              }`} />
              
              {/* 메인 앨범 커버 */}
              <div className="relative transform-gpu group-hover:scale-110 group-hover:-rotate-2 group-active:scale-95 transition-all duration-500">
                <div className="w-48 h-48 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover"
                    loading={index === currentIndex ? 'eager' : 'lazy'}
                    fetchpriority={index === currentIndex ? 'high' : 'low'}
                    decoding={index === currentIndex ? 'sync' : 'async'}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* 비닐 레코드 효과 */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-2xl" />
                
                {/* 호버 시 플레이 버튼 */}
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 rounded-2xl ${
                  index === currentIndex && albums.length > 1 ? 'group-hover:animate-none' : ''
                }`}>
                  <div className="bg-white/90 rounded-full p-4 transform scale-0 group-hover:scale-100 group-active:scale-90 transition-transform duration-300 shadow-lg hover:shadow-xl">
                    <Play className="w-8 h-8 text-gray-950 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 앨범 정보 */}
      <div className="mt-6 mb-8 text-center">
        <div className="h-40 flex items-center justify-center relative">
          {albums.map((album, index) => (
            <div
              key={album.id}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative space-y-3 bg-black/50 rounded-2xl px-3 sm:px-4 md:px-6 py-5 w-full max-w-full min-h-28 shadow-xl border border-white/20">
                {/* 앨범 제목 */}
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-santokki text-white mb-2">
                  {album.title}
                </h2>
                
                {/* 연도 */}
                <div className="flex items-center justify-center gap-2 text-gray-300 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span className="font-wanted-sans text-sm sm:text-base">{album.year}년</span>
                </div>
                
                {/* 짧은 설명 */}
                <p className="text-sm sm:text-base text-gray-200 font-wanted-sans max-w-full mx-auto leading-relaxed line-clamp-4 sm:line-clamp-3 mb-3">
                  {album.shortDescription || album.description}
                </p>
                
                {/* 인터랙션 안내 */}
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 text-brand-primary-400 text-sm font-semibold hover:text-brand-primary-300 transition-colors">
                    <Play className="w-3 h-3" />
                    {album.primaryAction?.label || '음악 듣기'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 네비게이션 화살표 */}
      {albums.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            aria-label="이전 앨범 보기"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={handleNext}
            aria-label="다음 앨범 보기"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* 인디케이터 */}
      {albums.length > 1 && (
        <div 
          className="flex justify-center mt-6 space-x-2 relative z-20"
          role="group"
          aria-label="앨범 선택"
        >
          {albums.map((album, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`${index + 1}번째 앨범: ${album.title} 선택`}
              aria-current={index === currentIndex ? 'true' : 'false'}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                index === currentIndex 
                  ? `bg-white ${theme.glow}` 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(AlbumCarousel);