import { useEffect, useState } from 'react';
import { AlertTriangle, Calendar, CheckCircle, RefreshCcw, Car } from 'lucide-react';
import { api } from '../../services/api';

const THRESHOLDS = {
  LEVEL1: 5000,
  LEVEL2: 7500,
  LEVEL3: 10000,
};

export default function Maintenance() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/vehicles');
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMaintenance = async (id) => {
    try {
      await api.post(`/admin/vehicles/${id}/maintenance/complete`);
      fetchVehicles();
    } catch (error) {
       alert('Lỗi: ' + error.message);
    }
  };

  const getMaintenanceLevel = (gap) => {
    if (gap >= THRESHOLDS.LEVEL3) return { label: 'BẢO TRÌ LỚN', color: 'bg-red-500', text: 'text-red-600', level: 3 };
    if (gap >= THRESHOLDS.LEVEL2) return { label: 'KIỂM TRA TỔNG QUÁT', color: 'bg-orange-500', text: 'text-orange-600', level: 2 };
    if (gap >= THRESHOLDS.LEVEL1) return { label: 'THAY DẦU & BẢO DƯỠNG', color: 'bg-yellow-500', text: 'text-yellow-600', level: 1 };
    return { label: 'HOẠT ĐỘNG TỐT', color: 'bg-green-500', text: 'text-green-600', level: 0 };
  };

  const vehiclesDue = vehicles.filter(v => {
    const gap = (v.mileage || 0) - (v.lastMaintenanceMileage || 0);
    return gap >= THRESHOLDS.LEVEL1 || v.status === 'Maintenance' || v.status === 'MAINTENANCE';
  });

  const inService = vehicles.filter(v => v.status === 'Maintenance' || v.status === 'MAINTENANCE');

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">Giám sát Bảo trì</h2>
        <button onClick={fetchVehicles} className="p-2 text-gray-400 hover:text-[#1B83A1] transition-colors">
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Đang sửa chữa', val: inService.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Đã quá hạn (5k+)', val: vehiclesDue.length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Tổng số xe', val: vehicles.length, color: 'text-gray-600', bg: 'bg-gray-50' },
          { label: 'Bảo trì lớn (10k)', val: vehicles.filter(v => (v.mileage - (v.lastMaintenanceMileage || 0)) >= THRESHOLDS.LEVEL3).length, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-3xl p-6 border border-white/50 shadow-sm transition-transform hover:scale-[1.02]`}>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left: Alerts List */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
              <AlertTriangle className="text-orange-500" size={20} />
              <h3 className="font-bold text-gray-800">Danh sách Cảnh báo Phân cấp</h3>
            </div>
            
            <div className="divide-y divide-gray-50">
              {vehiclesDue.length > 0 ? vehiclesDue.map(v => {
                const gap = v.mileage - (v.lastMaintenanceMileage || 0);
                const info = getMaintenanceLevel(gap);
                const percent = Math.min((gap / THRESHOLDS.LEVEL3) * 100, 100);
                
                return (
                  <div key={v.id} className="p-8 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-4">
                        <div className={`p-4 rounded-2xl transition-all ${info.color} text-white shadow-lg`}>
                          <Car size={24} />
                        </div>
                        <div>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${info.text}`}>{info.label}</p>
                          <p className="font-black text-xl text-gray-900">{v.name}</p>
                          <p className="text-xs text-gray-400 font-medium">{v.licensePlate} • Số ghế: {v.seats}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black ${info.text}`}>+{gap.toLocaleString()} KM</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Quá mốc bảo trì</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden p-1">
                        <div 
                          className={`h-full transition-all duration-1000 ${info.color} rounded-full flex items-center justify-end px-2`}
                          style={{ width: `${percent}%` }}
                        >
                           <span className="text-[8px] text-white font-black">{Math.round(percent)}%</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleCompleteMaintenance(v.id)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-[#1B83A1] hover:shadow-lg transition-all active:scale-95"
                      >
                        <CheckCircle size={14} /> Bảo trì xong
                      </button>
                    </div>
                    
                    <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-400">
                       <span className={gap >= 5000 ? 'text-yellow-600' : ''}>5,000 KM</span>
                       <span className={gap >= 7500 ? 'text-orange-600' : ''}>7,500 KM</span>
                       <span className={gap >= 10000 ? 'text-red-600' : ''}>10,000 KM</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-20 text-center">
                  <div className="inline-block p-6 bg-green-50 rounded-full text-green-500 mb-4">
                    <CheckCircle size={40} />
                  </div>
                  <p className="text-gray-400 font-bold">Mọi thứ đều sạch sẽ!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Legend */}
        <div className="space-y-6">
           <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
              <h4 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#1B83A1] rounded-full" />
                Phân cấp bảo trì
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mt-1 shadow-sm shadow-yellow-200" />
                  <div>
                    <p className="text-xs font-black text-gray-800">CẤP 1 (5,000 KM)</p>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Thay dầu máy, lọc dầu, kiểm tra hệ thống phanh cơ bản.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mt-1 shadow-sm shadow-orange-200" />
                  <div>
                    <p className="text-xs font-black text-gray-800">CẤP 2 (7,500 KM)</p>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Vệ sinh lọc gió, đảo lốp, kiểm tra nước làm mát.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 rounded-full bg-red-500 mt-1 shadow-sm shadow-red-200" />
                  <div>
                    <p className="text-xs font-black text-gray-800">CẤP 3 (10,000 KM)</p>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Bảo trì toàn bộ, thay bugi, kiểm tra hệ thống treo & lái.</p>
                  </div>
                </div>
              </div>
           </div>

           <div className="bg-[#1B83A1] rounded-[2rem] p-8 text-white shadow-xl">
              <RefreshCcw className="mb-4 opacity-50" size={32} />
              <h4 className="text-lg font-black mb-2">Tự động hóa</h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Dữ liệu KM được tự động lấy từ lịch sử trả xe của khách hàng. Bạn chỉ việc theo dõi và đưa xe đi bảo dưỡng đúng hạn.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
