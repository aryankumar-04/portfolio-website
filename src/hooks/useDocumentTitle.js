import { useEffect } from 'react';

/**
 * Sets document.title when the title changes.
 * Guards for environments without a document object.
 * Does not restore previous title on cleanup so that every route sets its own title.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    if (typeof document !== 'undefined' && title) {
      document.title = title;
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) twitterTitle.setAttribute('content', title);
    }
  }, [title]);
}

export default useDocumentTitle;
