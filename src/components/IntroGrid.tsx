import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './IntroGrid.css';

gsap.registerPlugin(ScrollTrigger);

const COLUMNS = 4;
const ROWS = 3;

// NOTE: the Figma MCP was rate-limited while this was built, so neither the
// real grid photography nor the exact scatter coordinates could be read. These
// reuse existing project imagery, and the scatter below is derived from the
// reference screenshot rather than the design's own numbers.
const IMAGES = [
  '/about-gallery-1.png',
  '/story-1.png',
  '/about-founder-2.png',
  '/about-gallery-3.png',
  '/carousel-slide-1.png',
  '/service-meetings.png',
  '/book-call.png',
  '/about-gallery-2.png',
  '/about-founder-1.png',
  '/hero-contact.png',
  '/carousel-slide-2.png',
  '/membership.png',
];

/** Deterministic 0–1 noise, so the "hand-scattered" look is stable per cell. */
const noise = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

/** How much of a cell stays on screen once it has been pushed out, in vw/vh. */
const MARGIN = 10;

/**
 * Where a cell waits before it flies in, as viewport units. Each cell leaves
 * through the edge it already sits nearest — the top row upward, the bottom row
 * downward, the middle row sideways — so fragments ring all four sides rather
 * than collecting in the corners. Cells keep their position along the edge they
 * exit through, which is what keeps the top and bottom edges populated. Every
 * route clears the middle, leaving it empty for the intro line.
 */
const scatterFor = (column: number, row: number, index: number) => {
  const jitter = (n: number) => (noise(index * 7 + n) - 0.5) * 2;
  const cellW = 100 / COLUMNS;
  const cellH = 100 / ROWS;
  const rotate = jitter(5) * 38;

  if (row === 0) {
    return { x: jitter(1) * 5, y: -(cellH - MARGIN) + jitter(2) * 5, rotate };
  }
  if (row === ROWS - 1) {
    return { x: jitter(1) * 5, y: 100 - MARGIN - cellH * row + jitter(2) * 5, rotate };
  }

  const x =
    column < COLUMNS / 2
      ? MARGIN - cellW * (column + 1)
      : 100 - MARGIN - cellW * column;
  return { x: x + jitter(1) * 5, y: jitter(2) * 8, rotate };
};

export default function IntroGrid() {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cells = gsap.utils.toArray<HTMLElement>('.intro-grid-cell');
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track || !sticky || cells.length === 0) return;

      // Start states are applied up front rather than through `fromTo`: on a
      // paused timeline, children positioned after time 0 get reverted by the
      // parent's first render, which leaves the scatter never showing at all.
      // These values are viewport-relative, so they don't depend on the cells
      // having been laid out yet.
      cells.forEach((cell, index) => {
        const { x, y, rotate } = scatterFor(index % COLUMNS, Math.floor(index / COLUMNS), index);
        gsap.set(cell, { x: `${x}vw`, y: `${y}vh`, rotate, borderRadius: 16 });
      });
      gsap.set('.intro-grid-intro', { autoAlpha: 1 });
      gsap.set('.intro-grid-lockup', { autoAlpha: 0 });

      const timeline = gsap.timeline({ paused: true });

      cells.forEach((cell, index) => {
        const column = index % COLUMNS;
        const row = Math.floor(index / COLUMNS);
        // Cells further from the middle set off a beat later, so the grid closes
        // inward. Measured on both axes now that cells exit through four edges.
        const fromCentreX = Math.abs(column - (COLUMNS - 1) / 2) / ((COLUMNS - 1) / 2);
        const fromCentreY = Math.abs(row - (ROWS - 1) / 2) / ((ROWS - 1) / 2);
        const distance = Math.min(1, Math.hypot(fromCentreX, fromCentreY) / Math.SQRT2);

        timeline.to(
          cell,
          {
            x: 0,
            y: 0,
            rotate: 0,
            borderRadius: 0,
            ease: 'none',
            duration: 0.78 - distance * 0.1,
          },
          0.05 + distance * 0.12
        );
      });

      // The intro line clears out early; the lockup only lands once the grid has
      // closed up behind it.
      timeline.to('.intro-grid-intro', { autoAlpha: 0, ease: 'none', duration: 0.2 }, 0);
      timeline.to('.intro-grid-lockup', { autoAlpha: 1, ease: 'none', duration: 0.2 }, 0.8);

      const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

      const trigger = ScrollTrigger.create({
        trigger: track,
        start: () => docTop(track),
        end: () => docTop(track) + track.offsetHeight - sticky.offsetHeight,
        scrub: true,
        animation: timeline,
        invalidateOnRefresh: true,
      });

      return () => trigger.kill();
    },
    { scope: trackRef }
  );

  return (
    <section className="intro-grid" ref={trackRef}>
      <div className="intro-grid-sticky" ref={stickyRef}>
        <div className="intro-grid-cells">
          {IMAGES.map((src, i) => (
            <div key={src + i} className="intro-grid-cell">
              <img src={src} alt="" className="intro-grid-image" />
            </div>
          ))}
        </div>

        <p className="intro-grid-intro">
          Introducing, Aurelion!
          <br />
          One-stop for everything
        </p>

        <div className="intro-grid-lockup">
          <img src="/footer-logo.svg" alt="Aurelion" className="intro-grid-logo" />
          {/* The reference screenshot cuts this sentence off mid-clause — the
              tail of the copy still needs to come from the design. */}
          <p className="intro-grid-copy">
            We analyze your personal and professional needs to detect blockages, enhance your
            life goals,
          </p>
        </div>
      </div>
    </section>
  );
}
