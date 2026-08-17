import './Home.css';
import BookCall from '../components/BookCall';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="home">
      <section className="hero" style={{ backgroundImage: 'url(/hero.png)' }} />
      <BookCall />
      <Footer />
    </div>
  );
}
