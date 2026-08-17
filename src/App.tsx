import { useState } from 'react';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <Home />
    </>
  );
}

export default App;
