import React, { lazy, Suspense, memo, useState, useEffect } from 'react';
import { PageLoadingSpinner } from './ui/LoadingSpinner';

// 무거운 컴포넌트들을 lazy loading으로 최적화
const LazyLightbox = lazy(() => import('./Lightbox'));
const LazyMusicPlayer = lazy(() => import('./MusicPlayer'));
const LazyVideoGallery = lazy(() => import('./VideoGallery'));
const LazyContactForm = lazy(() => import('./ContactForm'));

// Suspense 래퍼 HOC
const withSuspense = (Component, fallback = <PageLoadingSpinner size="sm" />) => {
  return memo((props) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  ));
};

// 최적화된 컴포넌트 내보내기
export const OptimizedLightbox = withSuspense(LazyLightbox);
export const OptimizedMusicPlayer = withSuspense(LazyMusicPlayer);
export const OptimizedVideoGallery = withSuspense(LazyVideoGallery);
export const OptimizedContactForm = withSuspense(LazyContactForm);

// 조건부 로딩 훅
export const useConditionalComponent = (shouldLoad, componentImport) => {
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (shouldLoad && !Component && !isLoading) {
      setIsLoading(true);
      componentImport()
        .then((module) => {
          setComponent(() => module.default);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Component loading failed:', error);
          setIsLoading(false);
        });
    }
  }, [shouldLoad, Component, isLoading, componentImport]);

  return { Component, isLoading };
};