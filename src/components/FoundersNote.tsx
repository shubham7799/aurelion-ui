import { Fragment } from 'react';
import './FoundersNote.css';

interface Testimonial {
  /** One entry per paragraph. A `*phrase*` within one renders emphasised. */
  quote: string[];
  name: string;
  title: string;
  photo: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: [
      'I have always believed that our time should be spent on the things that truly matter to us — while everything else should simply be taken care of.',
      'That thought stayed with me for years.',
      'I often wondered — if I value my time this deeply, what must it mean for someone whose life has reached a scale where even the smallest friction can take away from something far more important?',
      'There are people who can have a secretary, a team or someone for almost everything. But there are still things that require discretion, trust and a certain understanding that cannot always be placed in the hands of one individual.',
      'That is where the idea of Aurelion began for me.',
      'I wanted to create a trusted platform where the things that create friction in everyday life could be taken care of — privately, seamlessly and with the right people around you.',
      "A community where you don't have to keep searching, arranging and figuring everything out yourself.",
      'So that when you become a part of Aurelion, you can simply feel:',
      '*“It’s taken care of. I can get back to my life.”*',
      'For me, that is what Aurelion is truly about — *giving people back their time, ease and peace of mind, wherever life takes them.*',
    ],
    name: 'Deepali Mane',
    title: 'Founder, M.D',
    photo: '/about-founder-1.jpeg',
  },
  {
    quote: [
      'I believed in Aurelion because its vision connects with the real challenges faced by people whose time, privacy and convenience hold a different value. I saw an opportunity to build something that could genuinely make a difference, and that is what made me come forward and become part of this journey.',
      'My vision is for Aurelion to become a trusted part of the lives of *families who value this way of living* — helping them solve problems, access the right opportunities and create greater success with ease.',
      'For me, true success will be when our clients *recommend Aurelion to others and reach out with genuine gratitude*, knowing that we have made a meaningful difference in their lives.',
    ],
    name: 'Bholesing Girase',
    title: 'Co-Founder & COO',
    photo: '/about-founder-2.jpeg',
  },
];

/**
 * Splits a paragraph on `*...*` and renders the enclosed text emphasised —
 * the only markup these quotes need, so a small parser here beats reshaping
 * the data into a segment tree.
 */
function renderEmphasis(paragraph: string) {
  const parts = paragraph.split(/\*([^*]+)\*/g);
  return parts.map((part, i) =>
    // Odd indices are always the captured, emphasised groups — `split` with a
    // capturing regex alternates plain/matched/plain/matched/...
    i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>
  );
}

export default function FoundersNote() {
  return (
    <section className="founders-note">
      <div className="founders-note-grid">
        <p className="founders-note-label">
          Founder's
          <br />
          Note
        </p>

        <div className="founders-note-list">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="founders-note-item">
              <div className="founders-note-person">
                <img src={t.photo} alt={t.name} className="founders-note-photo" />
                <div className="founders-note-byline">
                  <p className="founders-note-name">{t.name}</p>
                  <p className="founders-note-title">{t.title}</p>
                </div>
                <img src="/about-signature.png" alt="" className="founders-note-signature" />
              </div>

              <div className="founders-note-quote-block">
                <img src="/about-quote.svg" alt="" className="founders-note-quote-icon" />
                <div className="founders-note-quote">
                  {t.quote.map((paragraph, i) => (
                    <p key={i}>{renderEmphasis(paragraph)}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
