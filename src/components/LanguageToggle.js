import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '../i18n';

const LanguageToggle = ({ className = "" }) => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => changeLanguage(language === 'ko' ? 'en' : 'ko')}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe size={16} />
        <span className="font-wanted-sans text-sm">
          {language === 'ko' ? 'EN' : '한국어'}
        </span>
      </motion.button>
    </div>
  );
};

export default LanguageToggle;