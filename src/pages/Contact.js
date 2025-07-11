import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import Section from '../components/Section';
import ContactForm from '../components/ContactForm';
import siteData from '../data';

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
  const contactInfo = siteData.artist.contact;

  return (
    <div>
      <Section title="연락처">
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

export default Contact;