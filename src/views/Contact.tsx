"use client";

import React from 'react';
import { Mail, Phone, MapPin, type LucideIcon } from 'lucide-react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import ContactForm from '../components/ContactForm';
import { UnifiedCard } from '../components/ui/Card';
import { useContactPageData } from '../hooks/usePageData';
import { useLanguage } from '../i18n';

interface ContactInfoProps {
  icon: LucideIcon;
  title: string;
  content: string;
  link: string;
  openInNewTab?: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  icon: Icon,
  title,
  content,
  link,
  openInNewTab = false
}) => (
  <div className="mb-8 flex items-center">
    <div className="mr-4 rounded-full bg-gray-700 p-4">
      <Icon className="text-gray-300" size={28} />
    </div>
    <div>
      <h4 className="mb-1 text-lg font-bold text-gray-200">{title}</h4>
      <a
        href={link}
        className="text-gray-400 transition-colors duration-300 hover:text-gray-200"
        target={openInNewTab ? '_blank' : '_self'}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    </div>
  </div>
);

const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const { data: contactPageData } = useContactPageData(language);
  const contactInfo = contactPageData.artist.contact;

  return (
    <div>
      <PageHero
        title={t('contact.title')}
        subtitle={t('contact.pageSubtitle')}
        imagePath="/images/hwang/12.png"
      />

      <Section title={t('contact.title')} className="mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <UnifiedCard
            padding="lg"
            motionProps={{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5 } }}
          >
            <h3 className="mb-8 font-santokki text-2xl font-bold text-gray-200">{t('contact.info')}</h3>

            <ContactInfo
              icon={Mail}
              title={t('contact.email')}
              content={contactInfo.email}
              link={`mailto:${contactInfo.email}`}
            />

            <ContactInfo
              icon={Phone}
              title={t('contact.phone')}
              content={contactInfo.phone}
              link={`tel:${contactInfo.phone.replace(/-/g, '')}`}
            />

            <ContactInfo
              icon={MapPin}
              title={t('contact.address')}
              content={contactInfo.address}
              link={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
              openInNewTab={true}
            />

            <div className="mt-8 rounded-lg bg-gray-700 p-4">
              <h4 className="mb-2 font-wanted-sans font-bold text-gray-200">{t('contact.businessHours')}</h4>
              <p className="whitespace-pre-line text-sm text-gray-400">
                {t('contact.businessHoursText')}
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-gray-700 p-4">
              <h4 className="mb-2 font-wanted-sans font-bold text-gray-200">{t('contact.inquiryTypes')}</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                {[0, 1, 2, 3].map((index) => (
                  <li key={`inquiry-type-${index}`}>• {t(`contact.inquiryTypesList.${index}`)}</li>
                ))}
              </ul>
            </div>
          </UnifiedCard>

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
