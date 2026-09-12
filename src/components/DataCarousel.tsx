import { useEffect, useState } from 'react';
import './DataCarousel.css';

export interface CarouselSlide {
  number: string;
  label: string;
  image: string;
  /** A crop composed for a narrow screen, used in place of `image` at the
      same width the carousel's own layout switches to its mobile tab
      arrangement. Falls back to `image` where a slide has no mobile crop. */
  mobileImage?: string;
  /** Shown in this slide's own expanded tab panel. Falls back to the
      carousel-level `tabDescription` when a slide doesn't set one. */
  tabDescription?: string;
}

/** Below this, the carousel's own layout is already the mobile one. */
const MOBILE_BREAKPOINT = '(max-width: 900px)';

/** Tracks a media query as state, so the image swap reacts to a live resize. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

interface DataCarouselProps {
  /** Fixed for the whole carousel — every slide shared the same wording
      anyway, so it's no longer something a slide carries individually. */
  heading: string;
  slides: CarouselSlide[];
  /** How long each slide stays up before auto-advancing, in ms. */
  intervalMs?: number;
  /** Fallback tab-panel copy for any slide that doesn't set its own. */
  tabDescription?: string;
}

const DEFAULT_TAB_DESCRIPTION =
  'We turn architectural designs into masterpiece interiors crafted by genius Italian artists.';

export default function DataCarousel({
  heading,
  slides,
  intervalMs = 6000,
  tabDescription = DEFAULT_TAB_DESCRIPTION,
}: DataCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);

  // Auto-advances, and the tabs below can jump straight to a slide. Keyed on
  // activeIndex with a timeout rather than a standing interval, so picking a tab
  // restarts the countdown — otherwise a click landing late in the cycle would
  // be snatched away a moment later by the pending tick.
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearTimeout(timer);
  }, [activeIndex, slides.length, intervalMs]);

  const active = slides[activeIndex];
  if (!active) return null;

  return (
    <section className="data-carousel" data-guide-media>
      <div className="data-carousel-images">
        {slides.map((slide, i) => (
          <div
            key={slide.label}
            className={`data-carousel-image${i === activeIndex ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${isMobile && slide.mobileImage ? slide.mobileImage : slide.image})` }}
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

      {/* Fixed for the whole carousel, so this never needs to remount or
          re-animate as the active slide changes. */}
      <div className="data-carousel-content">
        <h2 className="data-carousel-heading">{heading}</h2>
      </div>

      <div
        className="data-carousel-tabs"
        style={{ '--tab-count': slides.length } as React.CSSProperties}
      >
        {slides.map((slide, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={slide.label}
              type="button"
              className={`data-carousel-tab${isActive ? ' is-active' : ''}`}
              aria-current={isActive}
              onClick={() => setActiveIndex(i)}
            >
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
              {/* A span, not a p: the tab is a <button>, which only permits
                  phrasing content. Styled as a block in CSS. */}
              {isActive && (
                <span className="data-carousel-tab-description">
                  {slide.tabDescription ?? tabDescription}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
