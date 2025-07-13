import React from 'react';
import UnifiedWorkCard from './cards/UnifiedWorkCard';

const CardRenderer = ({ work, onClick }) => {
  return <UnifiedWorkCard work={work} onClick={onClick} />;
};

export default CardRenderer;
