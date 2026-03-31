import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';
import Pagination from '../../components/Pagination';

const emptyForm = { name: '', email: '', phone: '', idCard: '', licenseExpiry: '' };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      setError(null);
      const data = await api.get('/admin/customers');
      setCustomers(Array.isArray(data) ? data : []);
=======
      const response = await api.get(`/admin/customers?page=${currentPage}&size=${pageSize}`);
      const pageData = response.data;
      setCustomers(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
>>>>>>> refs/remotes/origin/main
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Không thể tải danh sách khách hàng. Vui lòng kiểm tra quyền hạn.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);


  const filtered = (customers || []).filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').includes(search) || (c.phone || '').includes(search)
  );

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
      <p className="text-red-600 font-medium">{error}</p>
      <button onClick={() => fetchCustomers()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-all">Thử lại</button>
    </div>
  );

  function openAdd() { setForm(emptyForm); setEditId(null); setShowModal(true); }
  function openEdit(c) { setForm({ ...c }); setEditId(c.id); setShowModal(true); }
  function handleSave() {
    if (editId) setCustomers(cs => cs.map(c => c.id === editId ? { ...c, ...form } : c));
    else setCustomers(cs => [...cs, { ...form, id: Date.now(), totalBookings: 0 }]);
    setShowModal(false);
  }
  function handleDelete(id) { setCustomers(cs => cs.filter(c => c.id !== id)); }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      {/* Header action */}
      <div className="shrink-0 flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus size={16} /> Thêm khách hàng
        </button>
      </div>

      {/* Stat cards */}
      <div className="shrink-0 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Tổng khách hàng</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{totalElements}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Mới tháng này</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">0</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Đang hiển thị</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{customers.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            className="w-full pl-9 pr-4 py-2 bg-[#F3F3F5] rounded-lg text-sm outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">ID</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Họ và tên</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Số điện thoại</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">CMND/CCCD</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">GPLX hết hạn</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.customerId || c.userId} className={`border-b border-gray-50 hover:bg-gray-50 ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3 font-mono text-gray-700">#{c.customerId}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name || c.fullName}</td>
                  <td className="px-4 py-3 text-gray-700">{c.email}</td>
                  <td className="px-4 py-3 font-mono text-gray-700">{c.phone || 'N/A'}</td>
                  <td className="px-4 py-3 font-mono text-gray-700">{c.identityCard || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-700">{c.driverLicenseExpiry || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(c.customerId || c.userId)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="shrink-0 px-4 py-4 border-t border-gray-100 bg-gray-50/50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">{editId ? 'Chỉnh sửa' : 'Thêm khách hàng'}</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[['Họ và tên', 'name'], ['Email', 'email'], ['Số điện thoại', 'phone'], ['CMND/CCCD', 'idCard'], ['Ngày hết hạn GPLX', 'licenseExpiry']].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input value={form[key] ?? ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm outline-none" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm">Hủy</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
