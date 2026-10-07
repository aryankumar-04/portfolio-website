/**
 * In-memory state tracking blog listing scroll position when navigating to an article.
 * Not stored in localStorage/sessionStorage so page refresh still resets to top.
 */
const STORAGE_KEY = 'blog_scroll_pos';
let savedBlogState = null;

export const blogScroll = {
  save() {
    if (typeof window === 'undefined') return;
    const y = window.__lenis ? window.__lenis.scroll : window.scrollY;
    savedBlogState = {
      y,
      viewportWidth: window.innerWidth,
    };
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(savedBlogState));
    } catch (e) {
      // Safe fallback if sessionStorage is unavailable
    }
  },

  read() {
    if (savedBlogState && typeof savedBlogState.y === 'number') {
      return savedBlogState;
    }
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        savedBlogState = JSON.parse(raw);
        return savedBlogState;
      }
    } catch (e) {}
    return savedBlogState;
  },

  hasPosition() {
    const data = this.read();
    return data !== null && typeof data.y === 'number';
  },

  clear() {
    savedBlogState = null;
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  },
};

export default blogScroll;
