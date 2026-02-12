import React from 'react';
import type { Metadata } from 'next';
import News from '../../views/News';

export const metadata: Metadata = {
  title: '소식 - 황경하',
  description: '황경하의 최신 소식, 공연 일정, 새로운 앨범 정보 등을 확인하세요. 콘서트와 음반 구매 정보도 제공합니다.',
  keywords: ['황경하', '소식', '공연', '콘서트', '음반', '뉴스', '일정']
};

export default function NewsPage() {
  return <News />;
}
