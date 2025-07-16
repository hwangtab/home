import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ExternalLink, ShoppingCart } from 'lucide-react';
import Section from '../components/Section';
import { useCachedPageData } from '../hooks/usePageData';
import { GridSkeleton } from '../components/ui/Skeleton';
import MetaDataManager from '../components/SEO/MetaDataManager';
import { usePageSEO } from '../hooks/useSEO';

const ConcertSlider = ({ concerts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % concerts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [concerts.length]);

  return (
    <motion.div 
      className="bg-gray-800 p-8 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="text-center"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-3xl font-bold mb-6 text-gray-200 font-santokki">
            {concerts[currentIndex].title}
          </h3>
          <p className="text-xl mb-4 font-wanted-sans text-gray-300">
            {concerts[currentIndex].date}
          </p>
          <p className="text-lg mb-8 font-wanted-sans text-gray-400">
            {concerts[currentIndex].location}
          </p>
          <motion.a
            href={concerts[currentIndex].ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gray-700 text-white px-8 py-4 rounded-full font-wanted-sans hover:bg-gray-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="mr-3" size={24} />
            공연정보
          </motion.a>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const AlbumPurchase = ({ album }) => (
  <motion.div 
    className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-stretch gap-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="md:w-1/2 flex flex-col justify-center">
      <motion.img 
        src={`${process.env.PUBLIC_URL}/${album.coverUrl}`}
        alt={album.title} 
        className="w-full h-auto object-cover rounded cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => window.open(album.purchaseUrl, '_blank')}
      />
    </div>
    <div className="md:w-1/2 flex flex-col justify-center">
      <h3 className="text-3xl font-bold mb-6 text-gray-200 font-santokki leading-tight">
        {album.title}
      </h3>
      <p className="text-xl mb-4 font-wanted-sans text-gray-300">
        {album.price}
      </p>
      <p className="text-gray-400 mb-6 font-wanted-sans">
        {album.description}
      </p>
      <motion.button 
        className="bg-gray-700 text-white px-8 py-4 rounded-full font-wanted-sans hover:bg-gray-600 transition duration-300 flex items-center justify-center self-start"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.open(album.purchaseUrl, '_blank')}
      >
        <ShoppingCart className="mr-3" size={24} />
        구매하기
      </motion.button>
    </div>
  </motion.div>
);

const NewsCard = ({ news }) => (
  <motion.div
    className="bg-gray-800 p-6 rounded-lg shadow-lg"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-xl font-bold text-gray-200 font-santokki">
        {news.title}
      </h3>
      {news.featured && (
        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-wanted-sans">
          NEW
        </span>
      )}
    </div>
    <p className="text-gray-400 font-wanted-sans text-sm mb-3">
      {news.date}
    </p>
    <p className="text-gray-300 font-wanted-sans">
      {news.content}
    </p>
  </motion.div>
);

const News = () => {
  const { data: siteData, loading, error } = useCachedPageData('news');

  // SEO 메타데이터
  const seoData = usePageSEO({
    title: '소식 - 황경하',
    description: '황경하의 최신 소식, 공연 일정, 새로운 앨범 정보 등을 확인하세요. 콘서트와 음반 구매 정보도 제공합니다.',
    keywords: ['황경하', '소식', '공연', '콘서트', '음반', '뉴스', '일정'],
    image: '/images/og/news-og.jpg'
  });

  if (loading) {
    return (
      <div>
        <MetaDataManager {...seoData} />
        <div className="container mx-auto py-8">
          <GridSkeleton count={3} columns="grid-cols-1" />
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div>
        <MetaDataManager {...seoData} />
        <div className="container mx-auto py-8 text-center">
          <p className="text-gray-300">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  const concerts = siteData.events?.concerts || [];
  // 데이터 구조 변경에 따라 'fish-album'을 works.music 배열에서 찾도록 수정
  const album = siteData.works?.music?.find(item => item.id === 'fish-without-water-2023');
  const news = siteData.news || [];

  return (
    <div>
      <MetaDataManager {...seoData} />
      <Section title="최신 소식">
        <div className="grid grid-cols-1 gap-6 mb-8">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </Section>

      <Section title="공연 일정">
        <ConcertSlider concerts={concerts} />
      </Section>

      {album && (
        <Section title="음반 구매">
          <AlbumPurchase album={album} />
        </Section>
      )}
    </div>
  );
};

export default React.memo(News);