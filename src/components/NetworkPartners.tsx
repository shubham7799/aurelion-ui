import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './NetworkPartners.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Figma node 788:800. The design's own numbers, including the placeholder in
 * the fourth slot — it is unfilled in the file, not a transcription slip.
 */
const STATS = [
  { value: '4,061', label: 'Private Clubs Worldwide' },
  { value: '87', label: 'Countries' },
  { value: '2,399', label: 'Cities & Destinations' },
  // { value: 'XX', label: 'Cities & Destinations' },
];

/** The sequence that runs round the globe, in the order the design has it. */
const ORBIT = [
  '2,591 Golf Clubs',
  '964 City & Social Clubs',
  '268 Country Clubs',
  '30 Yacht & Sailing Clubs',
  '28 Beach Clubs',
  'Gymkhanas, Wellness & more',
];

/**
 * Two passes round the ring, which is what the design shows — items recur as
 * the curve comes back round. Two is also close to the natural length of the
 * circumference at this type size, so `textLength` barely has to stretch it.
 */
const ORBIT_TEXT = [...ORBIT, ...ORBIT].join('   ·   ') + '   ·   ';

/** Seconds a number takes to run up to its total. */
const COUNT_DURATION = 1.2;
/** Lead between one number starting to count and the next. */
const COUNT_STAGGER = 0.08;

/** The figure behind a display value, or NaN for a placeholder like "XX". */
const figure = (value: string) => Number(value.replace(/,/g, ''));

/** The text circle, in the SVG's own 1000-unit box. */
const ARC_R = 460;
const ARC_C = 2 * Math.PI * ARC_R;

export default function NetworkPartners() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // Only the real figures count up; a placeholder is left exactly as typed.
      const counters = gsap.utils
        .toArray<HTMLElement>('.network-stat-value')
        .map((node) => ({ node, to: Number(node.dataset.count), at: 0 }))
        .filter(({ to }) => Number.isFinite(to));

      if (counters.length === 0) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Pin the width the finished number occupies before emptying it, so the
      // label beside it holds still instead of being shoved along as digits
      // arrive. Measured rather than assumed: the serif's figures are not
      // tabular, so no amount of padding would predict it.
      counters.forEach((counter) => {
        counter.node.style.minWidth = `${counter.node.offsetWidth}px`;
        counter.node.textContent = '0';
      });

      const release = () =>
        counters.forEach((counter) => {
          counter.node.style.minWidth = '';
        });

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          counters.forEach((counter, i) => {
            gsap.to(counter, {
              at: counter.to,
              duration: COUNT_DURATION,
              delay: i * COUNT_STAGGER,
              ease: 'power2.out',
              onUpdate: () => {
                counter.node.textContent = Math.round(counter.at).toLocaleString('en-US');
              },
              // The pinned width is only needed while the digits are changing;
              // letting it go again keeps the layout fluid on a later resize.
              onComplete: i === counters.length - 1 ? release : undefined,
            });
          });
        },
      });

      return () => {
        release();
        trigger.kill();
      };
    },
    { scope: rootRef }
  );

  return (
    <section className="network-partners" ref={rootRef}>
      <div className="network-partners-grid">
        <p className="network-partners-label">
          <span>Our Network</span>
          <span>&amp; Partners</span>
        </p>

        <ul className="network-stats">
          {STATS.map((stat) => (
            <li key={stat.label + stat.value} className="network-stat">
              {/* The finished number is what renders: the count-up empties it
                  in a layout effect, so it is never seen at zero without the
                  script, and reduced motion simply leaves it alone. */}
              <span className="network-stat-value" data-count={figure(stat.value)}>
                {stat.value}
              </span>
              <span className="network-stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="network-globe">
        {/*
          The map is a background rather than an <img>: a url() pointing into
          /public breaks the CRA build when it lives in a stylesheet, and a
          missing file here simply shows nothing instead of a broken image.
        */}
        <div
          className="network-globe-map"
          style={{ backgroundImage: 'url(/network-globe.webp)' }}
        />

        <svg
          className="network-globe-orbit"
          viewBox="0 0 1000 1000"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* Drawn from the left-hand point up over the top, so the text sits
                upright along the crown of the globe. */}
            <path
              id="network-globe-arc"
              fill="none"
              d={`M 500 500 m -${ARC_R} 0 a ${ARC_R} ${ARC_R} 0 1 1 ${ARC_R * 2} 0 a ${ARC_R} ${ARC_R} 0 1 1 -${ARC_R * 2} 0`}
            />
          </defs>

          <text className="network-globe-label">
            {/* Pinned to the exact circumference, so the sequence closes on
                itself and the loop has no seam. */}
            <textPath
              href="#network-globe-arc"
              textLength={ARC_C}
              lengthAdjust="spacing"
            >
              {ORBIT_TEXT}
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}
