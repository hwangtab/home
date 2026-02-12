import { useMemo } from 'react';
import type { Work } from '../types/data.types';

interface SEOOptions {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    type?: string;
    work?: Work | null;
    customMeta?: Record<string, string>;
}

interface MusicData {
    title: string;
    description: string;
    year: number;
    cover?: string;
}

interface ArticleData {
    title: string;
    description: string;
    year: number;
    publication?: string;
}

interface SEOMetadata {
    title: string;
    description: string;
    keywords: string[];
    image?: string;
    type: string;
    musicData?: MusicData;
    articleData?: ArticleData;
    customMeta?: Record<string, string>;
}

interface PageConfig {
    title: string;
    description: string;
    keywords: string[];
    type: string;
}

/**
 * SEO 메타데이터 생성을 위한 커스텀 훅
 */
export const useSEO = (options: SEOOptions = {}): SEOMetadata => {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

    const {
        title,
        description,
        keywords = [],
        image,
        type = 'website',
        work = null,
        customMeta = {}
    } = options;

    // 작품별 메타데이터 생성
    const workMeta = useMemo((): SEOMetadata | null => {
        if (!work) return null;

        const baseTitle = `${work.title} - 황경하`;
        const baseDescription = work.shortDescription || work.description || '';
        const baseKeywords: string[] = [
            '황경하',
            work.title,
            work.type,
            work.archiveCategory || '',
            ...(work.tags || [])
        ].filter((tag): tag is string => Boolean(tag));

        // 음악 작품
        if (work.archiveCategory === 'music') {
            return {
                title: baseTitle,
                description: `${work.year}년 발매된 황경하의 ${work.type === 'album' ? '앨범' : '싱글'} "${work.title}". ${baseDescription}`,
                keywords: [...baseKeywords, '음반', '앨범', '민중음악', '연대'],
                image: work.cover,
                type: 'music.song',
                musicData: {
                    title: work.title,
                    description: baseDescription,
                    year: work.year,
                    cover: work.cover
                }
            };
        }

        // 글 작품
        if (work.archiveCategory === 'writing') {
            const workWithPublication = work as Work & { publication?: string };
            return {
                title: baseTitle,
                description: `${workWithPublication.publication ? `${workWithPublication.publication}에 게재된 ` : ''}황경하의 ${work.type} "${work.title}". ${baseDescription}`,
                keywords: [...baseKeywords, '글', '칼럼', '에세이', '저술'],
                image: work.cover,
                type: 'article',
                articleData: {
                    title: work.title,
                    description: baseDescription,
                    year: work.year,
                    publication: workWithPublication.publication
                }
            };
        }

        // 시각/공연 작품
        return {
            title: baseTitle,
            description: `${work.year}년 황경하의 ${work.type} "${work.title}". ${baseDescription}`,
            keywords: baseKeywords,
            image: work.cover,
            type: 'website'
        };
    }, [work]);

    // 페이지별 기본 메타데이터
    const pageMeta = useMemo((): PageConfig => {
        const pageConfigs: Record<string, PageConfig> = {
            '/': {
                title: '황경하 Official Web',
                description: '음악가이자 사운드 엔지니어, 프로듀서인 황경하의 공식 웹사이트입니다. 사회적 메시지를 담은 음악과 예술 활동을 만나보세요.',
                keywords: ['황경하', '음악가', '프로듀서', '사운드엔지니어', '연대', '민중음악', '젠트리피케이션'],
                type: 'website'
            },
            '/about': {
                title: '소개 - 황경하',
                description: '황경하는 현장에서 글, 음악, 사진 등의 예술이 힘을 갖는 순간에 주목하여 활동하는 음악가입니다.',
                keywords: ['황경하', '아티스트', '프로필', '음악가', '연대'],
                type: 'website'
            },
            '/works': {
                title: '작품 - 황경하',
                description: '황경하의 작품들을 만나보세요. 젠트리피케이션, 민중음악 선곡집 등 사회적 메시지를 담은 음반, 글, 공연.',
                keywords: ['황경하', '음반', '앨범', '민중음악', '연대', '작품', '글', '공연'],
                type: 'website'
            },
            '/news': {
                title: '소식 - 황경하',
                description: '황경하의 최신 소식과 공연 정보를 확인하세요.',
                keywords: ['황경하', '소식', '공연', '뉴스', '최신'],
                type: 'website'
            },
            '/contact': {
                title: '연락처 - 황경하',
                description: '황경하에게 연락하거나 협업을 제안하고 싶으시면 여기로 연락해주세요.',
                keywords: ['황경하', '연락처', '협업', '문의', '컨택'],
                type: 'website'
            }
        };

        return pageConfigs[pathname] || pageConfigs['/'];
    }, [pathname]);

    return {
        title: title || pageMeta.title,
        description: description || pageMeta.description,
        keywords: keywords.length > 0 ? keywords : pageMeta.keywords,
        image: image || undefined,
        type: type,
        ...(workMeta && { ...workMeta }),
        customMeta
    };
};

export const usePageSEO = useSEO;
