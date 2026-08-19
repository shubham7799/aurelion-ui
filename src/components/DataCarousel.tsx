import { useEffect, useState } from 'react';
import './DataCarousel.css';

export interface CarouselSlide {
  number: string;
  label: string;
  heading: string;
  description: string;
  image: string;
}

interface DataCarouselProps {
  slides: CarouselSlide[];
  /** How long each slide stays up before auto-advancing, in ms. */
  intervalMs?: number;
  /** Shown in every tab's expanded panel — fixed copy, not per-slide. */
  tabDescription?: string;
}

const DEFAULT_TAB_DESCRIPTION =
  'We turn architectural designs into masterpiece interiors crafted by genius Italian artists.';

export default function DataCarousel({
  slides,
  intervalMs = 6000,
  tabDescription = DEFAULT_TAB_DESCRIPTION,
}: DataCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance only — no prev/next controls, per spec.
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [slides.length, intervalMs]);

  const active = slides[activeIndex];
  if (!active) return null;

  return (
    <section className="data-carousel">
      <div className="data-carousel-images">
        {slides.map((slide, i) => (
          <div
            key={slide.label}
            className={`data-carousel-image${i === activeIndex ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>

      <div className="data-carousel-scrim" />

      {/* Cycles clockwise through the ring's 4 quadrants: top-right, bottom-right,
          bottom-left, top-left — one step per slide. */}
      <div className={`data-carousel-ring data-carousel-ring-q${activeIndex % 4}`}>
        <img src="/carousel-ring-outer.svg" alt="" className="data-carousel-ring-outer" />
        <div className="data-carousel-ring-inner-wrap">
          <img src="/carousel-ring-inner.svg" alt="" className="data-carousel-ring-inner" />
        </div>
      </div>

      <div className="data-carousel-content" key={activeIndex}>
        <h2 className="data-carousel-heading">{active.heading}</h2>
        <p className="data-carousel-description">{active.description}</p>
      </div>

      <div className="data-carousel-tabs">
        {slides.map((slide, i) => {
          const isActive = i === activeIndex;
          return (
            <div key={slide.label} className={`data-carousel-tab${isActive ? ' is-active' : ''}`}>
              {isActive && (
                <span
                  key={activeIndex}
                  className="data-carousel-progress"
                  style={{ animationDuration: `${intervalMs}ms` }}
                />
              )}
              <span className="data-carousel-tab-row">
                <span className="data-carousel-tab-label">
                  <span className="data-carousel-tab-muted">{slide.number}</span>
                  <span className="data-carousel-tab-muted">-</span>
                  <span>{slide.label}</span>
                </span>
                {!isActive && <span className="data-carousel-tab-dot" />}
              </span>
              {isActive && <p className="data-carousel-tab-description">{tabDescription}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
