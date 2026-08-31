import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" style={{ backgroundImage: 'url(/hero.png)' }}>
      <h1 className="hero-headline">
        Luxury is having less to think about —
        <br />
        Everything included.
      </h1>

      <span className="hero-scroll">Scroll Down</span>
    </section>
  );
}
