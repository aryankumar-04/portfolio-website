import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const LIGHT_ICON = '/black.svg';
const DARK_ICON = '/white.svg';

export function useThemeFavicon() {
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
    favicon.setAttribute('href', theme === 'dark' ? DARK_ICON : LIGHT_ICON);
  }, [theme]);
}

export default useThemeFavicon;
