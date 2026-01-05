// @ts-nocheck
import React from 'react';
import UnifiedWorkCard from './cards/UnifiedWorkCard';
import { Work } from '../types/data.types';

interface CardRendererProps {
    work: Work;
    onClick?: (work: Work) => void;
}

const CardRenderer: React.FC<CardRendererProps> = ({ work, onClick }) => {
    return <UnifiedWorkCard work={work} onClick={onClick} />;
};

export default CardRenderer;
