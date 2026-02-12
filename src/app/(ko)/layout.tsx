import '../globals.css';
import React from 'react';
import type { Metadata } from 'next';
import Providers from '../providers';
import SiteLayout from '../../components/next/SiteLayout';
import { SITE_URL } from '../../lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '황경하 공식 웹사이트',
    template: '%s | 황경하'
  },
  description: '황경하의 공식 웹사이트입니다. 음악, 저술, 공연, 소식을 확인할 수 있습니다.',
  openGraph: {
    title: '황경하 공식 웹사이트',
    description: '황경하의 공식 웹사이트입니다. 음악, 저술, 공연, 소식을 확인할 수 있습니다.',
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    images: [{ url: '/images/og/default-og.svg', alt: '황경하 공식 웹사이트' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '황경하 공식 웹사이트',
    description: '황경하의 공식 웹사이트입니다. 음악, 저술, 공연, 소식을 확인할 수 있습니다.',
    images: ['/images/og/default-og.svg']
  }
};

export default function KoreanRootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <SiteLayout>{children}</SiteLayout>
        </Providers>
      </body>
    </html>
  );
}
