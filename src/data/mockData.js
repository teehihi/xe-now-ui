// ===== VEHICLES =====
export const vehicles = [
  // Cars
  { id: 1, licensePlate: '51A-12345', name: 'Toyota Camry 2023', brand: 'Toyota', category: 'car', type: 'Sedan', year: 2023, location: 'XeNow Quận 1', pricePerDay: 800000, status: 'available', seats: 5, fuel: 'Xăng', transmission: 'Automatic', mileage: 15000, image: '/images/car-toyota-camry.webp' },
  { id: 2, licensePlate: '51B-67890', name: 'Honda CR-V 2024', brand: 'Honda', category: 'car', type: 'SUV', year: 2024, location: 'XeNow Quận 1', pricePerDay: 1200000, status: 'available', seats: 7, fuel: 'Xăng', transmission: 'Automatic', mileage: 8000, image: '/images/car-honda-crv.webp' },
  { id: 3, licensePlate: '51C-11111', name: 'Mercedes-Benz E-Class 2024', brand: 'Mercedes-Benz', category: 'car', type: 'Luxury', year: 2024, location: 'XeNow Quận 3', pricePerDay: 3500000, status: 'available', seats: 5, fuel: 'Xăng', transmission: 'Automatic', mileage: 5000, image: '/images/car-mercedes.webp' },
  { id: 4, licensePlate: '51D-22222', name: 'Kia Carnival 2023', brand: 'Kia', category: 'car', type: 'MPV', year: 2023, location: 'XeNow Quận 1', pricePerDay: 1500000, status: 'available', seats: 8, fuel: 'Dầu diesel', transmission: 'Automatic', mileage: 20000, image: '/images/car-kia-carnival.webp' },
  { id: 5, licensePlate: '30A-33333', name: 'Mazda3 Sport 2023', brand: 'Mazda', category: 'car', type: 'Sedan', year: 2023, location: 'XeNow Hà Nội', pricePerDay: 700000, status: 'available', seats: 5, fuel: 'Xăng', transmission: 'Automatic', mileage: 12000, image: '/images/car-mazda3.webp' },
  { id: 6, licensePlate: '51E-44444', name: 'Ford Everest 2024', brand: 'Ford', category: 'car', type: 'SUV', year: 2024, location: 'XeNow Quận 3', pricePerDay: 1800000, status: 'available', seats: 7, fuel: 'Dầu diesel', transmission: 'Automatic', mileage: 6000, image: '/images/car-ford-everest.webp' },
  { id: 7, licensePlate: '51F-55555', name: 'Hyundai Elantra 2023', brand: 'Hyundai', category: 'car', type: 'Sedan', year: 2023, location: 'XeNow Quận 1', pricePerDay: 650000, status: 'rented', seats: 5, fuel: 'Xăng', transmission: 'Automatic', mileage: 22500, image: '/images/car-mazda3.webp' },
  { id: 8, licensePlate: '30B-66666', name: 'BMW 5 Series 2024', brand: 'BMW', category: 'car', type: 'Luxury', year: 2024, location: 'XeNow Hà Nội', pricePerDay: 4000000, status: 'available', seats: 5, fuel: 'Xăng', transmission: 'Automatic', mileage: 3000, image: '/images/car-mercedes.webp' },
  { id: 9, licensePlate: '43A-77777', name: 'Ford Ranger Raptor 2024', brand: 'Ford', category: 'car', type: 'Pickup', year: 2024, location: 'XeNow Đà Nẵng', pricePerDay: 2200000, status: 'available', seats: 5, fuel: 'Dầu diesel', transmission: 'Automatic', mileage: 9000, image: '/images/car-ford-everest.webp' },
  { id: 10, licensePlate: '51G-88888', name: 'Toyota Veloz Cross 2023', brand: 'Toyota', category: 'car', type: 'MPV', year: 2023, location: 'XeNow Quận 3', pricePerDay: 900000, status: 'maintenance', seats: 7, fuel: 'Xăng', transmission: 'Automatic', mileage: 10000, image: '/images/car-toyota-camry.webp' },
  
  // Motorcycles
  { id: 11, licensePlate: '51H-12345', name: 'Honda SH 350i 2024', brand: 'Honda', category: 'motorcycle', type: 'Tay ga', year: 2024, location: 'XeNow Quận 1', pricePerDay: 150000, status: 'available', seats: 2, fuel: 'Xăng', transmission: 'Automatic', mileage: 2000, image: '/images/car-honda-crv.webp' },
  { id: 12, licensePlate: '51I-23456', name: 'Yamaha Exciter 155 2023', brand: 'Yamaha', category: 'motorcycle', type: 'Số', year: 2023, location: 'XeNow Quận 1', pricePerDay: 120000, status: 'available', seats: 2, fuel: 'Xăng', transmission: 'Manual', mileage: 5000, image: '/images/car-mazda3.webp' },
  { id: 13, licensePlate: '51J-34567', name: 'Honda Vision 2024', brand: 'Honda', category: 'motorcycle', type: 'Tay ga', year: 2024, location: 'XeNow Quận 3', pricePerDay: 100000, status: 'available', seats: 2, fuel: 'Xăng', transmission: 'Automatic', mileage: 1500, image: '/images/car-honda-crv.webp' },
  { id: 14, licensePlate: '30C-45678', name: 'Yamaha Sirius 2023', brand: 'Yamaha', category: 'motorcycle', type: 'Số', year: 2023, location: 'XeNow Hà Nội', pricePerDay: 80000, status: 'available', seats: 2, fuel: 'Xăng', transmission: 'Manual', mileage: 8000, image: '/images/car-mazda3.webp' },
  { id: 15, licensePlate: '51K-56789', name: 'Honda Air Blade 160 2024', brand: 'Honda', category: 'motorcycle', type: 'Tay ga', year: 2024, location: 'XeNow Quận 1', pricePerDay: 130000, status: 'available', seats: 2, fuel: 'Xăng', transmission: 'Automatic', mileage: 3000, image: '/images/car-honda-crv.webp' },
  { id: 16, licensePlate: '43B-67890', name: 'Yamaha Janus 2023', brand: 'Yamaha', category: 'motorcycle', type: 'Tay ga', year: 2023, location: 'XeNow Đà Nẵng', pricePerDay: 90000, status: 'available', seats: 2, fuel: 'Xăng', transmission: 'Automatic', mileage: 6000, image: '/images/car-mazda3.webp' },
];

// ===== CUSTOMERS =====
export const customers = [
  { id: 1, name: 'Nguyễn Văn An', email: 'nguyenvanan@gmail.com', phone: '0901234567', idCard: '079123456789', licenseExpiry: '2028-12-31', totalBookings: 12 },
  { id: 2, name: 'Trần Thị Bình', email: 'tranthibinh@gmail.com', phone: '0912345678', idCard: '079234567890', licenseExpiry: '2027-06-30', totalBookings: 5 },
  { id: 3, name: 'Lê Hoàng Châu', email: 'lehoangchau@gmail.com', phone: '0923456789', idCard: '079345678901', licenseExpiry: '2029-03-15', totalBookings: 3 },
];

// ===== BOOKINGS =====
export const bookings = [
  { id: 1, customerId: 1, customerName: 'Nguyễn Văn An', vehicleId: 7, vehicleName: 'Hyundai Elantra 2023', startDate: '2026-03-20', endDate: '2026-03-27', totalPrice: 4550000, status: 'active', pickupLocation: 'XeNow Quận 1', returnLocation: 'XeNow Quận 1', createdAt: '2026-03-15T10:00:00' },
  { id: 2, customerId: 1, customerName: 'Nguyễn Văn An', vehicleId: 2, vehicleName: 'Honda CR-V 2024', startDate: '2026-04-01', endDate: '2026-04-05', totalPrice: 4800000, status: 'confirmed', pickupLocation: 'XeNow Quận 1', returnLocation: 'XeNow Quận 1', createdAt: '2026-03-25T14:30:00' },
  { id: 3, customerId: 1, customerName: 'Nguyễn Văn An', vehicleId: 3, vehicleName: 'Mercedes-Benz E-Class 2024', startDate: '2026-04-10', endDate: '2026-04-12', totalPrice: 7000000, status: 'pending', pickupLocation: 'XeNow Quận 3', returnLocation: 'XeNow Quận 3', createdAt: '2026-03-27T09:15:00' },
  { id: 4, customerId: 1, customerName: 'Nguyễn Văn An', vehicleId: 1, vehicleName: 'Toyota Camry 2023', startDate: '2026-02-10', endDate: '2026-02-15', totalPrice: 4000000, status: 'completed', pickupLocation: 'XeNow Quận 1', returnLocation: 'XeNow Quận 1', createdAt: '2026-02-05T11:20:00' },
  { id: 5, customerId: 1, customerName: 'Nguyễn Văn An', vehicleId: 5, vehicleName: 'Mazda3 Sport 2023', startDate: '2026-01-20', endDate: '2026-01-23', totalPrice: 2100000, status: 'completed', pickupLocation: 'XeNow Hà Nội', returnLocation: 'XeNow Hà Nội', createdAt: '2026-01-15T16:45:00' },
  { id: 6, customerId: 2, customerName: 'Trần Thị Bình', vehicleId: 4, vehicleName: 'Kia Carnival 2023', startDate: '2026-03-28', endDate: '2026-04-02', totalPrice: 7500000, status: 'confirmed', pickupLocation: 'XeNow Quận 1', returnLocation: 'XeNow Quận 1', createdAt: '2026-03-20T13:00:00' },
];

// ===== LOCATIONS =====
export const locations = [
  { id: 1, name: 'XeNow Quận 1', address: '123 Nguyễn Huệ', city: 'TP. Hồ Chí Minh', phone: '0283123456', vehicleCount: 12 },
  { id: 2, name: 'XeNow Quận 3', address: '456 Võ Văn Tần', city: 'TP. Hồ Chí Minh', phone: '0283234567', vehicleCount: 12 },
  { id: 3, name: 'XeNow Hà Nội', address: '789 Hoàn Kiếm', city: 'Hà Nội', phone: '0243123456', vehicleCount: 12 },
  { id: 4, name: 'XeNow Đà Nẵng', address: '321 Trần Phú', city: 'Đà Nẵng', phone: '0236123456', vehicleCount: 9 },
];

// ===== MAINTENANCE =====
export const maintenanceLogs = [
  { id: 1, vehicleId: 10, vehicleName: 'Toyota Veloz Cross 2023', date: '2026-03-24', serviceType: 'Bảo dưỡng định kỳ', currentKm: 10000, nextKm: 15000, garage: 'Toyota Service Center', cost: 2500000 },
  { id: 2, vehicleId: 7, vehicleName: 'Hyundai Elantra 2023', date: '2026-02-15', serviceType: 'Thay dầu động cơ', currentKm: 18000, nextKm: 23000, garage: 'Hyundai Official Service', cost: 1200000 },
];

export const vehiclesNeedMaintenance = [
  { id: 1, name: 'Toyota Camry 2023', currentKm: 14500, nextKm: 15000 },
  { id: 6, name: 'Ford Everest 2024', currentKm: 5800, nextKm: 6000 },
  { id: 7, name: 'Hyundai Elantra 2023', currentKm: 22500, nextKm: 23000 },
];

// ===== REVENUE CHART DATA =====
export const revenueData = [
  { month: 'T1', revenue: 120000000, bookings: 45 },
  { month: 'T2', revenue: 180000000, bookings: 62 },
  { month: 'T3', revenue: 150000000, bookings: 55 },
  { month: 'T4', revenue: 280000000, bookings: 88 },
  { month: 'T5', revenue: 220000000, bookings: 74 },
  { month: 'T6', revenue: 460000000, bookings: 116 },
];

export const vehicleTypeRevenue = [
  { name: 'Sedan', value: 18, color: '#1B83A1' },
  { name: 'SUV', value: 26, color: '#10B981' },
  { name: 'MPV', value: 15, color: '#F59E0B' },
  { name: 'Pickup', value: 10, color: '#EF4444' },
  { name: 'Luxury', value: 32, color: '#8B5CF6' },
];

export const topVehicles = [
  { rank: 1, name: 'Mercedes-Benz E-Class 2024', trips: 28, revenue: 98000000 },
  { rank: 2, name: 'BMW 5 Series 2024', trips: 24, revenue: 96000000 },
  { rank: 3, name: 'Ford Ranger Raptor 2024', trips: 22, revenue: 48000000 },
  { rank: 4, name: 'Honda CR-V 2024', trips: 35, revenue: 42000000 },
  { rank: 5, name: 'Ford Everest 2024', trips: 30, revenue: 54000000 },
];
