import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import Providers from './providers';
import SiteLayout from '../components/next/SiteLayout';

export const metadata: Metadata = {
  title: '황경하 Official Web',
  description: '음악가이자 사운드 엔지니어, 프로듀서인 황경하의 공식 웹사이트입니다.'
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
