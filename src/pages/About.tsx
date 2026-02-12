import React from 'react';
import Section from '../components/Section';
import PageHero from '../components/PageHero';
import DataRenderer, { RENDER_TYPES } from '../components/DataRenderer';
import { Heading3, BodyText } from '../components/ui/Typography';
import { Grid, Stack } from '../components/ui/Layout';
import { UnifiedCard as Card } from '../components/ui/Card';
import { useWorksData } from '../hooks/useDataProcessor';
import MetaDataManager from '../components/SEO/MetaDataManager';
import { usePageSEO } from '../hooks/useSEO';
import { useCachedPageData } from '../hooks/usePageData';
import { GridSkeleton } from '../components/ui/Skeleton';

interface AboutProps { }

const About: React.FC<AboutProps> = () => {
    const { data: siteData, loading, error } = useCachedPageData('about');

    // SEO 메타데이터
    const seoData = usePageSEO({
        title: '소개 - 황경하',
        description: '황경하는 현장에서 글, 음악, 사진 등의 예술이 힘을 갖는 순간에 주목하여 활동하는 음악가입니다. 세상의 소외된 이들과 함께합니다.',
        keywords: ['황경하', '아티스트', '프로필', '음악가', '연대', '사회운동', '예술가'],
        image: '/images/og/about-og.jpg'
    });

    // hooks를 최상위에서 호출 - siteData가 null일 때 빈 객체 전달
    const { timelineData } = useWorksData(siteData?.works || {}, 'about');

    if (loading) {
        return (
            <div>
                <MetaDataManager {...seoData} />
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
                <MetaDataManager {...seoData} />
                <div className="container mx-auto py-8 text-center">
                    <p className="text-gray-300">데이터를 불러오는 중 오류가 발생했습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <MetaDataManager {...seoData} />
            <PageHero
                title="소개"
                subtitle={<>황경하는 현장에서 글, 음악, 사진 등의 예술이 힘을 갖는 순간에<br className="hidden md:inline" /> 주목하여 활동하는 음악가입니다.</>}
                imagePath="/images/hwang/3.png"
            />

            <Section containerSize="default" className="mt-8">
                <Card variant="default" padding="default" shadow="default">
                    <DataRenderer
                        type={RENDER_TYPES.PROFILE}
                        data={[
                            siteData.artist?.bio || '',
                            siteData.artist?.philosophy || '',
                            "그의 작업은 사회에 대한 날카로운 시선과 따뜻한 연대의 메시지를 담고 있습니다. 음악 활동 외에도 황경하는 다양한 투쟁에 참여하며, 음악을 통한 사회 변화를 추구하고 있습니다.",
                            "명성과 부를 좇기보다 시대의 아픔에 공감하고 약자와 연대하는 예술, 세상의 부조리에 저항하고 변화의 메시지를 전하는 예술의 길을 개척하고 있습니다. 비록 험난한 여정이겠지만 노래하는 자의 가녀린 어깨가 세상을 변화시키리라 믿습니다."
                        ]}
                        imageSrc={`${process.env.PUBLIC_URL}/images/profile1.png`}
                        imageAlt="황경하"
                        layout="horizontal"
                    />
                </Card>
            </Section>

            <Section title="예술 철학" containerSize="default">
                <Card variant="default" padding="default" shadow="default">
                    <Grid cols={2} gap="lg" responsive={true}>
                        <Stack spacing="sm">
                            <Heading3 color="primary">연대와 저항</Heading3>
                            <BodyText color="secondary" className="break-words">
                                예술은 세상의 소외된 이들과 함께할 때 진정한 힘을 발휘합니다. 젠트리피케이션으로 쫓겨나는 상인들,
                                산업재해로 목숨을 잃는 노동자들, 재개발로 터전을 잃는 주민들과 함께 서며 그들의 이야기를 음악으로 기록합니다.
                            </BodyText>
                        </Stack>
                        <Stack spacing="sm">
                            <Heading3 color="primary">기록과 기억</Heading3>
                            <BodyText color="secondary" className="break-words">
                                사라져가는 것들, 잊혀져가는 것들을 예술로 기록하고 보존합니다.
                                개발이라는 이름으로 사라지는 골목길, 경제논리로 밀려나는 삶의 터전들을 음악으로 남겨 후세에 전합니다.
                            </BodyText>
                        </Stack>
                    </Grid>
                </Card>
            </Section>

            <Section title="활동 연혁" containerSize="default">
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
