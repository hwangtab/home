import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import ContactForm from '../components/ContactForm';
import { useCachedPageData } from '../hooks/usePageData';
import { GridSkeleton } from '../components/ui/Skeleton';
import MetaDataManager from '../components/SEO/MetaDataManager';
import { usePageSEO } from '../hooks/useSEO';

const ContactInfo = ({ icon: Icon, title, content, link }) => (
  <div className="flex items-center mb-8">
    <div className="bg-gray-700 p-4 rounded-full mr-4">
      <Icon className="text-gray-300" size={28} />
    </div>
    <div>
      <h4 className="font-bold text-gray-200 text-lg mb-1">{title}</h4>
      <a
        href={link}
        className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
        target={title === "주소" ? "_blank" : "_self"}
        rel={title === "주소" ? "noopener noreferrer" : ""}
      >
        {content}
      </a>
    </div>
  </div>
);


const Contact = () => {
  const { data: siteData, loading, error } = useCachedPageData('contact');

  // SEO 메타데이터
  const seoData = usePageSEO({
    title: '연락처 - 황경하',
    description: '황경하에게 연락하거나 문의사항이 있으시면 언제든지 연락해주세요. 이메일, 전화, 소셜미디어를 통해 소통할 수 있습니다.',
    keywords: ['황경하', '연락처', '문의', '이메일', '전화번호', '소통'],
    image: '/images/og/contact-og.jpg'
  });

  if (loading) {
    return (
      <div>
        <MetaDataManager {...seoData} />
        <div className="container mx-auto py-8">
          <GridSkeleton count={2} columns="grid-cols-1 md:grid-cols-2" />
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div>
        <MetaDataManager {...seoData} />
        <div className="container mx-auto py-8 text-center">
          <p className="text-gray-300">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  const contactInfo = siteData.artist?.contact || {};

  return (
    <div>
      <MetaDataManager {...seoData} />
      <PageHero
        title="연락처"
        subtitle="협업 및 문의"
        imagePath="/images/hwang/7.png"
      />

      <Section title="연락처" className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="bg-gray-800 p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-8 text-gray-200 font-santokki">연락처 정보</h3>

            <ContactInfo
              icon={Mail}
              title="이메일"
              content={contactInfo.email}
              link={`mailto:${contactInfo.email}`}
            />

            <ContactInfo
              icon={Phone}
              title="전화"
              content={contactInfo.phone}
              link={`tel:${contactInfo.phone.replace(/-/g, '')}`}
            />

            <ContactInfo
              icon={MapPin}
              title="주소"
              content={contactInfo.address}
              link={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
            />

            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <h4 className="font-bold text-gray-200 mb-2 font-wanted-sans">업무 시간</h4>
              <p className="text-gray-400 text-sm">
                평일 10:00 - 18:00<br />
                주말 및 공휴일 휴무
              </p>
            </div>

            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <h4 className="font-bold text-gray-200 mb-2 font-wanted-sans">문의 유형</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• 공연 및 콜라보레이션 문의</li>
                <li>• 인터뷰 및 취재 요청</li>
                <li>• 음반 구매 및 배송 문의</li>
                <li>• 기타 일반 문의</li>
              </ul>
            </div>
          </motion.div>

          <ContactForm
            theme="dark"
            includeSubject={true}
            animation={{ initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } }}
          />
        </div>
      </Section>
    </div>
  );
};

export default React.memo(Contact);