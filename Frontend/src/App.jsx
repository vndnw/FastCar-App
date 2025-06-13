import { Route, Routes, Navigate } from 'react-router-dom';
import UserLayout from './components/layout/UserLayout';
import HeroSection from './components/HeroSection/HeroSection';
import Home from './views/Home/Home';
import About from './views/About/About';
import City from './views/Locations/City';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import CarListing from './views/CarListing/CarListing';
import CarDetail from './views/CarDetail/CarDetail';

// Admin
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
    <Routes>

      {/* Layout cho trang người dùng */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<><HeroSection /><Home /></>} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:cityName" element={<><HeroSection /><City /></>} />
        <Route path="/xe-co-ngay" element={<CarListing />} />
        <Route path="/car-detail/:carId" element={<CarDetail />} />
      </Route>

      {/* Layout cho trang admin */}
      <Route path="/admin" element={<Main />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tables" element={<Tables />} />
        <Route path="billing" element={<Billing />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Fallback nếu route không khớp */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
