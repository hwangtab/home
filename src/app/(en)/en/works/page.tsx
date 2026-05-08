import type { Metadata } from 'next';
import Works from '../../../../views/Works';
import { getAlternates, toAbsoluteUrl } from '../../../../lib/seo';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Works - Hwang Gyeongha',
  description: 'Explore albums, writings, and socially engaged works by Hwang Gyeongha.',
  keywords: ['Hwang Gyeongha', 'album', 'works', 'solidarity', 'gentrification'],
  alternates: getAlternates('/works', 'en'),
  openGraph: {
    title: 'Works - Hwang Gyeongha',
    description: 'Explore albums, writings, and socially engaged works by Hwang Gyeongha.',
    url: toAbsoluteUrl('/en/works'),
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/images/og/works-og.svg', alt: 'Works by Hwang Gyeongha' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Works - Hwang Gyeongha',
    description: 'Explore albums, writings, and socially engaged works by Hwang Gyeongha.',
    images: ['/images/og/works-og.svg']
  }
};

function WorksLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <p className="text-gray-400">Loading works...</p>
    </div>
  );
}

export default function EnWorksPage() {
  return (
    <Suspense fallback={<WorksLoader />}>
      <Works />
    </Suspense>
  );
}
