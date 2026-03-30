import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, MapPin, Calendar, Shield, Star, Check, ArrowLeft, Fuel, Gauge, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentImg, setCurrentImg] = useState(0);
  const autoSlideRef = useRef(null);

  const getImageUrl = (url) => {
    if (!url) return '/images/car-toyota-camry.webp';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  // Auto slide every 4 seconds
  useEffect(() => {
    if (!vehicle?.images?.length || vehicle.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % vehicle.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [vehicle]);

  const prevImg = () => {
    setCurrentImg(prev => (prev - 1 + (vehicle?.images?.length || 1)) % (vehicle?.images?.length || 1));
  };

  const nextImg = () => {
    setCurrentImg(prev => (prev + 1) % (vehicle?.images?.length || 1));
  };

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/vehicles/${id}`);
        const data = res.data?.data || res.data || res;
        setVehicle({
          ...data,
          pricePerDay: Number(data.pricePerDay || data.dailyRate || 0),
          status: (data.status || '').toLowerCase(),
        });
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
    </div>
  );

  if (!vehicle) return <div className="max-w-6xl mx-auto px-8 py-16 text-center">Không tìm thấy xe</div>;

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const days = calculateDays();
  const totalPrice = days * vehicle.pricePerDay;

  const handleBooking = () => {
    if (!startDate || !endDate) {
      alert('Vui lòng chọn ngày nhận và trả xe');
      return;
    }
    navigate('/booking', { state: { vehicle, startDate, endDate, days, totalPrice } });
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} /> Quay lại
      </button>

      <div className="grid grid-cols-3 gap-8">
        {/* Left - Vehicle info */}
        <div className="col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="relative h-96 bg-gray-100">
              {/* Images */}
              {vehicle.images && vehicle.images.length > 0 ? (
                <>
                  <div className="w-full h-full overflow-hidden">
                    <div
                      className="flex h-full transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentImg * 100}%)` }}
                    >
                      {vehicle.images.map((img, i) => (
                        <img
                          key={i}
                          src={getImageUrl(img?.imageUrl)}
                          alt={`${vehicle.name} ${i + 1}`}
                          className="w-full h-full object-cover flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                  {vehicle.images.length > 1 && (
                    <>
                      <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors">
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors">
                        <ChevronRight size={20} />
                      </button>
                      {/* Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {vehicle.images.map((_, i) => (
                          <button key={i} onClick={() => setCurrentImg(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${i === currentImg ? 'bg-white w-5' : 'bg-white/50 w-2'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <img src={getImageUrl(vehicle.image)} alt={vehicle.name} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  vehicle.status === 'available' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700'
                }`}>
                  {vehicle.status === 'available' ? 'Sẵn sàng' : 'Đang thuê'}
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{vehicle.name}</h1>
                  <p className="text-gray-500 mt-1">{vehicle.brand} • {vehicle.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Giá thuê/ngày</p>
                  <p className="text-3xl font-bold text-[#1B83A1]">{vehicle.pricePerDay.toLocaleString('vi-VN')} ₫</p>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Users className="mx-auto mb-2 text-gray-600" size={24} />
                  <p className="text-sm text-gray-500">Số chỗ</p>
                  <p className="font-semibold text-gray-900">{vehicle.seats} chỗ</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Car className="mx-auto mb-2 text-gray-600" size={24} />
                  <p className="text-sm text-gray-500">Hộp số</p>
                  <p className="font-semibold text-gray-900">{vehicle.transmission}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Fuel className="mx-auto mb-2 text-gray-600" size={24} />
                  <p className="text-sm text-gray-500">Nhiên liệu</p>
                  <p className="font-semibold text-gray-900">{vehicle.fuel}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Gauge className="mx-auto mb-2 text-gray-600" size={24} />
                  <p className="text-sm text-gray-500">Số km đã đi</p>
                  <p className="font-semibold text-gray-900">{vehicle.mileage.toLocaleString('vi-VN')}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Tính năng nổi bật</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Bluetooth', 'Camera lùi', 'Cảm biến lùi', 'Định vị GPS', 'Túi khí an toàn', 'Màn hình cảm ứng'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check size={16} className="text-green-600" /> {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin size={18} /> Địa điểm nhận xe
                </h3>
                <p className="text-gray-600">{vehicle.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Booking form */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4">Đặt xe ngay</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Calendar size={14} /> Ngày nhận xe
                </label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Calendar size={14} /> Ngày trả xe
                </label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1]" />
              </div>
            </div>

            {days > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Số ngày thuê</span>
                  <span className="font-semibold">{days} ngày</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Giá thuê/ngày</span>
                  <span className="font-semibold">{vehicle.pricePerDay.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="border-t border-blue-200 mt-3 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-[#1B83A1]">{totalPrice.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
            )}

            <button onClick={handleBooking} disabled={vehicle.status !== 'available'}
              className="w-full py-3 bg-gradient-to-r from-[#155DFC] to-[#1447E6] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              {vehicle.status === 'available' ? 'Đặt xe ngay' : 'Xe không khả dụng'}
            </button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-green-600" />
                <span>Bảo hiểm toàn diện</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star size={16} className="text-yellow-500" />
                <span>Đánh giá 4.8/5 từ khách hàng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
