import './AboutHero.css';

export default function AboutHero() {
  return (
    <section
      className="about-hero"
      data-guide-media
      style={{ backgroundImage: 'url(/about-hero-bg.png)' }}
    >
      <div className="about-hero-scrim" />

      <h1 className="about-hero-heading">
        At Aurelion, we thrive to become the most trusted private lifestyle partner for discerning individuals and families making life more effortless through personalised attention, trusted access and meaningful experiences.
      </h1>

      <div className="about-hero-grid">
        <p className="about-hero-description">
          To simplify the lives of our members by understanding their needs, anticipating what matters and taking care of every detail with discretion and ownership.
        </p>
      </div>
    </section>
  );
}
