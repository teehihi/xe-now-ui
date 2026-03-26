import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, MapPin, ArrowLeft, Check } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    console.log('Register:', formData);
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image & Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#155DFC] to-[#1447E6] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.webp')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/images/logo.webp" alt="XeNow" className="h-14 brightness-0 invert" onError={(e) => {
                e.target.style.display = 'none';
              }} />
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Bắt đầu hành trình<br />cùng XeNow
            </h1>
            <p className="text-xl text-blue-100 mb-12">
              Đăng ký ngay để trải nghiệm dịch vụ cho thuê xe chất lượng cao với nhiều ưu đãi hấp dẫn
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Check, text: 'Đa dạng dòng xe từ phổ thông đến cao cấp' },
              { icon: Check, text: 'Giá cả minh bạch, không phí ẩn' },
              { icon: Check, text: 'Hỗ trợ 24/7, bảo hiểm toàn diện' },
              { icon: Check, text: 'Ưu đãi đặc biệt cho khách hàng mới' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <item.icon size={14} />
                </div>
                <span className="text-blue-50">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Quay lại trang chủ</span>
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#155DFC] to-[#1447E6] rounded-xl flex items-center justify-center mb-4">
                <UserPlus size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Đăng ký tài khoản</h2>
              <p className="text-gray-500 mt-2">Tạo tài khoản mới để bắt đầu thuê xe</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none transition-all"
                    placeholder="0912345678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none transition-all"
                    placeholder="TP. Hồ Chí Minh"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155DFC] focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#155DFC] to-[#1447E6] text-white rounded-lg font-medium hover:opacity-90 transition-opacity mt-6"
              >
                Đăng ký
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-[#155DFC] font-medium hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
