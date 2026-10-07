/**
 * In-memory module-level set tracking entrance animations that have completed.
 * Prevents replaying once-only entrance animations when returning from detail pages.
 * Resets on full page reload.
 */
const playedSet = new Set();

export const playedOnce = {
  has(key) {
    return playedSet.has(key);
  },
  add(key) {
    playedSet.add(key);
  },
  clear() {
    playedSet.clear();
  },
};

export default playedOnce;
