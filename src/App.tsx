import React, { Suspense, lazy, ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import { SEOProvider } from './components/SEO/MetaDataManager';
import { AnimationProvider } from './context/AnimationContext';
import { getRouterBasename } from './utils/env';

// 성능 최적화된 로딩 화면 컴포넌트
const OptimizedLoadingFallback: React.FC<{ page?: string }> = ({ page = '페이지' }) => (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-brand-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-200 font-wanted-sans">{page} 로딩 중...</p>
        </div>
    </div>
);




// 고급 에러 처리가 포함된 lazy loading 유틸리티
// 고급 에러 처리가 포함된 lazy loading 유틸리티
const createLazyComponent = <T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>
) => {
    return lazy(() => importFn());
};

// 최적화된 코드 스플리팅
const Home = createLazyComponent(() => import('./pages/Home'));
const About = createLazyComponent(() => import('./pages/About'));
const Works = createLazyComponent(() => import('./pages/Works'));
const News = createLazyComponent(() => import('./pages/News'));
const Contact = createLazyComponent(() => import('./pages/Contact'));


const App: React.FC = () => {
    const basename = getRouterBasename();

    return (
        <SEOProvider>
            <LanguageProvider>
                <ToastProvider>
                    <AnimationProvider>
                        <Router basename={basename}>
                            <Layout>
                                <ErrorBoundary> {/* ErrorBoundary로 감싸기 */}
                                    <Suspense fallback={<OptimizedLoadingFallback />}>
                                        <Routes>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/about" element={<About />} />
                                            <Route path="/works" element={<Works />} />

                                            <Route path="/news" element={<News />} />
                                            <Route path="/contact" element={<Contact />} />
                                        </Routes>
                                    </Suspense>
                                </ErrorBoundary>
                            </Layout>
                        </Router>
                    </AnimationProvider>
                </ToastProvider>
            </LanguageProvider>
        </SEOProvider>
    );
};

export default App;
