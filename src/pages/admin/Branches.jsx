import { useEffect, useState } from 'react';
import { MapPin, Phone, Plus, Pencil, Trash2, X, RefreshCcw, Building2 } from 'lucide-react';
import { api } from '../../services/api';
import Pagination from '../../components/Pagination';
import AddressPicker from '../../components/AddressPicker';

const emptyForm = { branchName: '', address: '', city: '', phone: '', street: '' };

export default function Branches() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(4);

  useEffect(() => {
    fetchLocations();
  }, [currentPage]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/admin/locations?page=${currentPage}&size=${pageSize}`);
      setLocations(Array.isArray(res.content) ? res.content : []);
      setTotalPages(res.totalPages || 0);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Không thể tải danh sách chi nhánh. Vui lòng kiểm tra quyền hạn.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
      <p className="text-red-600 font-medium">{error}</p>
      <button onClick={() => fetchLocations()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-all">Thử lại</button>
    </div>
  );

  function openAdd() { setForm(emptyForm); setEditId(null); setShowModal(true); }
  function openEdit(l) {
    const parts = (l.address || '').split(',');
    const street = parts[0]?.trim() || '';
    setForm({
      branchName: l.branchName,
      address: l.address,
      city: l.city,
      phone: l.phone,
      street,
      initialAddress: l.address,
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
      setToast('Lỗi khi lưu chi nhánh: ' + (error.response?.data?.message || error.message));
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
      setToast('Lỗi khi xóa: ' + (error.response?.data?.message || error.message));
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between">
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

      {/* Grid List */}
      <div className="flex-1 min-h-0 flex flex-col">
        {loading ? (
          <div className="flex-1 flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto pb-4 px-1">
              <div className="grid grid-cols-2 gap-6">
                {locations.map(l => (
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
                        <span className="text-sm font-medium text-gray-600">
                          {(l.address || '').split(',').slice(0, -1).join(',').trim()}
                        </span>
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
            </div>

            <div className="shrink-0 pt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-black text-gray-900">{editId ? 'Sửa thông tin' : 'Chi nhánh mới'}</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Cập nhật hệ thống phủ sóng của XeNow</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={22} /></button>
            </div>

            <div className="px-8 pb-8 space-y-4 overflow-y-auto flex-1 scrollbar-hide">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Tên chi nhánh</label>
                <input
                  placeholder="Ví dụ: XeNow Hoàn Kiếm"
                  value={form.branchName ?? ''}
                  onChange={e => setForm(f => ({ ...f, branchName: e.target.value }))}
                  className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#1B83A1] transition-all"
                />
              </div>

              <AddressPicker
                streetAddress={form.street || ''}
                onStreetChange={v => setForm(f => ({ ...f, street: v }))}
                onAddressChange={({ address, city }) => setForm(f => ({ ...f, address, city }))}
                initialAddress={form.initialAddress || ''}
              />

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Số điện thoại</label>
                <input
                  placeholder="09xxxxxxxxx"
                  value={form.phone ?? ''}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#1B83A1] transition-all"
                />
              </div>

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
