import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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

interface TranslationsMap {
    ko: TranslationValue;
    en: TranslationValue;
}

const translations: TranslationsMap = {
    ko: koTranslations as TranslationValue,
    en: enTranslations as TranslationValue
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const pathname = usePathname();
    const routeLanguage = getLocaleFromPathname(pathname);
    const [language, setLanguage] = useState<SupportedLanguage>(routeLanguage);

    useEffect(() => {
        if (language !== routeLanguage) {
            setLanguage(routeLanguage);
        }
    }, [language, routeLanguage]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language;
        }
    }, [language]);

    const changeLanguage = (lang: SupportedLanguage) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = useCallback((path: string): string => {
        const keys = path.split('.');

        // Traverse translation object by keys
        const resolve = (obj: any): string | null => {
            let current = obj;
            for (const key of keys) {
                if (current && typeof current === 'object' && key in current) {
                    current = current[key];
                } else {
                    return null;
                }
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

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
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
