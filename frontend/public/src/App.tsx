import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Program from './pages/Program';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/program" element={<Program />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
    </Routes>
    </Router>
  );
}
