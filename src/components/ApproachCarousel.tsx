import DataCarousel, { CarouselSlide } from './DataCarousel';

const HEADING = 'What is the approach \nlike at Aurelion';

// Own imagery now (about-carousel-slide-*.png) rather than borrowing the
// homepage carousel's — the tab descriptions are real copy; the heading above
// is shared by every slide, so it lives on the carousel rather than each one.
// Each also has its own mobile crop (about-carousel-slide-m*.png).
const SLIDES: CarouselSlide[] = [
  {
    number: '01',
    label: 'TRUST',
    tabDescription:
      'We build relationships through reliability, honesty and consistency — earning the confidence our members place in us.',
    image: '/about-carousel-slide-1.webp',
    mobileImage: '/about-carousel-slide-m1.webp',
  },
  {
    number: '02',
    label: 'DISCRETION',
    tabDescription:
      'We respect privacy and handle every request with sensitivity, confidentiality and quiet professionalism.',
    image: '/about-carousel-slide-2.webp',
    mobileImage: '/about-carousel-slide-m2.webp',
  },
  {
    number: '03',
    label: 'PERSONALISATION',
    tabDescription:
      'We understand that every member is different. Our approach is shaped around their individual preferences, needs and way of life.',
    image: '/about-carousel-slide-3.webp',
    mobileImage: '/about-carousel-slide-m3.webp',
  },
  {
    number: '04',
    label: 'OWNERSHIP',
    tabDescription:
      'Once something is entrusted to us, we take responsibility for it from beginning to end. Our members should never have to chase or manage what they have entrusted to Aurelion.',
    image: '/about-carousel-slide-4.webp',
    mobileImage: '/about-carousel-slide-m4.webp',
  },
];

export default function ApproachCarousel() {
  return <DataCarousel heading={HEADING} slides={SLIDES} intervalMs={6000} />;
}
