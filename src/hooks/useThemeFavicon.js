import { useEffect } from 'react';

const LIGHT_ICON = '/black.svg';
const DARK_ICON = '/white.svg';

export function useThemeFavicon() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    const updateFavicon = (isDark) => {
      // Remove the media-based fallback links from index.html to prevent conflict
      const fallbackLinks = document.querySelectorAll('link[rel="icon"][media]');
      fallbackLinks.forEach((link) => link.remove());

      // Get or create single <link id="app-favicon"> element
      let favicon = document.getElementById('app-favicon');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.id = 'app-favicon';
        favicon.rel = 'icon';
        favicon.type = 'image/svg+xml';
        document.head.appendChild(favicon);
      }

      favicon.setAttribute('type', 'image/svg+xml');
      favicon.setAttribute('href', isDark ? DARK_ICON : LIGHT_ICON);
    };

    // Initial run
    const isDark = mq ? mq.matches : false;
    updateFavicon(isDark);

    if (!mq) return;

    const handleChange = (e) => {
      updateFavicon(e.matches);
    };

    if (mq.addEventListener) {
      mq.addEventListener('change', handleChange);
    } else if (mq.addListener) {
      mq.addListener(handleChange);
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handleChange);
      } else if (mq.removeListener) {
        mq.removeListener(handleChange);
      }
    };
  }, []);
}

export default useThemeFavicon;
