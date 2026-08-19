import DataCarousel, { CarouselSlide } from './DataCarousel';

// NOTE: only slides 1–2 ("Quick Call", "Manager") have real Figma designs.
// "Global Network" and "Problem Solved" reuse existing project imagery and
// placeholder copy in the same voice, pending real designs for those two.
const SLIDES: CarouselSlide[] = [
  {
    number: '01',
    label: 'Quick Call',
    heading: 'What goes in the backend of things',
    description: 'The Aurelion. Perfect for hectic days, families, and alpine adventures.',
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

export default function AboutCarousel() {
  return <DataCarousel slides={SLIDES} intervalMs={6000} />;
}
