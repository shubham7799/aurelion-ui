import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Preloader from './components/Preloader';
import Nav from './components/Nav';
import GuideLines from './components/GuideLines';
import Home from './pages/Home';
import Contact from './pages/Contact';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <BrowserRouter>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <Nav />
      <GuideLines />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
