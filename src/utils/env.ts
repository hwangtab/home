/**
 * Checks if the application is running in a production environment.
 */
export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

const normalizeBasePath = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === '.') return '';

    try {
        const parsedUrl = new URL(trimmed);
        return parsedUrl.pathname === '/' ? '' : parsedUrl.pathname.replace(/\/$/, '');
    } catch {
        if (!trimmed.startsWith('/')) return '';
        return trimmed === '/' ? '' : trimmed.replace(/\/$/, '');
    }
};

/**
 * Determines the router basename based on the current environment.
 * Handles specific deployment scenarios like GitHub Pages.
 */
export const getRouterBasename = (): string => {
    if (isProduction() && window.location.hostname === 'hwangtab.github.io') {
        return '/home';
    }
    return normalizeBasePath(process.env.PUBLIC_URL || '');
};
