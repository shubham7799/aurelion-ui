import { useState } from 'react';
import './CustomerStories.css';

/**
 * The back-arrow glyph, drawn once. The next control reuses this same
 * markup and turns it round in CSS (`.customer-stories-control-next svg`)
 * rather than a second, mirrored copy of the same three paths.
 */
function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M15.8359 10H4.1693"
        stroke="#041121"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.16406 15L4.16406 10"
        stroke="#041121"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.16406 5L4.16406 10"
        stroke="#041121"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface Story {
  name: string;
  /** Omitted where the storyteller is named without a role. */
  title?: string;
  /** One entry per paragraph — the breaks carry the pacing of the telling. */
  quote: string[];
  photo: string;
}

/** Figma node 357:308 — a portrait beside the quote it belongs to. */
const STORIES: Story[] = [
  {
    name: 'Radhika',
    quote: [
      'When I was struggling with severe back pain, Deepali helped me find a place in Pune where I could stay and receive the care I needed for 10 days. But what I remember most is that she didn’t simply arrange it and leave it there. She kept checking on me, making sure everything was going well and that I was comfortable, so I could just focus on resting and feeling better.',
      'That experience made me realise how valuable it is to have someone who understands what you need, takes care of it and stays involved until you are truly okay. I believe that is why Aurelion needed to exist — to give people that kind of support and peace of mind when life gets difficult, and even when it simply gets busy.',
    ],
    photo: '/testimonial-1.webp',
  },
  {
    name: 'Maithili',
    quote: [
      'Living abroad, I needed someone I could trust to manage my property in India. Deepali understood what I needed, coordinated everything on the ground, kept me updated and stayed involved until it was sorted. Knowing someone I trusted was looking out for my interests gave me incredible peace of mind.',
      'For me, that experience was a reminder that distance should never mean being disconnected from the things that matter to you. Knowing I had someone I could trust on the ground gave me confidence to manage life from thousands of miles away. That is the kind of reassurance I now see at the heart of Aurelion.',
    ],
    photo: '/testimonial-2.webp',
  },
  {
    name: 'Mr. Suraj Kazi',
    quote: [
      'During a trip to Ahmedabad, I accidentally left behind one of my favourite and most expensive suits at the airport. A few days later, I casually mentioned it to Mr. Girase. Without me even asking, he reached out to his contact in Ahmedabad, followed up and somehow managed to get my suit back to me.',
      'What touched me most wasn\'t just getting the suit back, but the fact that he took my problem as his own and quietly saw it through.',
      'That is what I see in Aurelion — someone who listens, takes ownership and makes things happen, even when they seem impossible.'
    ],
    photo: '/testimonial-3.webp',
  },
];

export default function CustomerStories() {
  const [activeIndex, setActiveIndex] = useState(0);
  /** Which side the incoming story slides in from. */
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const active = STORIES[activeIndex];

  const goTo = (i: number, dir?: 'forward' | 'backward') => {
    // A dot can jump several stories at once with no arrow involved; absent an
    // explicit direction, forward/backward is simply which side of where we
    // are now it sits.
    setDirection(dir ?? (i >= activeIndex ? 'forward' : 'backward'));
    setActiveIndex(i);
  };

  // The arrows say their direction outright rather than leaving it to be
  // inferred from the index — both wrap the index around at the ends, which
  // would otherwise read backwards (0 → last looks like a jump forward).
  const goPrev = () => goTo((activeIndex - 1 + STORIES.length) % STORIES.length, 'backward');
  const goNext = () => goTo((activeIndex + 1) % STORIES.length, 'forward');

  return (
    <section className="customer-stories">
      <div className="customer-stories-grid">
        <div className="customer-stories-aside">
          <p className="customer-stories-label">
            <span>Customer</span>
            <span>Stories</span>
          </p>
        </div>

        <div
          className={`customer-stories-main customer-stories-main-${direction}`}
          key={`main-${activeIndex}`}
        >
          {/* The quote mark sits above the portrait; the portrait and the
              copy then share a row, aligned to each other rather than to the
              icon above — a named grid row for each, not stacked margins. */}
          <div className="customer-stories-quote-block">
            <img src="/about-quote.svg" alt="" className="customer-stories-quote-icon" />
            <img src={active.photo} alt={active.name} className="customer-stories-photo" loading="lazy" />
            <div className="customer-stories-quote">
              {active.quote.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="customer-stories-footer">
            <p className="customer-stories-byline">
              {active.name}
              {active.title ? <span>, {active.title}</span> : null}
            </p>
            <div className="customer-stories-dots">
              {STORIES.map((story, i) => (
                <button
                  key={story.name + i}
                  type="button"
                  aria-label={`Show story ${i + 1}`}
                  aria-current={i === activeIndex}
                  className={`customer-stories-dot${i === activeIndex ? ' is-active' : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>

          <div className="customer-stories-controls">
            <button
              type="button"
              className="customer-stories-control"
              aria-label="Previous story"
              onClick={goPrev}
            >
              <ArrowIcon />
            </button>

            <button
              type="button"
              className="customer-stories-control customer-stories-control-next"
              aria-label="Next story"
              onClick={goNext}
            >
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
