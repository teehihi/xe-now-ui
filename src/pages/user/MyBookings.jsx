import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Car, MapPin, Clock, CreditCard, FileText, X, ShieldCheck, Info } from 'lucide-react';
import { api } from '../../services/api';
import Pagination from '../../components/Pagination';

export default function MyBookings() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 5;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Note: we fetch all vehicles for now to match them with bookings by ID
      // If vehicles list becomes too large, this should be optimized
      const [bookingsResponse, vehiclesResponse] = await Promise.all([
        api.get(`/bookings/my-bookings?page=${currentPage}&size=${pageSize}`),
        api.get('/vehicles?size=100') // Fetch a larger set to ensure matches
      ]);
      
      const pageData = bookingsResponse.data || bookingsResponse;
      setBookings(pageData.content || []);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);

      // Handle both cases: paginated or list response for vehicles
      const vData = vehiclesResponse.content || vehiclesResponse.data?.content || vehiclesResponse;
      setVehicles(vData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getImageUrl = (url) => {
    if (!url) return '/images/car-toyota-camry.webp';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${url}`;
  };

  const userBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      active: 'bg-green-100 text-green-700 border-green-200',
      ongoing: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
      pending: 'Chờ thanh toán cọc',
      confirmed: 'Đã xác nhận cọc',
      active: 'Đang thuê',
      ongoing: 'Đang thuê',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[s] || styles.pending}`}>{labels[s] || s}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="mb-8 font-primary">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Đặt xe của tôi</h1>
        <p className="text-gray-500 mt-1">Quản lý và theo dõi các đơn đặt xe của bạn</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto pb-px">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'pending', label: 'Chờ xác nhận' },
          { key: 'confirmed', label: 'Đã xác nhận' },
          { key: 'ongoing', label: 'Đang thuê' },
          { key: 'completed', label: 'Hoàn thành' }
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-all duration-200 ${
              filter === tab.key 
                ? 'border-[#1B83A1] text-[#1B83A1]' 
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
          </div>
        ) : userBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Car className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 font-medium font-primary">Chưa có đơn đặt xe nào trong mục này</p>
          </div>
        ) : (
          userBookings.map(booking => {
            const vehicle = vehicles.find(v => v.id === booking.vehicleId);
            const bookingDate = booking.createdAt ? new Date(booking.createdAt) : null;

            return (
              <div key={booking.bookingId} className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Vehicle image */}
                  <div className="w-full md:w-56 h-40 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 relative">
                    <img src={getImageUrl(vehicle?.image)} alt={vehicle?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400'; }} />
                    <div className="absolute top-3 left-3">
                         {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  {/* Booking info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 font-primary">{vehicle?.name || booking.vehicleModel}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">Mã đơn: <span className="font-mono font-bold text-gray-600">#XN-{booking.bookingId}</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                             <Calendar size={14} />
                        </div>
                        <div>
                             <p className="text-[10px] text-gray-400 uppercase font-bold leading-tight">Thời gian thuê</p>
                             <p className="font-medium">{new Date(booking.startDate).toLocaleDateString('vi-VN')} - {new Date(booking.endDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                             <Clock size={14} />
                        </div>
                        <div>
                             <p className="text-[10px] text-gray-400 uppercase font-bold leading-tight">Ngày đặt</p>
                             <p className="font-medium">{bookingDate ? bookingDate.toLocaleString('vi-VN') : 'Vừa xong'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-5 border-t border-gray-50 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1B83A1]/10 flex items-center justify-center text-[#1B83A1]">
                             <CreditCard size={20} />
                        </div>
                        <div>
                             <p className="text-[10px] text-gray-400 uppercase font-bold leading-tight">Tổng thanh toán</p>
                             <p className="text-xl font-bold text-[#1B83A1]">{booking.totalPrice?.toLocaleString('vi-VN')} ₫</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        {booking.status.toLowerCase() === 'pending' && (
                          <div className="flex gap-2">
                            {vehicle?.depositAmount > 0 && (
                              <button 
                                onClick={() => navigate(`/payment/${booking.bookingId}`)}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200">
                                Thanh toán cọc
                              </button>
                            )}
                            <button className="px-5 py-2.5 text-sm font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                              Hủy đơn
                            </button>
                          </div>
                        )}
                        <button 
                          onClick={() => setSelectedBooking({ ...booking, vehicle })}
                          className="px-6 py-2.5 text-sm font-bold text-white bg-[#1B83A1] rounded-xl shadow-lg shadow-blue-500/10 hover:translate-y-[-2px] transition-all flex items-center gap-2">
                          <FileText size={16} /> Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-primary">Chi tiết đơn đặt xe</h2>
                    <p className="text-sm text-gray-400 mt-1">Mã hợp đồng điện tử: <span className="text-[#1B83A1] font-bold">#XN-{selectedBooking.bookingId}</span></p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:rotate-90 transition-all duration-300">
                    <X size={20} />
                </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
                {/* Vehicle Segment */}
                <div className="flex gap-6 mb-8">
                    <div className="w-40 h-28 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <img src={getImageUrl(selectedBooking.vehicle?.image)} alt="Vehicle" className="w-full h-full object-cover" 
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400'; }} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedBooking.vehicleModel}</h3>
                        <div className="flex gap-2 mt-2">
                             <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase tracking-widest">{selectedBooking.vehicle?.fuelType || 'Xăng'}</span>
                             <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase tracking-widest">{selectedBooking.vehicle?.transmission || 'Số tự động'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-600 mt-3 font-bold text-xs uppercase tracking-tighter">
                            <ShieldCheck size={14} /> Chính sách bảo hiểm đã kích hoạt
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                     <div className="p-4 bg-gray-50 rounded-2xl">
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Địa điểm nhận & trả xe</p>
                          <div className="flex items-start gap-2">
                               <MapPin size={16} className="text-[#1B83A1] mt-0.5" />
                               <p className="text-sm font-medium text-gray-800 leading-snug">{selectedBooking.pickupLocationName || 'Chi nhánh TP. Hồ Chí Minh'}</p>
                          </div>
                     </div>
                     <div className="p-4 bg-gray-50 rounded-2xl">
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Trạng thái hiện tại</p>
                          <div className="flex items-start gap-2">
                               <Info size={16} className="text-[#1B83A1] mt-0.5" />
                               <p className="text-sm font-bold text-gray-800 leading-snug uppercase">{selectedBooking.status}</p>
                          </div>
                     </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Chi tiết thanh toán</h4>
                     <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Tiền thuê xe ({Math.ceil((new Date(selectedBooking.endDate) - new Date(selectedBooking.startDate)) / (1000 * 60 * 60 * 24))} ngày)</span>
                          <span className="font-bold text-gray-900">{(selectedBooking.totalPrice - (selectedBooking.depositAmount || 0)).toLocaleString('vi-VN')} ₫</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                          <span className="text-orange-600 font-medium">Tiền cọc xe (Đã đóng)</span>
                          <span className="font-bold text-orange-600">{selectedBooking.depositAmount?.toLocaleString('vi-VN')} ₫</span>
                     </div>
                     <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-50 mt-2">
                          <span className="text-gray-500">Giảm giá mã khuyến mãi</span>
                          <span className="font-bold text-green-600">- 0 ₫</span>
                     </div>
                     <div className="flex justify-between items-center pt-4 mt-2">
                          <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                          <span className="text-2xl font-bold text-[#1B83A1]">{selectedBooking.totalPrice?.toLocaleString('vi-VN')} ₫</span>
                     </div>
                </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-gray-50 flex gap-4">
                <button className="flex-1 py-3.5 border-2 border-gray-200 text-gray-600 rounded-2xl font-bold text-sm tracking-tight hover:bg-white transition-all" onClick={() => setSelectedBooking(null)}>
                    Đóng cửa sổ
                </button>
                <button className="flex-1 py-3.5 bg-[#1B83A1] text-white rounded-2xl font-bold text-sm tracking-tight shadow-lg shadow-blue-500/20">
                    Xuất hóa đơn PDF
                </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
