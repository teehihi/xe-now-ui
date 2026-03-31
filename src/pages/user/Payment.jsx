import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle2, Copy, AlertCircle, QrCode, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/bookings/${id}`);
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handlePaymentConfirm = async () => {
    setConfirming(true);
    try {
      await api.post(`/bookings/${id}/confirm-payment`);
      alert('Xác nhận thanh toán tiền cọc thành công!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      alert('Có lỗi xảy ra khi xác nhận thanh toán');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
    </div>
  );

  if (!booking) return <div className="max-w-4xl mx-auto py-20 text-center">Không tìm thấy thông tin đơn hàng</div>;

  const qrUrl = `https://img.vietqr.io/image/MB-123456789999-compact2.png?amount=${booking.depositAmount}&addInfo=XENOW%20COC%20${booking.bookingId}&accountName=CONG%20TY%20XENOW`;

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <button onClick={() => navigate('/my-bookings')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft size={20} /> Quay lại danh sách
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">Thông tin đặt xe</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-bold text-gray-900">#XN-{booking.bookingId}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-500">Xe đã chọn</span>
                <span className="font-semibold text-gray-900 text-right">{booking.vehicleModel}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-500">Ngày thuê</span>
                <span className="text-gray-900">{new Date(booking.startDate).toLocaleDateString('vi-VN')} - {new Date(booking.endDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-500">Tổng giá trị hợp đồng</span>
                <span className="font-semibold text-gray-900">{booking.totalPrice?.toLocaleString('vi-VN')} ₫</span>
              </div>
              
              <div className="mt-8 p-6 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-orange-700 font-medium">TIỀN CỌC CẦN THANH TOÁN</span>
                  <span className="text-2xl font-bold text-orange-600">{booking.depositAmount?.toLocaleString('vi-VN')} ₫</span>
                </div>
                <p className="text-xs text-orange-600/80 leading-relaxed italic">
                  * Tiền cọc sẽ được hoàn trả 100% ngay sau khi bạn kết thúc hợp đồng thuê xe thành công.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 flex gap-4 items-start">
             <ShieldCheck className="text-blue-600 shrink-0" size={24} />
             <div>
                <h4 className="font-bold text-blue-900 text-sm mb-1">Giao dịch an toàn</h4>
                <p className="text-xs text-blue-700">XeNow cam kết bảo mật 100% thông tin và tài chính cho mọi giao dịch đặt cọc.</p>
             </div>
          </div>
        </div>

        {/* Right: Payment QR */}
        <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 w-full max-w-sm text-center">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Quét mã VietQR</h3>
                    <p className="text-xs text-gray-500">Sử dụng ứng dụng Ngân hàng hoặc Ví điện tử để quét</p>
                </div>

                <div className="relative group bg-gray-50 p-4 rounded-2xl mb-6">
                    <img src={qrUrl} alt="VietQR Payment" className="w-full aspect-square rounded-xl object-contain" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-[2px]">
                        <QrCode size={40} className="text-[#1B83A1]" />
                    </div>
                </div>

                <div className="space-y-4 text-left">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Chủ tài khoản</p>
                        <p className="font-bold text-gray-800 text-sm flex justify-between items-center">
                            CONG TY TNHH XENOW <Copy size={14} className="text-gray-300 cursor-pointer" />
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Nội dung chuyển khoản</p>
                        <p className="font-bold text-[#1B83A1] text-sm flex justify-between items-center">
                            XENOW COC {booking.bookingId} <Copy size={14} className="text-gray-300 cursor-pointer" />
                        </p>
                    </div>
                </div>

                <button 
                  onClick={handlePaymentConfirm}
                  disabled={confirming}
                  className="w-full mt-8 py-3.5 bg-gradient-to-r from-[#1B83A1] to-[#3B82F6] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                  {confirming ? 'Đang thực hiện...' : 'Tôi đã chuyển khoản xong'}
                </button>
            </div>
            
            <p className="mt-6 text-xs text-center text-gray-400 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-green-500" /> Thanh toán được bảo mật bởi VietQR & NAPAS
            </p>
        </div>
      </div>
    </div>
  );
}
