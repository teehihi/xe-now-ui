import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/40 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
          <ShieldAlert size={48} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-8xl font-black text-gray-900 mb-2 leading-none">403</h1>
        <p className="text-xl font-bold text-gray-800 mb-4 tracking-tight uppercase">Truy cập bị từ chối</p>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Rất tiếc, bạn không có đủ quyền hạn để truy cập vào trang này. Nếu bạn tin rằng đây là một lỗi, vui lòng liên hệ với quản trị viên hệ thống.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-gray-200"
          >
            <Home size={18} /> Quay về Trang chủ
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-95"
          >
            <ArrowLeft size={18} /> Quay lại trang trước
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 italic text-gray-400 text-xs">
          XeNow Management Security System
        </div>
      </div>
    </div>
  );
}
