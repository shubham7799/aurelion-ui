import { useNavigate } from 'react-router-dom';
import './Footer.css';

const SOCIAL_LINKS = [
  { name: 'Instagram', icon: '/footer-social-instagram.svg' },
  { name: 'X', icon: '/footer-social-x.svg' },
  { name: 'LinkedIn', icon: '/footer-social-linkedin.svg' },
  { name: 'YouTube', icon: '/footer-social-youtube.svg' },
];

const PARTNER_LOGOS = Array.from({ length: 16 }, (_, i) => `/partners/${String(i + 1).padStart(2, '0')}.svg`);

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-top">
        <img src="/footer-logo.svg" alt="Aurelion" className="footer-logo" />
        <nav className="footer-nav">
          <button type="button" onClick={() => navigate('/contact')}>
            Contact
          </button>
          <button type="button" onClick={() => navigate('/about')}>
            About
          </button>
        </nav>
      </div>

      <div className="footer-row">
        <p className="footer-tagline">
          We turn architectural designs into masterpiece interiors crafted by genius Italian artists.
        </p>
        <div className="footer-social">
          {SOCIAL_LINKS.map((social) => (
            <button key={social.name} type="button" aria-label={social.name} className="footer-social-icon">
              <img src={social.icon} alt="" />
            </button>
          ))}
        </div>
      </div>

      <div className="footer-partners">
        <span className="footer-partners-divider" />
        <p>Trusted Partners</p>
        <span className="footer-partners-divider" />
      </div>

      <div className="footer-partners-grid">
        {PARTNER_LOGOS.map((src) => (
          <img key={src} src={src} alt="Partner logo" className="footer-partner-logo" />
        ))}
      </div>

      <div className="footer-watermark">
        <img src="/footer-watermark.svg" alt="Aurelion" />
      </div>

      <div className="footer-bottom">
        <p>2026 © Aurelion</p>
        <div className="footer-legal">
          <button type="button">Cookie Policy</button>
          <button type="button">Privacy Policy</button>
        </div>
      </div>
    </footer>
  );
}
