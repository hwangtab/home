import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import LanguageToggle from './LanguageToggle';

const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navigation = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.works'), path: '/works' },
    { name: t('nav.archive'), path: '/archive' },
    { name: t('nav.news'), path: '/news' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  return (
    <motion.header 
      className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 px-6 sticky top-0 z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <motion.h1 
            className="text-5xl font-bold font-bombaram"
            animate={{ y: 12 }}
            whileHover={{ scale: 1.05, y: 12 }}
            style={{ 
              lineHeight: '1'
            }}
          >
            황경하
          </motion.h1>
        </Link>
        
        <div className="flex items-center space-x-6">
          <nav>
            <ul className="flex space-x-6">
              {navigation.map((item) => (
                <motion.li key={item.name} whileHover={{ scale: 1.1 }}>
                  <Link 
                    to={item.path} 
                    className={`hover:text-gray-300 transition duration-300 font-wanted-sans text-lg ${
                      location.pathname === item.path ? 'text-gray-300' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          
          <LanguageToggle />
        </div>
      </div>
    </motion.header>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-400 p-6 mt-12">
      <div className="container mx-auto text-center font-wanted-sans">
        <p>&copy; {t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen font-wanted-sans text-gray-200 flex flex-col">
      <Header />
      <main className="container mx-auto mt-12 p-6 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;