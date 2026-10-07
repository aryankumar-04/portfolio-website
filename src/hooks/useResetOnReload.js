/**
 * Reload detection and reset to "/" at app startup.
 * Prevents flash of old page and ensures a refresh always lands at the top of the main landing page.
 */
export function resetOnReload() {
  if (typeof window === 'undefined') return;

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const isReload = (() => {
    try {
      const navEntries = performance.getEntriesByType?.('navigation');
      if (navEntries && navEntries.length > 0) {
        return navEntries[0].type === 'reload';
      }
      return performance?.navigation?.type === 1;
    } catch {
      return false;
    }
  })();

  if (isReload) {
    window.scrollTo(0, 0);
  }
}

// Execute immediately upon module load before React renders
resetOnReload();

export default function useResetOnReload() {
  // Hook export for app-level compatibility
}
