import React from 'react';
import type { Metadata } from 'next';
import Home from '../views/Home';

export const metadata: Metadata = {
  title: 'Hwang Gyeongha Official Web',
  description: 'Official website of musician, sound engineer, and producer Hwang Gyeongha. Explore socially engaged music and artistic works.',
  keywords: ['Hwang Gyeongha', 'musician', 'producer', 'sound engineer', 'solidarity', 'minjung music', 'gentrification']
};

export default function Page() {
  return <Home />;
}
