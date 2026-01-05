// @ts-nocheck
import React, { memo } from 'react';

// 색상 팔레트 정의
export const COLORS = {
    gray: {
        50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af',
        500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 850: '#1a202c', 900: '#111827', 950: '#0d1117'
    },
    brand: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#06b6d4', dark: '#1e293b', light: '#f1f5f9' },
    state: { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' },
    korean: {
        hanbok: { red: '#c93f37', blue: '#4a69bd', yellow: '#f39c12', green: '#27ae60', purple: '#8e44ad' },
        natural: { earth: '#8d6e63', sky: '#87ceeb', mountain: '#5d6d7e', water: '#48c9b0', sunset: '#e67e22' }
    }
} as const;

export const COLOR_TOKENS = {
    text: { primary: COLORS.gray[100], secondary: COLORS.gray[300], muted: COLORS.gray[400], disabled: COLORS.gray[500], inverse: COLORS.gray[900] },
    background: { primary: COLORS.gray[900], secondary: COLORS.gray[800], tertiary: COLORS.gray[850], overlay: 'rgba(0, 0, 0, 0.5)', glass: 'rgba(255, 255, 255, 0.1)' },
    border: { default: COLORS.gray[600], muted: COLORS.gray[700], accent: COLORS.brand.primary, error: COLORS.state.error },
    interactive: { primary: COLORS.brand.primary, primaryHover: '#2563eb', secondary: COLORS.gray[600], secondaryHover: COLORS.gray[500], accent: COLORS.brand.accent, accentHover: '#0891b2' }
} as const;

export const GRADIENTS = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600',
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-800',
    accent: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    warm: 'bg-gradient-to-r from-orange-400 to-red-500',
    cool: 'bg-gradient-to-r from-blue-400 to-indigo-600',
    korean: 'bg-gradient-to-r from-red-500 to-blue-600',
    sunset: 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500',
    ocean: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800',
    forest: 'bg-gradient-to-r from-green-400 to-blue-500',
    text: {
        primary: 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent',
        accent: 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent',
        warm: 'bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent',
        korean: 'bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent'
    }
} as const;

export const colorUtils = {
    withOpacity: (color: string, opacity: number): string => {
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    },
    lighten: (color: string, _amount: number): string => color,
    darken: (color: string, _amount: number): string => color
};

export const THEMES = {
    dark: {
        name: 'dark',
        colors: {
            background: { primary: COLORS.gray[900], secondary: COLORS.gray[800], tertiary: COLORS.gray[850] },
            text: { primary: COLORS.gray[100], secondary: COLORS.gray[300], muted: COLORS.gray[400] },
            border: { default: COLORS.gray[600], muted: COLORS.gray[700] }
        }
    }
} as const;

type SwatchSize = 'sm' | 'md' | 'lg';

interface ColorSwatchProps {
    color: string;
    name?: string;
    size?: SwatchSize;
    showHex?: boolean;
    className?: string;
}

const sizeClasses: Record<SwatchSize, string> = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };

export const ColorSwatch = memo<ColorSwatchProps>(({ color, name, size = 'md', showHex = true, className = '' }) => (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
        <div className={`${sizeClasses[size]} rounded-lg border border-gray-600 shadow-sm`} style={{ backgroundColor: color }} />
        {name && (
            <div className="text-center">
                <p className="text-xs font-medium text-gray-200">{name}</p>
                {showHex && <p className="text-xs text-gray-400 font-mono">{color}</p>}
            </div>
        )}
    </div>
));

interface ColorPaletteProps {
    colors: Record<string, string>;
    title?: string;
    className?: string;
}

export const ColorPalette = memo<ColorPaletteProps>(({ colors, title, className = '' }) => (
    <div className={`space-y-4 ${className}`}>
        {title && <h3 className="text-lg font-semibold text-gray-200 font-wanted-sans">{title}</h3>}
        <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {Object.entries(colors).map(([name, color]) => <ColorSwatch key={name} color={color} name={name} size="md" />)}
        </div>
    </div>
));

ColorSwatch.displayName = 'ColorSwatch';
ColorPalette.displayName = 'ColorPalette';
