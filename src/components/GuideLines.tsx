import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './GuideLines.css';

/**
 * Blocks whose whole background is a photograph or a video carry this
 * attribute. An ink line vanishes into that kind of picture, so the guides run
 * light across them.
 */
const MEDIA_BLOCK = '[data-guide-media]';

/** Over ordinary page ground, and over a photograph or video. */
const INK = 'rgba(4, 17, 33, 0.08)';
const LIGHT = 'rgba(255, 255, 255, 0.12)';

// Positions live in CSS rather than inline styles: an inline `left` wins over
// any stylesheet rule, so the mobile placement could not override it.
export default function GuideLines() {
  const { pathname } = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  // The guides are one fixed overlay running the height of the screen, but the
  // page behind them is not one colour — so rather than tinting the whole line
  // at once, each is painted with a hard-stop gradient cut to wherever the
  // media blocks currently sit. Two neighbouring sections therefore show their
  // own colour on the same line at the same time, with a crisp edge between
  // them instead of a fade.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Resolved from the DOM rather than refs or props: the guides sit above the
    // router, so the blocks they cross belong to whichever page is mounted.
    const blocks = Array.from(document.querySelectorAll<HTMLElement>(MEDIA_BLOCK));

    const paint = () => {
      const height = window.innerHeight;

      // Clipped to the screen and merged, so two blocks that meet — or a
      // sticky one overlapping its neighbour — produce a single band rather
      // than a seam of stray stops.
      const bands: Array<[number, number]> = [];
      blocks
        .map((block) => block.getBoundingClientRect())
        .map((rect): [number, number] => [
          Math.max(0, rect.top),
          Math.min(height, rect.bottom),
        ])
        .filter(([top, bottom]) => bottom > top)
        .sort((a, b) => a[0] - b[0])
        .forEach(([top, bottom]) => {
          const last = bands[bands.length - 1];
          if (last && top <= last[1]) last[1] = Math.max(last[1], bottom);
          else bands.push([top, bottom]);
        });

      const pct = (px: number) => ((px / height) * 100).toFixed(3);
      const stops: string[] = [];
      let cursor = 0;

      bands.forEach(([top, bottom]) => {
        if (top > cursor) stops.push(`${INK} ${pct(cursor)}%`, `${INK} ${pct(top)}%`);
        stops.push(`${LIGHT} ${pct(top)}%`, `${LIGHT} ${pct(bottom)}%`);
        cursor = bottom;
      });

      if (cursor < height) stops.push(`${INK} ${pct(cursor)}%`, `${INK} 100%`);

      root.style.setProperty('--guide-paint', `linear-gradient(to bottom, ${stops.join(', ')})`);
    };

    // Coalesced into a frame: scroll fires far more often than the screen is
    // repainted, and every run reads layout.
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        paint();
      });
    };

    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  return (
    <div className="guide-lines" ref={rootRef}>
      <span className="guide-line guide-line-first" />
      <span className="guide-line guide-line-middle" />
      <span className="guide-line guide-line-last" />
    </div>
  );
}
