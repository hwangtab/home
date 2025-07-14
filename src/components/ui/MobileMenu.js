import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Briefcase, Archive, Newspaper, Phone } from 'lucide-react';
import { useLanguage } from '../../i18n';

// 네비게이션 아이템 아이콘 매핑
const NAV_ICONS = {
  '/': Home,
  '/about': User,
  '/works': Briefcase,
  '/archive': Archive,
  '/news': Newspaper,
  '/contact': Phone
};

// 모바일 메뉴 오버레이
const MobileMenuOverlay = memo(({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* 배경 오버레이 */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />
        
        {/* 메뉴 패널 */}
        <motion.div
          className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl z-50 border-l border-brand-primary-500/20"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
));

// 메인 모바일 메뉴 컴포넌트
const MobileMenu = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  // 라우트 변경 시 메뉴 자동 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navigation = [
    { name: t('nav.home'), path: '/', description: '홈페이지' },
    { name: t('nav.about'), path: '/about', description: '아티스트 소개' },
    { name: t('nav.works'), path: '/works', description: '작품 모음' },
    { name: t('nav.archive'), path: '/archive', description: '활동 기록' },
    { name: t('nav.news'), path: '/news', description: '소식' },
    { name: t('nav.contact'), path: '/contact', description: '연락처' }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* 햄버거 메뉴 버튼 */}
      <motion.button
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-brand-primary-500/10 border border-brand-primary-500/20 hover:bg-brand-primary-500/20 transition-colors duration-300"
        onClick={toggleMenu}
        whileTap={{ scale: 0.95 }}
        aria-label="메뉴 열기"
      >
        <motion.div
          animate={isOpen ? 'open' : 'closed'}
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 }
          }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-brand-primary-400" />
          ) : (
            <Menu className="w-6 h-6 text-brand-primary-400" />
          )}
        </motion.div>
      </motion.button>

      {/* 모바일 메뉴 오버레이 */}
      <MobileMenuOverlay isOpen={isOpen} onClose={closeMenu}>
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div>
              <h2 className="text-2xl font-bold font-bombaram text-white">황경하</h2>
              <p className="text-sm text-gray-400 font-wanted-sans">Official Web</p>
            </div>
            <button
              onClick={closeMenu}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
              aria-label="메뉴 닫기"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* 네비게이션 */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigation.map((item, index) => {
                const IconComponent = NAV_ICONS[item.path] || Home;
                const isActive = location.pathname === item.path;

                return (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center p-4 rounded-xl font-wanted-sans transition-all duration-300 group ${
                        isActive
                          ? 'bg-brand-primary-500/20 text-brand-primary-300 border border-brand-primary-500/30'
                          : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors duration-300 ${
                        isActive
                          ? 'bg-brand-primary-500/30'
                          : 'bg-gray-700/30 group-hover:bg-brand-primary-500/20'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-lg">{item.name}</div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300">
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          className="w-2 h-2 bg-brand-primary-400 rounded-full"
                          layoutId="activeIndicator"
                          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* 하단 정보 */}
          <div className="p-6 border-t border-gray-700/50">
            <div className="text-center">
              <p className="text-sm text-gray-400 font-wanted-sans mb-2">
                음악가 · 사운드 엔지니어 · 프로듀서
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://www.instagram.com/hwangtab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-brand-primary-500/20 rounded-lg flex items-center justify-center hover:bg-brand-primary-500/30 transition-colors duration-300"
                >
                  <span className="text-sm">📷</span>
                </a>
                <a
                  href="https://www.youtube.com/@hwangtab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-brand-solidarity-500/20 rounded-lg flex items-center justify-center hover:bg-brand-solidarity-500/30 transition-colors duration-300"
                >
                  <span className="text-sm">📺</span>
                </a>
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