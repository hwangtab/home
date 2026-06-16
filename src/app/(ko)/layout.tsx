import '../globals.css';
import type { Metadata } from 'next';
import { SharedLayout } from '../../components/Layout/SharedLayout';
import { getAlternates, SITE_URL } from '../../lib/seo';
import { bombaram, myungjo, santokki } from '../../fonts';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: '/manifest.json',
  title: {
    default: '황경하 공식 웹사이트',
    template: '%s | 황경하',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/logo192.png', sizes: '192x192', type: 'image/png' }]
  },
  description: '황경하의 공식 웹사이트입니다. 음악, 저술, 공연, 소식을 확인할 수 있습니다.',
  openGraph: {
    title: '황경하 공식 웹사이트',
    description: '황경하의 공식 웹사이트입니다. 음악, 저술, 공연, 소식을 확인할 수 있습니다.',
    locale: 'ko_KR',
    images: [{ url: '/images/og/default-og.png', alt: '황경하 공식 웹사이트', width: 1200, height: 630, type: 'image/png' }],
  },
  twitter: {
    title: '황경하 공식 웹사이트',
    description: '황경하의 공식 웹사이트입니다. 음악, 저술, 공연, 소식을 확인할 수 있습니다.',
    images: ['/images/og/default-og.png'],
  },
  alternates: getAlternates('/', 'ko'),
};

export default function KoreanLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${bombaram.variable} ${myungjo.variable} ${santokki.variable}`}>
      <head>
        <link rel="preconnect" href="https://fastly.jsdelivr.net" crossOrigin="anonymous" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-brand-primary-600 focus:text-white focus:rounded-md"
        >
          메인 콘텐츠로 이동
        </a>
        <main id="main-content">
          <SharedLayout>{children}</SharedLayout>
        </main>
      </body>
    </html>
  );
}
