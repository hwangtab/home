// @ts-nocheck
import React, { memo } from 'react';

type SkeletonVariant = 'rounded' | 'circle' | 'rectangular';

interface SkeletonProps {
    width?: string;
    height?: string;
    className?: string;
    variant?: SkeletonVariant;
    animate?: boolean;
}

const variants: Record<SkeletonVariant, string> = {
    rounded: 'rounded',
    circle: 'rounded-full',
    rectangular: 'rounded-none'
};

export const Skeleton = memo<SkeletonProps>(({
    width = 'w-full',
    height = 'h-4',
    className = '',
    variant = 'rounded',
    animate = true
}) => {
    const skeletonClasses = [
        'bg-gray-700',
        animate ? 'animate-pulse' : '',
        variants[variant],
        width,
        height,
        'skeleton-optimized',
        className
    ].filter(Boolean).join(' ');

    return <div className={skeletonClasses} />;
});

interface CardSkeletonProps {
    className?: string;
}

export const CardSkeleton = memo<CardSkeletonProps>(({ className = '' }) => (
    <div className={`bg-gray-800 rounded-lg p-5 ${className}`}>
        <Skeleton width="w-full" height="h-48" variant="rounded" className="mb-4" />
        <div className="flex items-center justify-between mb-3">
            <Skeleton width="w-16" height="h-5" variant="rounded" />
            <Skeleton width="w-12" height="h-4" variant="rounded" />
        </div>
        <Skeleton width="w-3/4" height="h-6" className="mb-3" />
        <div className="space-y-2 mb-4">
            <Skeleton width="w-full" height="h-4" />
            <Skeleton width="w-5/6" height="h-4" />
        </div>
        <div className="flex gap-2 mb-4">
            <Skeleton width="w-12" height="h-6" variant="rounded" />
            <Skeleton width="w-16" height="h-6" variant="rounded" />
            <Skeleton width="w-14" height="h-6" variant="rounded" />
        </div>
        <div className="flex justify-end pt-2 border-t border-gray-700/50">
            <Skeleton width="w-20" height="h-8" variant="rounded" />
        </div>
    </div>
));

interface TextSkeletonProps {
    lines?: number;
    className?: string;
}

export const TextSkeleton = memo<TextSkeletonProps>(({ lines = 3, className = '' }) => (
    <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
            <Skeleton key={index} width={index === lines - 1 ? 'w-3/4' : 'w-full'} height="h-4" />
        ))}
    </div>
));

interface ImageSkeletonProps {
    aspectRatio?: string;
    className?: string;
}

export const ImageSkeleton = memo<ImageSkeletonProps>(({
    aspectRatio = 'aspect-square',
    className = ''
}) => (
    <div className={`relative ${aspectRatio} ${className}`}>
        <Skeleton width="w-full" height="h-full" variant="rounded" className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-600 rounded animate-pulse">
                <svg className="w-full h-full text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
));

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonSkeletonProps {
    size?: ButtonSize;
    className?: string;
}

const buttonSizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-28'
};

export const ButtonSkeleton = memo<ButtonSkeletonProps>(({ size = 'md', className = '' }) => (
    <Skeleton
        width={buttonSizeClasses[size].split(' ')[1]}
        height={buttonSizeClasses[size].split(' ')[0]}
        variant="rounded"
        className={className}
    />
));

interface ListSkeletonProps {
    items?: number;
    showAvatar?: boolean;
    className?: string;
}

export const ListSkeleton = memo<ListSkeletonProps>(({ items = 5, showAvatar = false, className = '' }) => (
    <div className={`space-y-4 ${className}`}>
        {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
                {showAvatar && <Skeleton width="w-10" height="h-10" variant="circle" />}
                <div className="flex-1">
                    <Skeleton width="w-1/2" height="h-4" className="mb-2" />
                    <Skeleton width="w-3/4" height="h-3" />
                </div>
            </div>
        ))}
    </div>
));

type GridColumns = 1 | 2 | 3 | 4;

interface GridSkeletonProps {
    items?: number;
    columns?: GridColumns;
    className?: string;
}

const gridClasses: Record<GridColumns, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
};

export const GridSkeleton = memo<GridSkeletonProps>(({ items = 6, columns = 3, className = '' }) => (
    <div className={`grid ${gridClasses[columns]} gap-6 ${className}`}>
        {Array.from({ length: items }).map((_, index) => (
            <CardSkeleton key={index} />
        ))}
    </div>
));

interface HeaderSkeletonProps {
    className?: string;
}

export const HeaderSkeleton = memo<HeaderSkeletonProps>(({ className = '' }) => (
    <div className={`mb-8 ${className}`}>
        <Skeleton width="w-48" height="h-8" className="mb-4" />
        <Skeleton width="w-96" height="h-5" />
    </div>
));

Skeleton.displayName = 'Skeleton';
CardSkeleton.displayName = 'CardSkeleton';
TextSkeleton.displayName = 'TextSkeleton';
ImageSkeleton.displayName = 'ImageSkeleton';
ButtonSkeleton.displayName = 'ButtonSkeleton';
ListSkeleton.displayName = 'ListSkeleton';
GridSkeleton.displayName = 'GridSkeleton';
HeaderSkeleton.displayName = 'HeaderSkeleton';
