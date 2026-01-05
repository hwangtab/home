// 공통 스타일 패턴
interface StyleVariants {
    base: string;
    dark: string;
    light: string;
}

interface ButtonStyles {
    base: string;
    primary: string;
    secondary: string;
    accent: string;
    disabled: string;
    [key: string]: string;
}

interface TextStyles {
    primary: string;
    secondary: string;
    tertiary: string;
}

interface ThemeStyleConfig {
    background: string;
    surface: string;
    surfaceVariant: string;
    text: TextStyles;
    border: string;
}

export const COMMON_STYLES = {
    // 카드 기본 스타일
    card: {
        base: 'p-6 rounded-lg shadow-lg h-full flex flex-col',
        dark: 'bg-gray-800',
        light: 'bg-white'
    } as StyleVariants,

    // 버튼 스타일
    button: {
        base: 'px-6 py-3 rounded-full font-wanted-sans transition duration-300 flex items-center justify-center',
        primary: 'bg-gray-700 text-white hover:bg-gray-600',
        secondary: 'bg-gray-600 text-white hover:bg-gray-500',
        accent: 'bg-blue-600 text-white hover:bg-blue-700',
        disabled: 'opacity-50 cursor-not-allowed'
    } as ButtonStyles,

    // 입력 필드 스타일
    input: {
        base: 'w-full px-4 py-3 rounded-md border focus:ring-2 focus:outline-none transition-colors',
        dark: 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500',
        light: 'bg-white border-gray-300 text-gray-700 focus:border-pink-500 focus:ring-pink-500'
    } as StyleVariants,

    // 텍스트 스타일
    text: {
        heading: 'text-2xl font-bold text-gray-200 font-santokki',
        subheading: 'text-xl font-bold text-gray-200 font-santokki',
        body: 'text-gray-400 font-wanted-sans',
        label: 'block text-sm font-medium mb-2',
        labelDark: 'text-gray-300',
        labelLight: 'text-gray-700'
    },

    // 레이아웃 스타일
    layout: {
        section: 'space-y-6',
        grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
        gridTwoCol: 'grid grid-cols-1 md:grid-cols-2 gap-6',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
    },

    // 상태별 스타일
    status: {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-600 text-white',
        info: 'bg-blue-600 text-white'
    }
} as const;

// 테마별 스타일 조합
export const THEME_STYLES: Record<'dark' | 'light', ThemeStyleConfig> = {
    dark: {
        background: 'bg-gray-900',
        surface: 'bg-gray-800',
        surfaceVariant: 'bg-gray-700',
        text: {
            primary: 'text-gray-200',
            secondary: 'text-gray-300',
            tertiary: 'text-gray-400'
        },
        border: 'border-gray-600'
    },

    light: {
        background: 'bg-gray-50',
        surface: 'bg-white',
        surfaceVariant: 'bg-gray-100',
        text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-700',
            tertiary: 'text-gray-500'
        },
        border: 'border-gray-300'
    }
};

// 스타일 조합 유틸리티 함수
export const combineStyles = (...styles: (string | undefined | null | false)[]): string => {
    return styles.filter(Boolean).join(' ');
};

export const getCardStyles = (theme: 'dark' | 'light' = 'dark'): string => {
    return combineStyles(
        COMMON_STYLES.card.base,
        theme === 'dark' ? COMMON_STYLES.card.dark : COMMON_STYLES.card.light
    );
};

export const getButtonStyles = (variant: keyof ButtonStyles = 'primary', disabled = false): string => {
    return combineStyles(
        COMMON_STYLES.button.base,
        COMMON_STYLES.button[variant],
        disabled && COMMON_STYLES.button.disabled
    );
};

export const getInputStyles = (theme: 'dark' | 'light' = 'dark'): string => {
    return combineStyles(
        COMMON_STYLES.input.base,
        theme === 'dark' ? COMMON_STYLES.input.dark : COMMON_STYLES.input.light
    );
};
