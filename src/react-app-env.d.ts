/// <reference types="react-scripts" />

// SVG imports
declare module '*.svg' {
    import * as React from 'react';
    export const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
    >;
    const src: string;
    export default src;
}

// JSON imports
declare module '*.json' {
    const value: unknown;
    export default value;
}

// Image imports
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';

// Fuse.js type declarations
declare module 'fuse.js' {
    interface FuseResult<T> {
        item: T;
        score?: number;
        matches?: readonly FuseResultMatch[];
        refIndex?: number;
    }

    interface FuseResultMatch {
        indices?: [number, number][];
        value?: string;
        key?: string;
        arrayIndex?: number;
    }

    interface IFuseOptions<T> {
        keys?: (keyof T | string)[];
        includeScore?: boolean;
        includeMatches?: boolean;
        threshold?: number;
        distance?: number;
        maxPatternLength?: number;
        minMatchCharLength?: number;
        findAllMatches?: boolean;
        ignoreLocation?: boolean;
        useExtendedSearch?: boolean;
        shouldSort?: boolean;
        sortFn?: (a: FuseResult<T>, b: FuseResult<T>) => number;
        getFn?: <U>(obj: T, path: string | string[]) => U;
        isCaseSensitive?: boolean;
    }

    export default class Fuse<T> {
        constructor(list: readonly T[], options?: IFuseOptions<T>, fuse?: any);
        search<U = T>(pattern: string | any): FuseResult<U>[];
        get<U>(value: string): U;
        setCollection(collection: readonly T[]): void;
    }
}

// Framer Motion type augmentation for TypeScript 5.9 compatibility
// framer-motion 6.x has type issues with newer TypeScript versions
declare module 'framer-motion' {
    import * as React from 'react';

    export interface MotionProps {
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        initial?: any;
        animate?: any;
        exit?: any;
        transition?: any;
        whileHover?: any;
        whileTap?: any;
        whileFocus?: any;
        whileDrag?: any;
        whileInView?: any;
        variants?: any;
        layout?: boolean | 'position' | 'size';
        layoutId?: string;
        drag?: boolean | 'x' | 'y';
        dragConstraints?: any;
        onAnimationStart?: (definition: any) => void;
        onAnimationComplete?: (definition: any) => void;
        onHoverStart?: (event: MouseEvent, info: any) => void;
        onHoverEnd?: (event: MouseEvent, info: any) => void;
    }

    type MotionComponent<T extends keyof JSX.IntrinsicElements> = React.ForwardRefExoticComponent<
        MotionProps & React.ComponentPropsWithoutRef<T> & React.RefAttributes<Element>
    >;

    export const motion: {
        div: MotionComponent<'div'>;
        span: MotionComponent<'span'>;
        button: MotionComponent<'button'>;
        a: MotionComponent<'a'>;
        ul: MotionComponent<'ul'>;
        li: MotionComponent<'li'>;
        img: MotionComponent<'img'>;
        nav: MotionComponent<'nav'>;
        header: MotionComponent<'header'>;
        footer: MotionComponent<'footer'>;
        section: MotionComponent<'section'>;
        article: MotionComponent<'article'>;
        aside: MotionComponent<'aside'>;
        main: MotionComponent<'main'>;
        p: MotionComponent<'p'>;
        h1: MotionComponent<'h1'>;
        h2: MotionComponent<'h2'>;
        h3: MotionComponent<'h3'>;
        h4: MotionComponent<'h4'>;
        h5: MotionComponent<'h5'>;
        h6: MotionComponent<'h6'>;
        form: MotionComponent<'form'>;
        input: MotionComponent<'input'>;
        textarea: MotionComponent<'textarea'>;
        label: MotionComponent<'label'>;
        svg: MotionComponent<'svg'>;
        path: MotionComponent<'path'>;
        circle: MotionComponent<'circle'>;
        rect: MotionComponent<'rect'>;
        line: MotionComponent<'line'>;
        polyline: MotionComponent<'polyline'>;
        polygon: MotionComponent<'polygon'>;
        g: MotionComponent<'g'>;
    };

    export const AnimatePresence: React.FC<{
        children?: React.ReactNode;
        initial?: boolean;
        mode?: 'sync' | 'wait' | 'popLayout';
        onExitComplete?: () => void;
        custom?: any;
    }>;

    // Animation Controls
    export interface AnimationControls {
        start: (definition: any, transitionOverride?: any) => Promise<any>;
        stop: () => void;
        set: (definition: any) => void;
    }

    export function useAnimation(): AnimationControls;
    export function useMotionValue(initial: number): any;
    export function useTransform(value: any, inputRange: number[], outputRange: any[]): any;
    export function useSpring(value: any, config?: any): any;
    export function useScroll(options?: any): any;
    export function useInView(ref: React.RefObject<Element>, options?: any): boolean;

    // Variants type
    export interface Variant {
        [key: string]: any;
    }

    export interface Variants {
        [key: string]: Variant;
    }

    export type Transition = {
        duration?: number;
        delay?: number;
        ease?: string | number[];
        type?: 'spring' | 'tween' | 'keyframes' | 'inertia';
        stiffness?: number;
        damping?: number;
        mass?: number;
        repeat?: number;
        repeatType?: 'loop' | 'reverse' | 'mirror';
        repeatDelay?: number;
    };

    export type TargetAndTransition = {
        [key: string]: any;
    };

    export type HTMLMotionProps<T extends keyof JSX.IntrinsicElements> =
        MotionProps & React.ComponentPropsWithoutRef<T>;
}

