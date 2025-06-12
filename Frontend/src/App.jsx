import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home/Home';
import Navbar from './components/Navbar/Navbar';
import About from './views/About/About';
import City from './views/Locations/City';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Footer from './components/Footer/Footer';
import HeroSection from './components/HeroSection/HeroSection';
import Login from './components/Login/Login';
import Register from './components/Login/Register';


// === THÊM IMPORT CHO CARLIST PAGE ===
import CarListing from './views/CarListing/CarListing';

function App() {
  return (
    <>
      <div className="app">
        <Navbar />

        <div className="content">
          <Routes>
            <Route path="/" element={<><HeroSection /><Home /></>} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/:cityName" element={<><HeroSection /><City /></>} />

            {/* === THÊM ROUTE MỚI CHO CAR LISTING === */}
            <Route path="/xe-co-ngay" element={<CarListing />} />
          </Routes>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;
