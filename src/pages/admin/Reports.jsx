import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { revenueData, vehicleTypeRevenue, topVehicles } from '../../data/mockData';
import { TrendingUp, CalendarCheck, BarChart2, Download } from 'lucide-react';

const summaryCards = [
  { label: 'Tổng doanh thu', value: '2,3 T ₫', sub: '+12% so với kỳ trước', icon: TrendingUp, bg: 'bg-blue-50 border-blue-200' },
  { label: 'Tổng booking', value: '440', sub: '+8% so với kỳ trước', icon: CalendarCheck, bg: 'bg-green-50 border-green-200' },
  { label: 'TB doanh thu/tháng', value: '390 Tr ₫', sub: '6 tháng gần đây', icon: BarChart2, bg: 'bg-purple-50 border-purple-200' },
  { label: 'TB booking/tháng', value: '73', sub: '6 tháng gần đây', icon: BarChart2, bg: 'bg-orange-50 border-orange-200' },
];

const typeStats = [
  { type: 'Sedan', count: 4, revenue: '850 Tr ₫', avg: '213 Tr ₫', color: '#1B83A1' },
  { type: 'SUV', count: 3, revenue: '1,2 T ₫', avg: '400 Tr ₫', color: '#10B981' },
  { type: 'MPV', count: 2, revenue: '680 Tr ₫', avg: '340 Tr ₫', color: '#F59E0B' },
  { type: 'Pickup', count: 1, revenue: '450 Tr ₫', avg: '450 Tr ₫', color: '#EF4444' },
  { type: 'Luxury', count: 2, revenue: '1,5 T ₫', avg: '750 Tr ₫', color: '#8B5CF6' },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div />
        <div className="flex gap-3">
          <select className="px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm outline-none">
            <option>6 tháng</option>
            <option>3 tháng</option>
            <option>1 năm</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Download size={15} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map(s => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Xu hướng doanh thu</h3>
          <button className="text-sm text-gray-500 hover:text-gray-700">Chi tiết</button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => `${v/1000000}M`} />
            <Tooltip formatter={v => [`${(v/1000000).toFixed(0)} Tr ₫`, 'Doanh thu']} />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#1B83A1" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Booking bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Số lượng booking theo tháng</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip formatter={v => [v, 'Booking']} />
              <Bar dataKey="bookings" fill="#1B83A1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Doanh thu theo loại xe</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={vehicleTypeRevenue} dataKey="value" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}%`}>
                {vehicleTypeRevenue.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, 'Tỷ lệ']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top vehicles */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top xe có doanh thu cao nhất</h3>
          <div className="space-y-3">
            {topVehicles.map(v => (
              <div key={v.rank} className="flex items-center gap-4 p-3 bg-[#F8FAFC] rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-[#1B83A1] flex items-center justify-center text-white text-sm font-semibold">{v.rank}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{v.name}</p>
                  <p className="text-xs text-gray-500">{v.trips} lượt thuê</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{(v.revenue/1000000).toFixed(0)} Tr ₫</p>
                  <p className="text-xs text-gray-400">Doanh thu</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Type stats table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Thống kê theo loại xe</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Loại xe</th>
                <th className="text-right py-2 text-gray-500 font-medium">Số xe</th>
                <th className="text-right py-2 text-gray-500 font-medium">Doanh thu</th>
                <th className="text-right py-2 text-gray-500 font-medium">TB/xe</th>
              </tr>
            </thead>
            <tbody>
              {typeStats.map((t, i) => (
                <tr key={t.type} className={`border-b border-gray-50 ${i === typeStats.length - 1 ? 'border-0' : ''}`}>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                      <span className="text-gray-900">{t.type}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right text-gray-700">{t.count}</td>
                  <td className="py-2.5 text-right text-gray-700">{t.revenue}</td>
                  <td className="py-2.5 text-right text-gray-700">{t.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
