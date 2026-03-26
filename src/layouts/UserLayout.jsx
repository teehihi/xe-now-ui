import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, CalendarCheck, User, Settings } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function UserLayout() {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const [forceHide, setForceHide] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleToggle = (e) => setForceHide(e.detail.hide);
    window.addEventListener('toggle-header', handleToggle);
    return () => window.removeEventListener('toggle-header', handleToggle);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else if (latest < previous) {
      setHidden(false);
    }
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#F8FAFC]">
      {/* Header */}
      <motion.header 
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={(hidden || forceHide) ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/images/logo.webp" alt="XeNow" className="h-16" onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'inline';
            }} />
            <span className="text-2xl font-bold" style={{ display: 'none' }}>
              <span className="text-[#1B83A1]">Xe</span>Now
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/" end className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#1B83A1] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Home size={16} /> Trang chủ
            </NavLink>
            <NavLink to="/my-bookings" className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#1B83A1] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <CalendarCheck size={16} /> Booking của tôi
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#1B83A1] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <User size={16} /> Tài khoản
            </NavLink>
            <button onClick={() => navigate('/admin')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 ml-2">
              <Settings size={16} /> Admin Panel
            </button>
          </nav>
        </div>
      </motion.header>

      <Outlet />

      {/* Footer */}
      <footer className="bg-[#0F172B] text-gray-400 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 mb-8">
            {/* Brand */}
            <div>
              <img src="/images/logo.webp" alt="XeNow" className="h-16 mb-4" onError={(e) => {
                e.target.style.display = 'none';
              }} />
              <p className="text-sm leading-relaxed mb-4">Nền tảng cho thuê xe hàng đầu Việt Nam. Đặt xe dễ dàng, lái xe an toàn, trải nghiệm đỉnh cao.</p>
              <div className="flex items-center gap-2 text-xs mb-4 text-gray-500">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                <span>Đồ án môn học – Trường Đại học Công nghệ Kỹ thuật TP.HCM (HCMUTE)</span>
              </div>
              <div className="flex gap-2">
                {[
                  { icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', label: 'Facebook' },
                  { icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', label: 'Zalo' },
                  { icon: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z', label: 'YouTube' },
                ].map((social, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-[#334155] flex items-center justify-center transition-colors" aria-label={social.label}>
                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon}/></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Dịch vụ */}
            <div>
              <h4 className="text-white font-semibold mb-4">Dịch vụ</h4>
              <ul className="space-y-2.5 text-sm">
                {['Thuê xe tự lái', 'Thuê xe có tài xế', 'Thuê xe theo tháng', 'Xe đưa đón sân bay', 'Xe du lịch'].map(s => (
                  <li key={s}><a href="#" className="hover:text-white transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>

            {/* Liên hệ */}
            <div>
              <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  <span>01 Võ Văn Ngân, Linh Chiểu,<br/>Thủ Đức, TP.HCM</span>
                </div>
                <div className="flex gap-2 items-center">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  <span>1800 6789 <span className="text-xs opacity-60">(Miễn phí)</span></span>
                </div>
                <div className="flex gap-2 items-center">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>support@xenow.vn</span>
                </div>
                <div className="flex gap-2 items-center">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>T2 – CN: 7:00 – 22:00</span>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4199.105974381275!2d106.76933817529977!3d10.850637657819968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgS-G7uSB0aHXhuq10IFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e1!3m2!1svi!2sus!4v1774544175234!5m2!1svi!2sus"
                className="w-full h-48 rounded-lg border border-gray-700"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="XeNow - 01 Võ Văn Ngân, Linh Chiểu, Thủ Đức, HCM"
              />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-gray-800 flex items-center justify-between text-xs">
            <span>© 2026 XeNow - HCMUTE. Tất cả quyền được bảo lưu.</span>
            <div className="flex gap-5">
              {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Cookies'].map(l => (
                <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
