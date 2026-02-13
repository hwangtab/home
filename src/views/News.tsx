"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Calendar, ShoppingCart } from 'lucide-react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import { useCachedPageData } from '../hooks/usePageData';
import { GridSkeleton } from '../components/ui/Skeleton';
import { Concert, NewsItem } from '../types/data.types';
import { useLanguage } from '../i18n';
import { getWorkBySlug, getWorkCoverUrl, type WorkDetail } from '../lib/works';

interface ConcertSliderProps {
    concerts: Concert[];
}

const ConcertSlider: React.FC<ConcertSliderProps> = ({ concerts }) => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (concerts.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % concerts.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [concerts.length]);

    if (concerts.length === 0) return null;

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
                    {concerts[currentIndex].ticketUrl && (
                        <motion.a
                            href={concerts[currentIndex].ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-gray-700 text-white px-8 py-4 rounded-full font-wanted-sans hover:bg-gray-600 transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Calendar className="mr-3" size={24} />
                            {t('news.concertInfo')}
                        </motion.a>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
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

    return (
        <motion.div
            className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-stretch gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="md:w-1/2 flex flex-col justify-center">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Image
                        src={imageUrl}
                        alt={album.title}
                        width={960}
                        height={960}
                        className={`w-full h-auto object-cover rounded ${actionUrl ? 'cursor-pointer' : ''}`}
                        onClick={() => actionUrl && window.open(actionUrl, '_blank', 'noopener,noreferrer')}
                    />
                </motion.div>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-6 text-gray-200 font-santokki leading-tight">
                    {album.title}
                </h3>
                <p className="text-gray-400 mb-6 font-wanted-sans">
                    {album.description}
                </p>
                {actionUrl && (
                    <motion.button
                        className="bg-gray-700 text-white px-8 py-4 rounded-full font-wanted-sans hover:bg-gray-600 transition duration-300 flex items-center justify-center self-start"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(actionUrl, '_blank', 'noopener,noreferrer')}
                    >
                        <ShoppingCart className="mr-3" size={24} />
                        {actionLabel}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

interface NewsCardProps {
    news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => (
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

const News: React.FC = () => {
    const { t, language } = useLanguage();
    const { data: siteData, loading, error } = useCachedPageData('news', language);
    const album = useMemo(() => getWorkBySlug('fish-without-water-2023', language), [language]);

    if (loading) {
        return (
            <div>
                <div className="container mx-auto py-8">
                    <GridSkeleton items={3} columns={1} />
                </div>
            </div>
        );
    }

    if (error || !siteData) {
        return (
            <div>
                <div className="container mx-auto py-8 text-center">
                    <p className="text-gray-300">{t('common.loadingError')}</p>
                </div>
            </div>
        );
    }

    const concerts: Concert[] = siteData.events?.concerts || [];
    const news: NewsItem[] = siteData.news || [];

    return (
        <div>
            <PageHero
                title={t('news.pageTitle')}
                subtitle={t('news.pageSubtitle')}
                imagePath="/images/hwang/6.png"
            />

            <Section title={t('news.title')} className="mt-8">
                <div className="grid grid-cols-1 gap-6 mb-8">
                    {news.map((item) => (
                        <NewsCard key={item.id} news={item} />
                    ))}
                </div>
            </Section>

            <Section title={t('news.concerts')}>
                <ConcertSlider concerts={concerts} />
            </Section>

            {album && (
                <Section title={t('news.albumPurchase')}>
                    <AlbumPurchase album={album} />
                </Section>
            )}
        </div>
    );
};

export default React.memo(News);
