import './Home.css';
import Membership from '../components/Membership';
import AboutCarousel from '../components/AboutCarousel';
import BookCall from '../components/BookCall';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="home">
      <section className="hero" style={{ backgroundImage: 'url(/hero.png)' }} />
      <AboutCarousel />
      <Membership />
      <BookCall />
      <Footer />
    </div>
  );
}
