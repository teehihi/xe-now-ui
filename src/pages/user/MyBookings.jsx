import { useEffect, useState } from 'react';
import { Calendar, Car, MapPin, Clock, CreditCard, FileText } from 'lucide-react';
import { api } from '../../services/api';

export default function MyBookings() {
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (url) => {
    if (!url) return '/images/car-toyota-camry.webp';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsData, vehiclesData] = await Promise.all([
          api.get('/bookings/my-bookings'),
          api.get('/vehicles')
        ]);
        setBookings(bookingsData);
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const userBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      active: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      active: 'Đang thuê',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Đặt xe của tôi</h1>
        <p className="text-gray-500 mt-1">Quản lý và theo dõi các đơn đặt xe của bạn</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'pending', label: 'Chờ xác nhận' },
          { key: 'confirmed', label: 'Đã xác nhận' },
          { key: 'active', label: 'Đang thuê' },
          { key: 'completed', label: 'Hoàn thành' }
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === tab.key 
                ? 'border-[#1B83A1] text-[#1B83A1]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
          </div>
        ) : userBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Car className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">Chưa có đơn đặt xe nào</p>
          </div>
        ) : (
          userBookings.map(booking => {
            const vehicle = vehicles.find(v => v.id === booking.vehicleId);
            if (!vehicle) return null;

            return (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-6">
                  {/* Vehicle image */}
                  <div className="w-48 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={getImageUrl(vehicle.image)} alt={vehicle.name} className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }} />
                  </div>

                  {/* Booking info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
                        <p className="text-sm text-gray-500">{vehicle.brand} • {vehicle.type}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>Nhận xe: {new Date(booking.startDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>Trả xe: {new Date(booking.endDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        <span>{vehicle.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>Đặt lúc: {new Date(booking.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Tổng tiền:</span>
                        <span className="text-lg font-bold text-[#1B83A1]">{booking.totalPrice.toLocaleString('vi-VN')} ₫</span>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <button className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                            Hủy đặt xe
                          </button>
                        )}
                        <button className="px-4 py-2 text-sm text-[#1B83A1] border border-[#1B83A1] rounded-lg hover:bg-blue-50 flex items-center gap-1">
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
    </div>
  );
}
