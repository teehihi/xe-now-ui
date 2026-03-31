import { useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronDown, X, Upload, Eye } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const statusOptions = ['Tất cả trạng thái', 'Available', 'Rented', 'Maintenance'];
const statusLabel = { Available: 'Sẵn sàng', Rented: 'Đã thuê', Maintenance: 'Bảo trì' };
const vehicleTypes = ['xe ô tô', 'xe tay ga', 'xe số'];

const emptyForm = { licensePlate: '', modelId: '', type: 'xe ô tô', locationId: '', pricePerDay: '', depositAmount: '', seats: '', mileage: '', manufactureYear: 2023 };

export default function Vehicles() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const editIdParam = searchParams.get('edit');
    if (editIdParam && vehicles?.length > 0) {
      const v = vehicles.find(v => (v.vehicleId || v.id) === Number(editIdParam));
      if (v) openEdit(v);
    }
  }, [searchParams, vehicles]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [vData, lData, mData] = await Promise.all([
        api.get('/admin/vehicles'),
        api.get('/locations'),
        api.get('/admin/models')
      ]);
      setVehicles(Array.isArray(vData) ? vData : []);
      setLocations(Array.isArray(lData) ? lData : []);
      setModels(Array.isArray(mData) ? mData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Không thể tải dữ liệu xe. Vui lòng kiểm tra quyền truy cập của bạn.');
    } finally {
      setLoading(false);
    }
  };

  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState('');

  const filtered = (vehicles || []).filter(v => {
    const matchSearch = (v.name || '').toLowerCase().includes(search.toLowerCase()) || 
                       (v.licensePlate || '').includes(search);
    const matchStatus = statusFilter === 'Tất cả trạng thái' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

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

  function openAdd() { 
    setForm({ ...emptyForm, locationId: locations[0]?.locationId, modelId: models[0]?.modelId }); 
    setEditId(null); 
    setShowModal(true); 
  }
  
  function openEdit(v) { 
    setForm({ 
      ...v, 
      pricePerDay: String(v.pricePerDay || v.dailyRate || ''),
      type: v.type,
      locationId: v.locationId,
      modelId: v.modelId
    }); 
    setEditId(v.vehicleId || v.id); 
    setShowModal(true); 
  }

  async function handleSave() {
    try {
      const payload = {
        ...form,
        pricePerDay: Number(form.pricePerDay) || 0,
        dailyRate: Number(form.pricePerDay) || 0,
        type: form.type || 'Xe ô tô',
        locationId: Number(form.locationId) || (locations[0]?.locationId),
        modelId: Number(form.modelId) || (models[0]?.modelId)
      };

      if (!payload.modelId) {
        showToast('Vui lòng chọn mẫu xe');
        return;
      }

      if (editId) {
        await api.put(`/admin/vehicles/${editId}`, payload);
        showToast('Cập nhật xe thành công');
      } else {
        await api.post('/admin/vehicles', payload);
        showToast('Thêm xe mới thành công');
      }
      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error('Save error:', error);
      const msg = error.response?.data?.error || error.message || 'Lỗi khi lưu dữ liệu';
      showToast(msg);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) return;
    try {
      await api.delete(`/admin/vehicles/${id}`);
      showToast('Đã xóa xe');
      fetchData();
    } catch (error) {
      showToast('Lỗi khi xóa xe');
    }
  }

  async function handleFileUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0 || !editId) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    try {
        await api.post(`/admin/vehicles/${editId}/images`, formData);
        showToast('Tải ảnh lên thành công');
        // Refresh vehicle data to show new images
        const updatedVehicle = await api.get(`/admin/vehicles`);
        setVehicles(updatedVehicle);
        const current = updatedVehicle.find(v => (v.vehicleId || v.id) === editId);
        if (current) setForm(prev => ({ ...prev, images: current.images }));
    } catch (error) {
        showToast('Lỗi khi tải ảnh');
    }
  }

  async function handleDeleteImage(imageId) {
    if (!window.confirm('Xóa ảnh này?')) return;
    try {
        await api.delete(`/admin/vehicles/images/${imageId}`);
        const updatedImages = form.images.filter(img => img.imageId !== imageId);
        setForm(prev => ({ ...prev, images: updatedImages }));
        showToast('Đã xóa ảnh');
    } catch (error) {
        showToast('Lỗi khi xóa ảnh');
    }
  }

  async function handleSetPrimary(imageId) {
    try {
        await api.put(`/admin/vehicles/images/${imageId}/primary`);
        const updatedImages = form.images.map(img => ({
            ...img,
            isPrimary: img.imageId === imageId
        }));
        setForm(prev => ({ ...prev, images: updatedImages }));
        showToast('Đã đặt làm ảnh chính');
        fetchData(); // Refresh list to update thumbnail
    } catch (error) {
        showToast('Lỗi khi đặt ảnh chính');
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const getImgUrl = (url) => {
    if (!url) return '/images/car-toyota-camry.webp';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
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
              {statusOptions.map(o => <option key={o} value={o}>{o === 'Tất cả trạng thái' ? o : statusLabel[o] ?? o}</option>)}
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
              <th className="text-left px-4 py-3 text-gray-500 font-medium w- condensation">Ảnh</th>
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
              <tr key={v.vehicleId || v.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                <td className="px-4 py-2">
                  <img src={getImgUrl(v.image)} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                </td>
                <td className="px-4 py-3 font-mono text-gray-700">{v.licensePlate}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{v.name}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">{v.typeName || v.type || 'N/A'}</span>
                </td>
                <td className="px-4 py-3 text-gray-700">{v.locationName || v.location || 'N/A'}</td>
                <td className="px-4 py-3 text-gray-700">{(v.dailyRate || v.pricePerDay || 0).toLocaleString('vi-VN')} ₫</td>
                <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => navigate(`/admin/vehicles/${v.vehicleId || v.id}`)} title="Xem chi tiết" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"><Eye size={15} /></button>
                    <button onClick={() => openEdit(v)} title="Chỉnh sửa" className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(v.vehicleId || v.id)} title="Xóa" className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="relative">
                <h2 className="text-xl font-bold text-gray-900">{editId ? 'Chỉnh sửa xe' : 'Thêm xe mới'}</h2>
                <div className="absolute -bottom-1 left-0 w-12 h-1 bg-blue-500 rounded-full" />
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={20} /></button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Mẫu xe (Model)</label>
                  <div className="relative">
                    <select
                      value={form.modelId || ''}
                      onChange={e => setForm(f => ({ ...f, modelId: e.target.value }))}
                      className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 appearance-none border-transparent focus:border-blue-500 transition-all font-medium"
                    >
                      <option value="">Chọn mẫu xe</option>
                      {models.map(m => (
                        <option key={m.modelId} value={m.modelId}>
                          {m.brandName ? `${m.brandName} - ` : ''}{m.modelName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Biển số xe</label>
                  <input
                    value={form.licensePlate || ''}
                    onChange={e => setForm(f => ({ ...f, licensePlate: e.target.value }))}
                    placeholder="51A-12345"
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 border-transparent focus:border-blue-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Năm sản xuất</label>
                  <input
                    type="number"
                    value={form.manufactureYear || form.year || ''}
                    onChange={e => setForm(f => ({ ...f, manufactureYear: Number(e.target.value) }))}
                    placeholder="2023"
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 border-transparent focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Loại xe</label>
                  <select
                    value={form.type || ''}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20"
                  >
                    {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Số chỗ ngồi</label>
                  <input
                    type="number"
                    value={form.seats || ''}
                    onChange={e => setForm(f => ({ ...f, seats: Number(e.target.value) }))}
                    placeholder="5"
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 border-transparent focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Số km đã đi</label>
                  <input
                    type="number"
                    value={form.mileage || ''}
                    onChange={e => setForm(f => ({ ...f, mileage: Number(e.target.value) }))}
                    placeholder="15000"
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 border-transparent focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Giá thuê/ngày</label>
                  <input
                    type="number"
                    value={form.pricePerDay || form.dailyRate || ''}
                    onChange={e => setForm(f => ({ ...f, pricePerDay: Number(e.target.value) }))}
                    placeholder="800000"
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 border-transparent focus:border-blue-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Tiền cọc (Deposit)</label>
                  <input
                    type="number"
                    value={form.depositAmount || ''}
                    onChange={e => setForm(f => ({ ...f, depositAmount: Number(e.target.value) }))}
                    placeholder="2000000"
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 border-transparent focus:border-blue-500 transition-all font-medium"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Vị trí/Chi nhánh</label>
                  <select
                    value={form.locationId || ''}
                    onChange={e => setForm(f => ({ ...f, locationId: Number(e.target.value) }))}
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Chọn chi nhánh</option>
                    {locations.map(l => <option key={l.locationId} value={l.locationId}>{l.branchName}</option>)}
                  </select>
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Hình ảnh xe</label>
                
                {/* Custom Upload Area */}
                <label className={`block w-full border-2 border-dashed border-gray-200 rounded-2xl py-10 transition-all ${editId ? 'hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer' : 'opacity-50 grayscale'}`}>
                  <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={!editId} accept="image/*" />
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-gray-50 rounded-full mb-3 text-gray-400">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Chọn ảnh</p>
                    <p className="text-xs text-gray-400 mt-1">hoặc kéo thả ảnh vào đây</p>
                  </div>
                </label>

                {!editId && (
                  <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">Lưu thông tin xe trước khi tải ảnh lên.</p>
                )}

                {/* Thumbnails */}
                {form.images && form.images.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {form.images.map(img => (
                      <div key={img.imageId} className="group relative w-32 aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                        <img src={getImgUrl(img.imageUrl)} alt="" className="w-full h-full object-cover" />
                        
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => handleSetPrimary(img.imageId)} title="Đặt làm ảnh hiện thị chính" className={`p-1.5 rounded-lg ${img.isPrimary ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}>
                             {img.isPrimary ? '★' : '☆'}
                          </button>
                          <button onClick={() => handleDeleteImage(img.imageId)} title="Xóa ảnh" className="p-1.5 bg-white text-red-500 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {img.isPrimary && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-500 text-white text-[10px] rounded shadow-sm">Ảnh chính</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 px-8 py-6 border-t border-gray-100">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleSave} 
                className="px-8 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all active:scale-95"
              >
                {editId ? 'Lưu chỉnh sửa' : 'Thêm xe'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 shadow-2xl rounded-2xl px-6 py-4 text-sm font-bold text-gray-800 z-50 animate-in slide-in-from-bottom flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          {toast}
        </div>
      )}
    </div>

  );
}
