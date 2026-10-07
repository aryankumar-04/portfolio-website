import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { WorkArchive } from './pages/WorkArchive';
import { WorkDetail } from './pages/WorkDetail';
import { BlogArchive } from './pages/BlogArchive';
import BlogArticle from './pages/BlogArticle';
import { NotFound } from './pages/NotFound';
import { useThemeFavicon } from './hooks/useThemeFavicon';
import { ROUTE_TITLES } from './config/site';
import { homeScroll } from './utils/homeScroll';
import { blogScroll } from './utils/blogScroll';

const ScrollToTopOnNavigate: React.FC = () => {
  const { pathname, hash, state } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (pathname === '/') {
      document.title = ROUTE_TITLES.home;
    }

    if (
      navType === 'POP' ||
      Boolean((state as any)?.restoreHome) ||
      Boolean((state as any)?.restoreBlog)
    ) {
      return;
    }

    if (!hash) {
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
    } else {
      const scrollTarget = () => {
        const element = document.querySelector(hash);
        if (element) {
          if ((window as any).__lenis) {
            (window as any).__lenis.scrollTo(element);
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
          }
          return true;
        }
        return false;
      };

      if (!scrollTarget()) {
        const timer = setTimeout(() => {
          scrollTarget();
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, hash, navType, state]);

  return null;
};

export const App: React.FC = () => {
  useThemeFavicon();

  useEffect(() => {
    // Disable browser automatic scroll restoration on reload/refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Exclude mailto: and tel: clicks from triggering beforeunload scrollTo(0,0)
    let isProtocolClick = false;
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      const href = target?.getAttribute('href');
      if (href?.startsWith('mailto:') || href?.startsWith('tel:')) {
        isProtocolClick = true;
        setTimeout(() => {
          isProtocolClick = false;
        }, 1200);
      }
    };
    document.addEventListener('click', handleDocumentClick, true);

    const handleBeforeUnload = () => {
      if (isProtocolClick) return;
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const lenis = new Lenis({
      lerp: 0.1,
    });
    (window as any).__lenis = lenis;
    lenis.scrollTo(0, { immediate: true });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTopOnNavigate />
      <div className="flex flex-col min-h-screen bg-transparent selection:bg-dark selection:text-cream">
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
    </BrowserRouter>
  );
};

export default App;
