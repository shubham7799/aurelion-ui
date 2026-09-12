import ScrollHighlightText, { scrollTrackProps, scrollStickyProps } from './ScrollHighlightText';
import './Membership.css';

const HEADLINE =
  "Aurelion is a private lifestyle membership designed to give you back what becomes most valuable — your time, attention and freedom." +
  '\n\nOne trusted relationship, built around you.';

export default function Membership() {
  return (
    // Tall outer track — its height beyond the sticky screen is the scroll budget
    // the highlight consumes while the section stays visually locked.
    <section className="membership" {...scrollTrackProps}>
      <div className="membership-sticky" {...scrollStickyProps}>
        <div className="membership-grid">
          <p className="membership-label">
            {/* Membership
            <br />
            Details */}
          </p>

          <div className="membership-copy">
            <ScrollHighlightText
              className="membership-highlight"
              startOffset={10}
              text={HEADLINE}
            />
            {/* <button type="button" className="membership-link">
              Read more about membership
            </button> */}
          </div>

          {/* Sits inside the same grid as the copy rather than full-bleed below
              it, so its left edge lands on a column line instead of the page
              edge. */}
          <img
            src="/membership.png"
            alt=""
            width={1071}
            height={1138}
            className="membership-image"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
