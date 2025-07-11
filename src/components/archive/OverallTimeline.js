import React from 'react';
import CardRenderer from '../CardRenderer';
import { Heading3, BodyText } from '../ui/Typography';
import { Container, Grid, Stack } from '../ui/Layout';

const OverallTimeline = ({ flattenedEvents, onCardClick }) => {
  return (
    <Container size="default">
      <Stack spacing="lg" align="center" className="mb-8">
        <Heading3 color="primary" align="center">
          전체 활동 연혁
        </Heading3>
        <BodyText color="secondary" align="center">
          {flattenedEvents.length}개의 작품과 활동
        </BodyText>
      </Stack>
      
      <Grid cols={3} gap="lg" responsive={true}>
        {flattenedEvents.map((event, index) => (
          <CardRenderer 
            key={`${event.id || event.title}-${index}`} 
            work={event}
            onClick={onCardClick}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default OverallTimeline;
