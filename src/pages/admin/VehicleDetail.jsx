import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, MapPin, Calendar, Shield, Gauge, Fuel, Users, ArrowLeft, Pencil, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/admin/vehicles/${id}`);
      setVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      showToast('Không thể tải thông tin xe');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const getImgUrl = (url) => {
    if (!url) return '/images/car-toyota-camry.webp';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  if (!vehicle) return (
    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
      <p className="text-gray-500">Không tìm thấy thông tin xe</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Quay lại danh sách</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{vehicle.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{vehicle.licensePlate}</span>
              <StatusBadge status={vehicle.status} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/admin/vehicles?edit=${id}`)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Pencil size={16} /> Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Photos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Hình ảnh xe</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video rounded-xl bg-gray-50 overflow-hidden border border-gray-100 relative group">
                <img src={getImgUrl(vehicle.image)} alt={vehicle.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-blue-500 text-white text-[10px] rounded shadow-sm">Ảnh chính</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {vehicle.images?.filter(img => !img.isPrimary).slice(0, 4).map((img, idx) => (
                  <div key={img.imageId || idx} className="aspect-video rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                    <img src={getImgUrl(img.imageUrl || img.url)} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {(!vehicle.images || vehicle.images.length <= 1) && (
                   <div className="col-span-2 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                      Chưa có ảnh phụ
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Thông số kỹ thuật</h3>
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Car size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500">Mẫu xe</p>
                    <p className="font-semibold text-gray-900">{vehicle.modelName || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Calendar size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500">Năm sản xuất</p>
                    <p className="font-semibold text-gray-900">{vehicle.manufactureYear || vehicle.year}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Users size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500">Số chỗ ngồi</p>
                    <p className="font-semibold text-gray-900">{vehicle.seats} chỗ</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Fuel size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500">Loại nhiên liệu</p>
                    <p className="font-semibold text-gray-900">{vehicle.fuelType || 'Xăng'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Gauge size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500">Số km đã đi</p>
                    <p className="font-semibold text-gray-900">{vehicle.mileage?.toLocaleString('vi-VN')} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MapPin size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500">Vị trí hiện tại</p>
                    <p className="font-semibold text-gray-900">{vehicle.locationName || vehicle.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Maintenance (Placeholders for now) */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Thông tin giá</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Giá thuê ngày</span>
                  <span className="font-bold text-[#1B83A1]">{(vehicle.dailyRate || vehicle.pricePerDay || 0).toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Tiền cọc (Deposit)</span>
                  <span className="font-bold text-orange-600">{(vehicle.depositAmount || 0).toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Bảo hiểm mặc định</span>
                  <span className="font-medium text-gray-700">Đã bao gồm</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">Thuế GTGT (10%)</span>
                  <span className="font-medium text-gray-700">Chưa bao gồm</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Tình trạng bảo trì</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-green-100 text-green-600 rounded-full mt-0.5"><CheckCircle2 size={14} /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bảo trì gần nhất</p>
                    <p className="text-xs text-gray-500">12/03/2026 (Thay nhớt, kiểm tra phanh)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-orange-100 text-orange-600 rounded-full mt-0.5"><Clock size={14} /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bảo trì dự kiến</p>
                    <p className="text-xs text-gray-500">12/05/2026 (Đăng kiểm định kỳ)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <h3 className="font-bold text-gray-900 mb-4">Trạng thái hiện tại</h3>
             <div className={`p-4 rounded-xl mb-4 ${
               vehicle.status?.toLowerCase() === 'available' ? 'bg-green-50' : 
               vehicle.status?.toLowerCase() === 'rented' ? 'bg-blue-50' : 'bg-orange-50'
             }`}>
                <div className="flex items-center gap-3 mb-2">
                   {vehicle.status?.toLowerCase() === 'available' ? <CheckCircle2 className="text-green-600" size={18} /> : 
                    vehicle.status?.toLowerCase() === 'rented' ? <Clock className="text-blue-600" size={18} /> : 
                    <AlertCircle className="text-orange-600" size={18} />}
                   <span className={`font-bold text-sm ${
                     vehicle.status?.toLowerCase() === 'available' ? 'text-green-700' : 
                     vehicle.status?.toLowerCase() === 'rented' ? 'text-blue-700' : 'text-orange-700'
                   }`}>
                     {vehicle.status?.toLowerCase() === 'available' ? 'SẴN SÀNG CHO THUÊ' : 
                      vehicle.status?.toLowerCase() === 'rented' ? 'ĐANG ĐƯỢC THUÊ' : 'ĐANG BẢO TRÌ'}
                   </span>
                </div>
                <p className="text-xs text-gray-600">
                   {vehicle.status === 'Available' ? 'Xe đã sẵn sàng tại bãi và có thể đặt ngay.' : 
                    vehicle.status === 'Rented' ? 'Xe đang được khách hàng sử dụng, dự kiến trả ngày 05/04/2026.' : 
                    'Xe đang trong quá trình kiểm tra kỹ thuật định kỳ.'}
                </p>
             </div>
             
             <div className="space-y-3">
                <button className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                   Đặt lịch bảo trì
                </button>
                <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                   Xem lịch sử chuyến đi
                </button>
             </div>
          </div>

          <div className="bg-[#1B83A1] rounded-2xl p-6 text-white">
             <Shield className="mb-4 opacity-80" size={32} />
             <h3 className="font-bold text-lg mb-2">Hồ sơ kỹ thuật</h3>
             <p className="text-sm text-white/80 leading-relaxed mb-4">
                Sổ đăng kiểm và giấy tờ bảo hiểm còn thời hạn đến ngày 30/12/2026.
             </p>
             <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                Xem giấy tờ xe
             </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-medium shadow-2xl animate-in slide-in-from-bottom duration-300 z-[100]">
          {toast}
        </div>
      )}
    </div>
  );
}
