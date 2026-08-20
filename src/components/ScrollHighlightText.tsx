import { useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollHighlightText.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Spread onto the tall scroll-track ancestor wrapping the text. The reveal runs
 * across the span that track's `position: sticky` child stays locked.
 */
export const scrollTrackProps = { 'data-scroll-track': '' } as const;

/**
 * Spread onto the `position: sticky` element inside the track. Its real height
 * (which may exceed one viewport) is what determines when it releases, so the
 * reveal's `end` is measured from that rather than assumed to be `100vh`.
 */
export const scrollStickyProps = { 'data-scroll-sticky': '' } as const;

const TRACK_SELECTOR = '[data-scroll-track]';
const STICKY_SELECTOR = '[data-scroll-sticky]';

interface ScrollHighlightTextProps {
  /** The sentence to reveal — highlighted one character at a time. */
  text: string;
  /** Extra class on the root, for font/color overrides. */
  className?: string;
  /**
   * How long the track holds before the reveal begins, as a percentage of
   * viewport height. Only applies inside a scroll track.
   */
  startOffset?: number;
  /** Set false to render the text fully highlighted, with no scroll animation. */
  animate?: boolean;
}

export default function ScrollHighlightText({
  text,
  className = '',
  startOffset = 0,
  animate = true,
}: ScrollHighlightTextProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // `Array.from` splits by code point, so astral characters (emoji, accented
  // pairs) stay intact instead of being torn into broken halves by `split('')`.
  const characters = useMemo(() => Array.from(text), [text]);

  useGSAP(
    () => {
      if (!animate) return;

      const root = rootRef.current;
      if (!root) return;

      // Read the spans straight from the DOM. A ref array reset during render is
      // fragile — React only re-invokes ref callbacks when nodes actually change,
      // so on a re-render the array can be empty while the DOM is perfectly fine.
      const chars = Array.from(root.querySelectorAll<HTMLSpanElement>('.shl-char'));
      if (chars.length === 0) return;

      // Resolve the track from the DOM rather than a passed-in ref: layout effects
      // run bottom-up, so a parent's ref is still null while this child effect runs,
      // but the DOM itself is already fully constructed.
      const track = root.closest<HTMLElement>(TRACK_SELECTOR);
      const sticky = track?.querySelector<HTMLElement>(STICKY_SELECTOR);
      const target = track ?? root;

      // Absolute document offset of an element's top, valid at any scroll position.
      const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

      // Only the characters between the previous and current counts actually
      // change state, so touching just those keeps each scroll tick O(delta)
      // instead of re-walking every span in the sentence.
      let revealed = 0;
      const revealTo = (count: number) => {
        if (count === revealed) return;
        const [from, to] = count > revealed ? [revealed, count] : [count, revealed];
        for (let i = from; i < to; i += 1) {
          chars[i].classList.toggle('shl-active', i < count);
        }
        revealed = count;
      };

      // Numeric start/end only — string positions are easy to get subtly wrong,
      // and if `end` resolves before `start`, progress pins at 1 immediately.
      // With a track: starts after `startOffset` of hold time once it locks, and
      // ends exactly when the sticky child releases. Without one: reveals as
      // `root` crosses the viewport.
      const trigger = ScrollTrigger.create({
        trigger: target,
        start: track
          ? () => docTop(track) + (window.innerHeight * startOffset) / 100
          : () => docTop(target) - window.innerHeight * 0.75,
        end: track
          ? () => docTop(track) + track.offsetHeight - (sticky ?? target).offsetHeight
          : () => docTop(target) - window.innerHeight * 0.25,
        invalidateOnRefresh: true,
        onUpdate: (self) => revealTo(Math.round(self.progress * chars.length)),
      });

      return () => trigger.kill();
    },
    { scope: rootRef, dependencies: [characters, animate, startOffset] }
  );

  return (
    <div ref={rootRef} className={`scroll-highlight-text ${className}`.trim()}>
      {characters.map((char, i) => (
        <span key={i} className={animate ? 'shl-char' : 'shl-char shl-active'}>
          {char}
        </span>
      ))}
    </div>
  );
}
