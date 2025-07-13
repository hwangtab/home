import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Flex } from '../ui/Layout';
import Button, { IconButton } from '../ui/Button';
import { useWorksData } from '../../hooks/useDataProcessor';
import siteData from '../../data';

const TimelineSlider = ({ selectedYear, setSelectedYear }) => {
  const { flattenedEvents } = useWorksData(siteData.works, 'archive');
  
  const years = useMemo(() => {
    const yearSet = new Set(flattenedEvents.map(event => event.year));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [flattenedEvents]);
  const currentIndex = years.indexOf(selectedYear);

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : years.length - 1;
    setSelectedYear(years[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < years.length - 1 ? currentIndex + 1 : 0;
    setSelectedYear(years[newIndex]);
  };

  return (
    <Flex justify="center" align="center" gap="default" className="mb-8">
      <IconButton
        onClick={goToPrevious}
        variant="secondary"
        size="md"
        icon={<ChevronLeft size={24} />}
        animation="bounce"
      />
      
      <Flex gap="sm" wrap={true}>
        {years.map((year) => (
          <Button
            key={year}
            onClick={() => setSelectedYear(year)}
            variant={selectedYear === year ? 'primary' : 'outline'}
            size="md"
            animation="bounce"
          >
            {year}
          </Button>
        ))}
      </Flex>
      
      <IconButton
        onClick={goToNext}
        variant="secondary"
        size="md"
        icon={<ChevronRight size={24} />}
        animation="bounce"
      />
    </Flex>
  );
};

export default TimelineSlider;
