import '../globals.css';
import React from 'react';
import type { Metadata } from 'next';
import Providers from '../providers';
import SiteLayout from '../../components/next/SiteLayout';
import { SITE_URL } from '../../lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Hwang Gyeongha Official Web',
  description: 'Official website of musician, sound engineer, and producer Hwang Gyeongha.',
  openGraph: {
    title: 'Hwang Gyeongha Official Web',
    description: 'Official website of musician, sound engineer, and producer Hwang Gyeongha.',
    type: 'website',
    locale: 'en_US',
    url: '/en',
    images: [{ url: '/images/og/default-og.svg', alt: 'Hwang Gyeongha Official Web' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hwang Gyeongha Official Web',
    description: 'Official website of musician, sound engineer, and producer Hwang Gyeongha.',
    images: ['/images/og/default-og.svg']
  }
};

export default function EnglishRootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteLayout>{children}</SiteLayout>
        </Providers>
      </body>
    </html>
  );
}
