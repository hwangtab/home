import React, { lazy, Suspense, ReactNode, ComponentType } from 'react';

// Loading component
interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "로딩 중..." }) => (
    <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-600 border-t-gray-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-wanted-sans">{message}</p>
        </div>
    </div>
);

// Error boundary for lazy loaded components
interface LazyErrorBoundaryProps {
    children: ReactNode;
}

interface LazyErrorBoundaryState {
    hasError: boolean;
}

class LazyErrorBoundary extends React.Component<LazyErrorBoundaryProps, LazyErrorBoundaryState> {
    constructor(props: LazyErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): LazyErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('Lazy component loading error:', error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="text-center">
                        <p className="text-red-400 font-wanted-sans mb-2">컴포넌트 로딩 실패</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                            페이지 새로고침
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for lazy loading with error boundary
export const withLazyLoading = <P extends object>(
    LazyComponent: React.LazyExoticComponent<ComponentType<P>>,
    loadingMessage?: string
): React.FC<P> => {
    const WrappedComponent: React.FC<P> = (props) => (
        <LazyErrorBoundary>
            <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>
                <LazyComponent {...props} />
            </Suspense>
        </LazyErrorBoundary>
    );
    return WrappedComponent;
};

// Lazy load heavy components
export const LazyMusicPlayer = lazy(() =>
    import('../components/MusicPlayer').then(module => ({ default: module.default }))
);

export const LazyVideoGallery = lazy(() =>
    import('../components/VideoGallery').then(module => ({ default: module.default }))
);

export const LazyLightbox = lazy(() =>
    import('../components/Lightbox').then(module => ({ default: module.default }))
);

export const LazySearchBar = lazy(() =>
    import('../components/SearchBar').then(module => ({ default: module.default }))
);

// Lazy load pages
export const LazyAbout = lazy(() =>
    import('../pages/About').then(module => ({ default: module.default }))
);

export const LazyWorks = lazy(() =>
    import('../pages/Works').then(module => ({ default: module.default }))
);

export const LazyNews = lazy(() =>
    import('../pages/News').then(module => ({ default: module.default }))
);

export const LazyContact = lazy(() =>
    import('../pages/Contact').then(module => ({ default: module.default }))
);

// Wrapped components with error boundaries
export const MusicPlayer = withLazyLoading(LazyMusicPlayer, "음악 플레이어 로딩 중...");
export const VideoGallery = withLazyLoading(LazyVideoGallery, "비디오 갤러리 로딩 중...");
export const Lightbox = withLazyLoading(LazyLightbox, "이미지 뷰어 로딩 중...");
export const SearchBar = withLazyLoading(LazySearchBar, "검색 기능 로딩 중...");

// Page components with lazy loading
export const About = withLazyLoading(LazyAbout, "소개 페이지 로딩 중...");
export const Works = withLazyLoading(LazyWorks, "작품 페이지 로딩 중...");
export const News = withLazyLoading(LazyNews, "소식 페이지 로딩 중...");
export const Contact = withLazyLoading(LazyContact, "연락처 페이지 로딩 중...");

// Utility for preloading components
export const preloadComponent = (componentImport: () => Promise<unknown>): void => {
    componentImport();
};

// Preload critical components
export const preloadCriticalComponents = (): void => {
    const preloaders = [
        () => import('../components/MusicPlayer'),
        () => import('../components/SearchBar'),
        () => import('../pages/Works')
    ];

    preloaders.forEach(preloader => {
        if ('requestIdleCallback' in window) {
            (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(preloader);
        } else {
            setTimeout(preloader, 100);
        }
    });
};

// Route-based code splitting utility
export const createLazyRoute = <P extends object>(
    importFn: () => Promise<{ default: ComponentType<P> }>,
    fallback?: ReactNode
): React.FC<P> => {
    const LazyComponent = lazy(importFn);

    return (props: P) => (
        <LazyErrorBoundary>
            <Suspense fallback={fallback || <LoadingSpinner />}>
                <LazyComponent {...props} />
            </Suspense>
        </LazyErrorBoundary>
    );
};

export default {
    withLazyLoading,
    preloadComponent,
    preloadCriticalComponents,
    createLazyRoute,
    LoadingSpinner,
    LazyErrorBoundary
};

export { LoadingSpinner, LazyErrorBoundary };
