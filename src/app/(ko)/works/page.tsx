import type { Metadata } from 'next';
import Works from '../../../views/Works';
import { getAlternates, toAbsoluteUrl } from '../../../lib/seo';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '작품',
  description: '황경하의 음악, 글, 연대 활동 작품을 확인하세요.',
  keywords: ['황경하', '앨범', '작품', '연대', '저항', '민중음악'],
  alternates: getAlternates('/works', 'ko'),
  openGraph: {
    title: '작품 | 황경하',
    description: '황경하의 음악, 글, 연대 활동 작품을 확인하세요.',
    url: toAbsoluteUrl('/works'),
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/images/og/works-og.svg', alt: '황경하 작품' }]
  }
};

function WorksLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <p className="text-gray-400">작품 로딩 중...</p>
    </div>
  );
}

export default function WorksPage() {
  return (
    <Suspense fallback={<WorksLoader />}>
      <Works />
    </Suspense>
  );
}
