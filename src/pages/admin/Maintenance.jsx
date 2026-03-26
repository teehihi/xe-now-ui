import { Plus, AlertTriangle, Calendar } from 'lucide-react';
import { maintenanceLogs, vehiclesNeedMaintenance } from '../../data/mockData';

export default function Maintenance() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus size={16} /> Thêm lịch bảo trì
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          ['Tổng bảo trì', '2'],
          ['Đến hạn bảo trì', '3'],
          ['Chi phí bảo trì', '3.700.000 ₫'],
          ['Trung bình/xe', '1.850.000 ₫'],
        ].map(([label, val]) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{val}</p>
          </div>
        ))}
      </div>

      {/* Vehicles needing maintenance */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-orange-500" />
          <h3 className="font-semibold text-gray-900">Xe cần bảo trì</h3>
        </div>
        <div className="space-y-3">
          {vehiclesNeedMaintenance.map(v => (
            <div key={v.id} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{v.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Km hiện tại: {v.currentKm.toLocaleString('vi-VN')} / Bảo trì tiếp theo: {v.nextKm.toLocaleString('vi-VN')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-orange-100 text-orange-700 border border-orange-300 rounded-lg text-xs font-medium">Sắp đến hạn</span>
                <button className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800">Lên lịch</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <Calendar size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900">Lịch sử bảo trì</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['ID', 'Xe', 'Ngày bảo trì', 'Loại dịch vụ', 'Km hiện tại', 'Km tiếp theo', 'Garage', 'Chi phí'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {maintenanceLogs.map((m, i) => (
              <tr key={m.id} className={`border-b border-gray-50 hover:bg-gray-50 ${i === maintenanceLogs.length - 1 ? 'border-0' : ''}`}>
                <td className="px-4 py-3 font-mono text-gray-700">#{m.id}</td>
                <td className="px-4 py-3 text-gray-900">{m.vehicleName}</td>
                <td className="px-4 py-3 text-gray-700">{m.date}</td>
                <td className="px-4 py-3 text-gray-700">{m.serviceType}</td>
                <td className="px-4 py-3 text-gray-700">{m.currentKm.toLocaleString('vi-VN')} km</td>
                <td className="px-4 py-3 text-gray-700">{m.nextKm.toLocaleString('vi-VN')} km</td>
                <td className="px-4 py-3 text-gray-700">{m.garage}</td>
                <td className="px-4 py-3 text-gray-700">{m.cost.toLocaleString('vi-VN')} ₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
