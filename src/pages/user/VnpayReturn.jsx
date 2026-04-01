import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VnpayReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode');
    if (responseCode === '00') {
      setStatus('success');
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
        {status === 'processing' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#1B83A1] border-t-transparent rounded-full animate-spin mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Đang xử lý thanh toán</h2>
            <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-fade-in">
            <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Thanh toán thành công!</h2>
            <p className="text-gray-500 mt-2">Cảm ơn bạn đã sử dụng dịch vụ của XeNow.</p>
            <button
              onClick={() => navigate('/my-bookings')}
              className="mt-8 px-8 py-3 bg-[#1B83A1] text-white rounded-xl font-medium hover:bg-[#156e8a] transition-colors"
            >
              Xem lịch sử đặt xe
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center animate-fade-in">
            <XCircle className="w-20 h-20 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Giao dịch thất bại!</h2>
            <p className="text-gray-500 mt-2">Đã có lỗi xảy ra hoặc bạn đã hủy giao dịch.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
