import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n';
import LanguageToggle from './LanguageToggle';
import MobileMenu from './ui/MobileMenu';
import PageIndicator from './ui/PageIndicator';
import SkipLinks from './accessibility/SkipLinks';
import ScrollProgress from './ui/ScrollProgress';
import PageTransition from './transitions/PageTransition';
import useSwipeNavigation from '../hooks/useSwipeNavigation';
import useKeyboardNavigation from '../hooks/useKeyboardNavigation';

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
    <header 
      className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-850 text-white py-4 sm:py-6 px-2 sm:px-4 md:px-6 sticky top-0 z-50 transform-gpu border-b border-brand-primary-500/10"
      role="banner"
      aria-label="사이트 헤더"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/"
          aria-label="황경하 홈페이지로 이동"
          className="focus:outline-none focus:ring-a11y focus:ring-brand-primary-400 focus:ring-offset-a11y focus:ring-offset-gray-900 rounded-lg focus-visible:ring-a11y focus-visible:ring-brand-primary-400"
        >
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-bombaram transform-gpu hover:scale-105 transition-transform duration-200"
            style={{ 
              lineHeight: '1',
              transform: 'translateY(12px)'
            }}
          >
            황경하
          </h1>
        </Link>
        
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
          {/* 데스크톱 네비게이션 */}
          <nav 
            className="hidden md:block" 
            id="navigation"
            role="navigation" 
            aria-label="주 네비게이션"
          >
            <ul className="flex space-x-3 lg:space-x-6" role="menubar">
              {navigation.map((item) => (
                <li key={item.name} role="none">
                  <Link 
                    to={item.path} 
                    className={`hover:text-brand-primary-300 hover:scale-110 transition-all duration-200 font-wanted-sans text-sm lg:text-lg relative focus:outline-none focus:ring-a11y focus:ring-brand-primary-400 focus:ring-offset-a11y focus:ring-offset-gray-900 rounded-md px-1 lg:px-2 py-1 focus-visible:ring-a11y focus-visible:ring-brand-primary-400 inline-block ${
                      location.pathname === item.path ? 'text-brand-primary-400' : ''
                    }`}
                    role="menuitem"
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageToggle />
            {/* 모바일 메뉴 */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer 
      className="bg-gradient-to-r from-gray-950 to-gray-900 text-gray-400 p-3 sm:p-6 mt-8 sm:mt-12"
      id="footer"
      role="contentinfo"
      aria-label="사이트 푸터"
    >
      <div className="container mx-auto text-center font-wanted-sans">
        <p>&copy; {t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  // 스와이프 네비게이션 활성화
  useSwipeNavigation();
  // 키보드 네비게이션 활성화
  useKeyboardNavigation();

  return (
    <motion.div 
      className="bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen font-wanted-sans text-gray-100 flex flex-col transform-gpu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: 'easeOut'
      }}
    >
      {/* 스킵 링크 */}
      <SkipLinks />
      
      {/* 스크롤 진행률 인디케이터 */}
      <ScrollProgress />
      
      
      <Header />
      
      <main 
        id="main-content"
        className="container mx-auto mt-4 sm:mt-8 md:mt-12 p-2 sm:p-4 md:p-6 flex-1 contain-layout"
        role="main"
        aria-label="메인 콘텐츠"
        tabIndex="-1"
      >
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      
      <Footer />
      
      {/* 모바일 페이지 인디케이터 */}
      <PageIndicator />
    </motion.div>
  );
};

export default React.memo(Layout);