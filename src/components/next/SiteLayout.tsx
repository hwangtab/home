"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { useLanguage } from '../../i18n';
import LanguageToggle from '../LanguageToggle';
import { getLocaleFromPathname, stripLocalePrefix, withLocalePrefix } from '../../utils/localePath';
import { Copyright } from '../ui/Copyright';

interface SiteLayoutProps {
  children: React.ReactNode;
}

const SiteLayoutInner: React.FC<SiteLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const basePathname = stripLocalePrefix(pathname);
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const tickingRef = useRef(false);
  const lastScrolledRef = useRef(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 50;
        if (next !== lastScrolledRef.current) {
          lastScrolledRef.current = next;
          setIsScrolled(next);
        }
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nav = useMemo(() => [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/works', label: t('nav.works') },
    { path: '/news', label: t('nav.news') },
    { path: '/contact', label: t('nav.contact') }
  ], [t]);

  const navWithLinks = useMemo(() => nav.map((item) => ({
    ...item,
    href: withLocalePrefix(item.path, locale),
    isActive:
      item.path === '/'
        ? basePathname === '/'
        : basePathname === item.path || basePathname.startsWith(`${item.path}/`)
  })), [nav, locale, basePathname]);

  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen flex flex-col font-wanted-sans text-gray-100">
      <header
        className={`fixed top-0 left-0 right-0 z-50 text-white py-4 sm:py-6 px-2 sm:px-4 md:px-6 transform-gpu transition-[background-color,border-color] duration-300 ${
          isScrolled
            ? 'bg-gray-950/95 border-b border-brand-primary-500/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link
            href={withLocalePrefix('/', locale)}
            onClick={() => setIsOpen(false)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-400 rounded-lg"
          >
            <p
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-bombaram transform-gpu hover:scale-105 transition-transform duration-200"
              style={{ lineHeight: '1', transform: 'translateY(12px)' }}
            >
              {t('common.siteTitle')}
            </p>
          </Link>
          <nav className="hidden md:flex items-center gap-6 md:-translate-y-1">
            {navWithLinks.map((item) => (
              <Link
                key={item.path}
                href={item.href}
                className={item.isActive ? 'text-brand-primary-400' : 'text-gray-200 hover:text-brand-primary-300'}
              >
                {item.label}
              </Link>
            ))}
            <LanguageToggle />
          </nav>
          <button
            type="button"
            aria-label={t('nav.openMenu')}
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg border border-brand-primary-500/20 text-brand-primary-400"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {isOpen && (
          <div className={`md:hidden border-t ${isScrolled ? 'border-gray-800 bg-gray-900/98' : 'border-transparent bg-gray-950/90'}`}>
            <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
              {navWithLinks.map((item) => (
                <Link
                  key={item.path}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={item.isActive ? 'text-brand-primary-400' : 'text-gray-200'}
                >
                  {item.label}
                </Link>
              ))}
              <LanguageToggle />
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gradient-to-r from-gray-950 to-gray-900 text-gray-400 p-6 mt-12">
        <div className="container mx-auto text-center font-wanted-sans">
          <p><Copyright /> {t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default memo(SiteLayoutInner);
