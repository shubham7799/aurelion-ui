import './Home.css';
import Membership from '../components/Membership';
import ServiceStack from '../components/ServiceStack';
import IntroGrid from '../components/IntroGrid';
import AboutCarousel from '../components/AboutCarousel';
import CustomerStories from '../components/CustomerStories';
import NetworkPartners from '../components/NetworkPartners';
import BookCall from '../components/BookCall';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="home">
      <section className="hero" style={{ backgroundImage: 'url(/hero.png)' }} />
      <ServiceStack />
      <IntroGrid />
      <AboutCarousel />
      <CustomerStories />
      <NetworkPartners />
      <Membership />
      <BookCall />
      <Footer />
    </div>
  );
}
