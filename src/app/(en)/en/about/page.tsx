import React from 'react';
import type { Metadata } from 'next';
import About from '../../../../views/About';
import { getAlternates, toAbsoluteUrl } from '../../../../lib/seo';

export const metadata: Metadata = {
  title: 'About - Hwang Gyeongha',
  description: 'Hwang Gyeongha is an artist focused on moments when writing, music, and photography gain power in real-world spaces.',
  keywords: ['Hwang Gyeongha', 'artist', 'profile', 'musician', 'solidarity', 'social movement'],
  alternates: getAlternates('/about', 'en'),
  openGraph: {
    title: 'About - Hwang Gyeongha',
    description: 'Hwang Gyeongha is an artist focused on moments when writing, music, and photography gain power in real-world spaces.',
    url: toAbsoluteUrl('/en/about'),
    locale: 'en_US',
    type: 'profile',
    images: [{ url: '/images/og/default-og.png', alt: 'About Hwang Gyeongha', width: 1200, height: 630, type: 'image/png' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About - Hwang Gyeongha',
    description: 'Hwang Gyeongha is an artist focused on moments when writing, music, and photography gain power in real-world spaces.',
    images: ['/images/og/default-og.png']
  }
};

export default function EnAboutPage() {
  return <About />;
}
