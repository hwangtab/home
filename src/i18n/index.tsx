import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SupportedLanguage = 'ko' | 'en';

interface LanguageContextType {
    language: SupportedLanguage;
    changeLanguage: (lang: SupportedLanguage) => void;
    t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface TranslationValue {
    [key: string]: string | string[] | TranslationValue;
}

interface TranslationsMap {
    ko: TranslationValue;
    en: TranslationValue;
}

const translations: TranslationsMap = {
    ko: {
        // Navigation
        nav: {
            home: '홈',
            about: '소개',
            works: '작품',
            archive: '아카이브',
            news: '소식',
            contact: '연락처'
        },

        // Common
        common: {
            year: '년',
            loading: '로딩 중...',
            search: '검색',
            searchPlaceholder: '작품, 연도, 태그로 검색...',
            noResults: '검색 결과가 없습니다.',
            readMore: '더 보기',
            close: '닫기',
            download: '다운로드',
            share: '공유',
            back: '뒤로',
            next: '다음',
            previous: '이전'
        },

        // Home
        home: {
            hero: {
                title: '황경하',
                subtitle: '한국의 음악가, 사운드 엔지니어, 프로듀서, 그리고 연대자입니다.',
                viewWorks: '작품 보기'
            },
            latestSingle: '최신 싱글',
            featuredWorks: '주요 작품',
            viewAllWorks: '전체 작품 보기',
            quickNav: '둘러보기'
        },

        // About
        about: {
            title: '소개',
            philosophy: '예술 철학',
            timeline: '활동 연혁',
            resistanceTitle: '연대와 저항',
            resistanceText: '예술은 세상의 소외된 이들과 함께할 때 진정한 힘을 발휘합니다.',
            memoryTitle: '기록과 기억',
            memoryText: '사라져가는 것들, 잊혀져가는 것들을 예술로 기록하고 보존합니다.'
        },

        // Works
        works: {
            title: '작품',
            all: '전체',
            music: '음악',
            visual: '영상',
            writing: '글쓰기',
            performance: '공연',
            playAll: '전체 재생',
            videos: '비디오 작품',
            photography: '사진',
            essays: '에세이',
            interviews: '인터뷰',
            concerts: '콘서트',
            noWorks: '작품이 없습니다.',
            credits: '크레딧',
            setlist: '세트리스트',
            collaborators: '협력',
            photos: '사진',
            watchOriginal: '원본 보기',
            readArticle: '읽기'
        },

        // Archive
        archive: {
            title: '아카이브',
            subtitle: '2004년부터 현재까지, 20년간의 예술 활동을 기록합니다.',
            yearlyView: '연도별 보기',
            timelineView: '타임라인 보기',
            activities: '개의 주요 활동',
            overallTimeline: '전체 활동 연혁'
        },

        // News
        news: {
            title: '최신 소식',
            concerts: '공연 일정',
            albumPurchase: '음반 구매',
            concertInfo: '공연정보',
            purchase: '구매하기'
        },

        // Contact
        contact: {
            title: '연락처',
            info: '연락처 정보',
            email: '이메일',
            phone: '전화',
            address: '주소',
            form: {
                title: '문의하기',
                name: '이름',
                namePlaceholder: '성함을 입력해주세요',
                email: '이메일',
                emailPlaceholder: '이메일 주소를 입력해주세요',
                subject: '제목',
                subjectPlaceholder: '문의 제목을 입력해주세요',
                message: '메시지',
                messagePlaceholder: '문의 내용을 자세히 입력해주세요',
                send: '메시지 보내기',
                sending: '전송 중...',
                success: '메시지가 성공적으로 전송되었습니다!',
                error: '메시지 전송에 실패했습니다. 다시 시도해주세요.'
            },
            businessHours: '업무 시간',
            businessHoursText: '평일 10:00 - 18:00\n주말 및 공휴일 휴무',
            inquiryTypes: '문의 유형',
            inquiryTypesList: [
                '공연 및 콜라보레이션 문의',
                '인터뷰 및 취재 요청',
                '음반 구매 및 배송 문의',
                '기타 일반 문의'
            ]
        },

        // Music Player
        player: {
            playlist: '플레이리스트',
            shuffle: '셔플',
            repeat: '반복',
            volume: '볼륨',
            mute: '음소거'
        },

        // Footer
        footer: {
            copyright: '2024 황경하. All rights reserved.'
        }
    },

    en: {
        // Navigation
        nav: {
            home: 'Home',
            about: 'About',
            works: 'Works',
            archive: 'Archive',
            news: 'News',
            contact: 'Contact'
        },

        // Common
        common: {
            year: '',
            loading: 'Loading...',
            search: 'Search',
            searchPlaceholder: 'Search works, years, tags...',
            noResults: 'No search results found.',
            readMore: 'Read More',
            close: 'Close',
            download: 'Download',
            share: 'Share',
            back: 'Back',
            next: 'Next',
            previous: 'Previous'
        },

        // Home
        home: {
            hero: {
                title: 'Hwang Gyeongha',
                subtitle: 'Korean musician, sound engineer, producer, and solidarity activist.',
                viewWorks: 'View Works'
            },
            latestSingle: 'Latest Single',
            featuredWorks: 'Featured Works',
            viewAllWorks: 'View All Works',
            quickNav: 'Quick Navigation'
        },

        // About
        about: {
            title: 'About',
            philosophy: 'Artistic Philosophy',
            timeline: 'Career Timeline',
            resistanceTitle: 'Solidarity and Resistance',
            resistanceText: 'Art reveals its true power when it stands with the marginalized of the world.',
            memoryTitle: 'Record and Memory',
            memoryText: 'Recording and preserving things that are disappearing and being forgotten through art.'
        },

        // Works
        works: {
            title: 'Works',
            all: 'All',
            music: 'Music',
            visual: 'Visual',
            writing: 'Writing',
            performance: 'Performance',
            playAll: 'Play All',
            videos: 'Video Works',
            photography: 'Photography',
            essays: 'Essays',
            interviews: 'Interviews',
            concerts: 'Concerts',
            noWorks: 'No works available.',
            credits: 'Credits',
            setlist: 'Setlist',
            collaborators: 'Collaborators',
            photos: 'photos',
            watchOriginal: 'Watch Original',
            readArticle: 'Read'
        },

        // Archive
        archive: {
            title: 'Archive',
            subtitle: 'Recording 20 years of artistic activities from 2004 to present.',
            yearlyView: 'Yearly View',
            timelineView: 'Timeline View',
            activities: 'major activities',
            overallTimeline: 'Overall Timeline'
        },

        // News
        news: {
            title: 'Latest News',
            concerts: 'Concert Schedule',
            albumPurchase: 'Album Purchase',
            concertInfo: 'Concert Info',
            purchase: 'Purchase'
        },

        // Contact
        contact: {
            title: 'Contact',
            info: 'Contact Information',
            email: 'Email',
            phone: 'Phone',
            address: 'Address',
            form: {
                title: 'Get in Touch',
                name: 'Name',
                namePlaceholder: 'Please enter your name',
                email: 'Email',
                emailPlaceholder: 'Please enter your email address',
                subject: 'Subject',
                subjectPlaceholder: 'Please enter inquiry subject',
                message: 'Message',
                messagePlaceholder: 'Please describe your inquiry in detail',
                send: 'Send Message',
                sending: 'Sending...',
                success: 'Message sent successfully!',
                error: 'Failed to send message. Please try again.'
            },
            businessHours: 'Business Hours',
            businessHoursText: 'Weekdays 10:00 - 18:00\nClosed on weekends and holidays',
            inquiryTypes: 'Inquiry Types',
            inquiryTypesList: [
                'Performance and collaboration inquiries',
                'Interview and press requests',
                'Album purchase and shipping inquiries',
                'Other general inquiries'
            ]
        },

        // Music Player
        player: {
            playlist: 'Playlist',
            shuffle: 'Shuffle',
            repeat: 'Repeat',
            volume: 'Volume',
            mute: 'Mute'
        },

        // Footer
        footer: {
            copyright: '2024 Hwang Gyeongha. All rights reserved.'
        }
    }
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<SupportedLanguage>('ko');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as SupportedLanguage | null;
        if (savedLanguage === 'ko' || savedLanguage === 'en') {
            setLanguage(savedLanguage);
        }
    }, []);

    const changeLanguage = (lang: SupportedLanguage) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (path: string): string => {
        const keys = path.split('.');
        let value: TranslationValue | string | string[] | undefined = translations[language];

        for (const key of keys) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                value = value[key];
            } else {
                return path; // Return the path if translation not found
            }
        }

        return typeof value === 'string' ? value : path;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;
