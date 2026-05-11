import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import koTranslations from '../locales/ko.json';
import enTranslations from '../locales/en.json';
import { getLocaleFromPathname, withLocalePrefix } from '../utils/localePath';

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
    const router = useRouter();
    const routeLanguage = getLocaleFromPathname(pathname);

    // Resolve initial language: prefer localStorage, then route, then default 'ko'
    const getInitialLanguage = (): SupportedLanguage => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('language');
            if (stored === 'ko' || stored === 'en') return stored;
        }
        return routeLanguage === 'ko' || routeLanguage === 'en' ? routeLanguage : 'ko';
    };

    const [language, setLanguage] = useState<SupportedLanguage>(getInitialLanguage());
    const [isRouterSyncing, setIsRouterSyncing] = useState(false);

    // Sync: store language preference when changed
    useEffect(() => {
        if (language !== 'ko' && language !== 'en') return;
        localStorage.setItem('language', language);
    }, [language]);

    // Sync: navigate to locale-matching route when language changes
    // Guard against infinite redirect loops during hydration
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (isRouterSyncing) return;

        const currentLocale = getLocaleFromPathname(window.location.pathname);
        if (language !== currentLocale) {
            setIsRouterSyncing(true);
            router.push(withLocalePrefix(window.location.pathname, language));
            // Reset guard after navigation completes
            setTimeout(() => setIsRouterSyncing(false), 500);
        }
    }, [language, router, isRouterSyncing]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language;
        }
    }, [language]);

    const changeLanguage = (lang: SupportedLanguage) => {
        setLanguage(lang);
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
