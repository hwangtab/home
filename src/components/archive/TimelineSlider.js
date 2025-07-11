import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Flex } from '../ui/Layout';
import Button, { IconButton } from '../ui/Button';
import siteData from '../../data';

const TimelineSlider = ({ selectedYear, setSelectedYear }) => {
  const years = siteData.timeline.map(item => item.year).sort((a, b) => b - a);
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
