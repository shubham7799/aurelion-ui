import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Nav.css';

const NAV_ITEMS = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Schedule a Call', highlight: true },
];

export default function Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Never leave the panel hanging open over a page it no longer belongs to.
  useEffect(() => setOpen(false), [pathname]);

  // The panel covers the screen, so the page behind it shouldn't scroll under it.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const go = (to?: string) => {
    setOpen(false);
    if (to) navigate(to);
  };

  return (
    <header className={`nav${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="nav-col nav-col-logo"
        aria-label="Aurelion — home"
        onClick={() => go('/')}
      >
        <img src="/loader-logo-fill.svg" alt="" className="nav-logo" />
      </button>

      {/* Only ever shown on narrow screens; the bar itself is the menu above that. */}
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="nav-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{open ? 'Close' : 'Menu'}</span>
        <span className="nav-item-marker" />
      </button>

      <div className="nav-items" id="nav-panel">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => go(item.to)}
            className={`nav-col nav-item${item.highlight ? ' nav-item-highlight' : ' nav-item-glass'}`}
          >
            <span>{item.label.toUpperCase()}</span>
            <span className="nav-item-marker" />
          </button>
        ))}
      </div>
    </header>
  );
}
