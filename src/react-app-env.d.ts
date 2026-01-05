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
