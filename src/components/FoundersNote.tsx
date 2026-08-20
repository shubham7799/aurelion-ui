import './FoundersNote.css';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  photo: string;
}

// NOTE: both testimonials carry identical placeholder quote copy in the Figma
// source — presumably a draft that never got individual copy per founder.
// Reproduced as-is (names/titles/photos are real) rather than inventing quotes.
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Organizing a surprise family reunion while the client is overseas can be quite a challenge, but it's also an exciting opportunity to create lasting memories. From selecting the perfect location to coordinating every detail, the made ensure that this celebration will be truly unforgettable.",
    name: 'Deepali Mane',
    title: 'Founder, M.D',
    photo: '/about-founder-1.png',
  },
  {
    quote:
      "Organizing a surprise family reunion while the client is overseas can be quite a challenge, but it's also an exciting opportunity to create lasting memories. From selecting the perfect location to coordinating every detail, the made ensure that this celebration will be truly unforgettable.",
    name: 'Bholesing Girase',
    title: 'Co-Founder & COO',
    photo: '/about-founder-2.png',
  },
];

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
                <p className="founders-note-quote">{t.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
