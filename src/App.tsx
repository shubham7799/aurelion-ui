import { useState } from 'react';
import Preloader from './components/Preloader';
import Nav from './components/Nav';
import GuideLines from './components/GuideLines';
import Home from './pages/Home';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <Nav />
      <GuideLines />
      <Home />
    </>
  );
}

export default App;
