import './NetworkPartners.css';

// Elliptical ring from Figma node 357:308. The 17 badges are evenly spaced
// around an ellipse inside a 986 x 618.047 container; size and opacity ramp
// with depth so the far (upper) side of the ellipse recedes. Positions below
// are the Figma coordinates expressed as percentages of that container, so the
// ring keeps its shape at any width.
const RING_W = 986;
const RING_H = 618.047;

interface Badge {
  logo: string;
  /** Figma left/top of the badge box, in container px. */
  x: number;
  y: number;
  /** Badge diameter in container px. */
  size: number;
  opacity: number;
}

const BADGES: Badge[] = [
  { logo: '01.svg', x: 537.45, y: 37.89, size: 62.476, opacity: 0.11 },
  { logo: '02.svg', x: 430.56, y: 52.75, size: 61.422, opacity: 0.1 },
  { logo: '03.svg', x: 327.98, y: 87.91, size: 61.621, opacity: 0.1 },
  { logo: '04.svg', x: 234.09, y: 142.49, size: 63.099, opacity: 0.12 },
  { logo: '05.svg', x: 156.41, y: 217.76, size: 66.065, opacity: 0.18 },
  { logo: '06.svg', x: 112.52, y: 314.46, size: 70.877, opacity: 0.32 },
  { logo: '07.svg', x: 134.1, y: 414.57, size: 77.059, opacity: 0.54 },
  { logo: '08.svg', x: 215.69, y: 478.39, size: 82.214, opacity: 0.75 },
  { logo: '09.svg', x: 318.91, y: 502.94, size: 85.484, opacity: 0.9 },
  { logo: '10.svg', x: 426.34, y: 499.48, size: 87.208, opacity: 0.98 },
  { logo: '11.svg', x: 531.57, y: 474.2, size: 87.629, opacity: 1 },
  { logo: '12.svg', x: 630.46, y: 429.37, size: 86.804, opacity: 0.96 },
  { logo: '13.svg', x: 717.57, y: 364.7, size: 84.621, opacity: 0.86 },
  { logo: '14.svg', x: 781.64, y: 278.4, size: 80.772, opacity: 0.69 },
  { logo: '15.svg', x: 796.41, y: 175.24, size: 75.064, opacity: 0.46 },
  { logo: '16.svg', x: 739.89, y: 89.99, size: 69.117, opacity: 0.26 },
  // The ring has 17 slots but the project ships 16 partner marks, so the
  // faintest slot at the back reuses the first.
  { logo: '01.svg', x: 643.94, y: 47.33, size: 64.93, opacity: 0.16 },
];

const pct = (value: number, basis: number) => `${(value / basis) * 100}%`;

export default function NetworkPartners() {
  return (
    <section className="network-partners">
      <div className="network-partners-grid">
        <p className="network-partners-label">
          <span>Our Network</span>
          <span>&amp; Partners</span>
        </p>

        <div className="network-partners-ring">
          <h2 className="network-partners-heading">
            The world’s best hospitality services right under our hood
          </h2>

          {BADGES.map((badge, i) => (
            <span
              key={badge.logo + i}
              className="network-partners-badge"
              style={{
                left: pct(badge.x, RING_W),
                top: pct(badge.y, RING_H),
                width: pct(badge.size, RING_W),
                opacity: badge.opacity,
              }}
            >
              <img src={`/partners/${badge.logo}`} alt="" className="network-partners-logo" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
