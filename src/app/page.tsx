import React from 'react';
import type { Metadata } from 'next';
import Home from '../views/Home';

export const metadata: Metadata = {
  title: '황경하 Official Web',
  description: '음악가이자 사운드 엔지니어, 프로듀서인 황경하의 공식 웹사이트입니다. 사회적 메시지를 담은 음악과 예술 활동을 만나보세요.',
  keywords: ['황경하', '음악가', '프로듀서', '사운드엔지니어', '연대', '민중음악', '젠트리피케이션']
};

export default function Page() {
  return <Home />;
}
