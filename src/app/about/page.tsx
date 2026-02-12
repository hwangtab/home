import React from 'react';
import type { Metadata } from 'next';
import About from '../../views/About';

export const metadata: Metadata = {
  title: '소개 - 황경하',
  description: '황경하는 현장에서 글, 음악, 사진 등의 예술이 힘을 갖는 순간에 주목하여 활동하는 음악가입니다. 세상의 소외된 이들과 함께합니다.',
  keywords: ['황경하', '아티스트', '프로필', '음악가', '연대', '사회운동', '예술가']
};

export default function AboutPage() {
  return <About />;
}
