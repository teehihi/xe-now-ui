import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    idNumber: '001234567890',
    dateOfBirth: '1990-01-01',
    drivingLicense: 'B2-123456789'
  });

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Save profile:', formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thông tin tài khoản</h1>
        <p className="text-gray-500 mt-1">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#155DFC] to-[#1B83A1] p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{formData.fullName}</h2>
              <p className="text-blue-100 mt-1">{formData.email}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">Khách hàng thân thiết</span>
                <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">Đã xác thực</span>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CMND/CCCD</label>
              <input type="text" disabled={!isEditing} value={formData.idNumber}
                onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1] disabled:bg-gray-50 disabled:text-gray-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giấy phép lái xe</label>
              <input type="text" disabled={!isEditing} value={formData.drivingLicense}
                onChange={e => setFormData({ ...formData, drivingLicense: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#1B83A1] disabled:bg-gray-50 disabled:text-gray-600" />
            </div>
          </div>
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
