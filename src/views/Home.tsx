"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import { GridSkeleton } from '../components/ui/Skeleton';
import { useCachedPageData } from '../hooks/usePageData';
import { MusicWork, SiteData } from '../types/data.types';
import { useLanguage } from '../i18n';
import { getLocaleFromPathname, withLocalePrefix } from '../utils/localePath';

interface FeaturedWorksProps {
    siteData: SiteData | null;
}

const FeaturedWorks: React.FC<FeaturedWorksProps> = ({ siteData }) => {
    const { t } = useLanguage();
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname);
    const [featuredWorks, setFeaturedWorks] = useState<MusicWork[]>([]);

    useEffect(() => {
        if (!siteData) return;

        // 즉시 데이터 처리 - 로딩 시뮬레이션 제거
        const works = siteData.works?.music?.filter((item: MusicWork) =>
            item.featured && item.id !== 'melting-snow-2024'
        ).slice(0, 3) || [];
        setFeaturedWorks(works);
    }, [siteData]);

    return (
        <Section
            title={t('home.featuredWorks')}
            enableScrollAnimation={true}
            className="mt-16"
        >
            {!siteData || featuredWorks.length === 0 ? (
                <GridSkeleton items={3} columns={3} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {featuredWorks.map((work, index) => (
                        <div
                            key={work.id}
                            className="w-full bg-gray-750 p-6 rounded-lg shadow-lg transform-gpu hover:scale-105 transition-transform duration-300"
                        >
                            <Link href={withLocalePrefix(`/works/${work.id}`, locale)}>
                                <img
                                    src={work.cover || '/images/defaults/music-default.svg'}
                                    alt={work.title}
                                    className="w-full h-48 object-cover mb-4 rounded"
                                    loading="lazy"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        target.onerror = null;
                                        target.src = '/images/defaults/music-default.svg';
                                    }}
                                />
                                <h3 className="text-2xl font-bold mb-3 text-gray-100 font-santokki">
                                    {work.title} ({work.year})
                                </h3>
                                <p className="text-gray-300 font-wanted-sans text-sm line-clamp-3">
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
                        href={withLocalePrefix('/works', locale)}
                        className="inline-flex items-center bg-gray-750 text-white px-8 py-4 rounded-full font-wanted-sans hover:bg-gray-600 transition-all duration-300 transform-gpu"
                    >
                        {t('home.viewAllWorks')}
                    </Link>
                </div>
            </div>
        </Section>
    );
};

const QuickNavigation: React.FC = () => {
    const { t } = useLanguage();
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname);
    const quickLinks = [
        {
            name: t('nav.about'),
            path: '/about',
            description: t('home.quickLinks.aboutDesc'),
            icon: '👤',
            classes: {
                line: 'bg-brand-solidarity-500',
                iconBg: 'bg-brand-solidarity-500/10',
                iconBgHover: 'group-hover:bg-brand-solidarity-500/20',
                textHover: 'group-hover:text-brand-solidarity-300',
                arrow: 'text-brand-solidarity-400'
            }
        },
        {
            name: t('nav.works'),
            path: '/works',
            description: t('home.quickLinks.worksDesc'),
            icon: '🎵',
            classes: {
                line: 'bg-brand-earth-500',
                iconBg: 'bg-brand-earth-500/10',
                iconBgHover: 'group-hover:bg-brand-earth-500/20',
                textHover: 'group-hover:text-brand-earth-300',
                arrow: 'text-brand-earth-400'
            }
        },
        {
            name: t('nav.contact'),
            path: '/contact',
            description: t('home.quickLinks.contactDesc'),
            icon: '📞',
            classes: {
                line: 'bg-brand-harmony-500',
                iconBg: 'bg-brand-harmony-500/10',
                iconBgHover: 'group-hover:bg-brand-harmony-500/20',
                textHover: 'group-hover:text-brand-harmony-300',
                arrow: 'text-brand-harmony-400'
            }
        }
    ];

    return (
        <Section
            title={t('home.quickNav')}
            enableScrollAnimation={true}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
                {quickLinks.map((link, index) => (
                    <div
                        key={link.name}
                        className="w-full group bg-gray-750 hover:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 relative overflow-hidden hover:scale-105 hover:-translate-y-1"
                    >
                        {/* 브랜드 컬러 액센트 */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${link.classes.line}`} />

                        <Link href={withLocalePrefix(link.path, locale)} className="block">
                            <div className="flex flex-col items-center mb-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors duration-300 ${link.classes.iconBg} ${link.classes.iconBgHover}`}>
                                    <span className="text-2xl">{link.icon}</span>
                                </div>
                                <h3 className={`text-xl font-bold text-gray-100 font-santokki transition-colors duration-300 text-center ${link.classes.textHover}`}>
                                    {link.name}
                                </h3>
                            </div>
                            <p className="text-gray-300 group-hover:text-gray-200 font-wanted-sans transition-colors duration-300 text-center">
                                {link.description}
                            </p>

                            {/* 호버 시 화살표 */}
                            <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowRight className={`w-5 h-5 ${link.classes.arrow}`} />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Home: React.FC = () => {
    const { t, language } = useLanguage();
    const { data: siteData, loading, error } = useCachedPageData('home', language);

    // Always render PageHero to prevent double animation from layout shift
    return (
        <div className="contain-layout">
            <PageHero
                title={t('home.hero.title')}
                subtitle={t('home.hero.role')}
                imagePath="/images/hwang/11.png"
                height="100vh"
            />
            {loading ? (
                <Section title={t('home.featuredWorks')} enableScrollAnimation={false}>
                    <GridSkeleton items={3} columns={3} />
                </Section>
            ) : error ? (
                <Section title={t('common.error')} enableScrollAnimation={false}>
                    <div className="text-center text-gray-400">{t('common.loadingError')}</div>
                </Section>
            ) : (
                <>
                    <FeaturedWorks siteData={siteData} />
                    <QuickNavigation />
                </>
            )}
        </div>
    );
};

export default React.memo(Home);
