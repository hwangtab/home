'use client';

import React, { memo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import CardRenderer from './CardRenderer';
import type { Work } from '../types/data.types';
import { useLanguage } from '../i18n';

export const RENDER_TYPES = {
    CARD_GRID: 'card_grid',
    TIMELINE: 'timeline',
    EVENT_CARD: 'event_card',
    PROFILE: 'profile',
    SIMPLE_LIST: 'simple_list'
} as const;

type RenderType = (typeof RENDER_TYPES)[keyof typeof RENDER_TYPES];

// --- CardGrid ---

interface CardGridRendererProps {
    data: Work[];
    columns?: string;
    renderItem?: (item: Work, index: number) => ReactNode;
    animation?: boolean;
    className?: string;
}

const CardGridRenderer: React.FC<CardGridRendererProps> = memo(({
    data,
    columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    renderItem,
    animation = true,
    className = ''
}) => {
    const { t } = useLanguage();

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-300 font-wanted-sans">
                    {t('common.noData')}
                </p>
            </div>
        );
    }

    return (
        <div className={`${className} ${columns} gap-2 sm:gap-4 md:gap-6 items-stretch`}>
            {data.map((item, index) => (
                <motion.div
                    key={item.id ?? index}
                    initial={animation ? { opacity: 0, y: 20 } : undefined}
                    animate={animation ? { opacity: 1, y: 0 } : undefined}
                    transition={animation ? { duration: 0.3, delay: index * 0.1 } : undefined}
                >
                    {renderItem ? renderItem(item, index) : <CardRenderer work={item} />}
                </motion.div>
            ))}
        </div>
    );
});

// --- Timeline ---

interface TimelineEvent {
    title: string;
    description: string;
}

interface TimelineData {
    year: number;
    events: TimelineEvent[];
}

interface TimelineRendererProps {
    data: TimelineData[];
    renderEvent?: (event: TimelineEvent, index: number) => ReactNode;
    reversed?: boolean;
    className?: string;
}

const TimelineRenderer: React.FC<TimelineRendererProps> = memo(({
    data,
    renderEvent,
    reversed = false,
    className = ''
}) => {
    const sortedData = [...data].sort((a, b) =>
        reversed ? Number(b.year) - Number(a.year) : Number(a.year) - Number(b.year)
    );

    return (
        <div className={className}>
            {sortedData.map((yearData) => (
                <div key={yearData.year} className="relative">
                    <div className="flex items-center mb-2 sm:mb-4">
                        <div className="bg-gray-700 rounded-full w-4 h-4 mr-4" />
                        <h4 className="text-xl font-bold text-gray-100 font-santokki">
                            {yearData.year}
                        </h4>
                    </div>
                    <div className="ml-2 sm:ml-4 md:ml-8 space-y-2 sm:space-y-3">
                        {yearData.events.map((event, index) => (
                            <div key={index} className="bg-gray-750 p-2 sm:p-4 rounded-lg">
                                {renderEvent ? renderEvent(event, index) : (
                                    <div>
                                        <h5 className="font-bold text-gray-100 font-wanted-sans mb-1">
                                            {event.title}
                                        </h5>
                                        <p className="text-gray-300 text-sm">
                                            {event.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
});

// --- EventCard ---

interface EventCardRendererProps {
    event: {
        type?: string;
        title: string;
        description: string;
    };
    showIcon?: boolean;
    getEventIcon?: (type: string) => ReactNode;
    getEventColor?: (type: string) => string;
    className?: string;
}

const EventCardRenderer: React.FC<EventCardRendererProps> = memo(({
    event,
    showIcon = true,
    getEventIcon,
    getEventColor,
    className = ''
}) => {
    const defaultGetIcon = (type: string) => {
        const icons: Record<string, string> = {
            album: '\u{1F3B5}',
            single: '\u{1F3B5}',
            writing: '\u{270D}\u{FE0F}',
            performance: '\u{1F3A4}',
            visual: '\u{1F3A8}',
            default: '\u{1F4C5}'
        };
        return icons[type] ?? icons.default;
    };

    const defaultGetColor = (type: string) => {
        const colors: Record<string, string> = {
            album: 'bg-brand-primary-600',
            single: 'bg-brand-primary-600',
            writing: 'bg-brand-harmony-600',
            performance: 'bg-brand-solidarity-600',
            visual: 'bg-brand-earth-600',
            default: 'bg-gray-700'
        };
        return colors[type] ?? colors.default;
    };

    const eventType = event.type ?? 'default';

    return (
        <div className={`${className} bg-gray-850 p-3 sm:p-6 rounded-lg shadow-lg h-full flex flex-col`}>
            <div className="flex items-start space-x-2 sm:space-x-4 flex-1">
                {showIcon && (
                    <div className={`p-3 rounded-full ${getEventColor ? getEventColor(eventType) : defaultGetColor(eventType)} flex-shrink-0`}>
                        {getEventIcon ? getEventIcon(eventType) : defaultGetIcon(eventType)}
                    </div>
                )}
                <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-100 font-santokki mb-2 line-clamp-2">
                        {event.title}
                    </h3>
                    <p className="text-gray-300 font-wanted-sans text-sm flex-1 line-clamp-3">
                        {event.description}
                    </p>
                </div>
            </div>
        </div>
    );
});

// --- Profile ---

interface ProfileRendererProps {
    profile: string | string[];
    imageSrc?: string;
    imageAlt?: string;
    layout?: 'horizontal' | 'vertical';
    className?: string;
}

const ProfileRenderer: React.FC<ProfileRendererProps> = memo(({
    profile,
    imageSrc,
    imageAlt = 'Profile',
    layout = 'horizontal',
    className = ''
}) => {
    const isHorizontal = layout === 'horizontal';

    return (
        <div className={`${className} flex ${isHorizontal ? 'flex-col lg:flex-row' : 'flex-col'} items-start gap-2 sm:gap-4 lg:gap-8`}>
            <div className={`${isHorizontal ? 'w-full lg:max-w-xs lg:flex-shrink-0' : 'w-full'} flex flex-col justify-center`}>
                {imageSrc && (
                    <motion.div
                        className="w-full max-w-xs mx-auto lg:mx-0"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            width={1280}
                            height={854}
                            sizes="(max-width: 1024px) 100vw, 320px"
                            className="w-full h-auto rounded-lg shadow-lg object-cover"
                        />
                    </motion.div>
                )}
            </div>
            <div className={`${isHorizontal ? 'w-full lg:flex-1 min-w-0' : 'w-full'} flex flex-col justify-center`}>
                {Array.isArray(profile) ? (
                    profile.map((paragraph, index) => (
                        <p key={index} className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed mb-2 sm:mb-4 lg:mb-6 font-wanted-sans break-words">
                            {paragraph}
                        </p>
                    ))
                ) : (
                    <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed mb-2 sm:mb-4 lg:mb-6 font-wanted-sans break-words">
                        {profile}
                    </p>
                )}
            </div>
        </div>
    );
});

// --- SimpleList ---

interface SimpleListDataItem {
    [key: string]: unknown;
}

interface SimpleListRendererProps {
    data: SimpleListDataItem[];
    renderItem?: (item: SimpleListDataItem, index: number) => ReactNode;
    itemKey?: string;
    spacing?: string;
    className?: string;
}

const SimpleListRenderer: React.FC<SimpleListRendererProps> = memo(({
    data,
    renderItem,
    itemKey = 'id',
    spacing = 'space-y-4',
    className = ''
}) => {
    return (
        <div className={`${className} ${spacing}`}>
            {data.map((item, index) => {
                const record = item as Record<string, unknown>;
                const key = record[itemKey] as string | number | undefined;
                return (
                    <div key={key ?? `item-${index}`}>
                        {renderItem ? renderItem(item, index) : (
                            <div className="bg-gray-750 p-2 sm:p-4 rounded-lg">
                                <h4 className="font-bold text-gray-100 font-wanted-sans">
                                    {String(record.title ?? record.name ?? '')}
                                </h4>
                                {typeof record.description === 'string' && record.description && (
                                    <p className="text-gray-300 text-sm mt-1">
                                        {record.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});

// --- DataRenderer (Union Type) ---

interface DataRendererBase {
    type: RenderType;
    className?: string;
}

interface CardGridData extends DataRendererBase {
    type: 'card_grid';
    data: Work[];
    columns?: string;
    renderItem?: (item: Work, index: number) => ReactNode;
    animation?: boolean;
}

interface TimelineDataProp extends DataRendererBase {
    type: 'timeline';
    data: TimelineData[];
    renderEvent?: (event: TimelineEvent, index: number) => ReactNode;
    reversed?: boolean;
}

interface EventCardData extends DataRendererBase {
    type: 'event_card';
    data: {
        type?: string;
        title: string;
        description: string;
    };
    showIcon?: boolean;
    getEventIcon?: (type: string) => ReactNode;
    getEventColor?: (type: string) => string;
}

interface ProfileData extends DataRendererBase {
    type: 'profile';
    profile?: string | string[];
    /** @deprecated Use 'profile' instead. Kept for backward compatibility. */
    data?: string | string[];
    imageSrc?: string;
    imageAlt?: string;
    layout?: 'horizontal' | 'vertical';
}

interface SimpleListData extends DataRendererBase {
    type: 'simple_list';
    data: SimpleListDataItem[];
    renderItem?: (item: SimpleListDataItem, index: number) => ReactNode;
    itemKey?: string;
    spacing?: string;
}

type DataRendererProps = CardGridData | TimelineDataProp | EventCardData | ProfileData | SimpleListData;

const DataRenderer: React.FC<DataRendererProps> = memo((props) => {
    const { t } = useLanguage();

    switch (props.type) {
        case 'card_grid':
            return (
                <CardGridRenderer
                    data={props.data}
                    columns={props.columns}
                    renderItem={props.renderItem}
                    animation={props.animation}
                    className={props.className}
                />
            );

        case 'timeline':
            return (
                <TimelineRenderer
                    data={props.data}
                    renderEvent={props.renderEvent}
                    reversed={props.reversed}
                    className={props.className}
                />
            );

        case 'event_card':
            return (
                <EventCardRenderer
                    event={props.data}
                    showIcon={props.showIcon}
                    getEventIcon={props.getEventIcon}
                    getEventColor={props.getEventColor}
                    className={props.className}
                />
            );

        case 'profile':
            return (
                <ProfileRenderer
                    profile={props.profile ?? props.data ?? ''}
                    imageSrc={props.imageSrc}
                    imageAlt={props.imageAlt}
                    layout={props.layout}
                    className={props.className}
                />
            );

        case 'simple_list':
            return (
                <SimpleListRenderer
                    data={props.data}
                    renderItem={props.renderItem}
                    itemKey={props.itemKey}
                    spacing={props.spacing}
                    className={props.className}
                />
            );

        default:
            return (
                <div className="text-center py-8">
                    <p className="text-gray-300 font-wanted-sans">
                        {t('common.unknownRenderType')}
                    </p>
                </div>
            );
    }
});

DataRenderer.displayName = 'DataRenderer';
CardGridRenderer.displayName = 'CardGridRenderer';
TimelineRenderer.displayName = 'TimelineRenderer';
EventCardRenderer.displayName = 'EventCardRenderer';
ProfileRenderer.displayName = 'ProfileRenderer';
SimpleListRenderer.displayName = 'SimpleListRenderer';

export default DataRenderer;
