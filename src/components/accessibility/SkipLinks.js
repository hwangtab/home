import React, { memo } from 'react';
import { motion } from 'framer-motion';
import useKeyboardNavigation from '../../hooks/useKeyboardNavigation';

/**
 * 스킵 링크 컴포넌트
 * 스크린 리더 및 키보드 사용자를 위한 빠른 네비게이션 제공
 */
const SkipLinks = memo(() => {
  const { skipToMainContent } = useKeyboardNavigation();

  const skipLinks = [
    {
      href: '#main-content',
      label: '본문으로 바로가기',
      onClick: skipToMainContent
    },
    {
      href: '#navigation',
      label: '네비게이션으로 바로가기',
      onClick: () => {
        const nav = document.querySelector('nav');
        if (nav) {
          const firstLink = nav.querySelector('a, button');
          firstLink?.focus();
        }
      }
    },
    {
      href: '#footer',
      label: '푸터로 바로가기',
      onClick: () => {
        const footer = document.querySelector('footer');
        if (footer) {
          footer.setAttribute('tabindex', '-1');
          footer.focus();
        }
      }
    }
  ];

  return (
    <div className="sr-only focus-within:not-sr-only">
      <nav 
        aria-label="스킵 링크"
        className="fixed top-0 left-0 z-50 bg-brand-primary-600 text-white"
      >
        <ul className="flex">
          {skipLinks.map((link, index) => (
            <li key={index}>
              <motion.a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  link.onClick();
                }}
                className="block px-4 py-2 text-sm font-medium hover:bg-brand-primary-700 focus:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-primary-600 transition-colors duration-200"
                whileFocus={{ scale: 1.05 }}
                tabIndex="0"
              >
                {link.label}
              </motion.a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
});

SkipLinks.displayName = 'SkipLinks';

export default SkipLinks;