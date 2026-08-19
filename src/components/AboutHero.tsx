import './AboutHero.css';

export default function AboutHero() {
  return (
    <section className="about-hero" style={{ backgroundImage: 'url(/about-hero-bg.png)' }}>
      <div className="about-hero-scrim" />

      <h1 className="about-hero-heading">
        At Aurelion, we believe true luxury is having less to true luxury is having less to gieve true luxury is having At Aurelion, we believe true luxury is having less to
      </h1>

      <div className="about-hero-grid">
        <p className="about-hero-description">
          Every journey, every reservation, every introduction, every detail—quietly
          anticipated, seamlessly coordinated, and impeccably delivered through one
          trusted relationship.
        </p>
      </div>
    </section>
  );
}
