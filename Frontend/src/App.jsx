import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Contact from './views/Contact/Contact';
import About from './views/About/About';
import City from './views/Locations/City';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      <div className="app">
        <Navbar />
        <div style={{ height: '120px' }} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/:cityName" element={<City />} />
          </Routes>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;
