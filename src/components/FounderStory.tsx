import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollHighlightText, { scrollTrackProps, scrollStickyProps } from './ScrollHighlightText';
import './FounderStory.css';

gsap.registerPlugin(ScrollTrigger);

const HEADING = "Aurelion began with a simple belief. Life should leave more room for what matters. We believe that when life gets busy, having someone you trust to take care of what matters can make all the difference.";

/** Scroll the section stays locked for while the sentence reveals, in vh. */
const VH_REVEAL = 180;
/** Beat the section holds, still, before the reveal starts — in vh. */
const START_OFFSET = 8;

/** Share of the locked span the images take to rise into place. */
const ARRIVAL_SPAN = 0.4;
/** Lead between one image starting its rise and the next, within that share. */
const ARRIVAL_STAGGER = 0.18;
/** How far below its resting place an image begins, as a share of its height. */
const RISE = 0.55;
/**
 * How far the gallery drifts up as the released section scrolls away, as a
 * share of the viewport. Kept in viewport units rather than px so the headroom
 * above the row scales with it — the sticky box clips, and the gallery has
 * roughly a third of the screen above it to travel into at any height.
 */
const DRIFT = 0.26;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const span = (value: number, from: number, to: number) => clamp01((value - from) / (to - from));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

export default function FounderStory() {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track || !sticky) return;

      const gallery = sticky.querySelector<HTMLElement>('.founder-story-gallery');
      const images = gsap.utils.toArray<HTMLElement>('.founder-story-image');
      if (!gallery || images.length === 0) return;

      const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
      /** Where the reveal begins — the same point ScrollHighlightText starts at. */
      const lockFrom = () => docTop(track) + (window.innerHeight * START_OFFSET) / 100;
      /** Where the sticky child lets go and the section scrolls on. */
      const release = () => docTop(track) + track.offsetHeight - sticky.offsetHeight;

      // Each image climbs into place from below, one just behind the next, over
      // the opening of the locked span — so they are arriving while the sentence
      // is lighting up rather than being there already.
      const arrive = (progress: number) => {
        images.forEach((image, i) => {
          const lead = i * ARRIVAL_STAGGER;
          const t = easeOut(span(progress, lead, lead + (1 - (images.length - 1) * ARRIVAL_STAGGER)));
          gsap.set(image, {
            y: image.offsetHeight * RISE * (1 - t),
            // Fades faster than it travels, so it is solid for most of the climb.
            opacity: clamp01(t * 1.8),
          });
        });
      };

      arrive(0);

      const arrival = ScrollTrigger.create({
        trigger: track,
        start: lockFrom,
        end: () => {
          const from = lockFrom();
          return from + (release() - from) * ARRIVAL_SPAN;
        },
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => arrive(self.progress),
        onRefresh: (self) => arrive(self.progress),
      });

      // Once the section is unpinned it scrolls away like any other, and the
      // gallery slides up a little faster than the page does — a parallax that
      // only exists after the release, so the pinned composition stays still.
      const drift = ScrollTrigger.create({
        trigger: track,
        start: release,
        end: () => docTop(track) + track.offsetHeight,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set(gallery, { y: -DRIFT * window.innerHeight * self.progress }),
        onRefresh: (self) => gsap.set(gallery, { y: -DRIFT * window.innerHeight * self.progress }),
      });

      return () => {
        arrival.kill();
        drift.kill();
      };
    },
    { scope: trackRef }
  );

  return (
    <section
      className="founder-story"
      ref={trackRef}
      style={{ '--track-height': `${100 + VH_REVEAL}vh` } as React.CSSProperties}
      {...scrollTrackProps}
    >
      <div className="founder-story-sticky" ref={stickyRef} {...scrollStickyProps}>
        <ScrollHighlightText
          className="founder-story-heading"
          text={HEADING}
          startOffset={START_OFFSET}
        />

        <div className="founder-story-gallery">
          <img src="/finale/02.png" alt="" className="founder-story-image" />
          <img
            src="/finale/07.png"
            alt=""
            className="founder-story-image founder-story-image-tall"
          />
          <img src="/finale/05.png" alt="" className="founder-story-image" />
        </div>
      </div>
    </section>
  );
}
