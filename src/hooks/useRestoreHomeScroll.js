import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { homeScroll, getBreakpoint } from '../utils/homeScroll';

/**
 * Restores home scroll position when returning to "/" via Back button, Escape, or browser POP.
 * Runs instantly in useLayoutEffect, retries via rAF until document height permits reaching target,
 * handles breakpoint changes by section offset, and clears saved state once restored.
 */
export function useRestoreHomeScroll() {
  const location = useLocation();
  const navType = useNavigationType();

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const isRestore =
      location.pathname === '/' &&
      !location.hash &&
      (Boolean(location.state?.restoreHome) || (navType === 'POP' && homeScroll.hasPosition()));

    if (!isRestore) {
      homeScroll.clear();
      return;
    }

    const saved = homeScroll.read();
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
      let expectedTargetY = saved.y;

      if (saved.sectionId) {
        const section = document.getElementById(saved.sectionId);
        if (section) {
          const currentScroll = window.__lenis?.scroll ?? window.scrollY;
          const sectionTop = section.getBoundingClientRect().top + currentScroll;
          expectedTargetY = Math.max(0, sectionTop - (saved.offsetInSection || 0));
        }
      }

      const targetY = Math.max(0, Math.min(expectedTargetY, maxScroll));
      doScroll(targetY);

      const currentY = window.__lenis?.scroll ?? window.scrollY;
      const reachedTarget = Math.abs(currentY - expectedTargetY) <= 3;
      const elapsed = performance.now() - startTime;

      if (!reachedTarget && elapsed < 2000) {
        rafId = requestAnimationFrame(attemptRestore);
      }
    };

    // First attempt immediately in layout effect before browser paint
    attemptRestore();

    // Re-check as dynamic sections or images expand layout
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(() => {
        attemptRestore();
      });
      resizeObserver.observe(document.body);
    }

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
      window.removeEventListener('load', handleLoad);
    };
  }, [location.pathname, location.hash, location.state, navType]);
}

export default useRestoreHomeScroll;
