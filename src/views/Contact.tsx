"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, LucideIcon } from 'lucide-react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import ContactForm from '../components/ContactForm';
import { useCachedPageData } from '../hooks/usePageData';
import { GridSkeleton } from '../components/ui/Skeleton';
import { useLanguage } from '../i18n';

interface ContactInfoProps {
    icon: LucideIcon;
    title: string;
    content: string;
    link: string;
    openInNewTab?: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon: Icon, title, content, link, openInNewTab = false }) => (
    <div className="flex items-center mb-8">
        <div className="bg-gray-700 p-4 rounded-full mr-4">
            <Icon className="text-gray-300" size={28} />
        </div>
        <div>
            <h4 className="font-bold text-gray-200 text-lg mb-1">{title}</h4>
            <a
                href={link}
                className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
                target={openInNewTab ? "_blank" : "_self"}
                rel={openInNewTab ? "noopener noreferrer" : ""}
            >
                {content}
            </a>
        </div>
    </div>
);

const Contact: React.FC = () => {
    const { t, language } = useLanguage();
    const { data: siteData, loading, error } = useCachedPageData('contact', language);

    if (loading) {
        return (
            <div>
                <div className="container mx-auto py-8">
                    {/* Correction: columns={2} maps to md:grid-cols-2 */}
                    <GridSkeleton items={2} columns={2} />
                </div>
            </div>
        );
    }

    if (error || !siteData) {
        return (
            <div>
                <div className="container mx-auto py-8 text-center">
                    <p className="text-gray-300">{t('common.loadingError')}</p>
                </div>
            </div>
        );
    }

    const contactInfo = siteData.artist?.contact || {};

    return (
        <div>
            <PageHero
                title={t('contact.title')}
                subtitle={t('contact.pageSubtitle')}
                imagePath="/images/hwang/12.png"
            />

            <Section title={t('contact.title')} className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        className="bg-gray-800 p-8 rounded-lg shadow-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-2xl font-bold mb-8 text-gray-200 font-santokki">{t('contact.info')}</h3>

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
                            link={`tel:${contactInfo.phone?.replace(/-/g, '')}`}
                        />

                        <ContactInfo
                            icon={MapPin}
                            title={t('contact.address')}
                            content={contactInfo.address}
                            link={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
                            openInNewTab={true}
                        />

                        <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                            <h4 className="font-bold text-gray-200 mb-2 font-wanted-sans">{t('contact.businessHours')}</h4>
                            <p className="text-gray-400 text-sm">
                                {t('contact.businessHoursText').split('\n').map((line, index) => (
                                    <React.Fragment key={`${line}-${index}`}>
                                        {line}
                                        {index === 0 && <br />}
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>

                        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                            <h4 className="font-bold text-gray-200 mb-2 font-wanted-sans">{t('contact.inquiryTypes')}</h4>
                            <ul className="text-gray-400 text-sm space-y-1">
                                {[0, 1, 2, 3].map((index) => (
                                    <li key={`inquiry-type-${index}`}>• {t(`contact.inquiryTypesList.${index}`)}</li>
                                ))}
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
