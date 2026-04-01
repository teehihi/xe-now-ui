import { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, ShieldCheck, AlertCircle, FileText, UploadCloud, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'licenses'
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [licenses, setLicenses] = useState([]);
  
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '',
    idNumber: '', dateOfBirth: '', drivingLicense: ''
  });

  // Modal State cho Thêm GPLX
  const [isAddLicenseModalOpen, setIsAddLicenseModalOpen] = useState(false);
  const [licenseFile, setLicenseFile] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [newLicenseData, setNewLicenseData] = useState(null);
  const [isSubmittingLicense, setIsSubmittingLicense] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [user, token, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      if (!token) { navigate('/login'); return; }
      
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      
      let currentUser = user;
      const userResponse = await fetch('http://localhost:8080/api/auth/me', { headers });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        currentUser = userData.data?.user || userData.user || userData.data || userData;
      }
      
      const verifyResponse = await fetch('http://localhost:8080/api/customer/verify-status', { headers });
      if (!verifyResponse.ok) {
        setFormData({
          fullName: currentUser?.fullName || '', email: currentUser?.email || '',
          phone: currentUser?.phone || '', address: '', idNumber: '',
          dateOfBirth: currentUser?.dateOfBirth || '', drivingLicense: ''
        });
        return;
      }
      
      const verifyJson = await verifyResponse.json();
      const verifyData = verifyJson.data || verifyJson;
      setIsVerified(verifyData.verified);
      
      if (verifyData.verified) {
        // Fetch licenses
        fetchLicenses(headers);
        
        const customerResponse = await fetch(`http://localhost:8080/api/customer/${verifyData.userId}`, { headers });
        if (customerResponse.ok) {
          const customerJson = await customerResponse.json();
          const customer = customerJson.data || customerJson;
          setCustomerData(customer);
          setFormData({
            fullName: currentUser?.fullName || '', email: currentUser?.email || '',
            phone: currentUser?.phone || '', address: customer.address || '',
            idNumber: customer.identityCard || '', dateOfBirth: currentUser?.dateOfBirth || '',
            drivingLicense: customer.driverLicense || ''
          });
        }
      } else {
        setFormData({
          fullName: currentUser?.fullName || '', email: currentUser?.email || '',
          phone: currentUser?.phone || '', address: '', idNumber: '',
          dateOfBirth: currentUser?.dateOfBirth || '', drivingLicense: ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLicenses = async (headers) => {
    try {
      const res = await fetch('http://localhost:8080/api/customer/licenses', { headers });
      if (res.ok) {
        const json = await res.json();
        setLicenses(json.data || []);
      }
    } catch(err) {
      console.error("Fetch licenses error", err);
    }
  }

  const handleSave = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const res = await fetch('http://localhost:8080/api/users/me', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
        })
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
      setIsEditing(false);
      setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setToast({ message: 'Không thể lưu thông tin. Vui lòng thử lại.', type: 'error' });
    }
  };

  const handleLicenseFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLicenseFile(file);
    setLicensePreview(URL.createObjectURL(file));
    setIsOcrScanning(true);
    setNewLicenseData(null);

    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('http://localhost:8080/api/customer/ocr/driver-license', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi quét ảnh');
      
      const ocrData = data.data || data;
      setNewLicenseData(ocrData);
      setToast({ message: 'Quét GPLX thành công!', type: 'success' });
    } catch(err) {
      console.error(err);
      setToast({ message: 'Lỗi đọc GPLX, vui lòng thử lại ảnh rõ nét hơn.', type: 'error' });
      setLicenseFile(null);
      setLicensePreview(null);
    } finally {
      setIsOcrScanning(false);
    }
  }

  const handleSubmitNewLicense = async () => {
    if (!newLicenseData || !licenseFile) return;
    setIsSubmittingLicense(true);
    
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const formData = new FormData();
      formData.append('licenseNumber', newLicenseData.driverLicense);
      formData.append('licenseClass', newLicenseData.licenseClass);
      
      // Chuyển đổi định dạng ngày mm/dd/yyyy -> yyyy-MM-dd
      const convertDate = (dt) => {
        if(!dt) return "";
        if(dt.includes('-')) return dt; // Already good format maybe
        if(dt.includes('/')) {
          const parts = dt.split('/');
          if(parts.length === 3) {
            // FPT trả về dd/MM/yyyy
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
        return dt;
      };

      formData.append('issueDate', convertDate(newLicenseData.issueDate));
      if (newLicenseData.expiryDate && newLicenseData.expiryDate !== 'Không thời hạn') {
        formData.append('expiryDate', convertDate(newLicenseData.expiryDate));
      } else {
         formData.append('expiryDate', 'Không thời hạn');
      }
      formData.append('image', licenseFile);

      const res = await fetch('http://localhost:8080/api/customer/licenses', {
        method: 'POST',
        headers,
        body: formData
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Lỗi lưu GPLX');
      
      setToast({ message: 'Thêm GPLX thành công!', type: 'success' });
      setIsAddLicenseModalOpen(false);
      setLicensePreview(null);
      setLicenseFile(null);
      setNewLicenseData(null);
      
      // Refresh Licenses
      fetchLicenses({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' });
    } catch(err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setIsSubmittingLicense(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1B83A1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thông tin tài khoản</h1>
        <p className="text-gray-500 mt-1">Quản lý thông tin cá nhân của bạn</p>
      </div>

      {/* Verification Alert */}
      {!isVerified && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">Tài khoản chưa xác thực</p>
            <p className="text-sm text-yellow-700 mt-1">Vui lòng xác thực CCCD để có thể thêm Bằng lái hoặc thuê xe.</p>
          </div>
          <button onClick={() => navigate('/verify')}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700">
            Xác thực ngay
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-[#155DFC] to-[#1B83A1] p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{formData.fullName || 'Người dùng'}</h2>
              <p className="text-blue-100 mt-1">{formData.email}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-white/20 rounded-lg text-sm flex items-center gap-1">Khách hàng thân thiết</span>
                {isVerified && (
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-sm flex items-center gap-1">
                    <ShieldCheck size={14} /> Đã xác thực CCCD
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* TABS HEADER */}
        <div className="flex border-b border-gray-200 px-6">
          <button 
            className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'info' ? 'border-[#1B83A1] text-[#1B83A1]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('info')}
          >
            Thông tin cá nhân
          </button>
          <button 
            disabled={!isVerified} 
            title={!isVerified ? 'Vui lòng xác minh CCCD trước' : ''}
            className={`px-6 py-4 font-medium text-sm border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'licenses' ? 'border-[#1B83A1] text-[#1B83A1]' : 'border-transparent text-gray-500 hover:text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={() => setActiveTab('licenses')}
          >
            <FileText size={16}/> Giấy phép lái xe
          </button>
        </div>

        {/* TABS CONTENT */}
        <div className="p-8">
          
          {/* TAB 1: THÔNG TIN CÁ NHÂN */}
          {activeTab === 'info' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Hồ sơ của bạn</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-[#1B83A1] border border-[#1B83A1] rounded-lg hover:bg-blue-50">
                    <Edit2 size={16} /> Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <X size={16} /> Hủy
                    </button>
                    <button onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1B83A1] text-white rounded-lg hover:opacity-90">
                      <Save size={16} /> Lưu
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <User size={14} /> Họ và tên
                  </label>
                  <input type="text" disabled={!isEditing} value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1] disabled:bg-gray-50 disabled:text-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Mail size={14} /> Email
                  </label>
                  <input type="email" disabled={!isEditing} value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1] disabled:bg-gray-50 disabled:text-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Phone size={14} /> Số điện thoại
                  </label>
                  <input type="tel" disabled={!isEditing} value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1] disabled:bg-gray-50 disabled:text-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Calendar size={14} /> Ngày sinh
                  </label>
                  <input type="date" disabled={!isEditing} value={formData.dateOfBirth}
                    onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1] disabled:bg-gray-50 disabled:text-gray-600" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <MapPin size={14} /> Địa chỉ
                  </label>
                  <textarea disabled={!isEditing} value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1] disabled:bg-gray-50 disabled:text-gray-600" />
                </div>
              </div>

              {/* CCCD Information Section - Chỉ xem */}
              {isVerified && (
                <>
                  <div className="mt-8 mb-4 flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Thông tin CCCD/CMND</h3>
                    <div className="h-px flex-1 bg-gray-200"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số CCCD/CMND</label>
                      <input type="text" disabled value={formData.idNumber || 'Chưa xác thực'}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none disabled:bg-gray-50 disabled:text-gray-600" />
                    </div>
                    {customerData?.identityCardIssueDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ngày cấp CCCD</label>
                        <input type="text" disabled value={customerData.identityCardIssueDate}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none disabled:bg-gray-50 disabled:text-gray-600" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: QUẢN LÝ GPLX */}
          {activeTab === 'licenses' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Quản lý Bằng Lái Xe</h3>
                  <p className="text-sm text-gray-500">Thêm nhiều bằng lái xe cho các phương tiện khác nhau.</p>
                </div>
                <button 
                  onClick={() => setIsAddLicenseModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1B83A1] text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                >
                  <Plus size={16} /> Thêm Giấy phép
                </button>
              </div>

              {licenses.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="font-medium text-gray-900 mb-1">Chưa có Giấy phép lái xe nào</p>
                  <p className="text-sm text-gray-500 mb-4">Bạn cần tải lên giấy phép lái xe để có thể thuê phương tiện tương ứng.</p>
                  <button onClick={() => setIsAddLicenseModalOpen(true)} className="text-[#1B83A1] font-medium hover:underline">
                    Thêm ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {licenses.map((lic, index) => (
                    <div key={lic.licenseId || index} className="border border-gray-200 rounded-xl p-5 hover:border-[#1B83A1] transition-colors bg-white shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-[#155DFC] text-white px-3 py-1 rounded-bl-lg font-semibold text-sm">
                        Hạng {lic.licenseClass}
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#1B83A1] shrink-0">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{lic.licenseNumber}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600"><span className="text-gray-400 w-20 inline-block">Ngày cấp:</span> {lic.issueDate}</p>
                            <p className="text-sm text-gray-600"><span className="text-gray-400 w-20 inline-block">Hết hạn:</span> {lic.expiryDate || 'Không thời hạn'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      
      {/* MODAL THÊM GPLX */}
      {isAddLicenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <UploadCloud className="text-[#1B83A1]"/> Thêm Giấy Phép Lái Xe Mới
              </h3>
              <button 
                onClick={() => { setIsAddLicenseModalOpen(false); setLicensePreview(null); setLicenseFile(null); setNewLicenseData(null); }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {/* Nơi upload hình */}
              {!licensePreview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:bg-gray-50 hover:border-[#1B83A1] transition-colors"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleLicenseFileChange}
                  />
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1B83A1]">
                    <UploadCloud size={24} />
                  </div>
                  <p className="font-medium text-gray-900 mb-1">Tải ảnh mặt trước GPLX</p>
                  <p className="text-sm text-gray-500">Hỗ trợ JPG, PNG. Đảm bảo ảnh rõ nét và không chụp lóa.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={licensePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <button 
                      onClick={() => { setLicensePreview(null); setLicenseFile(null); setNewLicenseData(null); }}
                      className="absolute top-2 right-2 bg-gray-900/60 text-white rounded-full p-1.5 hover:bg-gray-900"
                      title="Chụp lại"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* OCR Loading */}
                  {isOcrScanning && (
                    <div className="p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3 animate-pulse">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Đang trích xuất thông tin bằng AI...</span>
                    </div>
                  )}

                  {/* Hiển thị kết quả OCR */}
                  {newLicenseData && !isOcrScanning && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                      <h4 className="font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-2">Thông tin nhận diện</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500 uppercase font-semibold">Số GPLX</label>
                          <p className="font-medium text-gray-900 text-sm mt-1">{newLicenseData.driverLicense}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase font-semibold">Hạng</label>
                          <p className="font-medium text-gray-900 text-sm mt-1">{newLicenseData.licenseClass}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase font-semibold">Ngày cấp</label>
                          <p className="font-medium text-gray-900 text-sm mt-1">{newLicenseData.issueDate || '-'}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase font-semibold">Ngày hết hạn</label>
                          <p className="font-medium text-gray-900 text-sm mt-1">{newLicenseData.expiryDate || 'Không thời hạn'}</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm flex items-start gap-2 mt-4">
                        <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                        <p>Vui lòng kiểm tra kỹ thông tin. Nếu sai lệch, hãy thử tải lại ảnh rõ nét hơn.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
              <button 
                onClick={() => { setIsAddLicenseModalOpen(false); setLicensePreview(null); setLicenseFile(null); setNewLicenseData(null); }}
                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                disabled={!newLicenseData || isSubmittingLicense || isOcrScanning}
                onClick={handleSubmitNewLicense}
                className="px-5 py-2.5 bg-[#1B83A1] text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmittingLicense ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang lưu...</>
                ) : 'Xác nhận Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mt-8 hidden">
        {/* Removed stats for brevity but kept in code structure */}
      </div>
    </div>
  );
}
