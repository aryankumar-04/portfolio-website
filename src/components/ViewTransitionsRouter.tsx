import React, { useRef, useState, useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory, History, Action, Location } from '@remix-run/router';
import { flushSync } from 'react-dom';

// Origin point captured by document-level listener in capture phase
let latestClickOrigin: { x: number; y: number } | null = null;
let latestClickTime = 0;

if (typeof document !== 'undefined') {
  const captureClick = (e: MouseEvent | TouchEvent) => {
    if ('button' in e && (e as MouseEvent).button !== 0) return;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    const target = e.target as HTMLElement | null;
    if (!target) {
      latestClickOrigin = { x: clientX, y: clientY };
      latestClickTime = performance.now();
      return;
    }

    // Check if the clicked link or card contains an AnimatedArrowBox
    const container = target.closest(
      'a, button, [role="link"], [role="button"], .work-project-card, article, li'
    ) as HTMLElement | null;

    const arrowBox = (target.closest('[data-animated-arrow-box]') ||
      container?.querySelector('[data-animated-arrow-box]')) as HTMLElement | null;

    if (arrowBox) {
      const rect = arrowBox.getBoundingClientRect();
      latestClickOrigin = {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
      };
    } else if (clientX === 0 && clientY === 0 && container) {
      // Keyboard activation fallback (Enter/Space on link)
      const rect = container.getBoundingClientRect();
      latestClickOrigin = {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
      };
    } else {
      latestClickOrigin = {
        x: Math.round(clientX),
        y: Math.round(clientY),
      };
    }

    latestClickTime = performance.now();
  };

  document.addEventListener('click', captureClick, { capture: true, passive: true });
}

function focusNewPage() {
  requestAnimationFrame(() => {
    const heading = document.querySelector('main h1') as HTMLElement | null;
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
      heading.style.outline = 'none';
    } else {
      const main = document.querySelector('main') as HTMLElement | null;
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus({ preventScroll: true });
        main.style.outline = 'none';
      }
    }
  });
}

function resetScrollInstantly() {
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.resize?.();
    lenis.scrollTo(0, { immediate: true, force: true });
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
}

let activePageTransition: any = null;

export const ViewTransitionsRouter: React.FC<{
  basename?: string;
  children: React.ReactNode;
}> = ({ basename, children }) => {
  const historyRef = useRef<History | null>(null);
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ v5Compat: true });
  }
  const history = historyRef.current;

  const [state, setStateImpl] = useState<{
    action: Action;
    location: Location;
  }>({
    action: history.action,
    location: history.location,
  });

  const currentLocationRef = useRef(state.location);
  currentLocationRef.current = state.location;

  useLayoutEffect(() => {
    return history.listen((update) => {
      const prevLocation = currentLocationRef.current;
      const nextLocation = update.location;

      // 4. Do NOT run for same-page hash/anchor scrolling or query-only changes
      if (nextLocation.pathname === prevLocation.pathname) {
        setStateImpl(update);
        return;
      }

      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // If prefers-reduced-motion is enabled, navigate instantly with no animation
      if (prefersReduced) {
        setStateImpl(update);
        if (update.action !== Action.Pop) {
          resetScrollInstantly();
        }
        focusNewPage();
        return;
      }

      // If document.startViewTransition is not supported, navigate instantly with 150ms opacity fade-in
      if (typeof document === 'undefined' || !document.startViewTransition) {
        setStateImpl(update);
        if (update.action !== Action.Pop) {
          resetScrollInstantly();
        }
        focusNewPage();
        const main = document.querySelector('main') || document.getElementById('root');
        if (main) {
          const anim = main.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 150,
            easing: 'ease-out',
          });
          anim.onfinish = () => {
            (main as HTMLElement).style.opacity = '';
          };
        }
        return;
      }

      // If theme transition is running, do not conflict with it
      if (document.documentElement.getAttribute('data-vt') === 'theme') {
        setStateImpl(update);
        if (update.action !== Action.Pop) {
          resetScrollInstantly();
        }
        focusNewPage();
        return;
      }

      // If previous page transition is running, skip it cleanly
      if (activePageTransition) {
        try {
          activePageTransition.skip();
        } catch (_) {}
        activePageTransition = null;
      }

      // Check whether there is a recent click point (from within 500ms)
      const now = performance.now();
      const hasRecentClick =
        latestClickOrigin !== null && now - latestClickTime < 500;

      // 5. Back/Forward browser buttons (no click point): use a quick 150ms cross-fade, with no circle
      const isPopWithoutClick = update.action === Action.Pop && !hasRecentClick;

      const origin = hasRecentClick ? latestClickOrigin : null;
      latestClickOrigin = null; // consume origin

      const vtType = isPopWithoutClick ? 'page-pop' : 'page';
      document.documentElement.setAttribute('data-vt', vtType);

      try {
        const transition = document.startViewTransition(() => {
          flushSync(() => {
            setStateImpl(update);
          });
          if (!isPopWithoutClick) {
            resetScrollInstantly();
          }
        });

        activePageTransition = transition;

        transition.ready
          .then(() => {
            if (isPopWithoutClick) {
              // 150ms cross-fade for browser back/forward buttons
              document.documentElement.animate(
                {
                  opacity: [0, 1],
                },
                {
                  duration: 150,
                  easing: 'ease-out',
                  pseudoElement: '::view-transition-new(root)',
                }
              );
            } else {
              // Circular reveal animation (420ms)
              const x = origin ? origin.x : Math.round(window.innerWidth / 2);
              const y = origin ? origin.y : Math.round(window.innerHeight / 2);
              const endRadius =
                Math.hypot(
                  Math.max(x, window.innerWidth - x),
                  Math.max(y, window.innerHeight - y)
                ) + 10;

              document.documentElement.animate(
                {
                  clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                  ],
                },
                {
                  duration: 420,
                  easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
                  pseudoElement: '::view-transition-new(root)',
                }
              );
            }
          })
          .catch(() => {});

        transition.finished.finally(() => {
          if (activePageTransition === transition) {
            activePageTransition = null;
          }
          const currentVt = document.documentElement.getAttribute('data-vt');
          if (currentVt === vtType) {
            document.documentElement.removeAttribute('data-vt');
          }
          focusNewPage();
        });
      } catch (_) {
        document.documentElement.removeAttribute('data-vt');
        activePageTransition = null;
        setStateImpl(update);
        if (!isPopWithoutClick) {
          resetScrollInstantly();
        }
        focusNewPage();
      }
    });
  }, [history]);

  return (
    <Router
      basename={basename}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </Router>
  );
};

export default ViewTransitionsRouter;
