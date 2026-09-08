import './Hero.css';

const SCROLL_LABEL = 'Scroll Down';
/** Seconds between one character starting its roll and the next. */
const ROLL_STAGGER = 0.06;

export default function Hero() {
  return (
    <section className="hero">
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        poster="/hero.png"
      >
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <h1 className="hero-headline">
        Luxury is having less to think about —
        <br />
        Everything included.
      </h1>

      {/* Split per character so each can roll on its own beat. The label is
          announced from the aria-label — the pieces are decorative, and read
          one letter at a time otherwise. */}
      <span className="hero-scroll" aria-label={SCROLL_LABEL} role="img">
        {Array.from(SCROLL_LABEL).map((char, i) => (
          <span
            key={`${char}-${i}`}
            aria-hidden="true"
            className="hero-scroll-char"
            style={{ animationDelay: `${i * ROLL_STAGGER}s` }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </span>
    </section>
  );
}
