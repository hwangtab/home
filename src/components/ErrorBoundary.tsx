'use client';

import React, { Component, ErrorInfo } from 'react';
import LanguageContext from '../i18n';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    isChunkError: boolean;
    retryCount: number;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorFallbackProps {
    retryCount: number;
    error: Error;
    isChunkError: boolean;
    onRetry: () => void;
    onReload: () => void;
    t: (key: string) => string;
}

const isChunkError = (error: Error): boolean =>
    error?.name === 'ChunkLoadError' ||
    error?.message?.includes('Loading chunk') ||
    error?.message?.includes('Loading CSS chunk');

const clearCacheAndReload = () => {
    const reload = () => window.location.reload();
    if ('caches' in window) {
        window.caches.keys().then(names => {
            names.forEach(name => window.caches.delete(name));
        }).finally(reload);
    } else {
        reload();
    }
};

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
    retryCount,
    error,
    isChunkError,
    onRetry,
    onReload,
    t
}) => {
    if (isChunkError) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
                <div className="max-w-md mx-auto text-center space-y-6">
                    <div className="text-6xl mb-4">🔄</div>
                    <h2 className="text-2xl font-bold text-white font-santokki">
                        {t('errorBoundary.chunkTitle')}
                    </h2>
                    <p className="text-gray-300 font-wanted-sans">
                        {t('errorBoundary.chunkDesc')}
                    </p>
                    {retryCount > 0 && (
                        <p className="text-gray-400 text-sm font-wanted-sans">
                            {t('errorBoundary.retryCount')}: {retryCount}/3
                        </p>
                    )}
                    <div className="flex gap-4 justify-center">
                        {retryCount < 3 && (
                            <button
                                onClick={onRetry}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-wanted-sans"
                            >
                                {t('common.retry')}
                            </button>
                        )}
                        <button
                            onClick={onReload}
                            className="px-6 py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors font-wanted-sans"
                        >
                            {t('common.refresh')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-md mx-auto text-center space-y-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-white font-santokki">
                    {t('errorBoundary.unexpectedTitle')}
                </h2>
                <p className="text-gray-300 font-wanted-sans">
                    {t('errorBoundary.unexpectedDesc')}
                </p>
                <p className="text-gray-400 text-sm font-wanted-sans break-words">
                    {error.toString()}
                </p>
                <button
                    onClick={onReload}
                    className="px-6 py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors font-wanted-sans"
                >
                    {t('errorBoundary.refreshPage')}
                </button>
            </div>
        </div>
    );
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    static contextType = LanguageContext;
    declare context: React.ContextType<typeof LanguageContext>;

    // Safe translation helper — falls back to key identity when outside LanguageProvider
    private getT(): (key: string) => string {
        return this.context?.t ?? ((key: string) => key);
    }

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            isChunkError: false,
            retryCount: 0
        };
    }

    static getDerivedStateFromError(error: Error, prevState: ErrorBoundaryState): ErrorBoundaryState {
        return {
            hasError: true,
            error,
            isChunkError: isChunkError(error),
            retryCount: prevState.retryCount
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught error:", error, errorInfo);

        if (this.state.isChunkError) {
            // chunk 로딩 실패 시: 캐시 삭제 후 페이지 재로드하여 chunk 재요청
            clearCacheAndReload();
        }

        this.setState(prevState => ({
            retryCount: prevState.retryCount + 1
        }));
    }

    handleReload = () => {
        clearCacheAndReload();
    };

    handleRetry = () => {
        // chunk 에러: 캐시 삭제 후 리로드 / 일반 에러: 상태만 리셋
        if (this.state.isChunkError) {
            clearCacheAndReload();
        } else {
            this.setState(prevState => ({
                hasError: false,
                error: null,
                retryCount: prevState.retryCount + 1
            }));
        }
    };

    render() {
        const t = this.getT();

        if (this.state.hasError) {
            return (
                <ErrorFallback
                    retryCount={this.state.retryCount}
                    error={this.state.error!}
                    isChunkError={this.state.isChunkError}
                    onRetry={this.handleRetry}
                    onReload={this.handleReload}
                    t={t}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
