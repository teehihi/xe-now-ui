import { Ghost, Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#1B83A1]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse duration-700" />
      
      <div className="max-w-md w-full relative bg-white/40 backdrop-blur-xl border border-white shadow-2xl rounded-[2.5rem] p-10 text-center animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="w-24 h-24 bg-gray-50 text-[#1B83A1] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-gray-100 rotate-12 hover:rotate-0 transition-transform duration-500">
          <Ghost size={48} strokeWidth={1.5} className="animate-bounce mt-2" />
        </div>
        
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1B83A1] to-purple-600 mb-2 leading-none">404</h1>
        <p className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter italic">Lạc vào hư không?</p>
        
        <p className="text-gray-500 mb-10 leading-relaxed font-medium">
          Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên hoặc tạm thời không khả dụng. 
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center justify-center gap-3 w-full py-4 bg-[#1B83A1] text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#1B83A1]/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Home size={18} className="group-hover:rotate-12 transition-transform" /> 
            Quay về Trang chủ
          </button>
          
          <div className="pt-4 flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest px-4">
            <div className="h-px bg-gray-100 flex-1" />
            Hoặc tìm kiếm xe ngay
            <div className="h-px bg-gray-100 flex-1" />
          </div>

          <button 
            onClick={() => navigate('/vehicles')}
            className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            <Search size={18} /> Khám phá dàn xe của XeNow
          </button>
        </div>
      </div>
    </div>
  );
}
