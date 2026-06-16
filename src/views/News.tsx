"use client";

import React, { memo, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Calendar, ShoppingCart } from 'lucide-react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import { UnifiedCard } from '../components/ui/Card';
import { useNewsPageData } from '../hooks/usePageData';
import type { Concert, NewsItem } from '../types/data.types';
import { useLanguage } from '../i18n';
import { getWorkBySlug, getWorkCoverUrl, type WorkDetail } from '../lib/works';

const FADE_UP_MOTION = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } } as const;
const NEWS_CARD_MOTION = { whileHover: { scale: 1.02 }, transition: { type: 'spring', stiffness: 300 } } as const;

interface ConcertSliderProps {
  concerts: Concert[];
}

const ConcertSlider: React.FC<ConcertSliderProps> = ({ concerts }) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (concerts.length === 0) {
      setCurrentIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % concerts.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [concerts.length]);

  if (concerts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-700 bg-gray-900/60 p-6 text-center text-gray-400">
        {t('news.noConcerts')}
      </div>
    );
  }

  const currentConcert = concerts[currentIndex];

  // concert.id를 key로 사용하여 데이터 변경 시 안정성 보장
  // currentIndex에 종속되지 않아 불필요한 unmount/remount 방지
  const key = currentConcert.id;

  return (
    <UnifiedCard
      padding="lg"
      motionProps={FADE_UP_MOTION}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={key}
          className="text-center"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="mb-6 font-santokki text-3xl font-bold text-gray-200">{currentConcert.title}</h3>
          <p className="mb-4 font-wanted-sans text-xl text-gray-300">{currentConcert.date}</p>
          <p className="mb-8 font-wanted-sans text-lg text-gray-400">{currentConcert.location}</p>
          {currentConcert.ticketUrl ? (
            <motion.a
              href={currentConcert.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-gray-700 px-8 py-4 font-wanted-sans text-white transition duration-300 hover:bg-gray-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="mr-3" size={24} />
              {t('news.concertInfo')}
            </motion.a>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </UnifiedCard>
  );
};

interface AlbumPurchaseProps {
  album: WorkDetail;
}

const AlbumPurchase: React.FC<AlbumPurchaseProps> = ({ album }) => {
  const { t } = useLanguage();
  const imageUrl = getWorkCoverUrl(album.cover, album.category);
  const actionUrl = album.primaryAction?.url;
  const actionLabel = album.primaryAction?.label || t('news.purchase');
  const albumImage = (
    <Image
      src={imageUrl}
      alt={album.title}
      width={960}
      height={960}
      className={`h-auto w-full rounded object-cover ${actionUrl ? 'cursor-pointer' : ''}`}
    />
  );

  return (
    <UnifiedCard
      padding="lg"
      className="flex flex-col items-stretch gap-12 md:flex-row"
      motionProps={FADE_UP_MOTION}
    >
      <div className="flex flex-col justify-center md:w-1/2">
        {actionUrl ? (
          <motion.a
            href={actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${actionLabel}: ${album.title}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {albumImage}
          </motion.a>
        ) : (
          <motion.div transition={{ type: 'spring', stiffness: 300 }}>
            {albumImage}
          </motion.div>
        )}
      </div>
      <div className="flex flex-col justify-center md:w-1/2">
        <h3 className="mb-6 font-santokki text-3xl font-bold leading-tight text-gray-200">{album.title}</h3>
        <p className="mb-6 font-wanted-sans text-gray-400">{album.description}</p>
        {actionUrl ? (
          <motion.a
            href={actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex self-start rounded-full bg-gray-700 px-8 py-4 font-wanted-sans text-white transition duration-300 hover:bg-gray-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="mr-3" size={24} />
            {actionLabel}
          </motion.a>
        ) : null}
      </div>
    </UnifiedCard>
  );
};

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard = memo<NewsCardProps>(({ news }) => (
  <UnifiedCard
    padding="lg"
    motionProps={NEWS_CARD_MOTION}
  >
    <div className="mb-4 flex items-start justify-between">
      <h3 className="font-santokki text-xl font-bold text-gray-200">{news.title}</h3>
      {news.featured ? (
        <span className="rounded-full bg-red-600 px-2 py-1 text-xs text-white font-wanted-sans">NEW</span>
      ) : null}
    </div>
    <p className="mb-3 font-wanted-sans text-sm text-gray-400">{news.date}</p>
    <p className="font-wanted-sans text-gray-300">{news.content}</p>
  </UnifiedCard>
));

const News: React.FC = () => {
  const { t, language } = useLanguage();
  const { data: newsPageData } = useNewsPageData(language);
  const album = useMemo(() => getWorkBySlug('fish-without-water-2023', language), [language]);

  return (
    <div>
      <PageHero
        title={t('news.pageTitle')}
        subtitle={t('news.pageSubtitle')}
        imagePath="/images/hwang/6.png"
      />

      <Section title={t('news.title')} className="mt-8">
        {newsPageData.news.length > 0 ? (
          <div className="mb-8 grid grid-cols-1 gap-6">
            {newsPageData.news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-700 bg-gray-900/60 p-6 text-center text-gray-400">
            {t('news.noNews')}
          </div>
        )}
      </Section>

      <Section title={t('news.concerts')}>
        <ConcertSlider concerts={newsPageData.events.concerts} />
      </Section>

      {album ? (
        <Section title={t('news.albumPurchase')}>
          <AlbumPurchase album={album} />
        </Section>
      ) : null}
    </div>
  );
};

export default React.memo(News);
