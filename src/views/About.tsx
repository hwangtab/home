"use client";

import React from 'react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import DataRenderer, { RENDER_TYPES } from '../components/DataRenderer';
import { Heading3, BodyText } from '../components/ui/Typography';
import { Grid, Stack } from '../components/ui/Layout';
import { UnifiedCard as Card } from '../components/ui/Card';
import { useWorksData } from '../hooks/useDataProcessor';
import { useCachedPageData } from '../hooks/usePageData';
import { GridSkeleton } from '../components/ui/Skeleton';
import { useLanguage } from '../i18n';

interface AboutProps { }

const About: React.FC<AboutProps> = () => {
    const { t, language } = useLanguage();
    const { data: siteData, loading, error } = useCachedPageData('about', language);

    // hooks를 최상위에서 호출 - siteData가 null일 때 빈 객체 전달
    const { timelineData } = useWorksData(siteData?.works || {}, 'about');

    if (loading) {
        return (
            <div>
                <div className="container mx-auto py-8">
                    {/* Correction: maps to md:grid-cols-2 */}
                    <GridSkeleton items={3} columns={2} />
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
                            siteData.artist?.bio || '',
                            siteData.artist?.philosophy || '',
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
                        renderEvent={(event: any, index: number) => (
                            <Stack spacing="sm">
                                {/* Heading4 not exported from Typography? Using Heading3 or verify. 
                    Actually Typography.js had H1-H6 but Typography.tsx exported Heading1..Heading6.
                    Let's assume Heading4 is available or use Heading3. 
                    Checking about.js again, it imported Heading4.
                    Checking Typography.tsx... I trust it has Heading4.
                */}
                                <h4 className="text-lg font-bold text-gray-100 font-santokki">
                                    {event.title}
                                </h4>
                                <p className="text-gray-400 text-sm">
                                    {event.description}
                                </p>
                            </Stack>
                        )}
                    />
                </Card>
            </Section>
        </div>
    );
};

export default React.memo(About);
