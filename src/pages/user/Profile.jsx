import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idNumber: '',
    dateOfBirth: '',
    drivingLicense: ''
  });

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
      
      console.log('Token:', token);
      
      if (!token) {
        console.error('No token available');
        navigate('/login');
        return;
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      console.log('Fetching user data with headers:', headers);
      
      // Fetch current user info
      const userResponse = await fetch('http://localhost:8080/api/auth/me', {
        headers
      });
      
      console.log('User response status:', userResponse.status);
      
      let currentUser = user;
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('User data:', userData);
        currentUser = userData.user;
      } else {
        const errorText = await userResponse.text();
        console.error('Failed to fetch user:', errorText);
      }
      
      // Check verification status
      const verifyResponse = await fetch('http://localhost:8080/api/customer/verify-status', {
        headers
      });
      
      console.log('Verify response status:', verifyResponse.status);
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log('Verify data:', verifyData);
        setIsVerified(verifyData.verified);
        
        if (verifyData.verified) {
          // Fetch customer data
          const customerResponse = await fetch(`http://localhost:8080/api/customer/${verifyData.userId}`, {
            headers
          });
          
          console.log('Customer response status:', customerResponse.status);
          
          if (customerResponse.ok) {
            const customer = await customerResponse.json();
            console.log('Customer data:', customer);
            setCustomerData(customer);
            setFormData({
              fullName: currentUser.fullName || '',
              email: currentUser.email || '',
              phone: currentUser.phone || '',
              address: customer.address || '',
              idNumber: customer.identityCard || '',
              dateOfBirth: currentUser.dateOfBirth || '',
              drivingLicense: customer.driverLicense || ''
            });
          } else {
            const errorText = await customerResponse.text();
            console.error('Failed to fetch customer:', errorText);
          }
        } else {
          // Not verified - only show basic user info
          setFormData({
            fullName: currentUser.fullName || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
            address: '',
            idNumber: '',
            dateOfBirth: currentUser.dateOfBirth || '',
            drivingLicense: ''
          });
        }
      } else {
        const errorText = await verifyResponse.text();
        console.error('Failed to check verification status:', errorText);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Implement update API
      console.log('Save profile:', formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Không thể lưu thông tin. Vui lòng thử lại.');
    }
  };

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
            <p className="text-sm text-yellow-700 mt-1">Vui lòng xác thực CCCD và GPLX để có thể thuê xe.</p>
          </div>
          <button onClick={() => navigate('/verify')}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700">
            Xác thực ngay
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#155DFC] to-[#1B83A1] p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{formData.fullName || 'Người dùng'}</h2>
              <p className="text-blue-100 mt-1">{formData.email}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">Khách hàng thân thiết</span>
                {isVerified && (
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-sm flex items-center gap-1">
                    <ShieldCheck size={14} /> Đã xác thực
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>
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

          {/* CCCD Information Section */}
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

                {customerData?.identityCardExpiry && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hết hạn CCCD</label>
                    <input type="text" disabled value={customerData.identityCardExpiry}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none disabled:bg-gray-50 disabled:text-gray-600" />
                  </div>
                )}
              </div>

              {/* GPLX Information Section */}
              <div className="mt-8 mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-200"></div>
                <h3 className="text-lg font-semibold text-gray-900">Thông tin Giấy phép lái xe</h3>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số GPLX</label>
                  <input type="text" disabled value={formData.drivingLicense || 'Chưa xác thực'}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none disabled:bg-gray-50 disabled:text-gray-600" />
                </div>

                {customerData?.driverLicenseClass && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hạng GPLX</label>
                    <input type="text" disabled value={customerData.driverLicenseClass}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none disabled:bg-gray-50 disabled:text-gray-600" />
                  </div>
                )}

                {customerData?.driverLicenseIssueDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày cấp GPLX</label>
                    <input type="text" disabled value={customerData.driverLicenseIssueDate}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none disabled:bg-gray-50 disabled:text-gray-600" />
                  </div>
                )}

                {customerData?.driverLicenseExpiry && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hết hạn GPLX</label>
                    <input type="text" disabled value={customerData.driverLicenseExpiry}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none disabled:bg-gray-50 disabled:text-gray-600" />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Show message if not verified */}
          {!isVerified && (
            <div className="mt-8">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <ShieldCheck size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Thông tin CCCD và GPLX chưa được xác thực</p>
                <p className="text-sm text-gray-500">Vui lòng hoàn tất xác thực để xem đầy đủ thông tin</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p className="text-3xl font-bold text-[#1B83A1]">12</p>
          <p className="text-sm text-gray-600 mt-1">Chuyến đi</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p className="text-3xl font-bold text-green-600">8</p>
          <p className="text-sm text-gray-600 mt-1">Hoàn thành</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <p className="text-3xl font-bold text-yellow-600">4.8</p>
          <p className="text-sm text-gray-600 mt-1">Đánh giá</p>
        </div>
      </div>
    </div>
  );
}
