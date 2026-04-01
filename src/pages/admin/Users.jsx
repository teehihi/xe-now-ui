import { useEffect, useState } from 'react';
import { 
  Users, Search, Shield, UserCheck, Mail, Phone, 
  Calendar, MoreVertical, Check, X, ShieldAlert,
  UserRound, Lock, Unlock, UserCog
} from 'lucide-react';
import { api } from '../../services/api';
import Pagination from '../../components/Pagination';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [initialLoad, setInitialLoad] = useState(true);
  const [toast, setToast] = useState('');
  
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tempRoles, setTempRoles] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [currentPage, search, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?page=${currentPage}&size=${pageSize}&sort=id,${sortOrder}${search ? `&keyword=${search}` : ''}`);
      setUsers(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Disabled' : 'Active';
    const confirmMsg = newStatus === 'Disabled' 
      ? `Khóa tài khoản của ${user.fullName}?` 
      : `Mở khóa tài khoản cho ${user.fullName}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await api.post(`/admin/users/${user.userId}/status?status=${newStatus}`);
      showToast(`${newStatus === 'Active' ? 'Đã mở khóa' : 'Đã khóa'} tài khoản thành công`);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setTempRoles([...user.roles]);
    setShowRoleModal(true);
  };

  const toggleRoleSelection = (roleName) => {
    setTempRoles(prev => 
      prev.includes(roleName) 
        ? prev.filter(r => r !== roleName) 
        : [...prev, roleName]
    );
  };

  const handleUpdateRoles = async () => {
    try {
      await api.post(`/admin/users/${selectedUser.userId}/roles`, tempRoles);
      showToast('Cập nhật vai trò thành công');
      setShowRoleModal(false);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật vai trò');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Disabled': return 'bg-red-50 text-red-700 border-red-100';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  if (initialLoad) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      {/* Header & Filter */}
      <div className="shrink-0 flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-[#1B83A1]/5 focus:border-[#1B83A1] outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
          <Users size={16} />
          <span>Tổng số: <b>{totalElements}</b> thành viên</span>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-auto pb-4 px-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[200px]">
             <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th 
                    className="text-left px-6 py-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  >
                    ID <span className="text-[10px] text-gray-400 ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Thông tin người dùng</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Liên hệ</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Vai trò</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Ngày tạo</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Trạng thái</th>
                  <th className="w-24 px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.userId} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">#{user.userId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0 capitalize font-bold">
                          {user.fullName ? user.fullName.charAt(0) : user.username.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user.fullName || 'N/A'}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={12} className="text-gray-400" />
                          <span className="text-xs">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={12} className="text-gray-400" />
                          <span className="text-xs">{user.phone || 'Chưa cập nhật'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.map(r => (
                          <span key={r} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 uppercase">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      <span className="text-xs">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(user.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {user.status === 'Active' ? 'Đang hoạt động' : 'Đã bị khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => openRoleModal(user)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Chỉnh sửa vai trò"
                        >
                          <UserCog size={18} />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 rounded-lg transition-colors ${user.status === 'Active' 
                            ? 'hover:bg-red-50 text-gray-400 hover:text-red-600' 
                            : 'hover:bg-emerald-50 text-gray-400 hover:text-emerald-600'}`}
                          title={user.status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          {user.status === 'Active' ? <Lock size={18} /> : <Unlock size={18} />}
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
        
        {/* Pagination */}
        <div className="shrink-0 pt-4 border-t border-gray-100">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Role Management Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Vai trò người dùng</h2>
              <button onClick={() => setShowRoleModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1B83A1] font-bold shadow-sm">
                  {selectedUser.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedUser.fullName}</p>
                  <p className="text-xs text-gray-500">@{selectedUser.username}</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Chọn các vai trò:</label>
                <div className="grid gap-2">
                  {roles.map(role => {
                    const isSelected = tempRoles.includes(role.name);
                    return (
                      <button
                        key={role.id}
                        onClick={() => toggleRoleSelection(role.name)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? 'bg-[#1B83A1]/5 border-[#1B83A1] text-[#1B83A1]' 
                            : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        <span className="font-medium">{role.name}</span>
                        {isSelected && <Check size={18} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex gap-3">
              <button 
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-white transition-all"
              >
                Hủy
              </button>
              <button 
                onClick={handleUpdateRoles}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-medium shadow-2xl animate-in slide-in-from-bottom duration-300 z-[100]">
          {toast}
        </div>
      )}
    </div>
  );
}
