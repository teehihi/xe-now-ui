import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Award } from 'lucide-react';
import { api } from '../../services/api';

const emptyForm = { brandName: '' };

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/brands');
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  function openAdd() { 
    setForm(emptyForm); 
    setEditId(null); 
    setShowModal(true); 
  }

  function openEdit(b) { 
    setForm({ ...b }); 
    setEditId(b.brandId); 
    setShowModal(true); 
  }

  async function handleSave() {
    if (!form.brandName.trim()) return showToast('Vui lòng nhập tên hãng');
    
    try {
      if (editId) {
        await api.put(`/admin/brands/${editId}`, form);
        showToast('Cập nhật hãng thành công');
      } else {
        await api.post('/admin/brands', form);
        showToast('Thêm hãng mới thành công');
      }
      fetchBrands();
      setShowModal(false);
    } catch (error) {
      showToast('Lỗi khi lưu dữ liệu');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa hãng này sẽ ảnh hưởng đến các mẫu xe liên quan. Bạn chắc chắn?')) return;
    try {
      await api.delete(`/admin/brands/${id}`);
      showToast('Đã xóa hãng xe');
      fetchBrands();
    } catch (error) {
      showToast('Lỗi khi xóa hãng');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý hãng xe</h1>
          <p className="text-sm text-gray-500">Quản lý danh mục các thương hiệu xe trong hệ thống</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-sm">
          <Plus size={18} /> Thêm hãng xe
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {brands.map(b => (
            <div key={b.brandId} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                    <Award size={24} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{b.brandName}</h3>
                    <p className="text-xs text-gray-500">ID: #{b.brandId}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(b.brandId)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-900">{editId ? 'Chỉnh sửa hãng' : 'Thêm hãng mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Tên hãng xe</label>
                <div className="relative">
                  <input 
                    value={form.brandName} 
                    onChange={e => setForm({ ...form, brandName: e.target.value })}
                    placeholder="VD: Toyota, Honda..."
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-8 py-6 bg-gray-50/50 border-t border-gray-50">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-all">
                Hủy bỏ
              </button>
              <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                {editId ? 'Lưu thay đổi' : 'Xác nhận thêm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-medium shadow-2xl animate-in slide-in-from-bottom duration-300 z-[100]">
          {toast}
        </div>
      )}
    </div>
  );
}
