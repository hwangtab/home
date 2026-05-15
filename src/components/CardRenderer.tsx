import React from 'react';
import UnifiedWorkCard from './cards/UnifiedWorkCard';
import type { Work } from '../types/data.types';

interface CardRendererProps {
  work: Work;
}

const CardRenderer: React.FC<CardRendererProps> = ({ work }) => {
  return <UnifiedWorkCard work={work} />;
};

export default CardRenderer;
