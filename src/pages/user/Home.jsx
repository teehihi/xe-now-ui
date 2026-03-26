import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Car, Shield, Clock, Star, ArrowRight } from 'lucide-react';
import { vehicles } from '../../data/mockData';

const features = [
  { icon: Shield, title: 'Bảo hiểm toàn diện', desc: 'Xe được bảo hiểm đầy đủ, yên tâm trên mọi hành trình', color: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { icon: Clock, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn', color: 'bg-green-50 border-green-100', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { icon: Car, title: 'Xe chất lượng cao', desc: 'Đa dạng dòng xe từ phổ thông đến cao cấp', color: 'bg-purple-50 border-purple-100', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { icon: Star, title: 'Giá tốt nhất', desc: 'Cam kết giá cạnh tranh, nhiều ưu đãi hấp dẫn', color: 'bg-orange-50 border-orange-100', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('Tất cả');

  const availableVehicles = vehicles.filter(v => v.status === 'available');
  const filtered = availableVehicles.filter(v =>
    (searchType === 'Tất cả' || v.type === searchType) &&
    (searchLocation === '' || v.location.toLowerCase().includes(searchLocation.toLowerCase()))
  );

  return (
    <>
      {/* Hero */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero-bg.webp)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172B]/90 to-[#1C398E]/80" />
        <div className="relative z-10 max-w-6xl mx-auto px-8 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-7xl font-medium text-white leading-tight mb-4">
            Thuê Xe Chất Lượng<br />
            <span className="bg-gradient-to-r from-[#51A2FF] to-[#155DFC] bg-clip-text text-transparent">Trải Nghiệm Đỉnh Cao</span>
          </h1>
          <p className="text-2xl text-[#E2E8F0] mb-12 max-w-3xl">
            Đặt xe dễ dàng, lái xe an toàn cùng XeNow - Nền tảng cho thuê xe hàng đầu Việt Nam
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl border border-gray-200">
            <div className="grid grid-cols-5 gap-0">
              <div className="px-3">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <MapPin size={14} /> Địa điểm
                </label>
                <button className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-[#717182] text-left flex items-center justify-between">
                  <span>Chọn địa điểm</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="opacity-50">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              
              <div className="px-3">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <Calendar size={14} /> Ngày nhận xe
                </label>
                <input type="date" className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-[#717182] outline-none" />
              </div>
              
              <div className="px-3">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <Calendar size={14} /> Ngày trả xe
                </label>
                <input type="date" className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-[#717182] outline-none" />
              </div>
              
              <div className="px-3">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <Search size={14} /> Loại xe
                </label>
                <button className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-[#717182] text-left flex items-center justify-between">
                  <span>Tất cả</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="opacity-50">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              
              <div className="px-3 flex items-end">
                <button className="w-full py-2.5 bg-gradient-to-r from-[#155DFC] to-[#1447E6] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <Search size={16} /> Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why XeNow */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Tại sao chọn XeNow?</h2>
          <p className="text-gray-500 mt-2">Dịch vụ chuyên nghiệp, uy tín và đáng tin cậy</p>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className={`rounded-2xl border p-6 ${f.color}`}>
              <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center mb-4`}>
                <f.icon size={22} className={f.iconColor} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Available vehicles */}
      <section className="bg-[#F8FAFC] py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Xe hiện có</h2>
              <p className="text-gray-500 mt-1">{availableVehicles.length} xe đang sẵn sàng cho bạn</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-white bg-white">
              Xem tất cả <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {filtered.slice(0, 6).map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/vehicles/${v.id}`)}>
                <div className="relative h-48 bg-gray-100">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-medium">Sẵn sàng</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 text-gray-700 rounded-lg text-xs font-medium">{v.type}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{v.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{v.brand}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Car size={12} /> {v.seats} chỗ</span>
                    <span>{v.transmission}</span>
                    <span>{v.fuel}</span>
                    <span>{v.mileage.toLocaleString('vi-VN')} km</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Giá thuê/ngày</p>
                      <p className="text-lg font-bold text-[#1B83A1]">{v.pricePerDay.toLocaleString('vi-VN')} ₫</p>
                    </div>
                    <button className="text-sm text-[#1B83A1] font-medium hover:underline">Xem chi tiết →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#155DFC] to-[#1447E6] py-16">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Sẵn sàng bắt đầu hành trình?</h2>
          <p className="text-blue-200 text-lg mb-6">Đăng ký ngay để nhận ưu đãi đặc biệt cho lần thuê xe đầu tiên</p>
          <button className="px-8 py-3 bg-white text-[#1B83A1] font-semibold rounded-xl hover:bg-blue-50 transition-colors">
            Đăng ký ngay
          </button>
        </div>
      </section>
    </>
  );
}
