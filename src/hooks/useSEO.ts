import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
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
    const location = useLocation();

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
        const baseKeywords = [
            '황경하',
            work.title,
            work.type,
            work.archiveCategory || '',
            ...(work.tags || [])
        ].filter(Boolean);

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
        const pathname = location.pathname;

        const pageConfigs: Record<string, PageConfig> = {
            '/': {
                title: '황경하 Official Web',
                description: '음악가이자 사운드 엔지니어, 프로듀서인 황경하의 공식 웹사이트입니다. 사회적 메시지를 담은 음악과 예술 활동을 만나보세요.',
                keywords: ['황경하', '음악가', '프로듀서', '사운드엔지니어', '연대', '민중음악', '젠트리피케이션'],
                type: 'website'
            },
            '/about': {
                title: '소개 - 황경하',
                description: '황경하는 현장에서 글, 음악, 사진 등의 예술이 힘을 갖는 순간에 주목하여 활동하는 음악가입니다. 세상의 소외된 이들과 함께합니다.',
                keywords: ['황경하', '아티스트', '프로필', '음악가', '연대', '사회운동', '예술가'],
                type: 'profile'
            },
            '/works': {
                title: '작품 - 황경하',
                description: '황경하의 음악 작품들을 만나보세요. 젠트리피케이션, 민중음악 선곡집, 몸의 중심 등 사회적 메시지를 담은 음반과 글들을 소개합니다.',
                keywords: ['황경하', '음반', '앨범', '민중음악', '연대', '작품', '젠트리피케이션', '몸의중심'],
                type: 'website'
            },
            '/news': {
                title: '소식 - 황경하',
                description: '황경하의 최신 소식과 공연 정보를 확인하세요. 새로운 음반 발매와 공연 일정을 놓치지 마세요.',
                keywords: ['황경하', '소식', '공연', '뉴스', '최신', '일정'],
                type: 'website'
            },
            '/contact': {
                title: '연락처 - 황경하',
                description: '황경하에게 연락하거나 협업을 제안하고 싶으시면 여기로 연락해주세요. 스튜디오 놀에서 다양한 프로젝트를 진행합니다.',
                keywords: ['황경하', '연락처', '협업', '문의', '컨택', '스튜디오놀'],
                type: 'website'
            }
        };

        return pageConfigs[pathname] || pageConfigs['/'];
    }, [location.pathname]);

    // 최종 메타데이터 결합
    const finalMeta = useMemo((): SEOMetadata => {
        if (workMeta) {
            return {
                ...workMeta,
                ...options
            } as SEOMetadata;
        }

        return {
            title: title || pageMeta.title,
            description: description || pageMeta.description,
            keywords: keywords.length > 0 ? keywords : pageMeta.keywords,
            type: type !== 'website' ? type : pageMeta.type,
            image: image,
            customMeta
        };
    }, [workMeta, pageMeta, title, description, keywords, type, image, customMeta, options]);

    return finalMeta;
};

/**
 * 작품별 SEO 메타데이터 생성 훅
 */
export const useWorkSEO = (work: Work | null): SEOMetadata => {
    return useSEO({ work });
};

/**
 * 페이지별 SEO 메타데이터 생성 훅
 */
export const usePageSEO = (pageOptions: SEOOptions = {}): SEOMetadata => {
    return useSEO(pageOptions);
};

export default useSEO;
