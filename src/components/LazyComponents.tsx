// @ts-nocheck
import React, { lazy, Suspense, memo, useState, useEffect, LazyExoticComponent, ComponentType } from 'react';
import { PageLoadingSpinner } from './ui/LoadingSpinner';

const LazyLightbox = lazy(() => import('./Lightbox'));
const LazyMusicPlayer = lazy(() => import('./MusicPlayer'));
const LazyVideoGallery = lazy(() => import('./VideoGallery'));
const LazyContactForm = lazy(() => import('./ContactForm'));

// HOC for Suspense
function withSuspense<P extends object>(
    Component: LazyExoticComponent<ComponentType<any>> | ComponentType<P>,
    fallback: React.ReactNode = <PageLoadingSpinner size="sm" />
) {
    return memo((props: P) => (
        <Suspense fallback={fallback}>
            <Component {...props} />
        </Suspense>
    ));
}

// Export optimized components
export const OptimizedLightbox = withSuspense(LazyLightbox);
export const OptimizedMusicPlayer = withSuspense(LazyMusicPlayer);
export const OptimizedVideoGallery = withSuspense(LazyVideoGallery);
export const OptimizedContactForm = withSuspense(LazyContactForm);

// Conditional Loading Hook
export const useConditionalComponent = <T extends ComponentType<any>>(
    shouldLoad: boolean,
    componentImport: () => Promise<{ default: T }>
) => {
    const [Component, setComponent] = useState<T | null>(null);
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
