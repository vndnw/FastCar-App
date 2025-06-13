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

// === THÊM IMPORT CHO CAR DETAIL PAGE ===
import CarDetail from './views/CarDetail/CarDetail';


import { Navigate } from "react-router-dom";
import Dashboard from "./views/admin/Home";
import Tables from "./views/admin/Tables";
import Billing from "./views/admin/Billing";
import Profile from "./views/admin/Profile";
import Main from "./components/admin/layout/Main";
import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";


function App() {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          {/* Client routes */}
          <Route path="/" element={<><HeroSection /><Home /></>} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:cityName" element={<><HeroSection /><City /></>} />
          <Route path="/xe-co-ngay" element={<CarListing />} />
          <Route path="/car-detail/:carId" element={<CarDetail />} />          {

          /* Admin routes with layout */}
          <Route path="/admin" element={<Main />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tables" element={<Tables />} />
            <Route path="billing" element={<Billing />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;