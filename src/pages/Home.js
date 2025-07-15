import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Youtube, Play, Music, ExternalLink, Mail } from 'lucide-react';
import Section from '../components/Section';
import DynamicBackground from '../components/effects/DynamicBackground';
import InteractiveElements from '../components/effects/InteractiveElements';
import ArtisticOverlay from '../components/ArtisticOverlay';
import AlbumCarousel from '../components/effects/AlbumCarousel';
import MetaDataManager from '../components/SEO/MetaDataManager';
import { usePageSEO } from '../hooks/useSEO';
import { GridSkeleton } from '../components/ui/Skeleton';
import siteData from '../data';

const HeroSection = () => (
  <Section className="mb-0">
    <div 
      className="relative min-h-[100vh] sm:min-h-[90vh] md:min-h-[80vh] bg-black flex items-center justify-center py-8 sm:py-12 overflow-hidden"
      data-hero-section
    >
      {/* 동적 배경 효과 */}
      <DynamicBackground />
      
      {/* 인터랙티브 요소 */}
      <InteractiveElements />
      
      {/* 아티스틱 오버레이 효과 */}
      <ArtisticOverlay />
      
      {/* 중앙 콘텐츠 - 아티스트 메시지 */}
      <div className="relative z-20 px-4 sm:px-6 w-full">
        <div className="text-center max-w-4xl w-full mx-auto">
          {/* 메인 앨범 카루셀 */}
          <AlbumCarousel 
            albums={siteData.works.music.filter(item => item.featured)}
            className="mb-8 sm:mb-10"
          />
          
          {/* CTA 버튼들 - 앨범 중심으로 수정 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
            {/* 주요 CTA - 전체 작품 보기 */}
            <div className="relative group flex-1 sm:flex-none">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-all duration-300 group-hover:scale-110"></div>
              <Link 
                to="/works" 
                className="relative inline-flex items-center justify-center bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 hover:from-brand-primary-500 hover:to-brand-primary-600 text-white px-5 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-wanted-sans font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 min-h-touch w-full sm:w-auto border border-white/20 backdrop-blur-sm"
              >
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                  <Music className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="whitespace-nowrap">전체 작품 보기</span>
                </span>
                
                {/* 내부 글로우 효과 */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                
                {/* 애니메이션 링 */}
                <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </Link>
            </div>
            
            {/* 보조 CTA - 연락하기 */}
            <div className="relative group flex-1 sm:flex-none">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-solidarity-600 to-brand-solidarity-700 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-all duration-300 group-hover:scale-105"></div>
              <Link 
                to="/contact" 
                className="relative inline-flex items-center justify-center bg-gradient-to-r from-brand-solidarity-600/80 to-brand-solidarity-700/80 hover:from-brand-solidarity-500/90 hover:to-brand-solidarity-600/90 text-white px-5 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-wanted-sans font-medium text-sm sm:text-base md:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 hover:scale-102 min-h-touch w-full sm:w-auto border border-brand-solidarity-400/30 backdrop-blur-sm"
              >
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="whitespace-nowrap">연락하기</span>
                </span>
                
                {/* 네온 글로우 */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-solidarity-400/20 to-brand-solidarity-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 소셜 링크 - 반응형 위치 */}
      <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-30 flex space-x-2 sm:space-x-3 transform-gpu">
        <a
          href="https://www.instagram.com/hwangtab"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-brand-primary-500/20 hover:border-brand-primary-400/40 transition-all duration-300 transform-gpu min-h-touch min-w-touch"
        >
          <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
        </a>
        <a
          href="https://www.youtube.com/@hwangtab"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-brand-solidarity-500/20 hover:border-brand-solidarity-400/40 transition-all duration-300 transform-gpu min-h-touch min-w-touch"
        >
          <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
        </a>
      </div>
      
      {/* 섹션 구분선 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
    </div>
  </Section>
);


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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {featuredWorks.map((work, index) => (
          <div 
            key={work.id}
            className="w-full bg-gray-800 p-6 rounded-lg shadow-lg transform-gpu hover:scale-105 transition-transform duration-300"
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
          </div>
          ))}
        </div>
      )}
      <div className="text-center mt-8">
        <div className="hover:scale-105 transition-transform duration-200">
          <Link 
            to="/works"
            className="inline-flex items-center bg-gray-700 text-white px-8 py-4 rounded-full font-wanted-sans hover:bg-gray-600 transition-all duration-300 transform-gpu"
          >
            전체 작품 보기
          </Link>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {quickLinks.map((link, index) => (
          <div
            key={link.name}
            className="w-full group bg-gray-800 hover:bg-gray-750 p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 relative overflow-hidden hover:scale-105 hover:-translate-y-1"
          >
            {/* 브랜드 컬러 액센트 */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-${link.color}-500`} />
            
            <Link to={link.path} className="block">
              <div className="flex flex-col items-center mb-4">
                <div className={`w-12 h-12 bg-${link.color}-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-${link.color}-500/20 transition-colors duration-300`}>
                  <span className="text-2xl">{link.icon}</span>
                </div>
                <h3 className={`text-xl font-bold text-gray-200 group-hover:text-${link.color}-300 font-santokki transition-colors duration-300 text-center`}>
                  {link.name}
                </h3>
              </div>
              <p className="text-gray-400 group-hover:text-gray-300 font-wanted-sans transition-colors duration-300 text-center">
                {link.description}
              </p>
              
              {/* 호버 시 화살표 */}
              <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className={`w-5 h-5 text-${link.color}-400`} />
              </div>
            </Link>
          </div>
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
      <FeaturedWorks />
      <QuickNavigation />
    </div>
  );
};

export default Home;