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
        let value: any = translations[language];

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                // Fallback to English if translation is missing in the current language
                value = translations.en;
                for (const fallbackKey of keys) {
                    if (value && typeof value === 'object' && fallbackKey in value) {
                        value = value[fallbackKey];
                    } else {
                        return path; // Return the key path only if also missing in English
                    }
                }
                return typeof value === 'string' ? value : path;
            }
        }

        return typeof value === 'string' ? value : path;
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
