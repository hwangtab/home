import React from 'react';
import type { Metadata } from 'next';
import Home from '../../views/Home';
import { getAlternates, toAbsoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: '황경하 공식 웹사이트',
  description: '황경하의 공식 웹사이트입니다. 음악과 사회적 연대 작업을 확인하세요.',
  keywords: ['황경하', '음악가', '프로듀서', '사운드 엔지니어', '연대', '민중음악', '젠트리피케이션'],
  alternates: getAlternates('/', 'ko'),
  openGraph: {
    title: '황경하 공식 웹사이트',
    description: '황경하의 공식 웹사이트입니다. 음악과 사회적 연대 작업을 확인하세요.',
    url: toAbsoluteUrl('/'),
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/images/og/default-og.png', alt: '황경하 공식 웹사이트', width: 1200, height: 630, type: 'image/png' }]
  }
};

export default function Page() {
  return <Home />;
}
