import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary'; // ErrorBoundary 임포트
import { PageLoadingSpinner } from './components/ui/LoadingSpinner';
import { ToastProvider } from './components/ui/Toast';
import { SEOProvider } from './components/SEO/MetaDataManager';

// 코드 스플리팅을 위한 lazy loading
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Works = lazy(() => import('./pages/Works'));
const News = lazy(() => import('./pages/News'));
const Contact = lazy(() => import('./pages/Contact'));

const Archive = lazy(() => import('./pages/Archive'));

const App = () => {
  // GitHub Pages에서만 basename 사용, Vercel에서는 필요 없음
  const isGitHubPages = process.env.NODE_ENV === 'production' && 
    window.location.hostname === 'hwangtab.github.io';
  const basename = isGitHubPages ? '/home' : '';
  
  return (
    <SEOProvider>
      <LanguageProvider>
        <ToastProvider>
          <Router basename={basename}>
            <Layout>
              <ErrorBoundary> {/* ErrorBoundary로 감싸기 */}
                <Suspense fallback={<PageLoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/works" element={<Works />} />
                    <Route path="/archive" element={<Archive />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </Layout>
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </SEOProvider>
  );
};

export default App;
