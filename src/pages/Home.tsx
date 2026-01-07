import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import MetaDataManager from '../components/SEO/MetaDataManager';
import { usePageSEO } from '../hooks/useSEO';
import { GridSkeleton } from '../components/ui/Skeleton';
import { useCachedPageData } from '../hooks/usePageData';
import { MusicWork, SiteData } from '../types/data.types';

interface FeaturedWorksProps {
    siteData: SiteData | null;
}

const FeaturedWorks: React.FC<FeaturedWorksProps> = ({ siteData }) => {
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
            title="주요 작품"
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
                            <Link to={`/works?category=music&id=${work.id}`}>
                                <img
                                    src={work.cover}
                                    alt={work.title}
                                    className="w-full h-48 object-cover mb-4 rounded"
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
                        to="/works"
                        className="inline-flex items-center bg-gray-750 text-white px-8 py-4 rounded-full font-wanted-sans hover:bg-gray-600 transition-all duration-300 transform-gpu"
                    >
                        전체 작품 보기
                    </Link>
                </div>
            </div>
        </Section>
    );
};

const QuickNavigation: React.FC = () => {
    const quickLinks = [
        {
            name: '소개',
            path: '/about',
            description: '아티스트 소개와 철학',
            color: 'brand-solidarity',
            icon: '👤'
        },
        {
            name: '작품',
            path: '/works',
            description: '음악, 글, 공연 작품 모음',
            color: 'brand-earth',
            icon: '🎵'
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
                        className="w-full group bg-gray-750 hover:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 relative overflow-hidden hover:scale-105 hover:-translate-y-1"
                    >
                        {/* 브랜드 컬러 액센트 - using dynamic class names might break if not safelisted in purgecss/tailwind config, assuming they are ok or using style */}
                        <div className={`absolute top-0 left-0 w-full h-1 bg-${link.color}-500`} />

                        <Link to={link.path} className="block">
                            <div className="flex flex-col items-center mb-4">
                                <div className={`w-12 h-12 bg-${link.color}-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-${link.color}-500/20 transition-colors duration-300`}>
                                    <span className="text-2xl">{link.icon}</span>
                                </div>
                                <h3 className={`text-xl font-bold text-gray-100 group-hover:text-${link.color}-300 font-santokki transition-colors duration-300 text-center`}>
                                    {link.name}
                                </h3>
                            </div>
                            <p className="text-gray-300 group-hover:text-gray-200 font-wanted-sans transition-colors duration-300 text-center">
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

const Home: React.FC = () => {
    const { data: siteData, loading, error } = useCachedPageData('home');

    const seoData = usePageSEO({
        title: '황경하 Official Web',
        description: '음악가이자 사운드 엔지니어, 프로듀서인 황경하의 공식 웹사이트입니다. 사회적 메시지를 담은 음악과 예술 활동을 만나보세요.',
        keywords: ['황경하', '음악가', '프로듀서', '사운드엔지니어', '연대', '민중음악', '젠트리피케이션'],
        image: '/images/og/home-og.jpg'
    });

    // Always render PageHero to prevent double animation from layout shift
    return (
        <div className="contain-layout">
            <MetaDataManager {...seoData} />
            <PageHero
                title="황경하"
                subtitle="음악가 · 사운드 엔지니어 · 프로듀서"
                imagePath="/images/hwang/11.png"
                height="100vh"
            />
            {loading ? (
                <Section title="주요 작품" enableScrollAnimation={false}>
                    <GridSkeleton items={3} columns={3} />
                </Section>
            ) : error ? (
                <Section title="오류" enableScrollAnimation={false}>
                    <div className="text-center text-gray-400">데이터를 불러오는 중 오류가 발생했습니다.</div>
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
