import DataCarousel, { CarouselSlide } from './DataCarousel';

// NOTE: only slides 1–2 ("Quick Call", "Manager") have real Figma designs.
// "Global Network" and "Problem Solved" reuse existing project imagery and
// placeholder copy in the same voice, pending real designs for those two.
const SLIDES: CarouselSlide[] = [
  {
    number: '01',
    label: 'REQUEST',
    heading: 'You ask. We take it from there.',
    description: 'Every request begins with understanding. From the first conversation to the final outcome, Aurelion takes ownership, coordinates what is needed and stays with it until it is done.',
    image: '/carousel-slide-1.png',
  },
  {
    number: '02',
    label: 'ORCHESTRATE',
    heading: 'You ask. We take it from there.',
    description: 'Every request begins with understanding. From the first conversation to the final outcome, Aurelion takes ownership, coordinates what is needed and stays with it until it is done.',
    image: '/carousel-slide-2.png',
  },
  {
    number: '03',
    label: 'RESOLVE',
    heading: "You ask. We take it from there.",
    description: 'Every request begins with understanding. From the first conversation to the final outcome, Aurelion takes ownership, coordinates what is needed and stays with it until it is done.',
    image: '/hero.png',
  }
];

export default function AboutCarousel() {
  return <DataCarousel slides={SLIDES} intervalMs={6000} />;
}
