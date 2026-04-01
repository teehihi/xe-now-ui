import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Car, CalendarCheck, Users, MapPin,
  Wrench, BarChart2, ArrowLeft, Award, Activity, Shield, Key, UserCheck
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/vehicles', label: 'Quản lý xe', icon: Car },
  { to: '/admin/brands', label: 'Hãng xe', icon: Award },
  { to: '/admin/models', label: 'Mẫu xe', icon: Activity },
  { to: '/admin/bookings', label: 'Quản lý booking', icon: CalendarCheck },
  { to: '/admin/customers', label: 'Khách hàng', icon: Users },
  { to: '/admin/branches', label: 'Chi nhánh', icon: MapPin },
  { to: '/admin/maintenance', label: 'Bảo trì', icon: Wrench },
  { to: '/admin/reports', label: 'Báo cáo', icon: BarChart2 },
];

const systemItems = [
  { to: '/admin/roles', label: 'Vai trò', icon: Shield },
  { to: '/admin/permissions', label: 'Phân quyền', icon: Key },
  { to: '/admin/users', label: 'Người dùng', icon: UserCheck },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  return (
    <aside className="w-72 h-screen bg-[#1E293B] flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-[93px] flex items-center justify-center px-6 border-b border-[#617699] gap-3">
        <img src="/images/logo.webp" alt="XeNow" className="h-24 brightness-0 invert" onError={(e) => {
          e.target.style.display = 'none';
        }} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-sm font-medium transition-colors ${isActive
                ? 'bg-[#1B83A1] text-white'
                : 'text-[#CAD5E2] hover:bg-white/10'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}

        {/* System divider */}
        <div className="pt-4 pb-2 px-4">
          <p className="text-[10px] uppercase tracking-widest text-[#617699] font-bold">Hệ thống</p>
        </div>

        {systemItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-sm font-medium transition-colors ${isActive
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
