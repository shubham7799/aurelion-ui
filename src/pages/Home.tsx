import './Home.css';
import Membership from '../components/Membership';
import BookCall from '../components/BookCall';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="home">
      <section className="hero" style={{ backgroundImage: 'url(/hero.png)' }} />
      <Membership />
      <BookCall />
      <Footer />
    </div>
  );
}
