import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { ViewTransitionsRouter } from './components/ViewTransitionsRouter';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { WorkArchive } from './pages/WorkArchive';
import { WorkDetail } from './pages/WorkDetail';
import { BlogArchive } from './pages/BlogArchive';
import BlogArticle from './pages/BlogArticle';
import { NotFound } from './pages/NotFound';
import { useThemeFavicon } from './hooks/useThemeFavicon';
import { ScrollManager } from './components/ScrollManager';

const AppContent: React.FC = () => {
  useThemeFavicon();

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
    });
    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return (
    <ViewTransitionsRouter>
      <ScrollManager />
      <div className="flex flex-col min-h-screen bg-transparent selection:bg-dark selection:text-cream dark:selection:bg-cream dark:selection:text-[#0D0D0C]">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<WorkArchive />} />
            <Route path="/work/:slug" element={<WorkDetail />} />
            <Route path="/blog" element={<BlogArchive />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </ViewTransitionsRouter>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
