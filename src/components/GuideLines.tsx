import './GuideLines.css';

// Positions live in CSS rather than inline styles: an inline `left` wins over
// any stylesheet rule, so the mobile placement could not override it.
export default function GuideLines() {
  return (
    <div className="guide-lines">
      <span className="guide-line guide-line-first" />
      <span className="guide-line guide-line-middle" />
      <span className="guide-line guide-line-last" />
    </div>
  );
}
