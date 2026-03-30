import { useEffect, useState } from 'react';
import { Car, CalendarCheck, Users, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const statCards = [
  { label: 'Tổng số xe', value: '10', sub: '8 khả dụng', icon: Car, bg: 'bg-blue-50', iconBg: 'bg-[#1B83A1]' },
  { label: 'Tổng booking', value: '3', sub: '1 chờ duyệt', icon: CalendarCheck, bg: 'bg-green-50', iconBg: 'bg-green-500' },
  { label: 'Khách hàng', value: '3', sub: '', icon: Users, bg: 'bg-purple-50', iconBg: 'bg-purple-500' },
  { label: 'Doanh thu tháng này', value: '4,6 Tr ₫', sub: '', icon: TrendingUp, bg: 'bg-orange-50', iconBg: 'bg-orange-500' },
];

const vehicleStatus = [
  { label: 'Sẵn sàng', count: 8, color: '#10B981' },
  { label: 'Đang thuê', count: 1, color: '#F59E0B' },
  { label: 'Bảo trì', count: 1, color: '#EF4444' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        // ApiResponse structure: { success, message, data: stats }
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
    </div>
  );

  const totalRevenue = stats.recentBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const statCards = [
    { label: 'Tổng số xe', value: stats.totalVehicles, sub: `${stats.availableVehicles} khả dụng`, icon: Car, bg: 'bg-blue-50', iconBg: 'bg-[#1B83A1]' },
    { label: 'Tổng booking', value: stats.recentBookings.length, sub: `${stats.pendingBookings} chờ duyệt`, icon: CalendarCheck, bg: 'bg-green-50', iconBg: 'bg-green-500' },
    { label: 'Đang thuê', value: stats.ongoingBookings, sub: '', icon: Users, bg: 'bg-purple-50', iconBg: 'bg-purple-500' },
    { label: 'Tổng doanh thu', value: `${totalRevenue.toLocaleString('vi-VN')} ₫`, sub: '', icon: TrendingUp, bg: 'bg-orange-50', iconBg: 'bg-orange-500' },
  ];

  const vehicleStatus = [
    { label: 'Sẵn sàng', count: stats.availableVehicles, color: '#10B981' },
    { label: 'Bận', count: stats.totalVehicles - stats.availableVehicles, color: '#F59E0B' },
  ];

  const bookings = stats.recentBookings;
  const revenueData = []; // Placeholder for chart data
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${s.iconBg} flex items-center justify-center`}>
                <s.icon size={22} className="text-white" />
              </div>
              {s.sub && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{s.sub}</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue line chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Doanh thu 6 tháng</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => `${v / 1000000}M`} />
              <Tooltip formatter={v => [`${(v / 1000000).toFixed(1)} Tr ₫`, 'Doanh thu']} />
              <Line type="monotone" dataKey="revenue" stroke="#1B83A1" strokeWidth={2.5} dot={{ r: 4, fill: '#1B83A1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Booking bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Số lượng booking</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip formatter={v => [v, 'Booking']} />
              <Bar dataKey="bookings" fill="#1B83A1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Trạng thái xe</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={vehicleStatus} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                  {vehicleStatus.map((s) => <Cell key={s.label} fill={s.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {vehicleStatus.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-8">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                    <span className="text-sm text-gray-600">{s.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Booking gần đây</h3>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.bookingId} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">{b.vehicleModel}</p>
                  <p className="text-xs text-gray-500">{b.customerName}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-sm text-gray-600">{(b.totalPrice || 0).toLocaleString('vi-VN')} ₫</span>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
