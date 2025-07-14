import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Instagram, Youtube, Play } from 'lucide-react';
import Section from '../components/Section';
import AlbumMosaic from '../components/AlbumMosaic';
import ArtisticOverlay from '../components/ArtisticOverlay';
import MetaDataManager from '../components/SEO/MetaDataManager';
import { usePageSEO } from '../hooks/useSEO';
import { GridSkeleton, CardSkeleton } from '../components/ui/Skeleton';
import siteData from '../data';

const HeroSection = () => (
  <Section className="mb-0">
    <div 
      className="relative h-96 md:h-[80vh] bg-black overflow-hidden"
      data-hero-section
    >
      {/* 앨범 커버 모자이크 배경 - 새로운 데이터 구조에 맞게 수정 */}
      <AlbumMosaic 
        albums={siteData.works.music.filter(item => item.type === 'album')}
        singles={siteData.works.music.filter(item => item.type === 'single')}
        opacity={0.6}
        enableHover={true}
        enableClick={true}
      />
      
      {/* 아티스틱 오버레이 효과 */}
      <ArtisticOverlay />
      
      {/* 중앙 콘텐츠 - 아티스트 메시지 */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center max-w-4xl px-6">
          {/* 메인 타이틀 */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold font-bombaram text-white mb-4 leading-none"> {/* 모바일 친화적 크기 */}
              황경하
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-primary-500 to-brand-solidarity-500 mx-auto rounded-full" />
          </motion.div>
          
          {/* 아티스트 정체성 */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-200 font-santokki mb-6 md:mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            음악가 · 사운드 엔지니어 · 프로듀서 · 연대자
          </motion.p>
          
          {/* 철학 메시지 */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-300 font-wanted-sans mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            세상의 소외된 이들이 필요로 하는 순간<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            예술을 통해 힘을 보태고자 합니다
          </motion.p>
          
          {/* CTA 버튼들 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/works" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 hover:from-brand-primary-500 hover:to-brand-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-wanted-sans font-medium text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl min-h-touch min-w-touch w-full sm:w-auto"
              >
                작품 둘러보기
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-brand-solidarity-600 to-brand-solidarity-700 hover:from-brand-solidarity-500 hover:to-brand-solidarity-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-wanted-sans font-medium text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl min-h-touch min-w-touch w-full sm:w-auto"
              >
                아티스트 소개
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* 소셜 링크 - 오른쪽 상단 */}
      <motion.div
        className="absolute top-8 right-8 z-30 flex space-x-3 transform-gpu"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.a
          href="https://www.instagram.com/hwangtab"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-brand-primary-500/20 hover:border-brand-primary-400/40 transition-all duration-300 transform-gpu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Instagram className="w-6 h-6 text-white/80" />
        </motion.a>
        <motion.a
          href="https://www.youtube.com/@hwangtab"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-brand-solidarity-500/20 hover:border-brand-solidarity-400/40 transition-all duration-300 transform-gpu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Youtube className="w-6 h-6 text-white/80" />
        </motion.a>
      </motion.div>
      
      {/* 강화된 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70 z-10" />
      
      {/* 스크롤 인디케이터 */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  </Section>
);

const FeaturedSingle = () => {
  // 새로운 데이터 구조에 맞게 수정
  const latestSingle = siteData.works.music.find(item => 
    item.tags.includes('latest')
  );

  if (!latestSingle) return null;

  return (
    <Section 
      title="최신 싱글" 
      enableScrollAnimation={true}
      data-next-section
    >
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-3xl aspect-video mb-8">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/WmI2EPjLr0c?si=LJEuW4BUpKdcL0bf"
              title="황경하 - 눈녹듯 (Official Lyric Video)"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
          <div className="flex justify-center">
            {latestSingle.primaryAction && (
              <motion.a
                href={latestSingle.primaryAction.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-primary-600 hover:bg-brand-primary-700 text-white px-8 py-4 rounded-full font-wanted-sans transition-all duration-300 flex items-center justify-center text-lg font-medium transform-gpu"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 40px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Play className="mr-2" size={20} />
                {latestSingle.primaryAction.label}
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

const FeaturedWorks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredWorks, setFeaturedWorks] = useState([]);

  useEffect(() => {
    // 시뮬레이션: 데이터 로딩
    const timer = setTimeout(() => {
      const works = siteData.works.music.filter(item => 
        item.featured && item.id !== 'melting-snow-2024'
      ).slice(0, 3);
      setFeaturedWorks(works);
      setIsLoading(false);
    }, 800); // 0.8초 로딩 시뮬레이션

    return () => clearTimeout(timer);
  }, []);

  return (
    <Section 
      title="주요 작품" 
      enableScrollAnimation={true}
    >
      {isLoading ? (
        <GridSkeleton items={3} columns={3} />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
              }
            }
          }}
        >
          {featuredWorks.map((work, index) => (
          <motion.div 
            key={work.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg transform-gpu"
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.9 },
              show: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }
              }
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Link to={`/works/music`}>
              <img 
                src={work.cover} 
                alt={work.title} 
                className="w-full h-48 object-cover mb-4 rounded" 
              />
              <h3 className="text-2xl font-bold mb-3 text-gray-200 font-santokki">
                {work.title} ({work.year})
              </h3>
              <p className="text-gray-400 font-wanted-sans text-sm line-clamp-3">
                {work.description}
              </p>
            </Link>
          </motion.div>
          ))}
        </motion.div>
      )}
      <div className="text-center mt-8">
        <motion.div
          whileHover={{ 
            scale: 1.03,
            boxShadow: "0 10px 30px rgba(75, 85, 99, 0.4)"
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          <Link 
            to="/works"
            className="inline-flex items-center bg-gray-700 text-white px-8 py-4 rounded-full font-wanted-sans hover:bg-gray-600 transition-all duration-300 transform-gpu"
          >
            전체 작품 보기
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </motion.div>
      </div>
    </Section>
  );
};

const QuickNavigation = () => {
  const quickLinks = [
    { 
      name: '소개', 
      path: '/about', 
      description: '아티스트 소개와 철학',
      color: 'brand-solidarity',
      icon: '👤'
    },
    { 
      name: '아카이브', 
      path: '/archive', 
      description: '20년간의 활동 기록',
      color: 'brand-earth',
      icon: '📚' 
    },
    { 
      name: '연락처', 
      path: '/contact', 
      description: '문의 및 연락처',
      color: 'brand-harmony',
      icon: '📞' 
    }
  ];

  return (
    <Section 
      title="둘러보기" 
      enableScrollAnimation={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((link, index) => (
          <motion.div
            key={link.name}
            className="group bg-gray-800 hover:bg-gray-750 p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 relative overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              y: -4
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* 브랜드 컬러 액센트 */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-${link.color}-500`} />
            
            <Link to={link.path} className="block">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-${link.color}-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-${link.color}-500/20 transition-colors duration-300`}>
                  <span className="text-2xl">{link.icon}</span>
                </div>
                <h3 className={`text-xl font-bold text-gray-200 group-hover:text-${link.color}-300 font-santokki transition-colors duration-300`}>
                  {link.name}
                </h3>
              </div>
              <p className="text-gray-400 group-hover:text-gray-300 font-wanted-sans transition-colors duration-300">
                {link.description}
              </p>
              
              {/* 호버 시 화살표 */}
              <motion.div
                className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <ArrowRight className={`w-5 h-5 text-${link.color}-400`} />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const Home = () => {
  const seoData = usePageSEO({
    title: '황경하 Official Web',
    description: '음악가이자 사운드 엔지니어, 프로듀서인 황경하의 공식 웹사이트입니다. 사회적 메시지를 담은 음악과 예술 활동을 만나보세요.',
    keywords: ['황경하', '음악가', '프로듀서', '사운드엔지니어', '연대', '민중음악', '젠트리피케이션'],
    image: '/images/og/home-og.jpg'
  });

  return (
    <div>
      <MetaDataManager {...seoData} />
      <HeroSection />
      <FeaturedSingle />
      <FeaturedWorks />
      <QuickNavigation />
    </div>
  );
};

export default Home;