"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import OptimizedImage from '../components/OptimizedImage';
import { UnifiedCard } from '../components/ui/Card';
import { useHomePageData } from '../hooks/usePageData';
import type { MusicWork } from '../types/data.types';
import { useLanguage } from '../i18n';
import { getLocaleFromPathname, withLocalePrefix } from '../utils/localePath';
import { getWorkCoverUrl } from '../lib/works';

interface FeaturedWorksProps {
  works: MusicWork[];
}

const FeaturedWorks: React.FC<FeaturedWorksProps> = ({ works }) => {
  const { t } = useLanguage();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const featuredWorks = works.filter((work) => work.featured).slice(0, 3);

  if (featuredWorks.length === 0) {
    return null;
  }

  return (
    <Section title={t('home.featuredWorks')} enableScrollAnimation={true} className="mt-16">
      <div className="grid grid-cols-1 gap-8 justify-items-center md:grid-cols-2 lg:grid-cols-3">
        {featuredWorks.map((work) => (
          <UnifiedCard
            key={work.id}
            padding="lg"
            className="w-full transition-transform duration-300 hover:scale-105"
          >
            <Link href={withLocalePrefix(`/works/${work.id}`, locale)}>
              <OptimizedImage
                src={getWorkCoverUrl(work.cover, 'music')}
                alt={work.title}
                className="mb-4 h-48 w-full rounded"
                lazy
              />
              <h3 className="mb-3 font-santokki text-2xl font-bold text-gray-100">
                {work.title} ({work.year})
              </h3>
              <p className="line-clamp-3 text-sm text-gray-300 font-wanted-sans">{work.description}</p>
            </Link>
          </UnifiedCard>
        ))}
      </div>
      <div className="mt-8 text-center">
        <div className="transition-transform duration-200 hover:scale-105">
          <Link
            href={withLocalePrefix('/works', locale)}
            className="inline-flex items-center rounded-full bg-gray-750 px-8 py-4 font-wanted-sans text-white transition-all duration-300 hover:bg-gray-600"
          >
            {t('home.viewAllWorks')}
          </Link>
        </div>
      </div>
    </Section>
  );
};

const QuickNavigation: React.FC = () => {
  const { t } = useLanguage();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const quickLinks = [
    {
      name: t('nav.about'),
      path: '/about',
      description: t('home.quickLinks.aboutDesc'),
      icon: '👤',
      classes: {
        line: 'bg-brand-solidarity-500',
        iconBg: 'bg-brand-solidarity-500/10',
        iconBgHover: 'group-hover:bg-brand-solidarity-500/20',
        textHover: 'group-hover:text-brand-solidarity-300',
        arrow: 'text-brand-solidarity-400'
      }
    },
    {
      name: t('nav.works'),
      path: '/works',
      description: t('home.quickLinks.worksDesc'),
      icon: '🎵',
      classes: {
        line: 'bg-brand-earth-500',
        iconBg: 'bg-brand-earth-500/10',
        iconBgHover: 'group-hover:bg-brand-earth-500/20',
        textHover: 'group-hover:text-brand-earth-300',
        arrow: 'text-brand-earth-400'
      }
    },
    {
      name: t('nav.contact'),
      path: '/contact',
      description: t('home.quickLinks.contactDesc'),
      icon: '📞',
      classes: {
        line: 'bg-brand-harmony-500',
        iconBg: 'bg-brand-harmony-500/10',
        iconBgHover: 'group-hover:bg-brand-harmony-500/20',
        textHover: 'group-hover:text-brand-harmony-300',
        arrow: 'text-brand-harmony-400'
      }
    }
  ];

  return (
    <Section title={t('home.quickNav')} enableScrollAnimation={true}>
      <div className="grid grid-cols-1 gap-6 justify-items-center md:grid-cols-3">
        {quickLinks.map((link) => (
          <div
            key={link.name}
            className="group relative w-full overflow-hidden rounded-xl border border-gray-700 bg-gray-800 px-6 pb-6 pt-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-gray-600 hover:bg-gray-700 hover:shadow-2xl"
          >
            <div className={`absolute left-0 top-0 h-1 w-full ${link.classes.line}`} />

            <Link href={withLocalePrefix(link.path, locale)} className="block">
              <div className="mb-4 flex flex-col items-center">
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-300 ${link.classes.iconBg} ${link.classes.iconBgHover}`}
                >
                  <span className="text-2xl">{link.icon}</span>
                </div>
                <h3
                  className={`text-center font-santokki text-xl font-bold text-gray-100 transition-colors duration-300 ${link.classes.textHover}`}
                >
                  {link.name}
                </h3>
              </div>
              <p className="text-center font-wanted-sans text-gray-300 transition-colors duration-300 group-hover:text-gray-200">
                {link.description}
              </p>

              <div className="mt-4 flex justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ArrowRight className={`h-5 w-5 ${link.classes.arrow}`} />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
};

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const { data: homeData } = useHomePageData(language);

  return (
    <div className="contain-layout">
      <PageHero
        title={t('home.hero.title')}
        subtitle={t('home.hero.role')}
        imagePath="/images/hwang/11.png"
        height="100vh"
      />
      <FeaturedWorks works={homeData.works.music} />
      <QuickNavigation />
    </div>
  );
};

export default React.memo(Home);
