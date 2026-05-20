import '../globals.css';
import type { Metadata } from 'next';
import { SharedLayout } from '../../components/Layout/SharedLayout';
import { getAlternates } from '../../lib/seo';
import { bombaram, myungjo, santokki } from '../../fonts';

export const metadata: Metadata = {
  title: 'Hwang Gyeongha Official Web',
  description: 'Official website of musician, sound engineer, and producer Hwang Gyeongha.',
  openGraph: {
    title: 'Hwang Gyeongha Official Web',
    description: 'Official website of musician, sound engineer, and producer Hwang Gyeongha.',
    locale: 'en_US',
    images: [{ url: '/images/og/default-og.svg', alt: 'Hwang Gyeongha Official Web' }],
  },
  twitter: {
    title: 'Hwang Gyeongha Official Web',
    description: 'Official website of musician, sound engineer, and producer Hwang Gyeongha.',
    images: ['/images/og/default-og.svg'],
  },
  alternates: getAlternates('/en', 'en'),
};

export default function EnglishLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bombaram.variable} ${myungjo.variable} ${santokki.variable}`}>
      <head>
        <link rel="preconnect" href="https://fastly.jsdelivr.net" crossOrigin="anonymous" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-brand-primary-600 focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>
        <main id="main-content">
          <SharedLayout>{children}</SharedLayout>
        </main>
      </body>
    </html>
  );
}
