import ScrollHighlightText, { scrollTrackProps, scrollStickyProps } from './ScrollHighlightText';
import './Membership.css';

const HEADLINE =
  "Success shouldn't come at the cost of your time as life becomes more successful, " +
  'it also becomes more complex.';

export default function Membership() {
  return (
    // Tall outer track — its height beyond the sticky screen is the scroll budget
    // the highlight consumes while the section stays visually locked.
    <section className="membership" {...scrollTrackProps}>
      <div className="membership-sticky" {...scrollStickyProps}>
        <div className="membership-grid">
          <p className="membership-label">
            Membership
            <br />
            Details
          </p>

          <div className="membership-copy">
            <ScrollHighlightText
              className="membership-highlight"
              startOffset={10}
              text={HEADLINE}
            />
            <button type="button" className="membership-link">
              Read more about membership
            </button>
          </div>
        </div>

        <img
          src="/membership.png"
          alt=""
          width={2880}
          height={1526}
          className="membership-image"
        />
      </div>
    </section>
  );
}
