// @ts-nocheck
import React, { useState, useEffect, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useLanguage } from '../i18n';
import LanguageToggle from './LanguageToggle';
import MobileMenu from './ui/MobileMenu';
import PageIndicator from './ui/PageIndicator';
import SkipLinks from './accessibility/SkipLinks';
import ScrollProgress from './ui/ScrollProgress';
import PageTransition from './transitions/PageTransition';
import useSwipeNavigation from '../hooks/useSwipeNavigation';
import useKeyboardNavigation from '../hooks/useKeyboardNavigation';

const Header: React.FC = () => {
    const location = useLocation();
    // @ts-ignore - i18n context
    const { t } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial position

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigation = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.about'), path: '/about' },
        { name: t('nav.works'), path: '/works' },
        { name: t('nav.news'), path: '/news' },
        { name: t('nav.contact'), path: '/contact' }
    ];

    const headerBaseClasses = "text-white py-4 sm:py-6 px-2 sm:px-4 md:px-6 fixed top-0 left-0 right-0 z-50 transform-gpu transition-all duration-300";
    const headerScrolledClasses = "bg-gray-950/95 border-b border-brand-primary-500/10 backdrop-blur-md";
    const headerTransparentClasses = "bg-transparent border-b border-transparent";

    return (
        <header
            className={`${headerBaseClasses} ${isScrolled ? headerScrolledClasses : headerTransparentClasses}`}
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
                                        className={`hover:text-brand-primary-300 hover:scale-110 transition-all duration-200 font-wanted-sans text-sm lg:text-lg relative focus:outline-none focus:ring-a11y focus:ring-brand-primary-400 focus:ring-offset-a11y focus:ring-offset-gray-900 rounded-md px-1 lg:px-2 py-1 focus-visible:ring-a11y focus-visible:ring-brand-primary-400 inline-block ${location.pathname === item.path ? 'text-brand-primary-400' : ''
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

const Footer: React.FC = () => {
    // @ts-ignore
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

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    // 스와이프 네비게이션 활성화
    useSwipeNavigation();
    // 키보드 네비게이션 활성화
    useKeyboardNavigation();

    return (
        <div
            className="bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen font-wanted-sans text-gray-100 flex flex-col"
            style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
            }}
        >
            {/* 스킵 링크 */}
            <SkipLinks />

            {/* 스크롤 진행률 인디케이터 */}
            <ScrollProgress />


            <Header />

            <main
                id="main-content"
                className="flex-1 w-full relative contain-layout"
                role="main"
                aria-label="메인 콘텐츠"
                tabIndex={-1}
            >
                <PageTransition>
                    {children}
                </PageTransition>
            </main>

            <Footer />

            {/* 모바일 페이지 인디케이터 */}
            <PageIndicator />
        </div>
    );
};

export default React.memo(Layout);
