import React from 'react';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import Works from '../../views/Works';

export const metadata: Metadata = {
  title: 'Works - Hwang Gyeongha',
  description: 'Explore albums, writings, and socially engaged works by Hwang Gyeongha.',
  keywords: ['Hwang Gyeongha', 'album', 'works', 'solidarity', 'gentrification']
};

export default function WorksPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-12 text-gray-300">Loading works page...</div>}>
      <Works />
    </Suspense>
  );
}
