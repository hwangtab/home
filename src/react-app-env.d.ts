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
