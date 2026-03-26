import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// User pages
import Home from './pages/user/Home';
import VehicleDetail from './pages/user/VehicleDetail';
import BookingForm from './pages/user/BookingForm';
import MyBookings from './pages/user/MyBookings';
import Profile from './pages/user/Profile';
import Login from './pages/user/Login';
import Register from './pages/user/Register';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import Vehicles from './pages/admin/Vehicles';
import Bookings from './pages/admin/Bookings';
import Customers from './pages/admin/Customers';
import Branches from './pages/admin/Branches';
import Maintenance from './pages/admin/Maintenance';
import Reports from './pages/admin/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="vehicles/:id" element={<VehicleDetail />} />
          <Route path="booking" element={<BookingForm />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="customers" element={<Customers />} />
          <Route path="branches" element={<Branches />} />
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
  );
}

export default App;
