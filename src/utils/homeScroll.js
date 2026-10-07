/**
 * In-memory state tracking home scroll position when leaving the home page.
 * Not stored in localStorage/sessionStorage so page refresh still resets to top.
 */
const STORAGE_KEY = 'home_scroll_pos';
let savedState = null;

export function getBreakpoint(width) {
  if (width >= 1280) return 'desktop';
  if (width >= 810) return 'tablet';
  return 'mobile';
}

export const homeScroll = {
  save(sectionId) {
    if (typeof window === 'undefined') return;

    const y = window.__lenis ? window.__lenis.scroll : window.scrollY;
    let finalSectionId = sectionId || '';
    let offsetInSection = 0;

    if (!finalSectionId) {
      const projectsEl = document.getElementById('projects');
      const thoughtsEl = document.getElementById('thoughts');
      if (projectsEl) {
        const rect = projectsEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          finalSectionId = 'projects';
          offsetInSection = rect.top;
        }
      }
      if (!finalSectionId && thoughtsEl) {
        const rect = thoughtsEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          finalSectionId = 'thoughts';
          offsetInSection = rect.top;
        }
      }
    } else {
      const section = document.getElementById(finalSectionId);
      if (section) {
        offsetInSection = section.getBoundingClientRect().top;
      }
    }

    savedState = {
      y,
      sectionId: finalSectionId,
      offsetInSection,
      viewportWidth: window.innerWidth,
    };

    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    } catch (e) {}
  },

  read() {
    if (savedState && typeof savedState.y === 'number') {
      return savedState;
    }
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        savedState = JSON.parse(raw);
        return savedState;
      }
    } catch (e) {}
    return savedState;
  },

  hasPosition() {
    const data = this.read();
    return data !== null && typeof data.y === 'number';
  },

  clear() {
    savedState = null;
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  },
};

export default homeScroll;
