import './Home.css';
import BookCall from '../components/BookCall';

export default function Home() {
  return (
    <div className="home">
      <section className="hero" style={{ backgroundImage: 'url(/hero.png)' }} />
      <BookCall />
    </div>
  );
}
