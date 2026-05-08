import '../globals.css';
import type { Metadata } from 'next';
import { SharedLayout } from '../../components/Layout/SharedLayout';
import { getAlternates } from '../../lib/seo';

export const metadata: Metadata = {
  title: {
    default: '황경하 공식 웹사이트',
    template: '%s | 황경하',
  },
  description: '황경하의 공식 웹사이트입니다. 음악, 저술, 공연, 소식을 확인할 수 있습니다.',
  openGraph: {
    title: '황경하 공식 웹사이트',
    description: '황경하의 공식 웹사이트입니다. 음악, 저술, 공연, 소식을 확인할 수 있습니다.',
    locale: 'ko_KR',
    images: [{ url: '/images/og/default-og.svg', alt: '황경하 공식 웹사이트' }],
  },
  twitter: {
    title: '황경하 공식 웹사이트',
    description: '황경하의 공식 웹사이트입니다. 음악, 저술, 공연, 소식을 확인할 수 있습니다.',
    images: ['/images/og/default-og.svg'],
  },
  alternates: getAlternates('/', 'ko'),
};

export default function KoreanLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="ko">
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
