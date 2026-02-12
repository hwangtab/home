import React from 'react';
import type { Metadata } from 'next';
import Home from '../../../views/Home';
import { getAlternates, toAbsoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: 'Hwang Gyeongha Official Web',
  description: 'Official website of musician, sound engineer, and producer Hwang Gyeongha. Explore socially engaged music and artistic works.',
  keywords: ['Hwang Gyeongha', 'musician', 'producer', 'sound engineer', 'solidarity', 'minjung music', 'gentrification'],
  alternates: getAlternates('/', 'en'),
  openGraph: {
    title: 'Hwang Gyeongha Official Web',
    description: 'Official website of musician, sound engineer, and producer Hwang Gyeongha. Explore socially engaged music and artistic works.',
    url: toAbsoluteUrl('/en'),
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/images/og/default-og.svg', alt: 'Hwang Gyeongha Official Web' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hwang Gyeongha Official Web',
    description: 'Official website of musician, sound engineer, and producer Hwang Gyeongha. Explore socially engaged music and artistic works.',
    images: ['/images/og/default-og.svg']
  }
};

export default function EnPage() {
  return <Home />;
}
