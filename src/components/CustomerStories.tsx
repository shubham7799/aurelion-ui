import { useEffect, useRef, useState } from 'react';
import './CustomerStories.css';

interface QuoteStory {
  kind: 'quote';
  name: string;
  /** Omitted where the storyteller is named without a role. */
  title?: string;
  /** One entry per paragraph — the breaks carry the pacing of the telling. */
  quote: string[];
  photo: string;
}

interface VideoStory {
  kind: 'video';
  name: string;
  title?: string;
  video: string;
  poster: string;
}

type Story = QuoteStory | VideoStory;

/**
 * Figma nodes 357:308 (the written testimonial) and 822:42 (the video one) —
 * two card layouts on the same rotation, distinguished by `kind`. Only one
 * video asset exists in the project so far (`hero.mp4`), so every video story
 * points at it until the real clips are supplied.
 */
const STORIES: Story[] = [
  {
    kind: 'quote',
    name: 'Radhika',
    quote: [
      'When I was struggling with severe back pain, Deepali helped me find a place in Pune where I could stay and receive the care I needed for 10 days. But what I remember most is that she didn’t simply arrange it and leave it there. She kept checking on me, making sure everything was going well and that I was comfortable, so I could just focus on resting and feeling better.',
      'That experience made me realise how valuable it is to have someone who understands what you need, takes care of it and stays involved until you are truly okay. I believe that is why Aurelion needed to exist — to give people that kind of support and peace of mind when life gets difficult, and even when it simply gets busy.',
    ],
    photo: '/testimonial-1.png',
  },
  {
    kind: 'quote',
    name: 'Maithili',
    quote: [
      'Living abroad, I needed someone I could trust to manage my property in India. Deepali understood what I needed, coordinated everything on the ground, kept me updated and stayed involved until it was sorted. Knowing someone I trusted was looking out for my interests gave me incredible peace of mind.',
      'For me, that experience was a reminder that distance should never mean being disconnected from the things that matter to you. Knowing I had someone I could trust on the ground gave me confidence to manage life from thousands of miles away. That is the kind of reassurance I now see at the heart of Aurelion.',
    ],
    photo: '/testimonial-2.png',
  },
  { kind: 'video', name: 'Customer Name', title: 'Guest', video: '/hero.mp4', poster: '/story-1.png' },
  { kind: 'video', name: 'Customer Name', title: 'Guest', video: '/hero.mp4', poster: '/story-1.png' },
];

/** How long an unwatched story sits before the carousel moves on. */
const INTERVAL_MS = 7000;

export default function CustomerStories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  // Pauses the moment the clip scrolls out of view, rather than running on
  // silently underneath the rest of the page.
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) videoRef.current?.pause();
      },
      { threshold: 0 }
    );
    observer.observe(media);
    return () => observer.disconnect();
  }, [activeIndex]);

  // Advances on its own, but only while nobody is actually watching — a video
  // story the visitor pressed play on keeps its place instead of being cut
  // away from.
  useEffect(() => {
    if (playing) return;
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % STORIES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  // Switching stories always lands a video back on the poster frame with the
  // play button showing, never mid-playback of the story just left.
  useEffect(() => {
    setPlaying(false);
  }, [activeIndex]);

  const active = STORIES[activeIndex];
  const isQuote = active.kind === 'quote';

  const goTo = (i: number) => {
    videoRef.current?.pause();
    setActiveIndex(i);
  };

  const play = () => {
    videoRef.current?.play();
  };

  const pause = () => {
    videoRef.current?.pause();
  };

  return (
    <section className="customer-stories">
      <div className="customer-stories-grid">
        <div className="customer-stories-aside">
          <p className="customer-stories-label">
            <span>Customer</span>
            <span>Stories</span>
          </p>
        </div>

        <div className="customer-stories-main" key={`main-${activeIndex}`}>
          {isQuote ? (
            // The quote mark sits above the portrait; the portrait and the
            // copy then share a row, aligned to each other rather than to the
            // icon above — a named grid row for each, not stacked margins.
            <div className="customer-stories-quote-block">
              <img src="/about-quote.svg" alt="" className="customer-stories-quote-icon" />
              <img src={active.photo} alt={active.name} className="customer-stories-photo" />
              <div className="customer-stories-quote">
                {active.quote.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="customer-stories-media" ref={mediaRef}>
              <video
                ref={videoRef}
                className="customer-stories-video"
                src={active.video}
                poster={active.poster}
                playsInline
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
              />

              {/* Paused: a solid button, always there, the invitation to
                  start. Playing: the same spot turns into a hover-only pause
                  control — out of the way while watching, a click away when
                  wanted. */}
              {!playing ? (
                <button
                  type="button"
                  className="customer-stories-play"
                  aria-label={`Play ${active.name}'s story`}
                  onClick={play}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 7.5v9l7.5-4.5L9 7.5Z" fill="#041121" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className="customer-stories-pause"
                  aria-label={`Pause ${active.name}'s story`}
                  onClick={pause}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M8 7h2.5v10H8V7Zm5.5 0H16v10h-2.5V7Z" fill="#041121" />
                  </svg>
                </button>
              )}
            </div>
          )}

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
        </div>
      </div>
    </section>
  );
}
