import { useNavigate } from 'react-router-dom';
import './Nav.css';

const NAV_ITEMS = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Schedule a Call', highlight: true },
];

export default function Nav() {
  const navigate = useNavigate();

  return (
    <header className="nav">
      <button
        type="button"
        className="nav-col nav-col-logo"
        aria-label="Aurelion — home"
        onClick={() => navigate('/')}
      >
        <img src="/loader-logo-fill.svg" alt="" className="nav-logo" />
      </button>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={item.to ? () => navigate(item.to) : undefined}
          className={`nav-col nav-item${item.highlight ? ' nav-item-highlight' : ' nav-item-glass'}`}
        >
          <span>{item.label.toUpperCase()}</span>
          <span className="nav-item-marker" />
        </button>
      ))}
    </header>
  );
}
