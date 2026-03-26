import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronDown, X } from 'lucide-react';
import { vehicles as initialVehicles } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';

const statusOptions = ['Tất cả trạng thái', 'available', 'rented', 'maintenance'];
const statusLabel = { available: 'Sẵn sàng', rented: 'Đã thuê', maintenance: 'Bảo trì' };

const emptyForm = { licensePlate: '', name: '', brand: '', type: '', location: '', pricePerDay: '', seats: '', mileage: '' };

export default function Vehicles() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState('');

  const filtered = vehicles.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.licensePlate.includes(search);
    const matchStatus = statusFilter === 'Tất cả trạng thái' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openAdd() { setForm(emptyForm); setEditId(null); setShowModal(true); }
  function openEdit(v) { setForm({ ...v, pricePerDay: String(v.pricePerDay) }); setEditId(v.id); setShowModal(true); }

  function handleSave() {
    if (editId) {
      setVehicles(vs => vs.map(v => v.id === editId ? { ...v, ...form, pricePerDay: Number(form.pricePerDay) } : v));
      showToast('Cập nhật xe thành công');
    } else {
      const newV = { ...form, id: Date.now(), pricePerDay: Number(form.pricePerDay), status: 'available', image: '' };
      setVehicles(vs => [...vs, newV]);
      showToast('Thêm xe mới thành công');
    }
    setShowModal(false);
  }

  function handleDelete(id) {
    setVehicles(vs => vs.filter(v => v.id !== id));
    showToast('Đã xóa xe');
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div />
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          <Plus size={16} /> Thêm xe mới
        </button>
      </div>

      {/* Filter card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên xe hoặc biển số..."
              className="w-full pl-9 pr-4 py-2 bg-[#F3F3F5] rounded-lg text-sm outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-[#F3F3F5] rounded-lg text-sm outline-none cursor-pointer"
            >
              {statusOptions.map(o => <option key={o}>{o === 'Tất cả trạng thái' ? o : statusLabel[o] ?? o}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-sm text-gray-500 ml-auto">{filtered.length} xe</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Biển số</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Tên xe</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Loại</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Vị trí</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Giá/ngày</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Trạng thái</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <tr key={v.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                <td className="px-4 py-3 font-mono text-gray-700">{v.licensePlate}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{v.name}</p>
                  <p className="text-xs text-gray-500">{v.brand}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">{v.type}</span>
                </td>
                <td className="px-4 py-3 text-gray-700">{v.location}</td>
                <td className="px-4 py-3 text-gray-700">{v.pricePerDay.toLocaleString('vi-VN')} ₫</td>
                <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(v)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{editId ? 'Chỉnh sửa xe' : 'Thêm xe mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                ['Tên xe', 'name', 'Toyota Camry 2023'],
                ['Biển số xe', 'licensePlate', '51A-12345'],
                ['Hãng xe', 'brand', 'Toyota'],
                ['Năm sản xuất', 'year', '2023'],
                ['Loại xe', 'type', 'Sedan'],
                ['Số chỗ ngồi', 'seats', '5'],
                ['Số km đã đi', 'mileage', '15000'],
                ['Giá thuê/ngày', 'pricePerDay', '800000'],
              ].map(([label, key, placeholder]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    value={form[key] ?? ''}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1B83A1]/30"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800">{editId ? 'Lưu' : 'Thêm xe'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 shadow-lg rounded-xl px-5 py-3 text-sm font-medium text-gray-800 z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
