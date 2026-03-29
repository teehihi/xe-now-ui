import { useEffect, useState } from 'react';
import { MapPin, Phone, Plus, Pencil, Trash2, X, RefreshCcw, Building2 } from 'lucide-react';
import { api } from '../../services/api';

const emptyForm = { branchName: '', address: '', city: '', phone: '' };

export default function Branches() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/locations');
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  function openAdd() { setForm(emptyForm); setEditId(null); setShowModal(true); }
  function openEdit(l) { 
    setForm({ 
      branchName: l.branchName, 
      address: l.address, 
      city: l.city, 
      phone: l.phone 
    }); 
    setEditId(l.locationId); 
    setShowModal(true); 
  }

  async function handleSave() {
    try {
      setSaving(true);
      if (editId) {
        await api.put(`/admin/locations/${editId}`, form);
      } else {
        await api.post('/admin/locations', form);
      }
      setShowModal(false);
      fetchLocations();
    } catch (error) {
      alert('Lỗi khi lưu chi nhánh: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chi nhánh này?')) return;
    try {
      await api.delete(`/admin/locations/${id}`);
      fetchLocations();
    } catch (error) {
      alert('Lỗi khi xóa: ' + (error.response?.data?.message || error.message));
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-black text-gray-900">Hệ thống Chi nhánh</h2>
         <div className="flex gap-2">
            <button onClick={fetchLocations} className="p-2 text-gray-400 hover:text-[#1B83A1] transition-colors">
              <RefreshCcw size={20} />
            </button>
            <button onClick={openAdd} className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200">
              <Plus size={18} /> Thêm chi nhánh
            </button>
         </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Tổng chi nhánh', val: locations.length, color: 'text-[#1B83A1]', bg: 'bg-cyan-50' },
          { label: 'Các TP hiện diện', val: new Set(locations.map(l => l.city)).size, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Tổng phương tiện', val: locations.reduce((s, l) => s + (l.vehicleCount || 0), 0), color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-[2rem] p-8 border border-white/50 shadow-sm`}>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{s.label}</p>
            <p className={`text-4xl font-black ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
          </div>
        ) : locations.map(l => (
          <div key={l.locationId} className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1B83A1]/5 rounded-bl-[4rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1B83A1] flex items-center justify-center text-white shadow-lg shadow-cyan-100">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-gray-900 tracking-tight">{l.branchName}</h3>
                  <p className="text-sm font-bold text-[#1B83A1] uppercase tracking-widest">{l.city}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(l)} className="p-2.5 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={18} /></button>
                <button onClick={() => handleDelete(l.locationId)} className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>

            <div className="mt-8 space-y-4 relative z-10">
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <MapPin size={18} className="text-[#1B83A1]" />
                <span className="text-sm font-medium text-gray-600">{l.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                  <Phone size={14} /> {l.phone}
                </div>
                <div className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-tighter">
                   {l.vehicleCount || 0} Phương tiện
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-10 pt-10 pb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900">{editId ? 'Sửa thông tin' : 'Chi nhánh mới'}</h2>
                <p className="text-sm text-gray-400 font-medium">Cập nhật hệ thống phủ sóng của XeNow</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-10 pt-0 space-y-6">
              {[
                { label: 'Tên chi nhánh', key: 'branchName', placeholder: 'Ví dụ: XeNow Hoàn Kiếm' },
                { label: 'Địa chỉ', key: 'address', placeholder: 'Số 123, đường...' },
                { label: 'Thành phố', key: 'city', placeholder: 'Hà Nội, TP.HCM...' },
                { label: 'Số điện thoại', key: 'phone', placeholder: '09xxxxxxxxx' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">{f.label}</label>
                  <input 
                    placeholder={f.placeholder}
                    value={form[f.key] ?? ''} 
                    onChange={e => setForm(f_state => ({ ...f_state, [f.key]: e.target.value }))}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#1B83A1] transition-all" />
                </div>
              ))}
              
              <div className="pt-6 flex gap-4">
                <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-100 text-sm font-black text-gray-400 hover:bg-gray-50 transition-all">HỦY</button>
                <button 
                  disabled={saving}
                  onClick={handleSave} 
                  className="flex-[2] px-6 py-4 rounded-2xl bg-gray-900 text-white text-sm font-black hover:bg-[#1B83A1] transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                >
                  {saving ? 'ĐANG LƯU...' : (editId ? 'CẬP NHẬT' : 'XÁC NHẬN')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
