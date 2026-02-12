import React from 'react';
import type { Metadata } from 'next';
import Contact from '../../views/Contact';

export const metadata: Metadata = {
  title: '연락처 - 황경하',
  description: '황경하에게 연락하거나 문의사항이 있으시면 언제든지 연락해주세요. 이메일, 전화, 소셜미디어를 통해 소통할 수 있습니다.',
  keywords: ['황경하', '연락처', '문의', '이메일', '전화번호', '소통']
};

export default function ContactPage() {
  return <Contact />;
}
