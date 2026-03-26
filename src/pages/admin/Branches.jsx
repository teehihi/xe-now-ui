import { useState } from 'react';
import { MapPin, Phone, Car, Plus, Pencil, Trash2, X } from 'lucide-react';
import { locations as initialLocations } from '../../data/mockData';

const emptyForm = { name: '', address: '', city: '', phone: '' };

export default function Branches() {
  const [locations, setLocations] = useState(initialLocations);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  function openAdd() { setForm(emptyForm); setEditId(null); setShowModal(true); }
  function openEdit(l) { setForm({ ...l }); setEditId(l.id); setShowModal(true); }
  function handleSave() {
    if (editId) setLocations(ls => ls.map(l => l.id === editId ? { ...l, ...form } : l));
    else setLocations(ls => [...ls, { ...form, id: Date.now(), vehicleCount: 0 }]);
    setShowModal(false);
  }
  function handleDelete(id) { setLocations(ls => ls.filter(l => l.id !== id)); }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus size={16} /> Thêm chi nhánh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[['Tổng chi nhánh', locations.length], ['Đang hoạt động', locations.length], ['Tổng số xe', locations.reduce((s, l) => s + l.vehicleCount, 0)]].map(([label, val]) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-1">{val}</p>
          </div>
        ))}
      </div>

      {/* Branch cards */}
      <div className="grid grid-cols-2 gap-4">
        {locations.map(l => (
          <div key={l.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <MapPin size={18} className="text-[#1B83A1]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{l.name}</h3>
                  <p className="text-sm text-gray-500">{l.city}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" />{l.address}</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" />{l.phone}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
              <span className="text-gray-500">Số xe tại chi nhánh</span>
              <span className="font-semibold text-gray-900">{l.vehicleCount} xe</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-gray-500 font-medium">ID</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Tên chi nhánh</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Địa chỉ</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Thành phố</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Số điện thoại</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((l, i) => (
              <tr key={l.id} className={`border-b border-gray-50 hover:bg-gray-50 ${i === locations.length - 1 ? 'border-0' : ''}`}>
                <td className="px-4 py-3 font-mono text-gray-700">#{l.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{l.name}</td>
                <td className="px-4 py-3 text-gray-700">{l.address}</td>
                <td className="px-4 py-3 text-gray-700">{l.city}</td>
                <td className="px-4 py-3 font-mono text-gray-700">{l.phone}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={15} /></button>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">{editId ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh mới'}</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[['Tên chi nhánh', 'name'], ['Địa chỉ', 'address'], ['Thành phố', 'city'], ['Số điện thoại', 'phone']].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input value={form[key] ?? ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm outline-none" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm">Hủy</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium">
                {editId ? 'Lưu' : 'Thêm chi nhánh'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
