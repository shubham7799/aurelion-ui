import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Turned off at import time rather than inside an effect: browsers restore the
// previous scroll position while the document is still loading, so by the time
// React could run an effect the page has already jumped down the page.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

/**
 * Puts every navigation — and every reload — back at the top of the page.
 * Renders nothing; mount it inside the router.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  // Layout effect, so the reset lands before the browser paints and the new
  // page is never seen part-way down.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    // Page heights differ per route, and ScrollTrigger caches the start/end it
    // measured for the old one. Without this the pinned sections on the new
    // page fire against stale positions.
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
