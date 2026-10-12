// In-memory fallback if localStorage is disabled, blocked, or unavailable
const inMemoryStore = {};

const STORAGE_PREFIX = 'blogFirstRead:';

/**
 * Retrieves the saved first read timestamp (ms) for an article slug.
 *
 * @param {string} slug
 * @returns {number | null}
 */
export function getFirstReadTime(slug) {
  if (!slug || typeof slug !== 'string') return null;

  const key = `${STORAGE_PREFIX}${slug}`;

  // Check localStorage first
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const parsed = Number(raw);
        if (!Number.isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }
    } catch {
      // localStorage unavailable or blocked; fall through to in-memory store
    }
  }

  // Check in-memory store
  if (typeof inMemoryStore[key] === 'number') {
    return inMemoryStore[key];
  }

  return null;
}

/**
 * Records the initial visit timestamp once. Never overwrites an existing record.
 *
 * @param {string} slug
 * @returns {number} The saved (or newly recorded) first read timestamp in ms.
 */
export function recordFirstRead(slug) {
  if (!slug || typeof slug !== 'string') {
    return Date.now();
  }

  const existing = getFirstReadTime(slug);
  if (existing !== null) {
    return existing;
  }

  const now = Date.now();
  const key = `${STORAGE_PREFIX}${slug}`;

  // Save to in-memory store for session continuity
  inMemoryStore[key] = now;

  // Persist to localStorage if available
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(key, String(now));
    } catch {
      // Handled silently: in-memory store already retains the timestamp
    }
  }

  return now;
}

/**
 * Formats elapsed time since first read into the human-readable string specification:
 * - less than 1 minute: "Read just now"
 * - 1 minute: "Read 1 minute ago"; 2 to 59 minutes: "Read N minutes ago"
 * - 1 hour: "Read 1 hour ago"; 2 to 23 hours: "Read N hours ago"
 * - 24 to 47 hours: "Read 1 day ago"
 * - 2 to 6 days: "Read a few days ago"
 * - 7 to 13 days: "Read 1 week ago"
 * - 14 to 29 days: "Read a few weeks ago"
 * - 30 to 59 days: "Read 1 month ago"
 * - 2 to 11 months: "Read a few months ago"
 * - 12 to 23 months: "Read 1 year ago"
 * - 24 months or more: "Read a few years ago"
 *
 * @param {number} timestamp - Milliseconds since Unix epoch
 * @returns {string}
 */
export function formatReadAgo(timestamp) {
  if (
    !timestamp ||
    typeof timestamp !== 'number' ||
    Number.isNaN(timestamp) ||
    timestamp <= 0
  ) {
    return 'Read just now';
  }

  const now = Date.now();

  // If saved value is in the future (e.g. clock adjusted), treat as "Read just now"
  if (timestamp > now) {
    return 'Read just now';
  }

  const diffMs = now - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);

  // Less than 1 minute
  if (diffMinutes < 1) {
    return 'Read just now';
  }

  // 1 minute
  if (diffMinutes === 1) {
    return 'Read 1 minute ago';
  }

  // 2 to 59 minutes
  if (diffMinutes <= 59) {
    return `Read ${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  // 1 hour
  if (diffHours === 1) {
    return 'Read 1 hour ago';
  }

  // 2 to 23 hours
  if (diffHours <= 23) {
    return `Read ${diffHours} hours ago`;
  }

  // 24 to 47 hours
  if (diffHours <= 47) {
    return 'Read 1 day ago';
  }

  const diffDays = Math.floor(diffHours / 24);

  // 2 to 6 days
  if (diffDays <= 6) {
    return 'Read a few days ago';
  }

  // 7 to 13 days
  if (diffDays <= 13) {
    return 'Read 1 week ago';
  }

  // 14 to 29 days
  if (diffDays <= 29) {
    return 'Read a few weeks ago';
  }

  // 30 to 59 days
  if (diffDays <= 59) {
    return 'Read 1 month ago';
  }

  const diffMonths = Math.floor(diffDays / 30);

  // 2 to 11 months (up to ~364 days)
  if (diffMonths <= 11) {
    return 'Read a few months ago';
  }

  // 12 to 23 months (up to ~729 days)
  if (diffMonths <= 23) {
    return 'Read 1 year ago';
  }

  // 24 months or more
  return 'Read a few years ago';
}
