import React, { memo, forwardRef, ReactNode, HTMLAttributes } from 'react';

type ContainerSize = 'sm' | 'default' | 'lg' | 'xl' | 'full';
type PaddingSize = 'none' | 'sm' | 'default' | 'lg';
type GapSize = 'none' | 'xs' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse';
type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    size?: ContainerSize;
    padding?: PaddingSize;
    children?: ReactNode;
}

const sizeClasses: Record<ContainerSize, string> = {
    sm: 'max-w-3xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-2xl',
    full: 'max-w-full'
};

const paddingClasses: Record<PaddingSize, string> = {
    none: '',
    sm: 'px-2 sm:px-4',
    default: 'px-2 sm:px-4 md:px-6 lg:px-8',
    lg: 'px-3 sm:px-6 md:px-8 lg:px-12'
};

const gapClasses: Record<GapSize, string> = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    default: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
    '2xl': 'gap-16',
    '3xl': 'gap-20'
};

const spacingClasses: Record<GapSize, string> = {
    none: 'space-y-0',
    xs: 'space-y-1',
    sm: 'space-y-2',
    default: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12',
    '2xl': 'space-y-16',
    '3xl': 'space-y-20'
};

// Static grid column mappings for Tailwind JIT compatibility
const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12'
};

const mdGridColsMap: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6'
};

const lgGridColsMap: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6'
};

const xlGridColsMap: Record<number, string> = {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6'
};

export const Container = memo(forwardRef<HTMLDivElement, ContainerProps>(
    ({ size = 'default', padding = 'default', className = '', children, ...props }, ref) => {
        const classes = [
            'mx-auto',
            sizeClasses[size] || sizeClasses.default,
            paddingClasses[padding] || paddingClasses.default,
            className
        ].filter(Boolean).join(' ');
        return <div ref={ref} className={classes} {...props}>{children}</div>;
    }
));

type GridCols = number | { sm?: number; md?: number; lg?: number; xl?: number };

interface GridProps extends HTMLAttributes<HTMLDivElement> {
    cols?: GridCols;
    gap?: GapSize;
    responsive?: boolean;
    children?: ReactNode;
}

const responsiveCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
};

export const Grid = memo(forwardRef<HTMLDivElement, GridProps>(
    ({ cols = 1, gap = 'default', responsive = true, className = '', children, ...props }, ref) => {
        const getColsClass = (): string => {
            if (typeof cols === 'object') {
                const { sm = 1, md = 2, lg = 3, xl = 4 } = cols;
                // Use static mappings instead of dynamic string interpolation
                return [
                    gridColsMap[sm] || 'grid-cols-1',
                    mdGridColsMap[md] || 'md:grid-cols-2',
                    lgGridColsMap[lg] || 'lg:grid-cols-3',
                    xlGridColsMap[xl] || 'xl:grid-cols-4'
                ].join(' ');
            }
            if (responsive) return responsiveCols[cols] || gridColsMap[cols] || 'grid-cols-1';
            return gridColsMap[cols] || 'grid-cols-1';
        };
        const classes = [
            'grid',
            getColsClass(),
            gapClasses[gap] || gapClasses.default,
            className
        ].filter(Boolean).join(' ');
        return <div ref={ref} className={classes} {...props}>{children}</div>;
    }
));

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
    direction?: FlexDirection;
    align?: FlexAlign;
    justify?: FlexJustify;
    wrap?: boolean;
    gap?: GapSize;
    children?: ReactNode;
}

const directionClasses: Record<FlexDirection, string> = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    col: 'flex-col',
    'col-reverse': 'flex-col-reverse'
};

const alignClasses: Record<FlexAlign, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
};

const justifyClasses: Record<FlexJustify, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
};

export const Flex = memo(forwardRef<HTMLDivElement, FlexProps>(
    ({ direction = 'row', align = 'stretch', justify = 'start', wrap = false, gap = 'default', className = '', children, ...props }, ref) => {
        const classes = [
            'flex',
            directionClasses[direction] || directionClasses.row,
            alignClasses[align] || alignClasses.stretch,
            justifyClasses[justify] || justifyClasses.start,
            wrap ? 'flex-wrap' : '',
            gapClasses[gap] || gapClasses.default,
            className
        ].filter(Boolean).join(' ');
        return <div ref={ref} className={classes} {...props}>{children}</div>;
    }
));

interface StackProps extends HTMLAttributes<HTMLDivElement> {
    spacing?: GapSize;
    align?: FlexAlign;
    children?: ReactNode;
}

export const Stack = memo(forwardRef<HTMLDivElement, StackProps>(
    ({ spacing = 'default', align = 'stretch', className = '', children, ...props }, ref) => {
        const classes = [
            'flex flex-col',
            spacingClasses[spacing] || spacingClasses.default,
            alignClasses[align] || alignClasses.stretch,
            className
        ].filter(Boolean).join(' ');
        return <div ref={ref} className={classes} {...props}>{children}</div>;
    }
));

interface CenterProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export const Center = memo(forwardRef<HTMLDivElement, CenterProps>(
    ({ className = '', children, ...props }, ref) => (
        <div ref={ref} className={`flex items-center justify-center ${className}`} {...props}>
            {children}
        </div>
    )
));

interface SpacerProps {
    size?: GapSize;
    direction?: 'horizontal' | 'vertical';
    className?: string;
}

export const Spacer = memo<SpacerProps>(({ size = 'default', direction = 'vertical', className = '' }) => {
    const spacerSizes: Record<GapSize, string> = {
        none: direction === 'vertical' ? 'h-0' : 'w-0',
        xs: direction === 'vertical' ? 'h-1' : 'w-1',
        sm: direction === 'vertical' ? 'h-2' : 'w-2',
        default: direction === 'vertical' ? 'h-4' : 'w-4',
        md: direction === 'vertical' ? 'h-6' : 'w-6',
        lg: direction === 'vertical' ? 'h-8' : 'w-8',
        xl: direction === 'vertical' ? 'h-12' : 'w-12',
        '2xl': direction === 'vertical' ? 'h-16' : 'w-16',
        '3xl': direction === 'vertical' ? 'h-20' : 'w-20'
    };
    return <div className={`${spacerSizes[size] || spacerSizes.default} ${className}`} aria-hidden="true" />;
});

interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

export const Divider = memo<DividerProps>(({ orientation = 'horizontal', className = '' }) => {
    const classes = orientation === 'horizontal'
        ? 'w-full h-px bg-gray-700'
        : 'h-full w-px bg-gray-700';
    return <div className={`${classes} ${className}`} role="separator" />;
});

Container.displayName = 'Container';
Grid.displayName = 'Grid';
Flex.displayName = 'Flex';
Stack.displayName = 'Stack';
Center.displayName = 'Center';
Spacer.displayName = 'Spacer';
Divider.displayName = 'Divider';
