import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// User pages
import Home from './pages/user/Home';
import UserVehicles from './pages/user/Vehicles';
import VehicleDetail from './pages/user/VehicleDetail';
import BookingForm from './pages/user/BookingForm';
import MyBookings from './pages/user/MyBookings';
import Profile from './pages/user/Profile';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import VerifyIdentity from './pages/user/VerifyIdentity';
import Payment from './pages/user/Payment';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import AdminVehicles from './pages/admin/Vehicles';
import AdminVehicleDetail from './pages/admin/VehicleDetail';
import Bookings from './pages/admin/Bookings';
import Customers from './pages/admin/Customers';
import Branches from './pages/admin/Branches';
import Brands from './pages/admin/Brands';
import Models from './pages/admin/Models';
import Maintenance from './pages/admin/Maintenance';
import Reports from './pages/admin/Reports';

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="vehicles" element={<UserVehicles />} />
          <Route path="vehicles/:id" element={<VehicleDetail />} />
          <Route path="booking" element={<BookingForm />} />
          <Route path="payment/:id" element={<Payment />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Auth & Verification routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyIdentity />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="vehicles/:id" element={<AdminVehicleDetail />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="customers" element={<Customers />} />
          <Route path="branches" element={<Branches />} />
          <Route path="brands" element={<Brands />} />
          <Route path="models" element={<Models />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <p className="text-gray-600 mb-4">Trang không tồn tại</p>
            <a href="/" className="text-[#1B83A1] hover:underline">Quay về trang chủ</a>
          </div>
        </div>} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
