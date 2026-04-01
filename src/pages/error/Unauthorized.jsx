import { Lock, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Dark theme glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[100px] -ml-32 -mb-32 animate-pulse" />

      <div className="max-w-md w-full z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(30,144,255,0.1)] rounded-[2rem] p-10 text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/30">
          <Lock size={32} strokeWidth={2} />
        </div>
        
        <h1 className="text-7xl font-black text-white mb-2 leading-none tracking-tighter">401</h1>
        <p className="text-lg font-bold text-blue-400 mb-6 uppercase tracking-widest">Yêu cầu xác thực</p>
        
        <p className="text-gray-400 mb-10 leading-relaxed">
          Phiên làm việc của bạn đã hết hạn hoặc bạn cần đăng nhập để truy cập vào tài nguyên này. 
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-3 w-full py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/10"
          >
            <LogIn size={20} /> Đăng nhập ngay
          </button>
          
          <button 
            onClick={() => navigate('/register')}
            className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95"
          >
            <UserPlus size={20} /> Tạo tài khoản mới
          </button>
        </div>
        
        <button 
           onClick={() => navigate('/')}
           className="mt-8 text-gray-500 text-sm font-medium hover:text-gray-300 transition-colors"
        >
          Quay lại trang chủ XeNow
        </button>
      </div>
    </div>
  );
}
