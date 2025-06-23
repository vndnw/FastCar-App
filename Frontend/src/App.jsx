import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserLayout from './components/layout/UserLayout';
import HeroSection from './components/HeroSection/HeroSection';
import Home from './views/Home/Home';
import About from './views/About/About';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import CarListing from './views/CarListing/CarListing';
import CarDetail from './views/CarDetail/CarDetail';

// Admin
import Dashboard from "./views/admin/Home";
import Tables from "./views/admin/Tables";
import Billing from "./views/admin/Billing";
import Profile from "./views/admin/Profile";
import Users from "./views/admin/Users";
import Discount from "./views/admin/Discount";
import CarBrand from "./views/admin/CarBrand";
import Cars from "./views/admin/Cars";
import Main from "./components/admin/layout/Main";
import OwnerCar from './views/OwnerCar/OwnerCar';
import MyTrips from './views/MyTrips/MyTrips';


function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Layout cho trang người dùng */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<><HeroSection /><Home /></>} />
          <Route path="/about" element={<About />} />
          <Route path="/owner-car" element={<OwnerCar />} />
          <Route path="/my-trips" element={<MyTrips />} />
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/xe-co-ngay" element={<CarListing />} />
          <Route path="/car-detail/:carId" element={<CarDetail />} />
        </Route>
        {/* Layout cho trang admin */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <Main />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tables" element={<Tables />} />
          <Route path="billing" element={<Billing />} />
          <Route path="profile" element={<Profile />} />
          <Route path="users" element={<Users />} />
          <Route path="discount" element={<Discount />} />
          <Route path="car-brand" element={<CarBrand />} />
          <Route path="cars" element={<Cars />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Fallback nếu route không khớp */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
