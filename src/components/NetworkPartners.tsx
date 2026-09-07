import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import './NetworkPartners.css';

const RING_W = 986;
const RING_H = 618.047;

interface Stop {
  /** Figma top-left of the badge box, in container px. */
  x: number;
  y: number;
  /** Badge diameter at this point on the ring. */
  size: number;
  opacity: number;
}

/**
 * The ring exactly as drawn in Figma (node 357:308) — 17 stops in loop order,
 * running left along the top, down the near side, along the bottom and back up.
 * These are deliberately NOT refitted to a true ellipse: the design's own curve
 * is slightly irregular, and normalising it visibly changes the shape. Badges
 * travel through these points, so the silhouette stays the drawn one.
 */
const STOPS: Stop[] = [
  { x: 537.45, y: 37.89, size: 62.476, opacity: 0.11 },
  { x: 430.56, y: 52.75, size: 61.422, opacity: 0.1 },
  { x: 327.98, y: 87.91, size: 61.621, opacity: 0.1 },
  { x: 234.09, y: 142.49, size: 63.099, opacity: 0.12 },
  { x: 156.41, y: 217.76, size: 66.065, opacity: 0.18 },
  { x: 112.52, y: 314.46, size: 70.877, opacity: 0.32 },
  { x: 134.1, y: 414.57, size: 77.059, opacity: 0.54 },
  { x: 215.69, y: 478.39, size: 82.214, opacity: 0.75 },
  { x: 318.91, y: 502.94, size: 85.484, opacity: 0.9 },
  { x: 426.34, y: 499.48, size: 87.208, opacity: 0.98 },
  { x: 531.57, y: 474.2, size: 87.629, opacity: 1 },
  { x: 630.46, y: 429.37, size: 86.804, opacity: 0.96 },
  { x: 717.57, y: 364.7, size: 84.621, opacity: 0.86 },
  { x: 781.64, y: 278.4, size: 80.772, opacity: 0.69 },
  { x: 796.41, y: 175.24, size: 75.064, opacity: 0.46 },
  { x: 739.89, y: 89.99, size: 69.117, opacity: 0.26 },
  { x: 643.94, y: 47.33, size: 64.93, opacity: 0.16 },
];

const COUNT = STOPS.length;

/** Centres and the badge's largest diameter, as fractions of the container. */
const NODES = STOPS.map((s) => ({
  cx: (s.x + s.size / 2) / RING_W,
  cy: (s.y + s.size / 2) / RING_H,
  size: s.size,
  opacity: s.opacity,
}));
const SIZE_MAX = Math.max(...STOPS.map((s) => s.size));

// Reuses the Footer's partner marks; the ring has 17 stops and the project
// ships 16 files, so the last one repeats the first.
const LOGOS = Array.from({ length: COUNT }, (_, i) => `${String((i % 16) + 1).padStart(2, '0')}.svg`);

/** Seconds for one full circuit of the ring. */
const PERIOD = 85;

const wrap = (i: number) => ((i % COUNT) + COUNT) % COUNT;

/**
 * Catmull-Rom through the four stops around `t`, so a badge curves smoothly
 * between them instead of cutting the straight chord. The spline passes exactly
 * through every stop, which is what keeps the drawn shape intact.
 */
const spline = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (3 * p1 - 3 * p2 + p3 - p0) * t3)
  );
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function NetworkPartners() {
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ring = ringRef.current;
      if (!ring) return;

      const badges = gsap.utils.toArray<HTMLElement>('.network-partners-badge');
      if (badges.length === 0) return;

      gsap.set(badges, { xPercent: -50, yPercent: -50 });

      const spin = { t: 0 };

      const draw = () => {
        const width = ring.offsetWidth;
        const height = ring.offsetHeight;
        if (!width || !height) return;

        badges.forEach((badge, i) => {
          const at = spin.t + i;
          const index = Math.floor(at);
          const frac = at - index;

          const a = NODES[wrap(index - 1)];
          const b = NODES[wrap(index)];
          const c = NODES[wrap(index + 1)];
          const d = NODES[wrap(index + 2)];

          // Size and opacity are properties of where a badge is on the ring, so
          // they interpolate alongside position — a badge always matches the
          // depth of the stop it is passing. Linear here: a spline can overshoot
          // past the 0–1 opacity range.
          const size = lerp(b.size, c.size, frac);
          const opacity = lerp(b.opacity, c.opacity, frac);

          gsap.set(badge, {
            x: spline(a.cx, b.cx, c.cx, d.cx, frac) * width,
            y: spline(a.cy, b.cy, c.cy, d.cy, frac) * height,
            scale: size / SIZE_MAX,
            opacity,
            zIndex: Math.round(opacity * 100),
          });
        });
      };

      draw();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tween = gsap.to(spin, {
        t: COUNT,
        duration: PERIOD,
        ease: 'none',
        repeat: -1,
        onUpdate: draw,
      });

      // Only run while the ring is on screen.
      const observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? tween.play() : tween.pause()),
        { rootMargin: '10%' }
      );
      observer.observe(ring);

      const onResize = () => draw();
      window.addEventListener('resize', onResize);

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', onResize);
        tween.kill();
      };
    },
    { scope: ringRef }
  );

  return (
    <section className="network-partners">
      <div className="network-partners-grid">
        <p className="network-partners-label">
          <span>Our Network</span>
          <span>&amp; Partners</span>
        </p>

        <div className="network-partners-ring" ref={ringRef}>
          <h2 className="network-partners-heading">
            The world’s best hospitality services right under our hood
          </h2>

          {LOGOS.map((logo, i) => (
            <span key={logo + i} className="network-partners-badge">
              <img src={`/partners/${logo}`} alt="" className="network-partners-logo" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
