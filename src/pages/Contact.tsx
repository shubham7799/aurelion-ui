import { useState } from 'react';
import BookCall from '../components/BookCall';
import Footer from '../components/Footer';
import './Contact.css';

// const SERVICES = [
//   'Brand Identity',
//   'Web Design & Development',
//   'Motion & Animation',
//   'Creative Direction',
//   'Other',
// ];

/**
 * URL of the mail-sending endpoint. This is a plain URL and nothing else —
 * never a mailbox password, SMTP host or API secret. Create React App inlines
 * every REACT_APP_* value into the public bundle, so anything put here is
 * readable by any visitor. The credentials belong to that endpoint's own
 * server-side environment.
 */
const ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT ?? '/api/contact';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  projectType: '',
  service: '',
  message: '',
  consent: false,
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const update = <K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setError('');

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        // Surface the server's own reason when it sends one, so a misconfigured
        // mail relay doesn't just read as a generic failure. Anything else —
        // a dropped connection, DNS failure — reports as raw browser text like
        // "Failed to fetch", which is noise to a visitor, so it falls back to
        // the friendly copy below.
        const body = await response.json().catch(() => null);
        setStatus('error');
        setError(typeof body?.message === 'string' ? body.message : '');
        return;
      }

      setStatus('sent');
      setForm(EMPTY_FORM);
    } catch {
      setStatus('error');
      setError('');
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-heading">Contact Us</h1>

          <div className="contact-info-col contact-info-write">
            <p className="contact-info-label">Write Us</p>
            <p className="contact-info-text">contact@aurelionlm.com</p>
          </div>

          <div className="contact-info-col contact-info-office">
            <p className="contact-info-label">Sales Office</p>
            <p className="contact-info-text">
              At S no -46, A/Wing, 5th floor, Flat no-14, Rokade Heights, near Ideal Colony metro
              station, next to-Yena bungalow, Paud road, Erandwane, Kothrud-Pune-411038
            </p>
          </div>

          <div className="contact-info-col contact-info-call">
            <p className="contact-info-label">Call Us On</p>
            <p className="contact-info-text">+91 - 7219312755</p>
          </div>
        </div>

        <div
          className="contact-hero-map"
          data-guide-media
          style={{ backgroundImage: 'url(/hero-contact.webp)' }}
        />
      </section>

      <section className="contact-form-section">
        <div className="contact-form-grid">
          <h2 className="contact-heading">Send us a message</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-col contact-form-col-left">
              <div className="contact-field">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Name *"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="contact-field">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name *"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  required
                />
              </div>
              <div className="contact-field">
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                />
              </div>
              <div className="contact-field">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone *"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="contact-form-col contact-form-col-right">
              <div className="contact-group">
                <p className="contact-group-label">
                  Is your INQUIRY personal
                  <br />
                  or for SOMEONE ELSE?
                </p>
                <div className="contact-radio-group">
                  <label className="contact-radio">
                    <input
                      type="radio"
                      name="projectType"
                      value="self"
                      checked={form.projectType === 'self'}
                      onChange={(e) => update('projectType', e.target.value)}
                    />
                    <span className="contact-radio-dot" />
                    <span>MYSELF</span>
                  </label>
                  <label className="contact-radio">
                    <input
                      type="radio"
                      name="projectType"
                      value="other"
                      checked={form.projectType === 'other'}
                      onChange={(e) => update('projectType', e.target.value)}
                    />
                    <span className="contact-radio-dot" />
                    <span>ON SOMEONE’s BEHALF </span>
                  </label>
                </div>
              </div>

              {/* <div className="contact-group">
                <p className="contact-group-label">Service you are interested in</p>
                <div className="contact-select-wrap">
                  <select
                    name="service"
                    value={form.service}
                    onChange={(e) => update('service', e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {SERVICES.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  <img src="/chevron-down.svg" alt="" className="contact-select-chevron" />
                </div>
              </div> */}

              <div className="contact-group">
                <p className="contact-group-label">Tell us what you need</p>
                <textarea
                  name="message"
                  placeholder="Write your message *"
                  maxLength={400}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  required
                />
                <span className="contact-char-count">{form.message.length} / 400</span>
              </div>

              <label className="contact-checkbox">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={(e) => update('consent', e.target.checked)}
                  required
                />
                <span className="contact-checkbox-box" />
                <span>
                  I agree to the <a href="/privacy">Privacy Policy</a>
                </span>
              </label>

              <button type="submit" className="contact-submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send'}
              </button>

              {status === 'sent' && (
                <p className="contact-status contact-status-sent" role="status">
                  Thank you — your message is on its way. We'll be in touch shortly.
                </p>
              )}
              {status === 'error' && (
                <p className="contact-status contact-status-error" role="alert">
                  {error || "We couldn't send that just now. Please try again."}
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      <BookCall />
      <Footer />
    </div>
  );
}
