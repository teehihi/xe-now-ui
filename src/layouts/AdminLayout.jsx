import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const pageMeta = {
  '/admin':             { title: 'Dashboard',          subtitle: 'Tổng quan hệ thống XeNow' },
  '/admin/vehicles':    { title: 'Quản lý xe',         subtitle: 'Quản lý danh sách phương tiện' },
  '/admin/bookings':    { title: 'Quản lý Booking',    subtitle: 'Quản lý đơn đặt xe' },
  '/admin/customers':   { title: 'Quản lý Khách hàng', subtitle: 'Quản lý thông tin khách hàng' },
  '/admin/branches':    { title: 'Quản lý Chi nhánh',  subtitle: 'Quản lý các điểm giao nhận xe' },
  '/admin/maintenance': { title: 'Quản lý Bảo trì',   subtitle: 'Lịch sử và kế hoạch bảo trì xe' },
  '/admin/reports':     { title: 'Báo cáo & Thống kê', subtitle: 'Phân tích doanh thu và hiệu suất kinh doanh' },
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const meta = pageMeta[pathname] ?? { title: 'Admin', subtitle: '' };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
