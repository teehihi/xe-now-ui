import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Car, CalendarCheck, Users, MapPin,
  Wrench, BarChart2, ArrowLeft
} from 'lucide-react';

const navItems = [
  { to: '/admin',           label: 'Dashboard',       icon: LayoutDashboard, end: true },
  { to: '/admin/vehicles',  label: 'Quản lý xe',      icon: Car },
  { to: '/admin/bookings',  label: 'Quản lý booking', icon: CalendarCheck },
  { to: '/admin/customers', label: 'Khách hàng',      icon: Users },
  { to: '/admin/branches',  label: 'Chi nhánh',       icon: MapPin },
  { to: '/admin/maintenance',label: 'Bảo trì',        icon: Wrench },
  { to: '/admin/reports',   label: 'Báo cáo',         icon: BarChart2 },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  return (
    <aside className="w-72 min-h-screen bg-[#1E293B] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-[93px] flex items-center px-6 border-b border-[#617699]">
        <img src="/images/logo.webp" alt="XeNow" className="h-8 brightness-0 invert mr-2" onError={(e) => {
          e.target.style.display = 'none';
        }} />
        <span className="text-white text-2xl font-bold tracking-wide">
          <span className="text-[#1B83A1]">Xe</span>Now
        </span>
        <span className="ml-2 text-[#617699] text-xs">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#1B83A1] text-white'
                  : 'text-[#CAD5E2] hover:bg-white/10'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Back to user */}
      <div className="px-4 py-4 border-t border-[#1D293D]">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#CAD5E2] hover:bg-white/10 w-full transition-colors"
        >
          <ArrowLeft size={16} />
          Về trang User
        </button>
      </div>
    </aside>
  );
}
