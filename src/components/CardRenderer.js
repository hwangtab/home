import React from 'react';
import { UnifiedCard } from './ui/Card';

const CardRenderer = ({ work, onClick }) => {
  return <UnifiedCard work={work} onClick={onClick} />;
};

export default CardRenderer;
