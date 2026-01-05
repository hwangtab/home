import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface PageInfo {
    path: string;
    key: string;
}

interface UseKeyboardNavigationReturn {
    skipToMainContent: () => void;
    focusNext: () => void;
    focusPrevious: () => void;
    navigateToPage: (direction: 'next' | 'previous') => void;
    pages: PageInfo[];
    currentPageIndex: number;
}

/**
 * 키보드 네비게이션 훅
 */
const useKeyboardNavigation = (isEnabled = true): UseKeyboardNavigationReturn => {
    const navigate = useNavigate();
    const location = useLocation();

    const pages: PageInfo[] = [
        { path: '/', key: '1' },
        { path: '/about', key: '2' },
        { path: '/works', key: '3' },
        { path: '/news', key: '4' },
        { path: '/contact', key: '5' }
    ];

    const getFocusableElements = useCallback((): NodeListOf<HTMLElement> => {
        return document.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
    }, []);

    const focusNext = useCallback(() => {
        const focusableElements = getFocusableElements();
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement);
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex]?.focus();
    }, [getFocusableElements]);

    const focusPrevious = useCallback(() => {
        const focusableElements = getFocusableElements();
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement);
        const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex]?.focus();
    }, [getFocusableElements]);

    const navigateToPage = useCallback((direction: 'next' | 'previous') => {
        const currentIndex = pages.findIndex(page => page.path === location.pathname);
        if (currentIndex === -1) return;

        let nextIndex: number;
        if (direction === 'next') {
            nextIndex = currentIndex < pages.length - 1 ? currentIndex + 1 : 0;
        } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : pages.length - 1;
        }

        navigate(pages[nextIndex].path);
    }, [location.pathname, navigate, pages]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!isEnabled) return;

        const isInputField = ['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as Element).tagName);
        if (isInputField) return;

        if (event.altKey && !event.ctrlKey && !event.shiftKey) {
            const keyPressed = event.key;
            const targetPage = pages.find(page => page.key === keyPressed);
            if (targetPage) {
                event.preventDefault();
                navigate(targetPage.path);
                return;
            }
        }

        if (event.ctrlKey && !event.altKey && !event.shiftKey) {
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    navigateToPage('previous');
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    navigateToPage('next');
                    break;
                default:
                    break;
            }
            return;
        }

        if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
            switch (event.key) {
                case 'Tab':
                    break;
                case 'Escape':
                    event.preventDefault();
                    (document.activeElement as HTMLElement)?.blur();
                    break;
                case 'Home':
                    event.preventDefault();
                    const firstFocusable = getFocusableElements()[0];
                    firstFocusable?.focus();
                    break;
                case 'End':
                    event.preventDefault();
                    const focusableElements = getFocusableElements();
                    const lastFocusable = focusableElements[focusableElements.length - 1];
                    lastFocusable?.focus();
                    break;
                default:
                    break;
            }
        }
    }, [isEnabled, navigate, navigateToPage, getFocusableElements, pages]);

    useEffect(() => {
        if (isEnabled) {
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [handleKeyDown, isEnabled]);

    const skipToMainContent = useCallback(() => {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
        }
    }, []);

    return {
        skipToMainContent,
        focusNext,
        focusPrevious,
        navigateToPage,
        pages,
        currentPageIndex: pages.findIndex(page => page.path === location.pathname)
    };
};

export default useKeyboardNavigation;
