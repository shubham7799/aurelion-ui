import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Nav.css';

/** Scroll movement that has to accumulate before the bar reacts, in px. */
const SCROLL_THRESHOLD = 8;
/** Above this point the bar is always shown, whichever way the page is going. */
const ALWAYS_SHOWN_ABOVE = 80;

const MEMBER_PORTAL_URL = 'https://mindescapes.club/aurelion';

const NAV_ITEMS = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  // An external member portal, not a page of this site, so it opens in its
  // own tab rather than navigating away from the one the visitor is on.
  { label: 'Member Access', href: MEMBER_PORTAL_URL, highlight: true },
];

export default function Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Never leave the panel hanging open over a page it no longer belongs to.
  useEffect(() => setOpen(false), [pathname]);

  // The bar retracts on the way down the page and returns on the way up, so it
  // is out of the way while reading but never more than a flick away.
  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      // `last` only moves once the threshold is met, so a slow drag still
      // accumulates into a decision instead of being ignored forever.
      if (Math.abs(delta) < SCROLL_THRESHOLD) return;
      last = y;
      setHidden(delta > 0 && y > ALWAYS_SHOWN_ABOVE);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    // Whatever the page was doing, an open panel keeps its own bar on screen.
    <header className={`nav${open ? ' is-open' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
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
        {NAV_ITEMS.map((item) => {
          const className = `nav-col nav-item${item.highlight ? ' nav-item-highlight' : ' nav-item-glass'}`;
          const content = (
            <>
              <span>{item.label.toUpperCase()}</span>
              <span className="nav-item-marker" />
            </>
          );

          // The member portal lives outside this site, so it's a real link
          // (new tab) rather than a button that hands off to react-router.
          return 'href' in item ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={className}
            >
              {content}
            </a>
          ) : (
            <button key={item.label} type="button" onClick={() => go(item.to)} className={className}>
              {content}
            </button>
          );
        })}
      </div>
    </header>
  );
}
