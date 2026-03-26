// Booking status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const BOOKING_STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  active: 'Đang thuê',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

export const BOOKING_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  active: 'bg-green-100 text-green-700 border-green-200',
  completed: 'bg-gray-100 text-gray-700 border-gray-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200'
};

// Vehicle status
export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  MAINTENANCE: 'maintenance'
};

export const VEHICLE_STATUS_LABELS = {
  available: 'Sẵn sàng',
  rented: 'Đang thuê',
  maintenance: 'Bảo trì'
};

export const VEHICLE_STATUS_COLORS = {
  available: 'bg-green-100 text-green-700 border-green-200',
  rented: 'bg-blue-100 text-blue-700 border-blue-200',
  maintenance: 'bg-orange-100 text-orange-700 border-orange-200'
};

// Vehicle types
export const VEHICLE_TYPES = ['Sedan', 'SUV', 'MPV', 'Luxury', 'Pickup'];

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  TRANSFER: 'transfer',
  CARD: 'card'
};

export const PAYMENT_METHOD_LABELS = {
  cash: 'Tiền mặt',
  transfer: 'Chuyển khoản',
  card: 'Thẻ tín dụng'
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('vi-VN');
};
