import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const inp = 'w-full px-4 py-2.5 rounded-full bg-[#F3F3F5] border border-[#CAD5E2] outline-none focus:border-[#2563EB] text-sm text-[#64748B] placeholder:text-[#64748B]';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', remember: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.email,
          password: form.password
        })
      });

      const data = await response.json();
      
      if (data.authenticated && data.token) {
        // Save user and token
        login(data.user, data.token);
        navigate('/');
      } else {
        alert(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Lỗi kết nối đến server');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg,rgba(239,246,255,0.8) 0%,#F8FAFC 50%,rgba(255,247,237,0.5) 100%)' }}>

      <div className="w-full flex flex-col items-center gap-6" style={{ maxWidth: 420 }}>

        {/* Logo */}
        <img src="/images/logo.webp" alt="XeNow" className="h-20 object-contain cursor-pointer"
          onClick={() => navigate('/')}
          onError={e => e.target.style.display = 'none'} />

        {/* Card */}
        <div className="w-full bg-white rounded-3xl flex flex-col gap-5 px-10 py-8"
          style={{ border: '1px solid rgba(226,232,240,0.6)', boxShadow: '0 20px 25px -5px rgba(226,232,240,0.5),0 8px 10px -6px rgba(226,232,240,0.5)' }}>

          {/* Header */}
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-2xl font-semibold text-[#0F172B]">Chào mừng trở lại</h2>
            <p className="text-sm text-[#45556C]">Đăng nhập để tiếp tục hành trình cùng XeNow</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#314158]">
                <Mail size={14} /> Email hoặc Username
              </label>
              <input type="text" required className={inp} placeholder="example@xenow.vn"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#314158]">
                <Lock size={14} /> Mật khẩu
              </label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required className={inp + ' pr-10'} placeholder="Nhập mật khẩu"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })}
                  className="w-3.5 h-3.5 rounded border-gray-300 accent-[#2563EB]" />
                <span className="text-[#45556C]">Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="text-[#2563EB]">Quên mật khẩu?</Link>
            </div>

            <button type="submit" className="w-full h-11 rounded-full text-sm font-medium text-white mt-1"
              style={{ background: 'linear-gradient(90deg,#2563EB,#3B82F6)', boxShadow: '0 10px 15px -3px rgba(43,127,255,0.25)' }}>
              Đăng nhập
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
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-medium text-[#2563EB]">Đăng ký ngay</Link>
          </p>
        </div>

        <p className="text-xs text-[#62748E] flex items-center gap-1.5">
          <Lock size={12} /> Thông tin được bảo mật an toàn với SSL 256-bit
        </p>
      </div>
    </div>
  );
}
