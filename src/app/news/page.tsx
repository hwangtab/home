import React from 'react';
import type { Metadata } from 'next';
import News from '../../views/News';

export const metadata: Metadata = {
  title: 'News - Hwang Gyeongha',
  description: 'Check the latest updates, concert schedule, and album information from Hwang Gyeongha.',
  keywords: ['Hwang Gyeongha', 'news', 'concert', 'album', 'schedule']
};

export default function NewsPage() {
  return <News />;
}
