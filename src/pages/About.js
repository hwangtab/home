import React from 'react';
import Section from '../components/Section';
import DataRenderer, { RENDER_TYPES } from '../components/DataRenderer';
import { ProfileSkeleton, TimelineSkeleton } from '../components/ui/SkeletonUI';
import { Heading3, Heading4, BodyText, SmallText } from '../components/ui/Typography';
import { Container, Grid, Stack, Card } from '../components/ui/Layout';
import siteData from '../data';

const About = () => {
  return (
    <div>
      <Section title="소개">
        <Card variant="default" padding="xl" shadow="default">
          <DataRenderer 
            type={RENDER_TYPES.PROFILE}
            data={[
              siteData.artist.bio,
              siteData.artist.philosophy,
              "그의 작업은 사회에 대한 날카로운 시선과 따뜻한 연대의 메시지를 담고 있습니다. 음악 활동 외에도 황경하는 다양한 투쟁에 참여하며, 음악을 통한 사회 변화를 추구하고 있습니다.",
              "명성과 부를 좇기보다 시대의 아픔에 공감하고 약자와 연대하는 예술, 세상의 부조리에 저항하고 변화의 메시지를 전하는 예술의 길을 개척하고 있습니다. 비록 험난한 여정이겠지만 노래하는 자의 가녀린 어깨가 세상을 변화시키리라 믿습니다."
            ]}
            imageSrc={`${process.env.PUBLIC_URL}/images/profile1.png`}
            imageAlt="황경하"
            layout="horizontal"
          />
        </Card>
      </Section>

      <Section title="예술 철학">
        <Card variant="default" padding="xl" shadow="default">
          <Grid cols={2} gap="xl" responsive={true}>
            <Stack spacing="default">
              <Heading3 color="primary">연대와 저항</Heading3>
              <BodyText color="secondary">
                예술은 세상의 소외된 이들과 함께할 때 진정한 힘을 발휘합니다. 젠트리피케이션으로 쫓겨나는 상인들, 
                산업재해로 목숨을 잃는 노동자들, 재개발로 터전을 잃는 주민들과 함께 서며 그들의 이야기를 음악으로 기록합니다.
              </BodyText>
            </Stack>
            <Stack spacing="default">
              <Heading3 color="primary">기록과 기억</Heading3>
              <BodyText color="secondary">
                사라져가는 것들, 잊혀져가는 것들을 예술로 기록하고 보존합니다. 
                개발이라는 이름으로 사라지는 골목길, 경제논리로 밀려나는 삶의 터전들을 음악으로 남겨 후세에 전합니다.
              </BodyText>
            </Stack>
          </Grid>
        </Card>
      </Section>

      <Section title="활동 연혁">
        <Card variant="default" padding="xl" shadow="default">
          <DataRenderer 
            type={RENDER_TYPES.TIMELINE}
            data={siteData.timeline}
            reversed={true}
            renderEvent={(event, index) => (
              <Stack spacing="sm">
                <Heading4 color="primary">
                  {event.title}
                </Heading4>
                <SmallText color="secondary">
                  {event.description}
                </SmallText>
              </Stack>
            )}
          />
        </Card>
      </Section>
    </div>
  );
};

export default About;