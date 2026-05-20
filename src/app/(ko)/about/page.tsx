import React from 'react';
import type { Metadata } from 'next';
import About from '../../../views/About';
import { getAlternates, toAbsoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: '소개',
  description: '황경하의 작업 철학과 활동 배경을 소개합니다.',
  keywords: ['황경하', '아티스트', '프로필', '음악가', '연대', '사회운동'],
  alternates: getAlternates('/about', 'ko'),
  openGraph: {
    title: '소개 | 황경하',
    description: '황경하의 작업 철학과 활동 배경을 소개합니다.',
    url: toAbsoluteUrl('/about'),
    locale: 'ko_KR',
    type: 'profile',
    images: [{ url: '/images/og/default-og.png', alt: '황경하 소개', width: 1200, height: 630, type: 'image/png' }]
  }
};

export default function AboutPage() {
  return <About />;
}
