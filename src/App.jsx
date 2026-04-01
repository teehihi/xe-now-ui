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
import VnpayReturn from './pages/user/VnpayReturn';

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
import Roles from './pages/admin/Roles';
import Permissions from './pages/admin/Permissions';
import AdminUsers from './pages/admin/Users';

// Error pages
import NotFound from './pages/error/NotFound';
import Forbidden from './pages/error/Forbidden';
import Unauthorized from './pages/error/Unauthorized';

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
          <Route path="/vnpay-return" element={<VnpayReturn />} />

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
            <Route path="roles" element={<Roles />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Error routes */}
          <Route path="/401" element={<Unauthorized />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
