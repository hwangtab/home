"use client";

import React from 'react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import DataRenderer, { RENDER_TYPES } from '../components/DataRenderer';
import { Heading3, BodyText } from '../components/ui/Typography';
import { Grid, Stack } from '../components/ui/Layout';
import { UnifiedCard as Card } from '../components/ui/Card';
import { useWorksData } from '../hooks/useDataProcessor';
import { useAboutPageData } from '../hooks/usePageData';
import { useLanguage } from '../i18n';

const About: React.FC = () => {
  const { t, language } = useLanguage();
  const { data: aboutPageData } = useAboutPageData(language);
  const { timelineData } = useWorksData(aboutPageData.works, 'about');

  return (
    <div>
      <PageHero
        title={t('about.title')}
        subtitle={t('about.heroSubtitle')}
        imagePath="/images/hwang/3.png"
      />

      <Section containerSize="default" className="mt-8">
        <Card variant="default" padding="default" shadow="default">
          <DataRenderer
            type={RENDER_TYPES.PROFILE}
            data={[
              aboutPageData.artist.bio,
              aboutPageData.artist.philosophy,
              t('about.profileParagraph1'),
              t('about.profileParagraph2')
            ]}
            imageSrc={`${process.env.NEXT_PUBLIC_BASE_PATH || process.env.PUBLIC_URL || ''}/images/profile1.png`}
            imageAlt={t('common.siteTitle')}
            layout="horizontal"
          />
        </Card>
      </Section>

      <Section title={t('about.philosophy')} containerSize="default">
        <Card variant="default" padding="default" shadow="default">
          <Grid cols={2} gap="lg" responsive={true}>
            <Stack spacing="sm">
              <Heading3 color="primary">{t('about.resistanceTitle')}</Heading3>
              <BodyText color="secondary" className="break-words">
                {t('about.resistanceText')}
              </BodyText>
            </Stack>
            <Stack spacing="sm">
              <Heading3 color="primary">{t('about.memoryTitle')}</Heading3>
              <BodyText color="secondary" className="break-words">
                {t('about.memoryText')}
              </BodyText>
            </Stack>
          </Grid>
        </Card>
      </Section>

      <Section title={t('about.timeline')} containerSize="default">
        <Card variant="default" padding="default" shadow="default">
          <DataRenderer
            type={RENDER_TYPES.TIMELINE}
            data={timelineData}
            reversed={true}
            renderEvent={(event: { title: string; description: string }) => (
              <Stack spacing="sm">
                <h4 className="font-santokki text-lg font-bold text-gray-100">{event.title}</h4>
                <p className="text-sm text-gray-400">{event.description}</p>
              </Stack>
            )}
          />
        </Card>
      </Section>
    </div>
  );
};

export default React.memo(About);
