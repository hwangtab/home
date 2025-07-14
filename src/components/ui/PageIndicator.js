import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSwipeNavigation from '../../hooks/useSwipeNavigation';

/**
 * 모바일 페이지 인디케이터 컴포넌트
 * 현재 페이지 위치와 스와이프 네비게이션 힌트 제공
 */
const PageIndicator = memo(({ className = '' }) => {
  const { 
    hasPrevious, 
    hasNext, 
    previousPage, 
    nextPage, 
    currentIndex, 
    totalPages 
  } = useSwipeNavigation();

  // 페이지 이름 매핑
  const pageNames = {
    '/': '홈',
    '/about': '소개',
    '/works': '작품',
    '/archive': '아카이브',
    '/news': '소식',
    '/contact': '연락처'
  };

  return (
    <div className={`md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 ${className}`}>
      <div className="bg-gray-800/90 backdrop-blur-md rounded-full px-4 py-2 border border-gray-700/50 shadow-lg">
        <div className="flex items-center space-x-4">
          {/* 이전 페이지 버튼 */}
          <motion.div
            className={`${hasPrevious ? 'opacity-100' : 'opacity-30'}`}
            whileTap={{ scale: 0.95 }}
          >
            {hasPrevious ? (
              <Link 
                to={previousPage}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary-500/20 hover:bg-brand-primary-500/30 transition-colors duration-200"
                aria-label="이전 페이지"
              >
                <ChevronLeft className="w-4 h-4 text-brand-primary-400" />
              </Link>
            ) : (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600/20">
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </div>
            )}
          </motion.div>
          
          {/* 페이지 도트 인디케이터 */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-brand-primary-400 w-6' 
                    : 'bg-gray-600'
                }`}
                layoutId={index === currentIndex ? 'activePageDot' : undefined}
              />
            ))}
          </div>
          
          {/* 다음 페이지 버튼 */}
          <motion.div
            className={`${hasNext ? 'opacity-100' : 'opacity-30'}`}
            whileTap={{ scale: 0.95 }}
          >
            {hasNext ? (
              <Link 
                to={nextPage}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary-500/20 hover:bg-brand-primary-500/30 transition-colors duration-200"
                aria-label="다음 페이지"
              >
                <ChevronRight className="w-4 h-4 text-brand-primary-400" />
              </Link>
            ) : (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600/20">
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </div>
            )}
          </motion.div>
        </div>
        
        {/* 현재 페이지 이름 */}
        <motion.div 
          className="text-center mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={currentIndex}
        >
          <span className="text-xs text-gray-400 font-wanted-sans">
            {pageNames[window.location.pathname] || '페이지'}
          </span>
        </motion.div>
      </div>
      
      {/* 스와이프 힌트 (첫 방문시에만 표시) */}
      <motion.div
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -10 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-300 whitespace-nowrap">
          좌우로 스와이프하여 페이지 이동
        </div>
        <div className="w-2 h-2 bg-gray-900/80 transform rotate-45 mx-auto -mt-1" />
      </motion.div>
    </div>
  );
});

PageIndicator.displayName = 'PageIndicator';

export default PageIndicator;