import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

const inp = 'w-full px-4 py-2.5 rounded-full bg-[#F3F3F5] border border-[#CAD5E2] outline-none focus:border-[#2563EB] text-sm text-[#64748B] placeholder:text-[#64748B]';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ message, type });
  const [form, setForm] = useState({ 
    fullName: '', 
    email: '',
    phone: '',
    password: '', 
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { 
      showToast('Mật khẩu không khớp!', 'error');
      return; 
    }
    if (!agreed) {
      showToast('Vui lòng đồng ý với điều khoản dịch vụ', 'warning');
      return;
    }

    try {
      const result = await api.post('/auth/register', {
        username: form.email.split('@')[0],
        password: form.password,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone
      });

      if (result.success || result.id) {
        showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        showToast('Đăng ký thất bại: ' + (result.message || 'Lỗi không xác định'), 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast(error.response?.data?.message || 'Lỗi kết nối đến server', 'error');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg,rgba(239,246,255,0.8) 0%,#F8FAFC 50%,rgba(255,247,237,0.5) 100%)' }}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />

      <div className="w-full flex flex-col items-center" style={{ maxWidth: 420 }}>

        {/* Card */}
        <div className="w-full bg-white rounded-3xl flex flex-col gap-5 px-10 py-8"
          style={{ border: '1px solid rgba(226,232,240,0.6)', boxShadow: '0 20px 25px -5px rgba(226,232,240,0.5),0 8px 10px -6px rgba(226,232,240,0.5)' }}>

          {/* Header */}
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-2xl font-semibold text-[#0F172B]">Tạo tài khoản XeNow</h2>
            <p className="text-sm text-[#45556C]">Bắt đầu hành trình của bạn ngay hôm nay</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#314158]">
                <User size={14} /> Họ và tên
              </label>
              <input type="text" required className={inp} placeholder="Nguyễn Văn A"
                value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#314158]">
                <Mail size={14} /> Email
              </label>
              <input type="email" required className={inp} placeholder="email@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#314158]">
                <Phone size={14} /> Số điện thoại
              </label>
              <input type="tel" required className={inp} placeholder="09xxxxxxxxx"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#314158]">
                <Lock size={14} /> Mật khẩu
              </label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required className={inp + ' pr-10'} placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#314158]">
                <Lock size={14} /> Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input type={showCPw ? 'text' : 'password'} required className={inp + ' pr-10'} placeholder="••••••••"
                  value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                <button type="button" onClick={() => setShowCPw(!showCPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]">
                  {showCPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer" onClick={() => setAgreed(!agreed)}>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${agreed ? 'bg-[#2563EB] border-[#2563EB]' : 'border-gray-300 bg-white'}`}>
                {agreed && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-sm text-[#45556C]">
                Tôi đồng ý với <span className="text-[#2563EB]">điều khoản dịch vụ</span> và <span className="text-[#2563EB]">chính sách bảo mật</span>
              </span>
            </label>

            <button type="submit" className="w-full h-11 rounded-full text-sm font-medium text-white mt-1"
              style={{ background: 'linear-gradient(90deg,#2563EB,#3B82F6)', boxShadow: '0 10px 15px -3px rgba(43,127,255,0.25)' }}>
              Đăng ký
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-[#E2E8F0]" />
            <span className="text-xs text-[#62748E]">Hoặc tiếp tục với</span>
            <div className="flex-1 border-t border-[#E2E8F0]" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 h-10 rounded-full text-sm font-medium text-[#0F172A] bg-[#F8FAFC] border border-[#CAD5E2]">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 h-10 rounded-full text-sm font-medium text-[#0F172A] bg-[#F8FAFC] border border-[#CAD5E2]">
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <p className="text-sm text-[#45556C] text-center">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-medium text-[#2563EB]">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
