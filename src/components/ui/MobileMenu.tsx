
import React, { useState, useEffect, memo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Briefcase, Newspaper, Phone, LucideIcon } from 'lucide-react';
import { useLanguage } from '../../i18n';

const NAV_ICONS: Record<string, LucideIcon> = {
    '/': Home,
    '/about': User,
    '/works': Briefcase,
    '/news': Newspaper,
    '/contact': Phone
};

interface MobileMenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const MobileMenuOverlay = memo<MobileMenuOverlayProps>(({ isOpen, onClose, children }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }} onClick={onClose}
                />
                <motion.div
                    className="fixed top-0 right-0 h-full w-64 max-w-[70vw] bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl z-50 border-l border-brand-primary-500/20"
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {children}
                </motion.div>
            </>
        )}
    </AnimatePresence>
));

interface NavItem {
    name: string;
    path: string;
    description: string;
}

const MobileMenu = memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { t } = useLanguage();

    useEffect(() => { setIsOpen(false); }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const navigation: NavItem[] = [
        { name: t('nav.home'), path: '/', description: '홈페이지' },
        { name: t('nav.about'), path: '/about', description: '아티스트 소개' },
        { name: t('nav.works'), path: '/works', description: '작품 모음' },
        { name: t('nav.news'), path: '/news', description: '소식' },
        { name: t('nav.contact'), path: '/contact', description: '연락처' }
    ];

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <>
            <motion.button
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-brand-primary-500/10 border border-brand-primary-500/20 hover:bg-brand-primary-500/20 transition-colors duration-300"
                onClick={toggleMenu} whileTap={{ scale: 0.95 }} aria-label="메뉴 열기"
            >
                <motion.div animate={isOpen ? 'open' : 'closed'} variants={{ open: { rotate: 180 }, closed: { rotate: 0 } }} transition={{ duration: 0.3 }}>
                    {isOpen ? <X className="w-6 h-6 text-brand-primary-400" /> : <Menu className="w-6 h-6 text-brand-primary-400" />}
                </motion.div>
            </motion.button>

            <MobileMenuOverlay isOpen={isOpen} onClose={closeMenu}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-700/50">
                        <div>
                            <h2 className="text-2xl font-bold font-bombaram text-white">황경하</h2>
                            <p className="text-sm text-gray-400 font-wanted-sans">Official Web</p>
                        </div>
                        <button onClick={closeMenu} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700/50 transition-colors duration-200" aria-label="메뉴 닫기">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <nav className="flex-1 px-2 sm:px-4 py-3 sm:py-6">
                        <ul className="space-y-2">
                            {navigation.map((item, index) => {
                                const IconComponent = NAV_ICONS[item.path] || Home;
                                const isActive = location.pathname === item.path;
                                return (
                                    <motion.li key={item.path} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.3 }}>
                                        <Link to={item.path} className={`flex items-center p-2 sm:p-4 rounded-xl font-wanted-sans transition-all duration-300 group ${isActive ? 'bg-brand-primary-500/20 text-brand-primary-300 border border-brand-primary-500/30' : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'}`}>
                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-2 sm:mr-4 transition-colors duration-300 ${isActive ? 'bg-brand-primary-500/30' : 'bg-gray-700/30 group-hover:bg-brand-primary-500/20'}`}>
                                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-base sm:text-lg">{item.name}</div>
                                                <div className="text-sm text-gray-400 group-hover:text-gray-300">{item.description}</div>
                                            </div>
                                            {isActive && <motion.div className="w-2 h-2 bg-brand-primary-400 rounded-full" layoutId="activeIndicator" transition={{ type: 'spring', damping: 25, stiffness: 300 }} />}
                                        </Link>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="p-3 sm:p-6 border-t border-gray-700/50">
                        <div className="text-center">
                            <p className="text-sm text-gray-400 font-wanted-sans mb-2">음악가 · 사운드 엔지니어 · 프로듀서</p>
                            <div className="flex justify-center space-x-4">
                                <a href="https://www.instagram.com/podopodopo/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand-primary-500/20 rounded-lg flex items-center justify-center hover:bg-brand-primary-500/30 transition-colors duration-300"><span className="text-sm">📷</span></a>
                                <a href="https://www.youtube.com/@artliberationfront" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand-solidarity-500/20 rounded-lg flex items-center justify-center hover:bg-brand-solidarity-500/30 transition-colors duration-300"><span className="text-sm">📺</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </MobileMenuOverlay>
        </>
    );
});

MobileMenuOverlay.displayName = 'MobileMenuOverlay';
MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;
