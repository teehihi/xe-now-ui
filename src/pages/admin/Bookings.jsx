import { useState } from 'react';
import { Search, ChevronDown, Eye, Check, X } from 'lucide-react';
import { bookings as initialBookings } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';

const statusOptions = ['Tất cả trạng thái', 'pending', 'confirmed', 'renting', 'completed', 'cancelled'];
const statusLabel = { pending: 'Chờ duyệt', confirmed: 'Đã xác nhận', renting: 'Đang thuê', completed: 'Hoàn thành', cancelled: 'Đã hủy' };

const statCards = [
  { label: 'Chờ duyệt', key: 'pending', color: 'bg-yellow-50 border-yellow-200' },
  { label: 'Đã xác nhận', key: 'confirmed', color: 'bg-blue-50 border-blue-200' },
  { label: 'Đang thuê', key: 'renting', color: 'bg-green-50 border-green-200' },
  { label: 'Hoàn thành', key: 'completed', color: 'bg-gray-50 border-gray-200' },
];

export default function Bookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');

  const filtered = bookings.filter(b => {
    const matchSearch = b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
      String(b.id).includes(search);
    const matchStatus = statusFilter === 'Tất cả trạng thái' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function approve(id) { setBookings(bs => bs.map(b => b.id === id ? { ...b, status: 'confirmed' } : b)); }
  function cancel(id) { setBookings(bs => bs.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)); }

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.key} className={`rounded-2xl border p-5 ${s.color}`}>
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-1">
              {bookings.filter(b => b.status === s.key).length}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo mã, khách hàng, xe..."
              className="w-full pl-9 pr-4 py-2 bg-[#F3F3F5] rounded-lg text-sm outline-none" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-[#F3F3F5] rounded-lg text-sm outline-none cursor-pointer">
              {statusOptions.map(o => <option key={o} value={o}>{o === 'Tất cả trạng thái' ? o : statusLabel[o] ?? o}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-sm text-gray-500 ml-auto">{filtered.length} booking</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Mã booking</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Khách hàng</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Xe</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Thời gian</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Tổng tiền</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Trạng thái</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => (
              <tr key={b.id} className={`border-b border-gray-50 hover:bg-gray-50 ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                <td className="px-4 py-3 font-mono text-gray-700">#{b.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{b.customerName}</td>
                <td className="px-4 py-3 text-gray-700">{b.vehicleName}</td>
                <td className="px-4 py-3">
                  <p className="text-xs text-gray-700">{b.startDate}</p>
                  <p className="text-xs text-gray-400">{b.endDate}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{b.total.toLocaleString('vi-VN')} ₫</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {b.status === 'pending' && (
                      <button onClick={() => approve(b.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors" title="Duyệt">
                        <Check size={15} />
                      </button>
                    )}
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button onClick={() => cancel(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Hủy">
                        <X size={15} />
                      </button>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Xem">
                      <Eye size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
