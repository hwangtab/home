import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
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
    const isRouterSyncingRef = useRef(false);

    // Resolve initial language: prefer localStorage, then route, then default 'ko'
    const getInitialLanguage = (): SupportedLanguage => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('language');
            if (stored === 'ko' || stored === 'en') return stored;
        }
        return routeLanguage === 'ko' || routeLanguage === 'en' ? routeLanguage : 'ko';
    };

    const [language, setLanguage] = useState<SupportedLanguage>(getInitialLanguage());

   // Sync: store language preference when changed
    useEffect(() => {
        if (language !== 'ko' && language !== 'en') return;
        localStorage.setItem('language', language);
    }, [language]);

    // Sync: navigate to locale-matching route when language changes
    // Use pathname-based detection for guard reset — more reliable than rAF
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (isRouterSyncingRef.current) return;

        const currentLocale = getLocaleFromPathname(window.location.pathname);
        if (language !== currentLocale) {
            const targetPath = withLocalePrefix(window.location.pathname, language);
            // Prevent redundant push when already at the target path
            if (window.location.pathname === targetPath) return;
            isRouterSyncingRef.current = true;
            router.push(targetPath);
        }
    }, [language, router]);

    // Guard 해제: pathname이 변경되었을 때 (네비게이션 완료 감지)
    useEffect(() => {
        if (isRouterSyncingRef.current && getLocaleFromPathname(pathname) === language) {
            isRouterSyncingRef.current = false;
        }
    }, [pathname, language]);

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
