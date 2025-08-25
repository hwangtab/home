import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Music, Instagram, Youtube } from 'lucide-react';

/**
 * 미니멀한 브랜딩 요소들
 * 아티스틱한 히어로 섹션에 필요한 최소한의 브랜딩과 네비게이션
 */
const MinimalBranding = ({ onScrollHint }) => {
  return (
    <>
      {/* 아티스트 심볼 - 왼쪽 상단 */}
      <motion.div
        className="absolute top-8 left-8 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
          <Music className="w-6 h-6 text-white/80" />
        </div>
      </motion.div>

      {/* 소셜 링크 - 오른쪽 상단 */}
      <motion.div
        className="absolute top-8 right-8 z-20 flex space-x-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <motion.a
          href="https://www.instagram.com/podopodopo/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Instagram className="w-5 h-5 text-white/80" />
        </motion.a>
        <motion.a
          href="https://www.youtube.com/@artliberationfront"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Youtube className="w-5 h-5 text-white/80" />
        </motion.a>
      </motion.div>

      {/* 아티스트 이름 - 하단 중앙 (스크롤 시 나타남) */}
      <motion.div
        className="absolute bottom-20 md:bottom-24 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <div className="text-center px-4">
          <h1 className="text-3xl md:text-6xl font-bold text-white/90 font-bombaram tracking-wider">
            황경하
          </h1>
          <p className="text-white/60 font-wanted-sans text-xs md:text-base mt-2 tracking-widest">
            MUSICIAN · ACTIVIST
          </p>
        </div>
      </motion.div>

      {/* 스크롤 힌트 - 하단 중앙 */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        onClick={onScrollHint}
      >
        <motion.div
          className="flex flex-col items-center space-y-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-px h-8 bg-white/40" />
          <ChevronDown className="w-6 h-6 text-white/60" />
          <span className="text-white/40 text-xs font-wanted-sans tracking-widest">
            SCROLL
          </span>
        </motion.div>
      </motion.div>

      {/* 플로팅 뮤직 노트 (데코레이션) */}
      <motion.div
        className="absolute top-1/3 left-1/4 z-10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <div className="text-white/20 text-4xl font-bold">♪</div>
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-1/4 z-10"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -8, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <div className="text-white/20 text-3xl font-bold">♫</div>
      </motion.div>

      {/* 추상적 기하학 형태들 */}
      <motion.div
        className="absolute top-1/4 right-1/3 w-2 h-2 bg-white/30 rounded-full z-10"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/3 w-1 h-16 bg-white/20 z-10"
        animate={{
          scaleY: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
    </>
  );
};

export default MinimalBranding;