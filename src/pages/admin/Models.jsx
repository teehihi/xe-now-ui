import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Activity, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';
import Pagination from '../../components/Pagination';

const emptyForm = { modelName: '', brandId: '' };

export default function Models() {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]); // Used for dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [mData, bData] = await Promise.all([
        api.get(`/admin/models?page=${currentPage}&size=${pageSize}`),
        api.get('/admin/brands?size=100')
      ]);
      setModels(Array.isArray(mData.content) ? mData.content : []);
      setTotalPages(mData.totalPages || 0);
      setBrands(Array.isArray(bData.content) ? bData.content : []);
    } catch (error) {
      console.error('Error fetching models:', error);
      setError('Không thể tải danh sách mẫu xe. Vui lòng kiểm tra quyền hạn.');
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
      <button onClick={() => fetchData()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-all">Thử lại</button>
    </div>
  );

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  function openAdd() {
    setForm({ ...emptyForm, brandId: brands[0]?.brandId || '' });
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(m) {
    setForm({ ...m });
    setEditId(m.modelId);
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.modelName.trim() || !form.brandId) return showToast('Vui lòng điền đủ thông tin');

    try {
      const payload = {
        modelName: form.modelName,
        brandId: Number(form.brandId)
      };

      if (editId) {
        await api.put(`/admin/models/${editId}`, payload);
        showToast('Cập nhật mẫu xe thành công');
      } else {
        await api.post('/admin/models', payload);
        showToast('Thêm mẫu xe mới thành công');
      }
      fetchData();
      setShowModal(false);
    } catch (error) {
      showToast('Lỗi khi lưu dữ liệu');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mẫu xe này?')) return;
    try {
      await api.delete(`/admin/models/${id}`);
      showToast('Đã xóa mẫu xe');
      fetchData();
    } catch (error) {
      showToast('Lỗi khi xóa mẫu xe');
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý mẫu xe</h1>
          <p className="text-sm text-gray-500">Quản lý danh sách các dòng xe tương ứng với từng thương hiệu</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-sm">
          <Plus size={18} /> Thêm mẫu xe
        </button>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-auto min-h-0">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-100">
            <tr className="bg-gray-50/50">
              <th className="text-left px-8 py-4 text-gray-500 font-semibold">ID</th>
              <th className="text-left px-8 py-4 text-gray-500 font-semibold">Mẫu xe</th>
              <th className="text-left px-8 py-4 text-gray-500 font-semibold">Hãng xe</th>
              <th className="text-right px-8 py-4 text-gray-500 font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-400">Đang tải dữ liệu...</td>
              </tr>
            ) : (
              models.map((m) => (
                <tr key={m.modelId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 text-gray-500 font-mono text-xs">#{m.modelId}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Activity size={14} className="text-[#1B83A1]" />
                      </div>
                      <span className="font-semibold text-gray-900">{m.modelName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                      {m.brandName || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(m)} className="p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(m.modelId)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="shrink-0 pt-2 pb-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-900">{editId ? 'Chỉnh sửa mẫu xe' : 'Thêm mẫu xe mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Tên mẫu xe</label>
                <input
                  value={form.modelName}
                  onChange={e => setForm({ ...form, modelName: e.target.value })}
                  placeholder="VD: Camry, CR-V, Ranger..."
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Thuộc hãng xe</label>
                <div className="relative">
                  <select
                    value={form.brandId}
                    onChange={e => setForm({ ...form, brandId: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer"
                  >
                    {brands.map(b => (
                      <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
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
