import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Key, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import Pagination from '../../components/Pagination';

const emptyForm = { name: '', apiPath: '', method: 'GET', module: '' };
const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function Permissions() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => { fetchPermissions(); }, [currentPage, search, sortOrder]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/permissions/paged?page=${currentPage}&size=${pageSize}&keyword=${search}&sortDir=${sortOrder}`);
      setPermissions(Array.isArray(res.content) ? res.content : []);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      if (err.isForbidden) {
        setError('Bạn không có quyền truy cập vào danh sách quyền hạn.');
      } else {
        setError('Không thể tải danh sách quyền.');
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(p) {
    setForm({ name: p.name, apiPath: p.apiPath, method: p.method, module: p.module || '' });
    setEditId(p.id);
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.apiPath.trim()) return showToast('Vui lòng điền đầy đủ thông tin');
    try {
      if (editId) {
        await api.put(`/permissions/${editId}`, form);
        showToast('Cập nhật quyền thành công');
      } else {
        await api.post('/permissions', form);
        showToast('Tạo quyền mới thành công');
      }
      fetchPermissions();
      setShowModal(false);
    } catch (err) {
      if (!err.isForbidden) showToast(err.message || 'Lỗi khi lưu dữ liệu');
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Xóa quyền "${name}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await api.delete(`/permissions/${id}`);
      showToast('Đã xóa quyền');
      fetchPermissions();
    } catch (err) {
      if (!err.isForbidden) showToast(err.message || 'Không thể xóa quyền này');
    }
  }

  const methodColor = (m) => {
    const map = {
      GET: 'bg-emerald-100 text-emerald-700',
      POST: 'bg-blue-100 text-blue-700',
      PUT: 'bg-amber-100 text-amber-700',
      DELETE: 'bg-red-100 text-red-700',
      PATCH: 'bg-purple-100 text-purple-700',
    };
    return map[m] || 'bg-gray-100 text-gray-700';
  };

  if (initialLoad) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
      <p className="text-red-600 font-medium">{error}</p>
      <button onClick={fetchPermissions} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-all">Thử lại</button>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="shrink-0 flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Tìm kiếm quyền theo tên, module, path..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-sm">
          <Plus size={18} /> Thêm quyền
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-auto pb-4 px-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[200px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th 
                    className="text-left px-5 py-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors" 
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    title="Nhấn để sắp xếp"
                  >
                    ID <span className="text-[10px] text-gray-400">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  </th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600">Tên quyền</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600">Method</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600">API Path</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600">Module</th>
                  <th className="w-24 px-5 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {permissions.map(p => (
                  <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-500">#{p.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Key size={14} className="text-[#1B83A1]" />
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${methodColor(p.method)}`}>
                        {p.method}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <code className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg font-mono">{p.apiPath}</code>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                        {p.module || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && !initialLoad && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B83A1]"></div>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 pt-4 border-t border-gray-100">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-900">{editId ? 'Chỉnh sửa quyền' : 'Tạo quyền mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tên quyền *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: CREATE_VEHICLE"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">HTTP Method *</label>
                  <select
                    value={form.method}
                    onChange={e => setForm({ ...form, method: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                  >
                    {methods.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Module</label>
                  <input
                    value={form.module}
                    onChange={e => setForm({ ...form, module: e.target.value })}
                    placeholder="VD: VEHICLE, BOOKING..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">API Path *</label>
                <input
                  value={form.apiPath}
                  onChange={e => setForm({ ...form, apiPath: e.target.value })}
                  placeholder="VD: /api/admin/vehicles"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-8 py-6 bg-gray-50/50 border-t border-gray-50">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-all">
                Hủy bỏ
              </button>
              <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                {editId ? 'Lưu thay đổi' : 'Xác nhận tạo'}
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
