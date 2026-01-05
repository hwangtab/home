// @ts-nocheck
import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    isChunkError: boolean;
    retryCount: number;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            isChunkError: false,
            retryCount: 0
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        const isChunkError = error?.name === 'ChunkLoadError' ||
            error?.message?.includes('Loading chunk') ||
            error?.message?.includes('Loading CSS chunk');

        return {
            hasError: true,
            error,
            isChunkError,
            retryCount: 0
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught error:", error, errorInfo);

        if (this.state.isChunkError && this.state.retryCount < 2) {
            setTimeout(() => {
                this.setState(prevState => ({
                    hasError: false,
                    error: null,
                    retryCount: prevState.retryCount + 1
                }));
            }, 1000);
        }
    }

    handleReload = () => {
        const reload = () => window.location.reload();
        if ('caches' in window) {
            (window as Window & { caches?: CacheStorage }).caches!.keys().then(names => {
                names.forEach(name => (window as Window & { caches?: CacheStorage }).caches!.delete(name));
            }).finally(reload);
        } else {
            reload();
        }
    };

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            retryCount: this.state.retryCount + 1
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.state.isChunkError) {
                return (
                    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
                        <div className="max-w-md mx-auto text-center space-y-6">
                            <div className="text-6xl mb-4">🔄</div>
                            <h2 className="text-2xl font-bold text-white font-santokki">
                                페이지 로딩 중 문제가 발생했습니다
                            </h2>
                            <p className="text-gray-300 font-wanted-sans">
                                새로운 업데이트가 있을 수 있습니다. 페이지를 새로고침해 주세요.
                            </p>
                            {this.state.retryCount > 0 && (
                                <p className="text-gray-400 text-sm font-wanted-sans">
                                    재시도 횟수: {this.state.retryCount}/3
                                </p>
                            )}
                            <div className="flex gap-4 justify-center">
                                {this.state.retryCount < 3 && (
                                    <button
                                        onClick={this.handleRetry}
                                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-wanted-sans"
                                    >
                                        다시 시도
                                    </button>
                                )}
                                <button
                                    onClick={this.handleReload}
                                    className="px-6 py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors font-wanted-sans"
                                >
                                    새로고침
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
                            예기치 않은 오류가 발생했습니다
                        </h2>
                        <p className="text-gray-300 font-wanted-sans">
                            페이지를 로드하는 중 문제가 발생했습니다.
                        </p>
                        <p className="text-gray-400 text-sm font-wanted-sans break-words">
                            {this.state.error?.toString()}
                        </p>
                        <button
                            onClick={this.handleReload}
                            className="px-6 py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors font-wanted-sans"
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

export default ErrorBoundary;
