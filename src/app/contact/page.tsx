import React from 'react';
import type { Metadata } from 'next';
import Contact from '../../views/Contact';

export const metadata: Metadata = {
  title: 'Contact - Hwang Gyeongha',
  description: 'Contact Hwang Gyeongha for inquiries, collaborations, and communication via email and phone.',
  keywords: ['Hwang Gyeongha', 'contact', 'inquiry', 'email', 'phone']
};

export default function ContactPage() {
  return <Contact />;
}
