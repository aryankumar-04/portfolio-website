import React, { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const STORAGE_KEY = 'route_scroll_positions';
const RESTORE_TIMEOUT_MS = 2000;

type ScrollPositions = Record<string, number>;

const readPositions = (): ScrollPositions => {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const writePositions = (positions: ScrollPositions) => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Keep the in-memory map when session storage is unavailable.
  }
};

const clearPositions = () => {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // The in-memory map remains cleared when session storage is unavailable.
  }
};

const isPageReload = () => {
  try {
    const navigation = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
    return navigation?.type === 'reload' || performance.navigation?.type === 1;
  } catch {
    return false;
  }
};

const getScrollY = () => (window as any).__lenis?.scroll ?? window.scrollY;

const scrollInstantly = (y: number) => {
  const targetY = Math.max(0, y);
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.resize?.();
    lenis.scrollTo(targetY, { immediate: true, force: true });
  }
  window.scrollTo({ top: targetY, left: 0, behavior: 'instant' as ScrollBehavior });
};

/** Handles all route-level scroll saving, restoration, and resets. */
export const ScrollManager: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positionsRef = useRef<ScrollPositions | null>(null);
  const navigationRunRef = useRef(0);
  const isInitialReloadRef = useRef(isPageReload());

  if (!positionsRef.current && typeof window !== 'undefined') {
    positionsRef.current = readPositions();
  }

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (isInitialReloadRef.current) {
      positionsRef.current = {};
      clearPositions();
    }
  }, []);

  useLayoutEffect(() => {
    const positions = positionsRef.current ?? {};
    const savePosition = () => {
      positions[location.key] = getScrollY();
      positionsRef.current = positions;
      writePositions(positions);
    };

    window.addEventListener('pagehide', savePosition);
    return () => {
      savePosition();
      window.removeEventListener('pagehide', savePosition);
    };
  }, [location.key]);

  useLayoutEffect(() => {
    const navigationRun = ++navigationRunRef.current;
    const isCurrentRun = () => navigationRunRef.current === navigationRun;

    if (isInitialReloadRef.current) {
      scrollInstantly(0);
      const rafId = requestAnimationFrame(() => {
        if (isCurrentRun()) {
          scrollInstantly(0);
          isInitialReloadRef.current = false;
        }
      });
      return () => cancelAnimationFrame(rafId);
    }

    if (location.hash) {
      let rafId = 0;
      const startedAt = performance.now();

      const scrollToHash = () => {
        if (!isCurrentRun()) return;

        const target = document.querySelector(location.hash);
        if (target) {
          const lenis = (window as any).__lenis;
          if (lenis) {
            lenis.scrollTo(target);
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }

        if (performance.now() - startedAt < RESTORE_TIMEOUT_MS) {
          rafId = requestAnimationFrame(scrollToHash);
        }
      };

      scrollToHash();
      return () => cancelAnimationFrame(rafId);
    }

    if (navigationType !== 'POP') {
      scrollInstantly(0);
      const rafId = requestAnimationFrame(() => {
        if (isCurrentRun()) {
          scrollInstantly(0);
        }
      });
      return () => cancelAnimationFrame(rafId);
    }

    const savedY = positionsRef.current?.[location.key];
    if (typeof savedY !== 'number') {
      scrollInstantly(0);
      return;
    }

    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let disposed = false;
    const startedAt = performance.now();

    const restore = () => {
      if (disposed || !isCurrentRun()) return;

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      scrollInstantly(Math.min(savedY, maxScroll));

      if (Math.abs(getScrollY() - savedY) > 3 && performance.now() - startedAt < RESTORE_TIMEOUT_MS) {
        rafId = requestAnimationFrame(restore);
      }
    };

    restore();

    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(restore);
      resizeObserver.observe(document.body);
    }

    document.fonts?.ready.then(restore);
    window.addEventListener('load', restore, { once: true });

    const timeoutId = window.setTimeout(() => {
      resizeObserver?.disconnect();
      resizeObserver = null;
    }, RESTORE_TIMEOUT_MS);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      resizeObserver?.disconnect();
      window.removeEventListener('load', restore);
    };
  }, [location.key, location.hash, navigationType]);

  return null;
};

export default ScrollManager;
