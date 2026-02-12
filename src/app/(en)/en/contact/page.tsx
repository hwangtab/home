import React from 'react';
import type { Metadata } from 'next';
import Contact from '../../../../views/Contact';
import { getAlternates, toAbsoluteUrl } from '../../../../lib/seo';

export const metadata: Metadata = {
  title: 'Contact - Hwang Gyeongha',
  description: 'Contact Hwang Gyeongha for inquiries, collaborations, and communication via email and phone.',
  keywords: ['Hwang Gyeongha', 'contact', 'inquiry', 'email', 'phone'],
  alternates: getAlternates('/contact', 'en'),
  openGraph: {
    title: 'Contact - Hwang Gyeongha',
    description: 'Contact Hwang Gyeongha for inquiries, collaborations, and communication via email and phone.',
    url: toAbsoluteUrl('/en/contact'),
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/images/og/default-og.svg', alt: 'Contact Hwang Gyeongha' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact - Hwang Gyeongha',
    description: 'Contact Hwang Gyeongha for inquiries, collaborations, and communication via email and phone.',
    images: ['/images/og/default-og.svg']
  }
};

export default function EnContactPage() {
  return <Contact />;
}
