import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../i18n';
import { stripLocalePrefix, withLocalePrefix } from '../utils/localePath';

interface LanguageToggleProps {
    className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
    const { language, changeLanguage, t } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();
    const nextLanguage = language === 'ko' ? 'en' : 'ko';
    const label = nextLanguage === 'ko' ? t('common.switchToKorean') : t('common.switchToEnglish');

    const handleToggleLanguage = () => {
        const basePath = stripLocalePrefix(pathname);
        const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
        const currentHash = typeof window !== 'undefined' ? window.location.hash : '';
        const targetPath = `${withLocalePrefix(basePath, nextLanguage)}${currentSearch}${currentHash}`;

        changeLanguage(nextLanguage);
        router.push(targetPath);
    };

    return (
        <div className={`relative ${className}`}>
            <motion.button
                type="button"
                aria-label={label}
                onClick={handleToggleLanguage}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Globe size={16} />
                <span className="font-wanted-sans text-sm">
                    {language === 'ko' ? 'EN' : 'KO'}
                </span>
            </motion.button>
        </div>
    );
};

export default LanguageToggle;
