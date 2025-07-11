import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary'; // ErrorBoundary 임포트
import { PageLoadingSpinner } from './components/ui/LoadingSpinner';
import { ToastProvider } from './components/ui/Toast';

// 코드 스플리팅을 위한 lazy loading
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Works = lazy(() => import('./pages/Works'));
const Archive = lazy(() => import('./pages/Archive'));
const News = lazy(() => import('./pages/News'));
const Contact = lazy(() => import('./pages/Contact'));

const App = () => {
  // basename은 배포 환경에서만 사용
  const basename = process.env.NODE_ENV === 'production' ? '/home' : '';
  
  return (
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
  );
};

export default App;
