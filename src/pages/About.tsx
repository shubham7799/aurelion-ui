import AboutHero from '../components/AboutHero';
import ServiceStack from '../components/ServiceStack';
import FounderStory from '../components/FounderStory';
import ApproachCarousel from '../components/ApproachCarousel';
import FoundersNote from '../components/FoundersNote';
import BookCall from '../components/BookCall';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="about-page">
      <AboutHero />
      {/* <ServiceStack /> */}
      <FounderStory />
      <ApproachCarousel />
      <FoundersNote />
      <BookCall />
      <Footer />
    </div>
  );
}
