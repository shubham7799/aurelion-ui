import DataCarousel, { CarouselSlide } from './DataCarousel';

const HEADING = 'You ask.\nWe take it from there.';

// NOTE: only slides 1–2 ("Quick Call", "Manager") have real Figma designs.
// "Global Network" and "Problem Solved" reuse existing project imagery and
// placeholder copy in the same voice, pending real designs for those two.
const SLIDES: CarouselSlide[] = [
  { number: '01', label: 'REQUEST', image: '/carousel-slide-1.png', tabDescription: 'Tell us what matters. Once we understand the context, your preferences and timing, we take it forward.' },
  { number: '02', label: 'ORCHESTRATE', image: '/carousel-slide-2.png', tabDescription: 'We find, coordinate, confirm and carry the details across people and providers.' },
  { number: '03', label: 'RESOLVE', image: '/carousel-slide-3.png', tabDescription: 'If the plan changes, we stay with it until the outcome is safely in hand.' },
];

export default function AboutCarousel() {
  return <DataCarousel heading={HEADING} slides={SLIDES} intervalMs={6000} />;
}
