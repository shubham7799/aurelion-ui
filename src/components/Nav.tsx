import './Nav.css';

const NAV_ITEMS = [
  { label: 'About Us' },
  { label: 'Contact Us' },
  { label: 'Schedule a Call', highlight: true },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-col nav-col-logo">
        <img src="/loader-logo-fill.svg" alt="Aurelion" className="nav-logo" />
      </div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`nav-col nav-item${item.highlight ? ' nav-item-highlight' : ' nav-item-glass'}`}
        >
          <span>{item.label.toUpperCase()}</span>
          <span className="nav-item-marker" />
        </button>
      ))}
    </header>
  );
}
