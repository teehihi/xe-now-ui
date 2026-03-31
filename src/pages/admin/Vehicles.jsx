<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronDown, X, Upload, Eye } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
=======
import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
>>>>>>> refs/remotes/origin/main
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import CustomSelect from '../../components/CustomSelect';

const statusOptions = ['Tất cả trạng thái', 'Available', 'Rented', 'Maintenance'];
const statusLabel = { Available: 'Sẵn sàng', Rented: 'Đã thuê', Maintenance: 'Bảo trì' };
const vehicleTypes = ['Xe Ô Tô', 'Xe Tay Ga', 'Xe Số'];

<<<<<<< HEAD
const emptyForm = { licensePlate: '', modelId: '', type: 'xe ô tô', locationId: '', pricePerDay: '', depositAmount: '', seats: '', mileage: '', manufactureYear: 2023 };
=======
const emptyForm = { licensePlate: '', modelId: '', type: 'Xe Ô Tô', locationId: '', pricePerDay: '', seats: '', mileage: '', manufactureYear: 2024 };
>>>>>>> refs/remotes/origin/main

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
  const [pendingFiles, setPendingFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [toast, setToast] = useState('');

<<<<<<< HEAD
  const filtered = (vehicles || []).filter(v => {
    const matchSearch = (v.name || '').toLowerCase().includes(search.toLowerCase()) || 
                       (v.licensePlate || '').includes(search);
=======
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [vRes, lRes, mRes] = await Promise.all([
        api.get(`/admin/vehicles?page=${currentPage}&size=${pageSize}`),
        api.get('/admin/locations?size=1000'),
        api.get('/admin/models?size=1000')
      ]);

      // Handle ApiResponse structure from backend (wrapped in .data)
      const vPage = vRes.data || vRes;
      setVehicles(vPage.content ?? []);
      setTotalPages(vPage.totalPages ?? 0);
      setTotalElements(vPage.totalElements ?? 0);

      const lPage = lRes.data || lRes;
      setLocations(lPage.content ?? []);

      const mPage = mRes.data || mRes;
      setModels(mPage.content ?? []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = vehicles.filter(v => {
    const matchSearch = String(v.modelName || v.name || '').toLowerCase().includes(search.toLowerCase()) ||
      String(v.licensePlate || '').toLowerCase().includes(search.toLowerCase());
>>>>>>> refs/remotes/origin/main
    const matchStatus = statusFilter === 'Tất cả trạng thái' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

<<<<<<< HEAD
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
=======
  function openAdd() {
    setForm({ ...emptyForm, locationId: locations[0]?.locationId, modelId: models[0]?.modelId });
    setEditId(null);
    setPendingFiles([]);
    setPreviewUrls([]);
    setShowModal(true);
>>>>>>> refs/remotes/origin/main
  }

  function openEdit(v) {
    setForm({
      ...v,
      pricePerDay: String(v.pricePerDay || v.dailyRate || ''),
      locationId: v.locationId,
      modelId: v.modelId,
      images: v.images || []
    });
    setEditId(v.vehicleId || v.id);
    setPendingFiles([]);
    setPreviewUrls([]);
    setShowModal(true);
  }

  async function handleSave() {
    try {
      const payload = {
        ...form,
        pricePerDay: Number(form.pricePerDay) || 0,
        dailyRate: Number(form.pricePerDay) || 0,
        type: form.type || 'Xe Ô Tô',
        locationId: Number(form.locationId) || (locations[0]?.locationId),
        modelId: Number(form.modelId) || (models[0]?.modelId)
      };

      if (!payload.modelId) {
        showToast('Vui lòng chọn mẫu xe');
        return;
      }

      let savedId = editId;

      if (editId) {
        await api.put(`/admin/vehicles/${editId}`, payload);
        showToast('Cập nhật xe thành công');
      } else {
        const res = await api.post('/admin/vehicles', payload);
        const resData = res.data || res;
        savedId = resData.vehicleId || resData.id;
        showToast('Thêm xe mới thành công');
      }

      if (pendingFiles.length > 0 && savedId) {
        const formData = new FormData();
        pendingFiles.forEach(file => formData.append('files', file));
        await api.post(`/admin/vehicles/${savedId}/images`, formData);
        showToast('Đã tải ảnh lên');
      }

      fetchData();
      setShowModal(false);
    } catch (error) {
      const msg = error.message || 'Lỗi khi lưu dữ liệu';
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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    if (editId) {
        handleFileUpload(files);
        return;
    }

    setPendingFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  async function handleFileUpload(files) {
    if (!editId) return;
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    try {
      const uploadRes = await api.post(`/admin/vehicles/${editId}/images`, formData);
      showToast('Tải ảnh lên thành công');

      // Get updated images from upload response or fetch vehicle
      const res = await api.get(`/admin/vehicles/${editId}`);
      const vehicle = res.data?.data || res.data;
      if (vehicle?.images) {
        setForm(prev => ({ ...prev, images: vehicle.images }));
        setImageKey(prev => prev + 1);
      }
      fetchData();
    } catch (error) {
      showToast('Lỗi khi tải ảnh');
    }
  }

  function removePendingImage(index) {
    const newFiles = [...pendingFiles];
    newFiles.splice(index, 1);
    setPendingFiles(newFiles);

    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
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
      fetchData(); 
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
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `http://localhost:8080${url}`;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      <div className="shrink-0 flex items-center justify-between">
        <h1 className="text-xl font-bold">Quản lý xe</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          <Plus size={16} /> Thêm xe mới
        </button>
      </div>

      <div className="shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên xe hoặc biển số..."
              className="w-full pl-9 pr-4 py-2 bg-[#F3F3F5] rounded-lg text-sm outline-none"
            />
          </div>
          <div className="w-48">
            <CustomSelect 
                options={statusOptions.map(o => ({ id: o, name: o === 'Tất cả trạng thái' ? o : statusLabel[o] ?? o }))}
                value={statusFilter}
                onChange={v => setStatusFilter(v)}
                placeholder="Chọn trạng thái"
            />
          </div>
          <span className="text-sm text-gray-500 ml-auto">{totalElements} xe</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Ảnh</th>
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
            {filtered.map((v) => (
              <tr key={v.vehicleId || v.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                <td className="px-4 py-2">
                  <img src={getImgUrl(v.image)} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                </td>
                <td className="px-4 py-3 font-mono text-gray-700">{v.licensePlate}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{v.modelName || v.name}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">{v.typeName || v.type || 'N/A'}</span>
                </td>
                <td className="px-4 py-3 text-gray-700">{v.locationName || v.location || 'N/A'}</td>
                <td className="px-4 py-3 text-gray-700">{(v.dailyRate || v.pricePerDay || 0).toLocaleString('vi-VN')} ₫</td>
                <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
<<<<<<< HEAD
                    <button onClick={() => navigate(`/admin/vehicles/${v.vehicleId || v.id}`)} title="Xem chi tiết" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"><Eye size={15} /></button>
                    <button onClick={() => openEdit(v)} title="Chỉnh sửa" className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={15} /></button>
=======
                    <button onClick={() => openEdit(v)} title="Sửa" className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={15} /></button>
>>>>>>> refs/remotes/origin/main
                    <button onClick={() => handleDelete(v.vehicleId || v.id)} title="Xóa" className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="shrink-0 pt-2 pb-2">
        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{editId ? 'Chỉnh sửa xe' : 'Thêm xe mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <CustomSelect 
                    label="Mẫu xe (Model)"
                    options={models.map(m => ({ id: m.modelId, name: m.modelName, brand: m.brandName }))}
                    value={form.modelId || ''}
                    onChange={v => setForm(f => ({ ...f, modelId: v }))}
                    placeholder="Chọn mẫu xe"
                    getLabel={opt => `${opt.brand ? opt.brand + ' - ' : ''}${opt.name}`}
                />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Biển số xe</label>
                  <input
                    value={form.licensePlate || ''}
                    onChange={e => setForm(f => ({ ...f, licensePlate: e.target.value.toUpperCase() }))}
                    placeholder="51A-12345"
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Năm sản xuất</label>
                  <input
                    type="number"
                    value={form.manufactureYear || form.year || ''}
                    onChange={e => setForm(f => ({ ...f, manufactureYear: Number(e.target.value) }))}
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none"
                  />
                </div>

                <CustomSelect 
                    label="Loại xe"
                    options={vehicleTypes.map(t => ({ id: t, name: t }))}
                    value={form.type || ''}
                    onChange={v => setForm(f => ({ ...f, type: v }))}
                    placeholder="Chọn loại xe"
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Số chỗ ngồi</label>
                  <input
                    type="number"
                    value={form.seats || ''}
                    onChange={e => setForm(f => ({ ...f, seats: Number(e.target.value) }))}
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Số km đã đi</label>
                  <input
                    type="number"
                    value={form.mileage || ''}
                    onChange={e => setForm(f => ({ ...f, mileage: Number(e.target.value) }))}
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Giá thuê/ngày</label>
                  <input
                    type="number"
                    value={form.pricePerDay || form.dailyRate || ''}
                    onChange={e => setForm(f => ({ ...f, pricePerDay: Number(e.target.value) }))}
<<<<<<< HEAD
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
=======
                    className="w-full px-4 py-2 bg-[#F3F4F6] rounded-xl text-sm outline-none"
>>>>>>> refs/remotes/origin/main
                  />
                </div>

                <CustomSelect 
                    label="Vị trí/Chi nhánh"
                    options={locations.map(l => ({ id: l.locationId, name: l.branchName }))}
                    value={form.locationId || ''}
                    onChange={v => setForm(f => ({ ...f, locationId: Number(v) }))}
                    placeholder="Chọn chi nhánh"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Hình ảnh xe</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-2xl py-10 transition-all hover:border-blue-400 hover:bg-blue-50/30">
                  <input 
                    type="file" 
                    multiple 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={handleFileSelect} 
                    accept="image/*" 
                  />
                  <div className="flex flex-col items-center pointer-events-none">
                    <Upload size={24} className="text-gray-400" />
                    <p className="text-sm font-bold text-gray-900 mt-2">Chọn ảnh</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    {previewUrls.map((url, idx) => (
                        <div key={`pending-${idx}`} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-200">
                             <img src={url} alt="" className="w-full h-full object-cover" />
                             <button onClick={() => removePendingImage(idx)} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 hover:bg-red-50 transition-colors">
                                <X size={12} />
                             </button>
                             <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
                        </div>
                    ))}

                    {form.images && form.images.map(img => (
                      <div key={img.imageId} className="group relative w-24 h-24 rounded-xl overflow-hidden border border-gray-100">
                        <img src={getImgUrl(img.imageUrl)} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button onClick={() => handleSetPrimary(img.imageId)} title="Đặt làm ảnh chính" className={`p-1 rounded ${img.isPrimary ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                             {img.isPrimary ? '★' : '☆'}
                          </button>
                          <button onClick={() => handleDeleteImage(img.imageId)} title="Xóa ảnh" className="p-1 bg-white text-red-500 rounded"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-8 py-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 rounded-xl border border-gray-200 text-sm font-semibold">Hủy</button>
              <button onClick={handleSave} className="px-8 py-2 rounded-xl bg-gray-900 text-white text-sm font-bold active:scale-95 transition-all">
                {editId ? 'Lưu chỉnh sửa' : 'Thêm xe mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white rounded-xl px-6 py-3 text-sm z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
