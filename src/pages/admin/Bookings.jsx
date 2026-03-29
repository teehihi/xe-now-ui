import { useEffect, useState } from 'react';
import { Search, ChevronDown, Eye, Check, X, Car, Calendar, DollarSign, Phone, Mail, FileText, ClipboardList } from 'lucide-react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const statusOptions = ['Tất cả trạng thái', 'Pending', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled'];
const statusLabel = { 
  Pending: 'Chờ duyệt', 
  Confirmed: 'Đã xác nhận', 
  Ongoing: 'Đang thuê', 
  Completed: 'Hoàn thành', 
  Cancelled: 'Đã hủy' 
};

const statCards = [
  { label: 'Chờ duyệt', key: 'Pending', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { label: 'Đã xác nhận', key: 'Confirmed', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Đang thuê', key: 'Ongoing', color: 'bg-green-50 border-green-200 text-green-700' },
  { label: 'Hoàn thành', key: 'Completed', color: 'bg-gray-50 border-gray-200 text-gray-700' },
];

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
  
  // Modals state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Return form state
  const [mileage, setMileage] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/bookings');
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter(b => {
    const matchSearch = 
      String(b.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      String(b.vehicleModel || '').toLowerCase().includes(search.toLowerCase()) ||
      String(b.bookingId || '').includes(search);
    const matchStatus = statusFilter === 'Tất cả trạng thái' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  async function handleUpdateStatus(id, status, extra = {}) {
    try {
      let url = `/admin/bookings/${id}/status?status=${status}`;
      if (extra.mileage) url += `&mileage=${extra.mileage}`;
      if (extra.note) url += `&note=${encodeURIComponent(extra.note)}`;
      
      await api.post(url);
      setShowReturnModal(false);
      fetchBookings();
    } catch (error) {
      alert('Cập nhật thất bại: ' + error.message);
    }
  }

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-6">
        {statCards.map(s => (
          <div key={s.key} className={`rounded-3xl border p-6 transition-all hover:shadow-md ${s.color}`}>
            <p className="text-sm font-medium opacity-80">{s.label}</p>
            <p className="text-4xl font-bold mt-2">
              {bookings.filter(b => b.status === s.key).length}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-8 py-5">
        <div className="flex items-center gap-6">
          <div className="relative flex-1 max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo mã đơn, khách hàng, tên xe..."
              className="w-full pl-12 pr-6 py-3 bg-gray-50 rounded-2xl text-sm border-0 focus:ring-2 focus:ring-[#1B83A1] transition-all" 
            />
          </div>
          <div className="relative">
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-5 pr-12 py-3 bg-gray-50 rounded-2xl text-sm border-0 focus:ring-2 focus:ring-[#1B83A1] cursor-pointer outline-none"
            >
              {statusOptions.map(o => (
                <option key={o} value={o}>
                  {o === 'Tất cả trạng thái' ? o : statusLabel[o] ?? o}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-sm text-gray-400 ml-auto font-medium">
            {filtered.length} đơn đặt xe
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Mã đơn</th>
                <th className="text-left px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Khách hàng</th>
                <th className="text-left px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Xe thuê</th>
                <th className="text-left px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Lịch trình</th>
                <th className="text-left px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng cộng</th>
                <th className="text-center px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="text-right px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((b) => (
                <tr key={b.bookingId} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-8 py-5 font-mono text-[#1B83A1] font-semibold">#{b.bookingId}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{b.customerName}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> {b.customerPhone || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-semibold text-gray-700">{b.vehicleModel}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col text-xs space-y-1">
                      <span className="text-gray-600 flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> {formatDate(b.startDate)}</span>
                      <span className="text-gray-400 flex items-center gap-1.5"><Calendar size={12} /> {formatDate(b.endDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">
                      {formatCurrency(b.totalPrice)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center"><StatusBadge status={b.status} /></td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Workflow buttons */}
                      {b.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(b.bookingId, 'Confirmed')}
                            className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all" 
                            title="Xác nhận"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(b.bookingId, 'Cancelled')}
                            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all" 
                            title="Hủy đơn"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      
                      {b.status === 'Confirmed' && (
                        <button 
                          onClick={() => handleUpdateStatus(b.bookingId, 'Ongoing')}
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all text-xs font-bold shadow-lg shadow-blue-100" 
                        >
                          Giao xe
                        </button>
                      )}

                      {b.status === 'Ongoing' && (
                        <button 
                          onClick={() => {
                            setSelectedBooking(b);
                            setMileage('');
                            setNote('');
                            setShowReturnModal(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#1B83A1] text-white hover:bg-[#156a82] transition-all text-xs font-bold shadow-lg shadow-cyan-100" 
                        >
                          Nhận xe
                        </button>
                      )}

                      <button 
                        onClick={() => {
                          setSelectedBooking(b);
                          setShowDetailModal(true);
                        }}
                        className="p-2.5 rounded-xl bg-gray-100 text-gray-400 hover:text-[#1B83A1] hover:bg-blue-50 transition-all" 
                        title="Chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <ClipboardList size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">Không tìm thấy đơn đặt xe nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-50 rounded-2xl text-[#1B83A1]">
                <Car size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Xác nhận nhận xe trả</h3>
            </div>
            
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Bạn đang nhận xe <strong>{selectedBooking?.vehicleModel}</strong> trả từ khách hàng <strong>{selectedBooking?.customerName}</strong>. Vui lòng cập nhật số KM hiện tại.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Số KM hiện tại</label>
                <input 
                  type="number" 
                  value={mileage} 
                  onChange={e => setMileage(e.target.value)}
                  placeholder="Ví dụ: 12500"
                  className="w-full px-5 py-3 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#1B83A1] font-bold text-lg transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Ghi chú tình trạng</label>
                <textarea 
                  value={note} 
                  onChange={e => setNote(e.target.value)}
                  placeholder="Tình trạng xe khi trả: có vết xước, sạch sẽ..."
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#1B83A1] text-sm resize-none h-24 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowReturnModal(false)}
                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={() => handleUpdateStatus(selectedBooking.bookingId, 'Completed', { mileage, note })}
                className="flex-1 py-3 bg-[#1B83A1] text-white rounded-2xl font-bold text-sm shadow-xl shadow-cyan-100 hover:bg-[#156a82] transition-all"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-[#1B83A1] px-10 py-8 text-white relative">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="absolute top-6 right-8 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-4 mb-2 opacity-80 uppercase tracking-widest text-[10px] font-black">
                Chi tiết đơn hàng #{selectedBooking.bookingId}
              </div>
              <h3 className="text-3xl font-black">{selectedBooking.customerName}</h3>
            </div>

            <div className="p-10 grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                    <FileText size={14} /> Thông tin liên hệ
                  </h4>
                  <div className="space-y-2">
                    <p className="flex items-center gap-3 text-gray-700 font-semibold"><Phone size={14} className="text-blue-500" /> {selectedBooking.customerPhone || 'N/A'}</p>
                    <p className="flex items-center gap-3 text-gray-700 font-semibold"><Mail size={14} className="text-blue-500" /> {selectedBooking.customerEmail || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                    <Car size={14} /> Thông tin phương tiện
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="font-bold text-gray-900">{selectedBooking.vehicleModel}</p>
                    <p className="text-xs text-gray-500 mt-1">Hợp đồng thuê bao gồm bảo hiểm cơ bản</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                    <Calendar size={14} /> Lịch trình & Giá
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end border-b border-dashed border-gray-100 pb-2">
                      <span className="text-xs text-gray-400">Ngày nhận:</span>
                      <span className="text-sm font-bold text-gray-700">{formatDate(selectedBooking.startDate)}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-dashed border-gray-100 pb-2">
                      <span className="text-xs text-gray-400">Ngày trả:</span>
                      <span className="text-sm font-bold text-gray-700">{formatDate(selectedBooking.endDate)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-gray-400">Tổng cộng:</span>
                      <span className="text-xl font-black text-red-500">{formatCurrency(selectedBooking.totalPrice)}</span>
                    </div>
                  </div>
                </div>
                
                {selectedBooking.status === 'Completed' && (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                      <ClipboardList size={14} /> Nhật ký trả xe
                    </h4>
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                      <p className="text-xs font-bold text-green-700 mb-1">Số KM khi trả: {selectedBooking.returnMileage} KM</p>
                      <p className="text-xs text-green-600 italic">"{selectedBooking.returnNote || 'Không có ghi chú'}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-10 py-6 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="px-8 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
