import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import Providers from './providers';
import SiteLayout from '../components/next/SiteLayout';

export const metadata: Metadata = {
  title: 'Hwang Gyeongha Official Web',
  description: 'Official website of musician, sound engineer, and producer Hwang Gyeongha.'
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <SiteLayout>{children}</SiteLayout>
        </Providers>
      </body>
    </html>
  );
}
