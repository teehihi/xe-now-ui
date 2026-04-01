import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Shield, Check, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import Pagination from '../../components/Pagination';

const emptyForm = { name: '', description: '', permissions: [] };

export default function Roles() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
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
  const [permSearch, setPermSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, [currentPage, search, sortOrder]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/roles/paged?page=${currentPage}&size=${pageSize}&keyword=${search}&sortDir=${sortOrder}`);
      setRoles(Array.isArray(res.content) ? res.content : []);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error('Error fetching roles:', err);
      if (err.isForbidden) {
        setError('Bạn không có quyền truy cập vào danh sách vai trò.');
      } else {
        setError('Không thể tải danh sách vai trò.');
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const fetchAllPermissions = async () => {
    try {
      const res = await api.get('/permissions');
      setAllPermissions(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Error fetching permissions:', err);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setPermSearch('');
    fetchAllPermissions();
    setShowModal(true);
  }

  function openEdit(role) {
    setForm({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions ? role.permissions.map(p => ({ id: p.id })) : [],
    });
    setEditId(role.id);
    setPermSearch('');
    fetchAllPermissions();
    setShowModal(true);
  }

  function togglePermission(permId) {
    setForm(prev => {
      const exists = prev.permissions.some(p => p.id === permId);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter(p => p.id !== permId)
          : [...prev.permissions, { id: permId }],
      };
    });
  }

  function toggleModule(module) {
    const modulePerms = allPermissions.filter(p => p.module === module);
    const allSelected = modulePerms.every(p => form.permissions.some(fp => fp.id === p.id));
    setForm(prev => {
      if (allSelected) {
        return { ...prev, permissions: prev.permissions.filter(fp => !modulePerms.some(mp => mp.id === fp.id)) };
      } else {
        const newPerms = [...prev.permissions];
        modulePerms.forEach(mp => {
          if (!newPerms.some(fp => fp.id === mp.id)) newPerms.push({ id: mp.id });
        });
        return { ...prev, permissions: newPerms };
      }
    });
  }

  async function handleSave() {
    if (!form.name.trim()) return showToast('Vui lòng nhập tên vai trò');
    try {
      if (editId) {
        await api.put(`/roles/${editId}`, form);
        showToast('Cập nhật vai trò thành công');
      } else {
        await api.post('/roles', form);
        showToast('Tạo vai trò mới thành công');
      }
      fetchRoles();
      setShowModal(false);
    } catch (err) {
      if (!err.isForbidden) showToast(err.message || 'Lỗi khi lưu dữ liệu');
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Xóa vai trò "${name}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await api.delete(`/roles/${id}`);
      showToast('Đã xóa vai trò');
      fetchRoles();
    } catch (err) {
      if (!err.isForbidden) showToast(err.message || 'Không thể xóa vai trò này');
    }
  }

  // Group permissions by module
  const permissionsByModule = allPermissions.reduce((acc, p) => {
    const m = p.module || 'OTHER';
    (acc[m] = acc[m] || []).push(p);
    return acc;
  }, {});

  const filteredModules = Object.entries(permissionsByModule).filter(([mod, perms]) => {
    if (!permSearch) return true;
    const q = permSearch.toLowerCase();
    return mod.toLowerCase().includes(q) || perms.some(p => p.name.toLowerCase().includes(q) || p.apiPath.toLowerCase().includes(q));
  });

  const methodColor = (m) => {
    const map = { GET: 'bg-emerald-100 text-emerald-700', POST: 'bg-blue-100 text-blue-700', PUT: 'bg-amber-100 text-amber-700', DELETE: 'bg-red-100 text-red-700' };
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
      <button onClick={fetchRoles} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-all">Thử lại</button>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="shrink-0 flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Tìm kiếm vai trò..."
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
          <Plus size={18} /> Thêm vai trò
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-auto pb-4 px-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[200px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th 
                    className="text-left px-6 py-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors" 
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    title="Nhấn để sắp xếp"
                  >
                    ID <span className="text-[10px] text-gray-400">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Tên vai trò</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Mô tả</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Số quyền</th>
                  <th className="w-24 px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">#{role.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-[#1B83A1]" />
                        <span className="font-semibold text-gray-900">{role.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{role.description || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        {role.permissions?.length || 0} quyền
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(role)} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(role.id, role.name)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 shrink-0">
              <h2 className="text-xl font-bold text-gray-900">{editId ? 'Chỉnh sửa vai trò' : 'Tạo vai trò mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Tên vai trò *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="VD: ADMIN, MANAGER..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Mô tả</label>
                  <input
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Mô tả ngắn gọn về vai trò"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Permissions assignment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">Gán quyền ({form.permissions.length} đã chọn)</label>
                  <input
                    value={permSearch}
                    onChange={e => setPermSearch(e.target.value)}
                    placeholder="Tìm kiếm quyền..."
                    className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm w-64 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  {filteredModules.map(([module, perms]) => {
                    const allSelected = perms.every(p => form.permissions.some(fp => fp.id === p.id));
                    const someSelected = perms.some(p => form.permissions.some(fp => fp.id === p.id));
                    return (
                      <div key={module} className="border-b border-gray-50 last:border-b-0">
                        <button
                          onClick={() => toggleModule(module)}
                          className="w-full flex items-center gap-3 px-5 py-3 bg-gray-50/50 hover:bg-gray-100/50 transition-colors text-left"
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center text-white transition-colors ${allSelected ? 'bg-[#1B83A1] border-[#1B83A1]' : someSelected ? 'bg-[#1B83A1]/50 border-[#1B83A1]/50' : 'border-gray-300'}`}>
                            {(allSelected || someSelected) && <Check size={12} />}
                          </div>
                          <span className="text-sm font-bold text-gray-700">{module}</span>
                          <span className="text-xs text-gray-400 ml-auto">{perms.length} quyền</span>
                        </button>
                        <div className="px-5 py-2 space-y-1">
                          {perms.map(p => {
                            const checked = form.permissions.some(fp => fp.id === p.id);
                            return (
                              <label key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => togglePermission(p.id)}
                                  className="w-4 h-4 rounded accent-[#1B83A1]"
                                />
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${methodColor(p.method)}`}>{p.method}</span>
                                <span className="text-sm text-gray-700 font-medium flex-1">{p.name}</span>
                                <span className="text-xs text-gray-400 font-mono">{p.apiPath}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {filteredModules.length === 0 && (
                    <p className="px-5 py-8 text-center text-sm text-gray-400">Không tìm thấy quyền nào</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-8 py-6 bg-gray-50/50 border-t border-gray-50 shrink-0">
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
