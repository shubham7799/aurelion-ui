import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollHighlightText, { scrollTrackProps, scrollStickyProps } from './ScrollHighlightText';
import './ServiceStack.css';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE =
  "Success shouldn't come at the cost of your time as life becomes more successful, " +
  'it also becomes more complex.';

interface ServiceCard {
  image: string;
  caption: string;
}

// Figma (nodes 357:1373 / 357:1394 / 357:1418) only names two cards — MEETINGS
// and RESERVATIONS — and its third stacked layer reuses the second card's
// image, so only "Meetings" ships with its real asset here. Add entries to grow
// the stack; the animation reads its length.
const CARDS: ServiceCard[] = [
  { image: '/service-meetings.png', caption: 'Meetings' },
  // Placeholder art — the designed image for this card couldn't be exported.
  { image: '/about-gallery-1.png', caption: 'Reservations' },
  // Placeholder art and caption both — Figma names no third card.
  { image: '/about-gallery-2.png', caption: 'Travel' },
];

/** Scroll budget for the headline reveal, in viewport heights. */
const TEXT_SCROLL_VH = 170;
/** ...and for each card's arrival after it. */
const CARD_SCROLL_VH = 200;
/**
 * Total scroll the sticky screen holds for, so every card gets the same run-in
 * no matter how many are in CARDS — and the track height below follows it.
 */
const SCROLL_VH = TEXT_SCROLL_VH + CARD_SCROLL_VH * (CARDS.length - 1);
/** Share of that budget the reveal consumes before the cards start moving. */
const TEXT_SPAN = TEXT_SCROLL_VH / SCROLL_VH;
/** Hold before the reveal starts, as a percentage of viewport height. */
const TEXT_START_OFFSET = 6;
/** Stand-in viewport height, for the degenerate case where it reads as zero. */
const OFFSCREEN_FALLBACK = 1000;
/** Each card behind the front one grows by this much, per Figma's depth ladder. */
const SCALE_STEP = 0.03;
/** ...and drifts down by this share of its own height. */
const DRIFT_STEP = 2.2;

export default function ServiceStack() {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track || !sticky) return;

      const cards = gsap.utils.toArray<HTMLElement>('.service-stack-card');
      if (cards.length < 2) return;

      gsap.set(cards, { scale: 1, yPercent: 0 });

      // How far below its resting slot a waiting card sits. The sticky screen is
      // exactly one viewport tall and a card always rests inside it, so shifting
      // by the viewport height clears the bottom edge every time — no measuring
      // of the card itself, which is only reliable after layout has settled.
      // Still a function so it re-resolves on ScrollTrigger's refresh.
      const offscreen = () => window.innerHeight || OFFSCREEN_FALLBACK;

      // One tween per arrival, laid out on an integer timeline so card `i`
      // lands at time `i`. Everything already stacked is pushed a step further
      // back on the same beat.
      const timeline = gsap.timeline({ paused: true });
      cards.slice(1).forEach((card, offset) => {
        const index = offset + 1;
        const at = offset;

        timeline.fromTo(
          card,
          { y: offscreen },
          { y: 0, ease: 'none', duration: 1, immediateRender: true },
          at
        );

        for (let behind = 0; behind < index; behind += 1) {
          const depth = index - behind;
          timeline.to(
            cards[behind],
            {
              scale: 1 + SCALE_STEP * depth,
              yPercent: DRIFT_STEP * depth,
              ease: 'none',
              duration: 1,
            },
            at
          );
        }
      });

      const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
      const scrollable = () => track.offsetHeight - sticky.offsetHeight;
      // Mirrors ScrollHighlightText's own start/end maths so the cards begin on
      // exactly the scroll position where the last character lands, rather than
      // overlapping the tail of the reveal.
      const revealEnd = () => {
        const from = (window.innerHeight * TEXT_START_OFFSET) / 100;
        return docTop(track) + from + (scrollable() - from) * TEXT_SPAN;
      };

      const trigger = ScrollTrigger.create({
        trigger: track,
        start: revealEnd,
        end: () => docTop(track) + scrollable(),
        scrub: true,
        animation: timeline,
        invalidateOnRefresh: true,
        // Only the frontmost card is captioned in the design, so the label
        // tracks whichever card is currently on top.
        onUpdate: (self) =>
          setActiveIndex(
            Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)))
          ),
      });

      return () => trigger.kill();
    },
    { scope: trackRef }
  );

  return (
    <section
      className="service-stack"
      ref={trackRef}
      style={{ '--track-height': `${100 + SCROLL_VH}vh` } as React.CSSProperties}
      {...scrollTrackProps}
    >
      <div className="service-stack-sticky" ref={stickyRef} {...scrollStickyProps}>
        <div className="service-stack-grid">
          <ScrollHighlightText
            className="service-stack-heading"
            text={HEADLINE}
            startOffset={TEXT_START_OFFSET}
            trackSpan={TEXT_SPAN}
          />
        </div>

        <div className="service-stack-stage">
          <div className="service-stack-cards">
            {CARDS.map((card, i) => (
              <div key={card.caption} className="service-stack-card" style={{ zIndex: i + 1 }}>
                <img src={card.image} alt="" className="service-stack-image" />
              </div>
            ))}
          </div>

          <p className="service-stack-caption" key={CARDS[activeIndex].caption}>
            {CARDS[activeIndex].caption}
          </p>
        </div>
      </div>
    </section>
  );
}
