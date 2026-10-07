import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { blogScroll } from '../utils/blogScroll';

/**
 * Restores blog listing scroll position when returning to "/blog" via Back button, Escape, or browser POP.
 * Runs instantly in useLayoutEffect, retries via rAF and ResizeObserver until document height permits reaching target,
 * and clears saved state once restored.
 */
export function useRestoreBlogScroll() {
  const location = useLocation();
  const navType = useNavigationType();

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const isRestore =
      location.pathname === '/blog' &&
      !location.hash &&
      (Boolean(location.state?.restoreBlog) || (navType === 'POP' && blogScroll.hasPosition()));

    if (!isRestore) {
      // Forward navigation to /blog: clear saved position and scroll to top
      blogScroll.clear();
      window.scrollTo(0, 0);
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }
      return;
    }

    const saved = blogScroll.read();
    if (!saved) return;

    let rafId = null;
    let resizeObserver = null;
    let isDisposed = false;
    const startTime = performance.now();

    const doScroll = (y) => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.resize?.();
        lenis.scrollTo(y, { immediate: true, force: true });
      }
      window.scrollTo({ top: y, left: 0, behavior: 'instant' });
    };

    const attemptRestore = () => {
      if (isDisposed) return;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const targetY = Math.max(0, Math.min(saved.y, maxScroll));
      doScroll(targetY);

      const currentY = window.__lenis?.scroll ?? window.scrollY;
      const reachedTarget = Math.abs(currentY - saved.y) <= 3;
      const elapsed = performance.now() - startTime;

      if (!reachedTarget && elapsed < 2000) {
        rafId = requestAnimationFrame(attemptRestore);
      }
    };

    // Attempt immediately in layout effect before browser paint
    attemptRestore();

    // Re-check as images and content layout expand
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(() => {
        attemptRestore();
      });
      resizeObserver.observe(document.body);
      const mainEl = document.querySelector('main');
      if (mainEl) resizeObserver.observe(mainEl);
    }

    // Also listen for image loads across blog cards
    const imageLoadListeners = [];
    const images = Array.from(document.querySelectorAll('main img'));
    images.forEach((img) => {
      if (!img.complete) {
        const onDone = () => attemptRestore();
        img.addEventListener('load', onDone, { once: true });
        img.addEventListener('error', onDone, { once: true });
        imageLoadListeners.push({ img, onDone });
      }
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => attemptRestore());
    }

    const handleLoad = () => attemptRestore();
    window.addEventListener('load', handleLoad, { once: true });

    const cleanupTimer = setTimeout(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    }, 2000);

    return () => {
      isDisposed = true;
      clearTimeout(cleanupTimer);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      imageLoadListeners.forEach(({ img, onDone }) => {
        img.removeEventListener('load', onDone);
        img.removeEventListener('error', onDone);
      });
      window.removeEventListener('load', handleLoad);
    };
  }, [location.pathname, location.hash, location.state, navType]);
}

export default useRestoreBlogScroll;
