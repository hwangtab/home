// @ts-nocheck
import React, { memo } from 'react';
import { motion, Variants } from 'framer-motion';
import { ExternalLink, Play, Music, Image, FileText, Mic, LucideIcon } from 'lucide-react';
import { ThumbnailImage } from '../OptimizedImage';
import { HoverCard } from './AnimatedComponents';
import { Heading4, BodyText, Caption } from './Typography';
import { Stack, Flex } from './Layout';
import type { Work } from '../../types/data.types';

const cardVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.25, 0, 1] }
    },
};

type CardType = 'music' | 'visual' | 'writing' | 'performance' | 'default';

interface CardTypeConfig {
    icon: LucideIcon;
    color: string;
}

const cardTypeConfig: Record<CardType, CardTypeConfig> = {
    music: { icon: Music, color: 'bg-blue-600' },
    visual: { icon: Image, color: 'bg-green-600' },
    writing: { icon: FileText, color: 'bg-indigo-600' },
    performance: { icon: Mic, color: 'bg-red-600' },
    default: { icon: Music, color: 'bg-gray-600' },
};

const getCardType = (work: Work): CardType => {
    const type = work.type || '';
    if (type.includes('album') || type.includes('single')) return 'music';
    if (type.includes('visual') || type.includes('photography') || type.includes('video')) return 'visual';
    if (type.includes('writing')) return 'writing';
    if (type.includes('performance')) return 'performance';
    return 'default';
};

interface CardPartProps {
    work: Work & { images?: Array<{ src: string }>; excerpt?: string; links?: Record<string, string>; date?: string };
    type: CardType;
    config: CardTypeConfig;
}

const CardHeader = memo<CardPartProps>(({ work, type }) => {
    if (work.cover || (work.images && work.images[0]?.src)) {
        return (
            <div className="relative group">
                <ThumbnailImage
                    src={work.cover || work.images![0].src}
                    alt={work.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
                {type === 'visual' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                        <Play className="text-white" size={48} />
                    </div>
                )}
            </div>
        );
    }
    return null;
});

const CardBody = memo<CardPartProps>(({ work, config }) => (
    <Stack spacing="sm" className="flex-1 p-4">
        <Flex align="center" gap="sm">
            <div className={`${config.color} p-2 rounded-lg`}>
                <config.icon className="text-white" size={16} />
            </div>
            <Heading4 color="primary">{work.title} ({work.year || work.date})</Heading4>
        </Flex>

        <BodyText color="secondary" className="line-clamp-3 flex-1">
            {work.description}
        </BodyText>

        {work.excerpt && (
            <blockquote className="border-l-2 border-gray-600 pl-3 italic">
                <Caption color="muted">"{work.excerpt}"</Caption>
            </blockquote>
        )}
    </Stack>
));

interface CardFooterProps {
    work: Work & { tags?: string[]; links?: Record<string, string> };
    type: CardType;
}

const CardFooter = memo<CardFooterProps>(({ work }) => {
    const hasTags = work.tags && work.tags.length > 0;
    const hasLinks = work.links && Object.keys(work.links).length > 0;

    if (!hasTags && !hasLinks) return null;

    return (
        <Flex justify="between" align="end" className="p-4 pt-0">
            <Flex wrap={true} gap="sm">
                {work.tags?.slice(0, 3).map((tag) => (
                    <Caption key={tag} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                        {tag}
                    </Caption>
                ))}
            </Flex>
            {hasLinks && (
                <a
                    href={Object.values(work.links!)[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                    <ExternalLink size={14} className="mr-1" />
                    보기
                </a>
            )}
        </Flex>
    );
});

interface UnifiedCardProps {
    work: Work;
    onClick?: (work: Work) => void;
}

export const UnifiedCard = memo<UnifiedCardProps>(({ work, onClick }) => {
    const type = getCardType(work);
    const config = cardTypeConfig[type];
    const isClickable = type === 'visual';

    const handleClick = () => {
        if (isClickable && onClick) onClick(work);
    };

    const extendedWork = work as CardPartProps['work'];

    return (
        <HoverCard
            className={`h-full ${isClickable ? 'cursor-pointer' : ''}`}
            scale={1.03}
            shadowIntensity={1.5}
        >
            <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                layout
                onClick={handleClick}
                className="bg-gray-800 rounded-lg shadow-lg flex flex-col h-full"
            >
                <CardHeader work={extendedWork} type={type} config={config} />
                <CardBody work={extendedWork} type={type} config={config} />
                <CardFooter work={extendedWork} type={type} />
            </motion.div>
        </HoverCard>
    );
});

UnifiedCard.displayName = 'UnifiedCard';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
