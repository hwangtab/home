import React from 'react';
import type { Metadata } from 'next';
import About from '../../views/About';

export const metadata: Metadata = {
  title: 'About - Hwang Gyeongha',
  description: 'Hwang Gyeongha is an artist focused on moments when writing, music, and photography gain power in real-world spaces.',
  keywords: ['Hwang Gyeongha', 'artist', 'profile', 'musician', 'solidarity', 'social movement']
};

export default function AboutPage() {
  return <About />;
}
