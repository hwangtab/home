import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * 동적 메타데이터 관리 컴포넌트
 */
const MetaDataManager = ({
  title,
  description,
  keywords = [],
  image,
  type = 'website',
  url,
  articleData,
  musicData,
  customMeta = {}
}) => {
  const location = useLocation();

  // 기본 사이트 정보
  const siteInfo = {
    siteName: '황경하 Official Web',
    domain: 'https://hwang-gyeongha.vercel.app',
    defaultImage: '/images/og/default-og.jpg',
    defaultDescription: '황경하의 공식 웹사이트입니다. 음악과 공연 정보를 확인하세요.',
    twitterHandle: '@podopodopo'
  };

  // 현재 URL 생성
  const currentUrl = url || `${siteInfo.domain}${location.pathname}`;

  // 페이지별 기본 메타데이터
  const getPageDefaults = (pathname) => {
    const pages = {
      '/': {
        title: '황경하 Official Web',
        description: '음악가이자 사운드 엔지니어, 프로듀서인 황경하의 공식 웹사이트입니다.',
        keywords: ['황경하', '음악가', '프로듀서', '사운드엔지니어', '연대', '민중음악']
      },
      '/about': {
        title: '소개 - 황경하',
        description: '황경하는 현장에서 글, 음악, 사진 등의 예술이 힘을 갖는 순간에 주목하여 활동하는 음악가입니다.',
        keywords: ['황경하', '아티스트', '프로필', '음악가', '연대']
      },
      '/works': {
        title: '작품 - 황경하',
        description: '황경하의 음악 작품들을 만나보세요. 젠트리피케이션, 민중음악 선곡집 등 사회적 메시지를 담은 음반들.',
        keywords: ['황경하', '음반', '앨범', '민중음악', '연대', '작품']
      },
      '/news': {
        title: '소식 - 황경하',
        description: '황경하의 최신 소식과 공연 정보를 확인하세요.',
        keywords: ['황경하', '소식', '공연', '뉴스', '최신']
      },
      '/contact': {
        title: '연락처 - 황경하',
        description: '황경하에게 연락하거나 협업을 제안하고 싶으시면 여기로 연락해주세요.',
        keywords: ['황경하', '연락처', '협업', '문의', '컨택']
      }
    };

    return pages[pathname] || pages['/'];
  };

  const pageDefaults = getPageDefaults(location.pathname);

  // 최종 메타데이터 구성
  const finalTitle = title || pageDefaults.title;
  const finalDescription = description || pageDefaults.description;
  const finalKeywords = keywords.length > 0 ? keywords : pageDefaults.keywords;
  const finalImage = image || siteInfo.defaultImage;

  // JSON-LD 구조화된 데이터 생성
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "황경하",
      "alternateName": "Hwang Gyeongha",
      "description": "음악가, 사운드 엔지니어, 프로듀서",
      "url": siteInfo.domain,
      "image": finalImage,
      "sameAs": [
        "https://www.instagram.com/podopodopo/",
        "https://www.youtube.com/@artliberationfront"
      ],
      "jobTitle": ["음악가", "사운드 엔지니어", "프로듀서"],
      "worksFor": {
        "@type": "Organization",
        "name": "스튜디오 놀"
      }
    };

    // 음악 작품 데이터 추가
    if (musicData) {
      return {
        "@context": "https://schema.org",
        "@type": "MusicAlbum",
        "name": musicData.title,
        "description": musicData.description,
        "datePublished": musicData.year,
        "byArtist": {
          "@type": "Person",
          "name": "황경하"
        },
        "image": musicData.cover,
        "url": currentUrl
      };
    }

    // 글 작품 데이터 추가
    if (articleData) {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": articleData.title,
        "description": articleData.description,
        "datePublished": articleData.year,
        "author": {
          "@type": "Person",
          "name": "황경하"
        },
        "publisher": {
          "@type": "Organization",
          "name": articleData.publication || "황경하"
        },
        "image": finalImage,
        "url": currentUrl
      };
    }

    return baseData;
  };

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords.join(', ')} />
      <meta name="author" content="황경하" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph 태그 */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteInfo.siteName} />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter Card 태그 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content={siteInfo.twitterHandle} />
      <meta name="twitter:creator" content={siteInfo.twitterHandle} />

      {/* 추가 메타 태그 */}
      <meta name="theme-color" content="#1f2937" />
      <meta name="msapplication-TileColor" content="#1f2937" />

      {/* 커스텀 메타 태그 */}
      {Object.entries(customMeta).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}

      {/* 구조화된 데이터 */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
};

/**
 * HelmetProvider로 감싸는 래퍼 컴포넌트
 */
export const SEOProvider = ({ children }) => {
  return (
    <HelmetProvider>
      {children}
    </HelmetProvider>
  );
};

export default MetaDataManager;