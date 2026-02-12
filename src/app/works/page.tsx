import React from 'react';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import Works from '../../views/Works';

export const metadata: Metadata = {
  title: '작품 - 황경하',
  description: '황경하의 음악 작품들을 만나보세요. 젠트리피케이션, 민중음악 선곡집, 몸의 중심 등 사회적 메시지를 담은 음반과 글들을 소개합니다.',
  keywords: ['황경하', '음반', '앨범', '민중음악', '연대', '작품', '젠트리피케이션', '몸의중심']
};

export default function WorksPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-12 text-gray-300">작품 페이지 로딩 중...</div>}>
      <Works />
    </Suspense>
  );
}
