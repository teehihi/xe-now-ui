import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, CreditCard, Check } from 'lucide-react';
<<<<<<< HEAD
import { api } from '../../services/api';
=======
import { useAuth } from '../../context/AuthContext';
>>>>>>> refs/remotes/origin/main

export default function BookingForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { vehicle, startDate, endDate, days, totalPrice } = location.state || {};

  const getImageUrl = (url) => {
    if (!url) return '/images/car-toyota-camry.webp';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    idNumber: '',
    paymentMethod: 'bank_transfer'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const status = await api.get('/customer/verify-status');
        if (status.verified) {
          const profile = await api.get(`/customer/${status.userId}`);
          setFormData(f => ({
            ...f,
            fullName: profile.fullName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            address: profile.address || '',
            idNumber: profile.identityCard || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  // Fetch customer data to fill address and idNumber
  useEffect(() => {
    if (!token || !user?.userId) return;
    fetch(`http://localhost:8080/api/customer/verify-status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(res => {
        const data = res.data || res;
        if (data.verified && data.userId) {
          return fetch(`http://localhost:8080/api/customer/${data.userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(r => r.json());
        }
      })
      .then(res => {
        if (!res) return;
        const customer = res.data || res;
        setFormData(prev => ({
          ...prev,
          address: customer.address || '',
          idNumber: customer.identityCard || '',
        }));
      })
      .catch(() => {});
  }, [token, user?.userId]);

  if (!vehicle) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-16 text-center">
        <p className="text-gray-500 mb-4">Không có thông tin đặt xe</p>
        <button onClick={() => navigate('/')} className="text-[#1B83A1] hover:underline">
          Quay về trang chủ
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setLoading(true);
    try {
      const response = await api.post(`/bookings/create/${vehicle.id}`, {
        startDate: startDate + 'T09:00:00',
        endDate: endDate + 'T09:00:00',
        pickupLocationId: vehicle.locationId,
        returnLocationId: vehicle.locationId
      });
      
      console.log('Booking created:', response);
      navigate(`/payment/${response.bookingId}`);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Đồng đặt xe thất bại: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
=======
    // TODO: Implement actual booking logic
    console.log('Booking:', { ...formData, vehicle, startDate, endDate, totalPrice });
    navigate('/my-bookings');
>>>>>>> refs/remotes/origin/main
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} /> Quay lại
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Xác nhận đặt xe</h1>

      <div className="grid grid-cols-3 gap-8">
        {/* Left - Form */}
        <div className="col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin người thuê</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" required value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="email" required value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="tel" required value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0912345678"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1]" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea required value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Nhập địa chỉ của bạn"
                    rows="2"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CMND/CCCD *</label>
                <input type="text" required value={formData.idNumber}
                  onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                  placeholder="Số CMND/CCCD"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1]" />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} /> Phương thức thanh toán
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'cash', label: 'Tiền mặt', desc: 'Thanh toán khi nhận xe' },
                  { value: 'transfer', label: 'Chuyển khoản', desc: 'Chuyển khoản ngân hàng' },
                  { value: 'card', label: 'Thẻ tín dụng', desc: 'Thanh toán bằng thẻ' }
                ].map(method => (
                  <label key={method.value} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment" value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mt-1 w-4 h-4 text-[#1B83A1] focus:ring-[#1B83A1]" />
                    <div>
                      <p className="font-medium text-gray-900">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2 text-sm">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1B83A1] focus:ring-[#1B83A1]" />
              <span className="text-gray-600">
                Tôi đã đọc và đồng ý với điều khoản thuê xe và chính sách bảo mật
              </span>
            </div>

            <button type="submit"
              className="mt-6 w-full py-3 bg-gradient-to-r from-[#155DFC] to-[#1447E6] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              Xác nhận đặt xe
            </button>
          </form>
        </div>

        {/* Right - Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4">Thông tin đặt xe</h3>
            
            <div className="mb-4 pb-4 border-b">
              <img src={getImageUrl(vehicle.image)} alt={vehicle.name} className="w-full h-32 object-cover rounded-lg mb-3"
              onError={e => { e.target.style.display = 'none'; }} />
              <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
              <p className="text-sm text-gray-500">{vehicle.brand} • {vehicle.type}</p>
            </div>

            <div className="space-y-3 mb-4 pb-4 border-b text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                <div>
                  <p className="text-xs text-gray-400">Nhận xe</p>
                  <p className="font-medium">{new Date(startDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                <div>
                  <p className="text-xs text-gray-400">Trả xe</p>
                  <p className="font-medium">{new Date(endDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <div>
                  <p className="text-xs text-gray-400">Địa điểm</p>
                  <p className="font-medium">{vehicle.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Giá thuê ({days} ngày)</span>
                <span className="font-medium">{totalPrice.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Tiền cọc (Hoàn trả)</span>
                <span className="font-bold text-orange-600">{(vehicle.depositAmount || 0).toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí dịch vụ</span>
                <span className="font-medium">0 ₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bảo hiểm</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <Check size={14} /> Đã bao gồm
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-[#1B83A1]">{(totalPrice + (vehicle.depositAmount || 0)).toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
