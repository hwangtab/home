import React from 'react';
import type { Metadata } from 'next';
import Contact from '../../../views/Contact';
import { getAlternates, toAbsoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: '연락처',
  description: '협업, 공연, 인터뷰 등 황경하 관련 문의 연락처입니다.',
  keywords: ['황경하', '연락처', '문의', '이메일', '전화'],
  alternates: getAlternates('/contact', 'ko'),
  openGraph: {
    title: '연락처 | 황경하',
    description: '협업, 공연, 인터뷰 등 황경하 관련 문의 연락처입니다.',
    url: toAbsoluteUrl('/contact'),
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/images/og/default-og.png', alt: '황경하 연락처', width: 1200, height: 630, type: 'image/png' }]
  }
};

export default function ContactPage() {
  return <Contact />;
}
