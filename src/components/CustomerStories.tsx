import { useEffect, useRef, useState } from 'react';
import './CustomerStories.css';

interface Story {
  name: string;
  title: string;
  video: string;
  poster: string;
}

/**
 * Figma node 822:42. Each dot is a separate customer's video; only one asset
 * exists in the project so far (`hero.mp4`), so every story points at it until
 * the real clips are supplied — swap `video`/`poster` in per story then.
 */
const STORIES: Story[] = [
  { name: 'Deepali Mane', title: 'Business Manager ITC', video: '/hero.mp4', poster: '/story-1.png' },
  { name: 'Customer Name', title: 'Guest', video: '/hero.mp4', poster: '/story-1.png' },
  { name: 'Customer Name', title: 'Guest', video: '/hero.mp4', poster: '/story-1.png' },
  { name: 'Customer Name', title: 'Guest', video: '/hero.mp4', poster: '/story-1.png' },
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
  }, []);

  // Advances on its own, but only while nobody is actually watching — a story
  // the visitor pressed play on keeps its place instead of being cut away from.
  useEffect(() => {
    if (playing) return;
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % STORIES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  // Switching stories always lands back on the poster frame with the play
  // button showing, never mid-playback of the story just left.
  useEffect(() => {
    setPlaying(false);
  }, [activeIndex]);

  const active = STORIES[activeIndex];

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
        <p className="customer-stories-label">
          <span>Customer</span>
          <span>Stories</span>
        </p>

        <div className="customer-stories-main">
          <div className="customer-stories-media" key={`media-${activeIndex}`} ref={mediaRef}>
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

            {/* Paused: a solid button, always there, the invitation to start.
                Playing: the same spot turns into a hover-only pause control —
                out of the way while watching, a click away when wanted. */}
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

          <div className="customer-stories-footer">
            <p className="customer-stories-byline">
              {active.name}, <span>{active.title}</span>
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
