import DataCarousel, { CarouselSlide } from './DataCarousel';

// Same reusable tab set/imagery as the homepage's carousel (AboutCarousel.tsx) —
// only slide 1's heading/description are page-specific here. Slides 2–4 still
// don't have real designs of their own, so they reuse the same placeholders.
const SLIDES: CarouselSlide[] = [
  {
    number: '01',
    label: 'Quick Call',
    heading: 'What is the approach like at Aurelion',
    description: 'A considered approach to every detail, from first call to final farewell.',
    image: '/carousel-slide-1.png',
  },
  {
    number: '02',
    label: 'Manager',
    heading: 'Same view, different vibe.',
    description: 'The Cambrian. Perfect for spa days, families, and alpine adventures.',
    image: '/carousel-slide-2.png',
  },
  {
    number: '03',
    label: 'Global Network',
    heading: "Everywhere you go, we've been before.",
    description: 'The Aurelion Network. Perfect for seamless transitions, families, and alpine adventures.',
    image: '/hero.png',
  },
  {
    number: '04',
    label: 'Problem Solved',
    heading: 'One call handles everything else.',
    description: 'The Concierge. Perfect for peace of mind, families, and alpine adventures.',
    image: '/book-call.png',
  },
];

export default function ApproachCarousel() {
  return <DataCarousel slides={SLIDES} intervalMs={6000} />;
}
