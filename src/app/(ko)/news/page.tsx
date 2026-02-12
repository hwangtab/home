import React from 'react';
import type { Metadata } from 'next';
import News from '../../../views/News';
import { getAlternates, toAbsoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: '소식',
  description: '황경하의 최신 소식, 공연 일정, 음반 소식을 확인하세요.',
  keywords: ['황경하', '소식', '공연', '앨범', '일정'],
  alternates: getAlternates('/news', 'ko'),
  openGraph: {
    title: '소식 | 황경하',
    description: '황경하의 최신 소식, 공연 일정, 음반 소식을 확인하세요.',
    url: toAbsoluteUrl('/news'),
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/images/og/default-og.svg', alt: '황경하 소식' }]
  }
};

export default function NewsPage() {
  return <News />;
}
