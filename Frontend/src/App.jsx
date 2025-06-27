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
import Booking from './views/Booking/Booking';
import PaymentCallback from './views/PaymentStatus/PaymentCallback';
import PaymentSuccess from './views/PaymentStatus/PaymentSuccess';
import PaymentFailure from './views/PaymentStatus/PaymentFailure';


// Admin
import Dashboard from "./views/admin/Home";
import Users from "./views/admin/Users";
import AdminNotFound from "./views/admin/AdminNotFound";
import UserDetail from "./views/admin/UserDetail";
import UserEdit from "./views/admin/UserEdit";
import Discount from "./views/admin/Discount";
import CarBrand from "./views/admin/CarBrand";
import Cars from "./views/admin/Cars";
import Bookings from "./views/admin/Bookings";
import BookingDetail from "./views/admin/BookingDetail";
import Main from "./components/admin/layout/Main";
import CarEdit from "./views/admin/CarEdit";
import CarDetailAdmin from "./views/admin/CarDetail";


import OwnerCar from './views/OwnerCar/OwnerCar';
import MyTrips from './views/MyTrips/MyTrips';

import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import { BookingProvider } from './contexts/BookingContext';
import { CarProvider } from './contexts/CarContext';


function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <CarProvider>
          <Routes>
            {/* Layout cho trang người dùng */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<><HeroSection /><Home /></>} />
              <Route path="/about" element={<About />} />
              <Route path="/owner-car" element={<OwnerCar />} />
              <Route path="/booking/:carId" element={<Booking />} />
              <Route path="/payment-callback" element={<PaymentCallback />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />
              <Route path="/my-trips" element={<MyTrips />} />
              <Route path="/login" element={
                <RedirectIfAuthenticated>
                  <Login />
                </RedirectIfAuthenticated>
              }
              />
              <Route path="/register" element={
                <RedirectIfAuthenticated>
                  <Register />
                </RedirectIfAuthenticated>
              }
              />
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
              <Route path="users" element={<Users />} />
              <Route path="users/:userId" element={<UserDetail />} />
              <Route path="users/edit/:userId" element={<UserEdit />} />
              <Route path="discount" element={<Discount />} />
              <Route path="car-brand" element={<CarBrand />} />
              <Route path="cars" element={<Cars />} />
              <Route path="cars/:carId" element={<CarDetailAdmin />} />
              <Route path="cars/edit/:carId" element={<CarEdit />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="bookings/:bookingId" element={<BookingDetail />} />
              <Route path="*" element={<AdminNotFound />} />
            </Route>


            {/* Fallback nếu route không khớp */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CarProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
