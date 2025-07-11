import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardRenderer from '../CardRenderer';
import { Heading2, BodyText } from '../ui/Typography';
import { Container, Grid, Stack } from '../ui/Layout';
import siteData from '../../data';

const YearlyView = ({ selectedYear, onCardClick }) => {
  const yearData = siteData.timeline.find(item => item.year === selectedYear);
  
  if (!yearData) return null;

  return (
    <Container size="default">
      <Stack spacing="lg" align="center" className="mb-8">
        <Heading2 color="primary" align="center">
          {selectedYear}년
        </Heading2>
        <BodyText color="secondary" align="center">
          {yearData.events.length}개의 주요 활동
        </BodyText>
      </Stack>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Grid cols={2} gap="lg" responsive={true}>
            {yearData.events.map((event, index) => (
              <CardRenderer 
                key={`${selectedYear}-${index}`} 
                work={{...event, year: selectedYear}} 
                onClick={onCardClick}
              />
            ))}
          </Grid>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};

export default YearlyView;
