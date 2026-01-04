import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary'; // ErrorBoundary 임포트
import { ToastProvider } from './components/ui/Toast';
import { SEOProvider } from './components/SEO/MetaDataManager';
import { AnimationProvider } from './context/AnimationContext';

// 성능 최적화된 로딩 화면 컴포넌트
const OptimizedLoadingFallback = ({ page = '페이지' }) => (
  <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-gray-700 border-t-brand-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-200 font-wanted-sans">{page} 로딩 중...</p>
    </div>
  </div>
);

// 고급 에러 처리가 포함된 lazy loading 유틸리티
const createLazyComponent = (importFn, componentName) => {
  return lazy(() =>
    importFn()
      .then(module => ({
        default: React.memo(module.default) // 메모화로 성능 향상
      }))
      .catch(error => {
        console.error(`Failed to load ${componentName}:`, error);
        return {
          default: () => (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">페이지를 불러올 수 없습니다</h2>
                <p className="text-gray-300 mb-4">{componentName} 로딩 중 오류가 발생했습니다.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )
        };
      })
  );
};

// 최적화된 코드 스플리팅
const Home = createLazyComponent(() => import('./pages/Home'), 'Home');
const About = createLazyComponent(() => import('./pages/About'), 'About');
const Works = createLazyComponent(() => import('./pages/Works'), 'Works');
const News = createLazyComponent(() => import('./pages/News'), 'News');
const Contact = createLazyComponent(() => import('./pages/Contact'), 'Contact');


const App = () => {
  // GitHub Pages에서만 basename 사용, Vercel에서는 필요 없음
  const isGitHubPages = process.env.NODE_ENV === 'production' &&
    window.location.hostname === 'hwangtab.github.io';
  const basename = isGitHubPages ? '/home' : '';

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
