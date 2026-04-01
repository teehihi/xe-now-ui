import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, CreditCard, Check, Search, FileText, X } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CustomSelect = ({ value, onChange, options, disabled, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectedOption = options.find(o => String(o.value) === String(value));

  // Reset search term when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Strip Vietnamese accents for better searching
  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const filteredOptions = options.filter(o => {
    const searchFixed = removeAccents(searchTerm.toLowerCase());
    const labelFixed = removeAccents(o.label.toLowerCase());
    return labelFixed.includes(searchFixed);
  }).sort((a, b) => a.label.localeCompare(b.label, 'vi'));

  return (
    <div className="relative">
      <div 
        className={`w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none flex justify-between items-center text-sm transition-colors ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'cursor-pointer hover:border-[#1B83A1] focus:border-[#1B83A1]'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`${selectedOption ? "text-gray-900 line-clamp-1" : "text-gray-400"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
      </div>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 flex flex-col">
            <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 shrink-0">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-[#1B83A1] focus:ring-1 focus:ring-[#1B83A1]/20 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
               </div>
            </div>
            <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
              {filteredOptions.map(o => (
                <div 
                  key={o.value}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-cyan-50 transition-colors flex items-center justify-between ${String(o.value) === String(value) ? 'bg-cyan-50 text-[#1B83A1] font-medium' : 'text-gray-700'}`}
                  onClick={() => {
                    onChange(o.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="line-clamp-1">{o.label}</span>
                  {String(o.value) === String(value) && <Check size={14} className="flex-shrink-0 ml-2" />}
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-4 py-4 text-sm text-gray-400 text-center italic">Không tìm thấy kết quả</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};


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
    pickupLocationId: vehicle?.locationId || '',
    idNumber: '',
    idNumber: '',
    paymentMethod: (vehicle?.depositAmount || 0) > 0 ? 'Chuyển khoản VietQR' : 'Tiền mặt'
  });
  
  const [paymentOption, setPaymentOption] = useState('deposit'); // 'deposit' or 'full'
  const hasDeposit = (vehicle?.depositAmount || 0) > 0;
  
  const getPaymentAmount = () => {
    if (!hasDeposit) {
      return formData.paymentMethod === 'Tiền mặt' ? 0 : totalPrice; // Pay full if not cash
    }
    return paymentOption === 'deposit' ? vehicle.depositAmount : (totalPrice + vehicle.depositAmount);
  };
  
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  // Address state
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  const [licenses, setLicenses] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=3')
      .then(res => res.json())
      .then(data => {
        setProvinces(data);
        if (vehicle?.location) {
          const locName = vehicle.location.toLowerCase();
          // Try to auto-select City based on branch location string
          const matchedProvince = data.find(p => {
             const cleanPName = p.name.toLowerCase().replace('tỉnh ', '').replace('thành phố ', '').replace('tp. ', '').replace('tp ', '');
             return locName.includes(cleanPName) || locName.includes('hcm') && p.code === 79;
          });
          if (matchedProvince) {
             setSelectedProvince(matchedProvince.code);
             setDistricts(matchedProvince.districts);
          }
        }
      }).catch(err => console.error("Error fetching provinces:", err));
  }, [vehicle?.location]);

  const handleProvinceChange = (code) => {
    setSelectedProvince(code);
    const p = provinces.find(x => x.code === code);
    setDistricts(p?.districts || []);
    setSelectedDistrict('');
    setWards([]);
    setSelectedWard('');
  };

  const handleDistrictChange = (code) => {
    setSelectedDistrict(code);
    const d = districts.find(x => x.code === code);
    setWards(d?.wards || []);
    setSelectedWard('');
  };

  // Sync basic info when user object becomes available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  // Fetch customer verification data to fill address and idNumber (and update profile if needed)
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
          fullName: prev.fullName || customer.fullName || '',
          email: prev.email || customer.email || '',
          phone: prev.phone || customer.phone || '',
          idNumber: customer.identityCard || prev.idNumber || '',
        }));
        
        // Fetch licenses for this authenticated user
        fetch(`http://localhost:8080/api/customer/licenses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(lData => {
           let list = lData.data || [];
           setLicenses(list);
           if (list.length > 0) {
              setSelectedLicense(list[0].licenseId);
           }
        }).catch(err => console.error(err));
      })
      .catch(err => console.error("Error fetching customer:", err));
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
    setLoading(true);
    try {
      const pName = provinces.find(p => p.code === Number(selectedProvince))?.name || '';
      const dName = districts.find(d => d.code === Number(selectedDistrict))?.name || '';
      const wName = wards.find(w => w.code === Number(selectedWard))?.name || '';
      const fullPickupAddress = `${streetAddress}, ${wName}, ${dName}, ${pName}`.replace(/^(, )+/, '');

      if (!selectedLicense) {
        setErrorModal({ visible: true, message: "Vui lòng chọn Giấy phép lái xe phù hợp" });
        setLoading(false);
        return;
      }

      const response = await api.post(`/bookings/create/${vehicle.id}`, {
        startDate: startDate + 'T09:00:00',
        endDate: endDate + 'T09:00:00',
        pickupAddress: fullPickupAddress,
        returnAddress: fullPickupAddress,
        driverLicenseId: Number(selectedLicense),
        paymentMethod: formData.paymentMethod,
        paymentAmount: getPaymentAmount()
      });
      
      console.log('Booking created:', response);
      const data = response.data || response;
      if (data.paymentUrl) {
         window.location.href = data.paymentUrl;
      } else if (data.vietQrUrl) {
         setQrUrl(data.vietQrUrl);
         setQrModalVisible(true);
      } else {
         navigate(`/my-bookings`);
      }
    } catch (error) {
      console.error('Booking failed:', error);
      setErrorModal({ 
        visible: true, 
        message: 'Tạo đơn đặt xe thất bại: ' + (error.response?.data?.message || error.message) 
      });
    } finally {
      setLoading(false);
    }
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

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Địa chỉ nhận xe tận nơi *</label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative z-30">
                    <CustomSelect 
                      value={selectedProvince} 
                      onChange={handleProvinceChange}
                      options={provinces.map(p => ({ value: p.code, label: p.name }))}
                      placeholder="Chọn Tỉnh/Thành phố"
                    />
                  </div>

                  <div className="relative z-20">
                    <CustomSelect 
                      value={selectedDistrict} 
                      onChange={handleDistrictChange}
                      disabled={!selectedProvince}
                      options={districts.map(d => ({ value: d.code, label: d.name }))}
                      placeholder="Chọn Quận/Huyện"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative z-10">
                    <CustomSelect 
                      value={selectedWard} 
                      onChange={(val) => setSelectedWard(val)}
                      disabled={!selectedDistrict}
                      options={wards.map(w => ({ value: w.code, label: w.name }))}
                      placeholder="Chọn Phường/Xã"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" required value={streetAddress}
                      onChange={e => setStreetAddress(e.target.value)}
                      placeholder="Số nhà, tên đường..."
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1] text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CMND/CCCD *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" required value={formData.idNumber} disabled
                    placeholder="Số CMND/CCCD"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none bg-gray-50 text-gray-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between">
                  <span>Giấy Phép Lái Xe *</span>
                  {licenses.length === 0 && (
                    <span className="text-red-500 font-medium text-xs">Chưa có GPLX</span>
                  )}
                </label>
                
                {licenses.length > 0 ? (
                  <div className="relative z-0">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                    <select 
                      value={selectedLicense}
                      onChange={e => setSelectedLicense(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1] appearance-none bg-white relative cursor-pointer"
                    >
                      <option value="" disabled>Chọn GPLX để thuê xe</option>
                      {licenses.map(l => (
                        <option key={l.licenseId} value={l.licenseId}>
                          Hạng {l.licenseClass} - {l.licenseNumber} {l.expiryDate ? `(Hết hạn: ${l.expiryDate})` : ''}
                        </option>
                      ))}
                    </select>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                ) : (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
                     <p className="text-sm text-orange-800">Bạn chưa có thẻ GPLX nào.</p>
                     <button type="button" onClick={() => navigate('/profile')} className="text-sm px-3 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700">Thêm ngay</button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">GPLX phải phù hợp với phương tiện đang giao dịch (Dung tích xi lanh/Số ghế)</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} /> Phương thức thanh toán
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'Tiền mặt', label: 'Tiền mặt', desc: 'Thanh toán khi nhận xe', hidden: hasDeposit },
                  { value: 'Chuyển khoản VietQR', label: 'Chuyển khoản qua VietQR', desc: 'Quét mã VietQR (Miễn phí)', hidden: false },
                  { value: 'VNPAY', label: 'Thanh toán qua VNPAY', desc: 'Hỗ trợ thẻ ATM, Visa, MasterCard', hidden: false }
                ].filter(m => !m.hidden).map(method => (
                  <label key={method.value} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="paymentMethod" value={method.value}
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

              {hasDeposit && (
                <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4">
                  <h4 className="font-semibold text-gray-800 text-sm">Khoản thanh toán trước</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentOption === 'deposit' ? 'border-[#1B83A1] bg-white shadow-sm' : 'border-gray-200 bg-transparent hover:border-blue-200'}`}>
                       <input type="radio" name="paymentOption" value="deposit" checked={paymentOption === 'deposit'} onChange={() => setPaymentOption('deposit')} className="sr-only" />
                       <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentOption === 'deposit' ? 'border-[#1B83A1]' : 'border-gray-400'}`}>
                          {paymentOption === 'deposit' && <div className="w-2 h-2 rounded-full bg-[#1B83A1]" />}
                       </div>
                       <div>
                         <p className="font-semibold text-gray-900 leading-tight">Thanh toán cọc</p>
                         <p className="text-[#1B83A1] font-bold mt-1">{(vehicle.depositAmount).toLocaleString('vi-VN')} ₫</p>
                       </div>
                    </label>

                    <label className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentOption === 'full' ? 'border-[#1B83A1] bg-white shadow-sm' : 'border-gray-200 bg-transparent hover:border-blue-200'}`}>
                       <input type="radio" name="paymentOption" value="full" checked={paymentOption === 'full'} onChange={() => setPaymentOption('full')} className="sr-only" />
                       <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentOption === 'full' ? 'border-[#1B83A1]' : 'border-gray-400'}`}>
                          {paymentOption === 'full' && <div className="w-2 h-2 rounded-full bg-[#1B83A1]" />}
                       </div>
                       <div>
                         <p className="font-semibold text-gray-900 leading-tight">Thanh toán toàn bộ</p>
                         <p className="text-[#1B83A1] font-bold mt-1">{(totalPrice + vehicle.depositAmount).toLocaleString('vi-VN')} ₫</p>
                       </div>
                    </label>
                  </div>
                </div>
              )}
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

      {/* VietQR Modal */}
      {qrModalVisible && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative -translate-y-[10vh]">
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Thanh toán VietQR</h2>
            <p className="text-center text-sm text-gray-500 mb-6">Mở app Ngân hàng để quét mã QR</p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-center mb-6">
              <img src={qrUrl} alt="VietQR Code" className="w-full max-w-[200px]" />
            </div>
            
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngân hàng:</span>
                <span className="font-bold text-gray-900">Vietcombank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tài khoản:</span>
                <span className="font-bold text-[#1B83A1]">1040489156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chủ tài khoản:</span>
                <span className="font-bold text-gray-900 uppercase">Nguyễn Nhật Thiên</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setQrModalVisible(false);
                navigate('/my-bookings');
              }}
              className="w-full py-3 bg-gradient-to-r from-[#1B83A1] to-[#125B71] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Tôi đã thanh toán
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.visible && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-in fade-in transition-all">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <X size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thông báo</h3>
            <p className="text-gray-600 mb-8">{errorModal.message}</p>
            <button
              onClick={() => setErrorModal({ visible: false, message: '' })}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
