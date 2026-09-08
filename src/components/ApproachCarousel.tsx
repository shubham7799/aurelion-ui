import DataCarousel, { CarouselSlide } from './DataCarousel';

// Same reusable tab set/imagery as the homepage's carousel (AboutCarousel.tsx) —
// only slide 1's heading/description are page-specific here. Slides 2–4 still
// don't have real designs of their own, so they reuse the same placeholders.
const SLIDES: CarouselSlide[] = [
  {
    number: '01',
    label: 'Quick Call',
    heading: 'What is the approach like at Aurelion',
    description: 'The Cambrian. Perfect for spa days, families, and alpine adventures.',
    tabDescription:
      'We turn architectural designs into masterpiece interiors crafted by genius Italian artists.',
    image: '/carousel-slide-1.png',
  },
  {
    number: '02',
    label: 'Manager',
    heading: 'What is the approach like at Aurelion',
    description: 'The Cambrian. Perfect for spa days, families, and alpine adventures.',
    tabDescription:
      'We respect privacy and handle every request with sensitivity, confidentiality and quiet professionalism.',
    image: '/carousel-slide-2.png',
  },
  {
    number: '03',
    label: 'PERSONALISATION',
    heading: "What is the approach like at Aurelion",
    description: 'The Cambrian. Perfect for spa days, families, and alpine adventures.',
    tabDescription:
      'We understand that every member is different. Our approach is shaped around their individual preferences, needs and way of life.',
    image: '/hero.png',
  },
  {
    number: '04',
    label: 'OWNERSHIP',
    heading: 'What is the approach like at Aurelion',
    description: 'The Cambrian. Perfect for spa days, families, and alpine adventures.',
    tabDescription:
      'Once something is entrusted to us, we take responsibility for it from beginning to end. Our members should never have to chase or manage what they have entrusted to Aurelion.',
    image: '/book-call.png',
  },
];

export default function ApproachCarousel() {
  return <DataCarousel slides={SLIDES} intervalMs={6000} />;
}
