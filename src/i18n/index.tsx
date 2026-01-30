import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import koTranslations from '../locales/ko.json';
import enTranslations from '../locales/en.json';

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
    const [language, setLanguage] = useState<SupportedLanguage>('ko');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as SupportedLanguage | null;
        if (savedLanguage === 'ko' || savedLanguage === 'en') {
            setLanguage(savedLanguage);
        }
    }, []);

    const changeLanguage = (lang: SupportedLanguage) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (path: string): string => {
        const keys = path.split('.');
        let value: TranslationValue | string | string[] | undefined = translations[language];

        for (const key of keys) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                value = value[key];
            } else {
                return path; // Return the path if translation not found
            }
        }

        return typeof value === 'string' ? value : path;
    };

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
