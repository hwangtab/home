import React from 'react';
import type { Metadata } from 'next';
import News from '../../../../views/News';
import { getAlternates, toAbsoluteUrl } from '../../../../lib/seo';

export const metadata: Metadata = {
  title: 'News - Hwang Gyeongha',
  description: 'Check the latest updates, concert schedule, and album information from Hwang Gyeongha.',
  keywords: ['Hwang Gyeongha', 'news', 'concert', 'album', 'schedule'],
  alternates: getAlternates('/news', 'en'),
  openGraph: {
    title: 'News - Hwang Gyeongha',
    description: 'Check the latest updates, concert schedule, and album information from Hwang Gyeongha.',
    url: toAbsoluteUrl('/en/news'),
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/images/og/default-og.png', alt: 'News by Hwang Gyeongha', width: 1200, height: 630, type: 'image/png' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News - Hwang Gyeongha',
    description: 'Check the latest updates, concert schedule, and album information from Hwang Gyeongha.',
    images: ['/images/og/default-og.png']
  }
};

export default function EnNewsPage() {
  return <News />;
}
