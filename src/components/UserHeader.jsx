import { NavLink, useNavigate } from 'react-router-dom';
import { Home, CalendarCheck, User, Settings, LogOut } from 'lucide-react';

export default function UserHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl font-bold">
            <span className="text-[#1B83A1]">Xe</span>Now
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#1B83A1] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Home size={16} /> Trang chủ
          </NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#1B83A1] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <CalendarCheck size={16} /> Booking của tôi
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#1B83A1] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <User size={16} /> Tài khoản
          </NavLink>
          <button onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 ml-2">
            <Settings size={16} /> Admin
          </button>
          <button onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 ml-2">
            <LogOut size={16} /> Đăng xuất
          </button>
        </nav>
      </div>
    </header>
  );
}
