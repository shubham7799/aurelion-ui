import ScrollHighlightText from './ScrollHighlightText';
import './FounderStory.css';

export default function FounderStory() {
  return (
    <section className="founder-story">
      <ScrollHighlightText
        className="founder-story-heading"
        text="Success shouldn't come at the cost of your time as life becomes more successful, it also becomes more complex."
      />

      <div className="founder-story-gallery">
        <img src="/about-gallery-1.png" alt="" className="founder-story-image" />
        <img
          src="/about-gallery-2.png"
          alt=""
          className="founder-story-image founder-story-image-tall"
        />
        <img src="/about-gallery-3.png" alt="" className="founder-story-image" />
      </div>
    </section>
  );
}
