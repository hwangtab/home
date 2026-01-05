export type SupportedLanguage = 'ko' | 'en';

export interface NavigationTranslations {
    home: string;
    about: string;
    works: string;
    archive: string;
    news: string;
    contact: string;
}

export interface CommonTranslations {
    year: string;
    loading: string;
    search: string;
    searchPlaceholder: string;
    noResults: string;
    readMore: string;
    close: string;
    download: string;
    share: string;
    back: string;
    next: string;
    previous: string;
}

export interface Translations {
    nav: NavigationTranslations;
    common: CommonTranslations;
    home: Record<string, unknown>;
    about: Record<string, string>;
    works: Record<string, string>;
    archive: Record<string, string>;
    news: Record<string, string>;
    contact: Record<string, unknown>;
    player: Record<string, string>;
    footer: { copyright: string };
}

export interface LanguageContextValue {
    language: SupportedLanguage;
    changeLanguage: (lang: SupportedLanguage) => void;
    t: (path: string) => string;
}
