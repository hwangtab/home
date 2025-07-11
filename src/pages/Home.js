import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Instagram, Youtube } from 'lucide-react';
import Section from '../components/Section';
import AlbumMosaic from '../components/AlbumMosaic';
import ArtisticOverlay from '../components/ArtisticOverlay';
import siteData from '../data';

const HeroSection = () => (
  <Section className="mb-0">
    <div 
      className="relative h-96 md:h-[70vh] bg-black overflow-hidden"
      data-hero-section
    >
      {/* 앨범 커버 모자이크 배경 - 새로운 데이터 구조에 맞게 수정 */}
      <AlbumMosaic 
        albums={siteData.works.music.filter(item => item.type === 'album')}
        singles={siteData.works.music.filter(item => item.type === 'single')}
        opacity={0.8}
        enableHover={true}
        enableClick={true}
      />
      
      {/* 아티스틱 오버레이 효과 */}
      <ArtisticOverlay />
      
      {/* 소셜 링크만 - 오른쪽 상단 */}
      <motion.div
        className="absolute top-8 right-8 z-20 flex space-x-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.a
          href="https://www.instagram.com/hwangtab"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Instagram className="w-5 h-5 text-white/80" />
        </motion.a>
        <motion.a
          href="https://www.youtube.com/@hwangtab"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Youtube className="w-5 h-5 text-white/80" />
        </motion.a>
      </motion.div>
      
      {/* 추가 블렌드 모드 레이어 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 mix-blend-multiply" />
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
    <Section title="최신 싱글" data-next-section>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: '멜론', url: latestSingle.links.melon, color: 'bg-green-500' },
              { name: '벅스', url: latestSingle.links.bugs, color: 'bg-orange-500' },
              { name: '지니', url: latestSingle.links.genie, color: 'bg-blue-500' },
              { name: '바이브', url: latestSingle.links.vibe, color: 'bg-purple-500' },
            ].map((service) => (
              <motion.a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${service.color} text-white px-6 py-3 rounded-full font-wanted-sans hover:opacity-90 transition duration-300 flex items-center justify-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="mr-2" size={16} />
                {service.name}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

const FeaturedWorks = () => {
  // 새로운 데이터 구조에 맞게 수정
  const featuredWorks = siteData.works.music.filter(item => 
    item.featured && item.id !== 'melting-snow-2024'
  ).slice(0, 3);

  return (
    <Section title="주요 작품">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredWorks.map((work) => (
          <motion.div 
            key={work.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
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
      </div>
      <div className="text-center mt-8">
        <Link 
          to="/works"
          className="inline-flex items-center bg-gray-700 text-white px-8 py-4 rounded-full font-wanted-sans hover:bg-gray-600 transition duration-300"
        >
          전체 작품 보기
          <ArrowRight className="ml-2" size={20} />
        </Link>
      </div>
    </Section>
  );
};

const QuickNavigation = () => {
  const quickLinks = [
    { name: '소개', path: '/about', description: '아티스트 소개와 철학' },
    { name: '아카이브', path: '/archive', description: '20년간의 활동 기록' },
    { name: '연락처', path: '/contact', description: '문의 및 연락처' }
  ];

  return (
    <Section title="둘러보기">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((link) => (
          <motion.div
            key={link.name}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to={link.path}>
              <h3 className="text-xl font-bold mb-3 text-gray-200 font-santokki">
                {link.name}
              </h3>
              <p className="text-gray-400 font-wanted-sans">
                {link.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedSingle />
      <FeaturedWorks />
      <QuickNavigation />
    </div>
  );
};

export default Home;