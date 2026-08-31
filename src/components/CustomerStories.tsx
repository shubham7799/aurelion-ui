import { useEffect, useState } from 'react';
import './CustomerStories.css';

interface Story {
  quote: string;
  name: string;
  title: string;
  photo: string;
}

// The Figma design (node 357:308) shows 4 pagination dots but only spells out
// the first story. Stories 2–4 are placeholders so the dot count matches the
// design — swap in the real quotes/photos when they're available.
const STORIES: Story[] = [
  {
    quote:
      'Organizing a surprise family reunion while the client is overseas can be quite a challenge, but it’s also an exciting opportunity to create lasting memories. From selecting the perfect location to coordinating every detail, the made ensure that this celebration will be truly unforgettable.',
    name: 'Deepali Mane',
    title: 'Business Manager ITC',
    photo: '/story-1.png',
  },
  {
    quote:
      'From the first call to the last goodbye, every detail was handled with a level of care that made the whole trip feel effortless.',
    name: 'Customer Name',
    title: 'Guest',
    photo: '/story-1.png',
  },
  {
    quote:
      'We didn’t have to think about a single logistic — we just showed up and everything was exactly as promised.',
    name: 'Customer Name',
    title: 'Guest',
    photo: '/story-1.png',
  },
  {
    quote:
      'They understood what we wanted before we could describe it, and every recommendation landed perfectly.',
    name: 'Customer Name',
    title: 'Guest',
    photo: '/story-1.png',
  },
];

const INTERVAL_MS = 7000;

export default function CustomerStories() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % STORIES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  const active = STORIES[activeIndex];

  return (
    <section className="customer-stories">
      <div className="customer-stories-grid">
        <div className="customer-stories-aside">
          <p className="customer-stories-label">
            <span>Customer</span>
            <span>Stories</span>
          </p>
          <img
            src={active.photo}
            alt={active.name}
            className="customer-stories-photo"
            key={`photo-${activeIndex}`}
          />
        </div>

        <div className="customer-stories-main" key={`main-${activeIndex}`}>
          <img src="/about-quote.svg" alt="" className="customer-stories-quote-icon" />
          <p className="customer-stories-quote">{active.quote}</p>

          <div className="customer-stories-footer">
            <p className="customer-stories-byline">
              {active.name}, <span>{active.title}</span>
            </p>
            <div className="customer-stories-dots">
              {STORIES.map((story, i) => (
                <span
                  key={story.name + i}
                  className={`customer-stories-dot${i === activeIndex ? ' is-active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
