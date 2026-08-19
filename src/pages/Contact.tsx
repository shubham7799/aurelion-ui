import { useState } from 'react';
import BookCall from '../components/BookCall';
import Footer from '../components/Footer';
import './Contact.css';

const SERVICES = [
  'Brand Identity',
  'Web Design & Development',
  'Motion & Animation',
  'Creative Direction',
  'Other',
];

export default function Contact() {
  const [message, setMessage] = useState('');

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-heading">Contact Us</h1>

          <div className="contact-info-col contact-info-write">
            <p className="contact-info-label">Write Us</p>
            <p className="contact-info-text">support@aurelion.com</p>
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
            <p className="contact-info-text">+91 - 9167873930</p>
          </div>
        </div>

        <div className="contact-hero-map" style={{ backgroundImage: 'url(/hero-contact.png)' }} />
      </section>

      <section className="contact-form-section">
        <div className="contact-form-grid">
          <h2 className="contact-heading">Send us a message</h2>

          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="contact-form-col contact-form-col-left">
              <div className="contact-field">
                <input type="text" placeholder="Name *" required />
              </div>
              <div className="contact-field">
                <input type="text" placeholder="Last name *" required />
              </div>
              <div className="contact-field">
                <input type="email" placeholder="Email *" required />
              </div>
              <div className="contact-field">
                <input type="tel" placeholder="Phone *" required />
              </div>
            </div>

            <div className="contact-form-col contact-form-col-right">
              <div className="contact-group">
                <p className="contact-group-label">
                  Is your project personal
                  <br />
                  or for your company?
                </p>
                <div className="contact-radio-group">
                  <label className="contact-radio">
                    <input type="radio" name="project-type" value="staff" />
                    <span className="contact-radio-dot" />
                    <span>Staff</span>
                  </label>
                  <label className="contact-radio">
                    <input type="radio" name="project-type" value="company" />
                    <span className="contact-radio-dot" />
                    <span>Company</span>
                  </label>
                </div>
              </div>

              <div className="contact-group">
                <p className="contact-group-label">Service you are interested in</p>
                <div className="contact-select-wrap">
                  <select defaultValue="" required>
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
              </div>

              <div className="contact-group">
                <p className="contact-group-label">Tell us what you need</p>
                <textarea
                  placeholder="Write your message *"
                  maxLength={400}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <span className="contact-char-count">
                  {message.length} / 400
                </span>
              </div>

              <label className="contact-checkbox">
                <input type="checkbox" required />
                <span className="contact-checkbox-box" />
                <span>
                  I agree to the <a href="/privacy">Privacy Policy</a>
                </span>
              </label>

              <button type="submit" className="contact-submit">
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

      <BookCall />
      <Footer />
    </div>
  );
}
