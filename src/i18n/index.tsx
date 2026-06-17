'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import koTranslations from '../locales/ko.json';
import enTranslations from '../locales/en.json';
import { getLocaleFromPathname } from '../utils/localePath';

type SupportedLanguage = 'ko' | 'en';

interface LanguageContextType {
    language: SupportedLanguage;
    changeLanguage: (lang: SupportedLanguage) => void;
    t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface TranslationValue {
    [key: string]: string | string[] | TranslationValue;
}

type ResolvedTranslationValue = string | string[] | TranslationValue;

interface TranslationsMap {
    ko: TranslationValue;
    en: TranslationValue;
}

const translations: TranslationsMap = {
    ko: koTranslations as TranslationValue,
    en: enTranslations as TranslationValue
};

const isTranslationObject = (value: string | string[] | TranslationValue): value is TranslationValue => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const getTranslationChild = (value: ResolvedTranslationValue, key: string): ResolvedTranslationValue | null => {
    if (Array.isArray(value)) {
        const index = Number(key);
        return Number.isInteger(index) && index >= 0 && index < value.length ? value[index] : null;
    }

    if (isTranslationObject(value) && key in value) {
        return value[key];
    }

    return null;
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const pathname = usePathname();
    const routeLanguage = getLocaleFromPathname(pathname);

    const [language, setLanguage] = useState<SupportedLanguage>(routeLanguage);

   // Sync: store language preference when changed
    useEffect(() => {
        if (language !== 'ko' && language !== 'en') return;
        try {
            localStorage.setItem('language', language);
        } catch (error) {
            console.warn('Unable to persist language preference:', error);
        }
    }, [language]);

    // The URL locale is authoritative for direct links, refreshes, and search traffic.
    useEffect(() => {
        if (language !== routeLanguage) {
            setLanguage(routeLanguage);
        }
    }, [routeLanguage, language]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language;
        }
    }, [language]);

    const changeLanguage = useCallback((lang: SupportedLanguage) => {
        setLanguage(lang);
    }, []);

    const t = useCallback((path: string): string => {
        const keys = path.split('.');

        // Traverse translation object by keys
        const resolve = (obj: TranslationValue): string | null => {
            let current: ResolvedTranslationValue = obj;
            for (const key of keys) {
                const child = getTranslationChild(current, key);
                if (child === null) {
                    return null;
                }
                current = child;
            }
            return typeof current === 'string' ? current : null;
        };

        // Try current language first, then English fallback
        let result = resolve(translations[language]);
        if (result === null) {
            result = resolve(translations.en);
        }

        return result ?? path;
    }, [language]);

    const contextValue = useMemo(
        () => ({ language, changeLanguage, t }),
        [language, changeLanguage, t]
    );

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;
