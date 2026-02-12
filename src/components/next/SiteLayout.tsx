"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../i18n';
import LanguageToggle from '../LanguageToggle';

interface SiteLayoutProps {
  children: React.ReactNode;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const nav = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/works', label: t('nav.works') },
    { path: '/news', label: t('nav.news') },
    { path: '/contact', label: t('nav.contact') }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen font-wanted-sans text-gray-100">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 border-b border-brand-primary-500/10 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-3xl md:text-4xl font-bold font-bombaram">
            {t('common.siteTitle')}
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {nav.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={pathname === item.path ? 'text-brand-primary-400' : 'text-gray-200 hover:text-brand-primary-300'}
              >
                {item.label}
              </Link>
            ))}
            <LanguageToggle />
          </nav>
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg border border-brand-primary-500/20 text-brand-primary-400"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
              {nav.map((item) => (
                <Link key={item.path} href={item.path} className={pathname === item.path ? 'text-brand-primary-400' : 'text-gray-200'}>
                  {item.label}
                </Link>
              ))}
              <LanguageToggle />
            </div>
          </div>
        )}
      </header>

      <main className="pt-20">{children}</main>

      <footer className="bg-gradient-to-r from-gray-950 to-gray-900 text-gray-400 p-6 mt-12">
        <div className="container mx-auto text-center font-wanted-sans">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
