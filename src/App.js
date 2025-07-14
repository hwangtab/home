import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary'; // ErrorBoundary 임포트
import { ToastProvider } from './components/ui/Toast';
import { SEOProvider } from './components/SEO/MetaDataManager';

// 단순한 로딩 화면 컴포넌트 (애니메이션 없음)
const SimpleLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800" />
);

// 코드 스플리팅을 위한 최적화된 lazy loading
const Home = lazy(() => 
  import('./pages/Home').catch(() => ({ default: () => <div>Loading...</div> }))
);
const About = lazy(() => 
  import('./pages/About').catch(() => ({ default: () => <div>Loading...</div> }))
);
const Works = lazy(() => 
  import('./pages/Works').catch(() => ({ default: () => <div>Loading...</div> }))
);
const News = lazy(() => 
  import('./pages/News').catch(() => ({ default: () => <div>Loading...</div> }))
);
const Contact = lazy(() => 
  import('./pages/Contact').catch(() => ({ default: () => <div>Loading...</div> }))
);
const Archive = lazy(() => 
  import('./pages/Archive').catch(() => ({ default: () => <div>Loading...</div> }))
);

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
                <Suspense fallback={<SimpleLoadingFallback />}>
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
