const STORAGE_KEY = 'blog_read_history';

/**
 * Retrieves read history record for an article slug.
 *
 * @param {string} slug
 * @returns {{ slug: string, timestamp: number, count: number } | null}
 */
export function getArticleReadRecord(slug) {
  if (!slug || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && data[slug] ? data[slug] : null;
  } catch (err) {
    return null;
  }
}

/**
 * Records an article view in localStorage.
 *
 * @param {string} slug
 */
export function recordArticleRead(slug) {
  if (!slug || typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const prev = data[slug] || { count: 0 };
    data[slug] = {
      slug,
      timestamp: Date.now(),
      count: (prev.count || 0) + 1,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    // Gracefully handle quota or security errors
  }
}

/**
 * Formats elapsed time since last read into a human-readable string.
 *
 * - Under 1 minute: "Read just now"
 * - 1 to 59 minutes: "Read 1 minute ago", "Read 3 minutes ago", "Read 50 minutes ago"
 * - 60 minutes to 24 hours: switch to hours: "Read 1 hour ago", "Read 2 hours ago", "Read 21 hours ago", up to "Read 24 hours ago"
 * - More than 24 hours up to 6 days: days: "Read 1 day ago", "Read 2 days ago", "Read 3 days ago"
 * - 7 to 29 days: weeks: "Read 1 week ago", "Read 2 weeks ago"
 * - 30 to 364 days: months: "Read 1 month ago", "Read 5 months ago" (30 days per month)
 * - 365 days or more: years: "Read 1 year ago", "Read 2 years ago" (365 days per year)
 *
 * @param {number} timestamp
 * @returns {string | null}
 */
export function formatReadAgo(timestamp) {
  if (!timestamp || typeof timestamp !== 'number') return null;
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) {
    return 'Read just now';
  }
  if (diffMin < 60) {
    return `Read ${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffHours <= 24) {
    return `Read ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffDays <= 6) {
    return `Read ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Read ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Read ${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `Read ${years} ${years === 1 ? 'year' : 'years'} ago`;
}
