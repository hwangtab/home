import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * 키보드 네비게이션 훅
 * 방향키와 단축키로 페이지 및 요소 네비게이션 지원
 */
const useKeyboardNavigation = (isEnabled = true) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 페이지 순서 정의
  const pages = [
    { path: '/', key: '1' },
    { path: '/about', key: '2' },
    { path: '/works', key: '3' },
    { path: '/archive', key: '4' },
    { path: '/news', key: '5' },
    { path: '/contact', key: '6' }
  ];

  // 포커스 가능한 요소 찾기
  const getFocusableElements = useCallback(() => {
    return document.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }, []);

  // 다음/이전 포커스 가능한 요소로 이동
  const focusNext = useCallback(() => {
    const focusableElements = getFocusableElements();
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
  }, [getFocusableElements]);

  const focusPrevious = useCallback(() => {
    const focusableElements = getFocusableElements();
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
    focusableElements[prevIndex]?.focus();
  }, [getFocusableElements]);

  // 페이지 네비게이션
  const navigateToPage = useCallback((direction) => {
    const currentIndex = pages.findIndex(page => page.path === location.pathname);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
      nextIndex = currentIndex < pages.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : pages.length - 1;
    }

    navigate(pages[nextIndex].path);
  }, [location.pathname, navigate, pages]);

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback((event) => {
    if (!isEnabled) return;

    // 입력 필드에서는 키보드 네비게이션 비활성화
    const isInputField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
    if (isInputField) return;

    // Alt + 숫자키로 페이지 직접 이동
    if (event.altKey && !event.ctrlKey && !event.shiftKey) {
      const keyPressed = event.key;
      const targetPage = pages.find(page => page.key === keyPressed);
      if (targetPage) {
        event.preventDefault();
        navigate(targetPage.path);
        return;
      }
    }

    // Ctrl + 방향키로 페이지 네비게이션
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

    // 기본 키보드 네비게이션 (포커스 이동)
    if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
      switch (event.key) {
        case 'Tab':
          // Tab 키는 기본 동작 유지
          break;
        case 'Escape':
          // ESC 키로 포커스 해제
          event.preventDefault();
          document.activeElement?.blur();
          break;
        case 'Home':
          // Home 키로 첫 번째 포커스 요소로 이동
          event.preventDefault();
          const firstFocusable = getFocusableElements()[0];
          firstFocusable?.focus();
          break;
        case 'End':
          // End 키로 마지막 포커스 요소로 이동
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

  // 스킵 링크를 위한 메인 컨텐츠로 포커스 이동
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