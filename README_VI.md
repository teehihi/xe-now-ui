# XeNow - Hệ thống quản lý cho thuê xe

Ứng dụng web quản lý cho thuê xe được xây dựng với React + Vite + TailwindCSS.

## Tính năng

### Phần khách hàng (User)
- 🏠 Trang chủ với tìm kiếm xe
- 🚗 Xem chi tiết xe và đặt xe
- 📋 Quản lý booking của tôi
- 👤 Quản lý thông tin cá nhân
- 🔐 Đăng nhập / Đăng ký

### Phần quản trị (Admin)
- 📊 Dashboard với thống kê tổng quan
- 🚙 Quản lý xe
- 📅 Quản lý booking
- 👥 Quản lý khách hàng
- 🏢 Quản lý chi nhánh
- 🔧 Quản lý bảo trì
- 📈 Báo cáo & thống kê

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## Cấu trúc thư mục

```
src/
├── components/       # Các component dùng chung
│   ├── AdminHeader.jsx
│   ├── AdminSidebar.jsx
│   ├── StatusBadge.jsx
│   └── UserHeader.jsx
├── data/            # Mock data
│   └── mockData.js
├── layouts/         # Layout components
│   ├── AdminLayout.jsx
│   └── UserLayout.jsx
├── pages/           # Các trang
│   ├── admin/       # Trang admin
│   │   ├── Dashboard.jsx
│   │   ├── Vehicles.jsx
│   │   ├── Bookings.jsx
│   │   ├── Customers.jsx
│   │   ├── Branches.jsx
│   │   ├── Maintenance.jsx
│   │   └── Reports.jsx
│   └── user/        # Trang user
│       ├── Home.jsx
│       ├── VehicleDetail.jsx
│       ├── BookingForm.jsx
│       ├── MyBookings.jsx
│       ├── Profile.jsx
│       ├── Login.jsx
│       └── Register.jsx
├── App.jsx          # Main app với routing
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Routes

### User Routes
- `/` - Trang chủ
- `/vehicles/:id` - Chi tiết xe
- `/booking` - Form đặt xe
- `/my-bookings` - Booking của tôi
- `/profile` - Thông tin cá nhân
- `/login` - Đăng nhập
- `/register` - Đăng ký

### Admin Routes
- `/admin/dashboard` - Dashboard
- `/admin/vehicles` - Quản lý xe
- `/admin/bookings` - Quản lý booking
- `/admin/customers` - Quản lý khách hàng
- `/admin/branches` - Quản lý chi nhánh
- `/admin/maintenance` - Quản lý bảo trì
- `/admin/reports` - Báo cáo

## Công nghệ sử dụng

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router v7** - Routing
- **TailwindCSS v4** - Styling
- **Lucide React** - Icons
- **Recharts** - Charts & graphs

## Lưu ý

- Hiện tại đang sử dụng mock data trong `src/data/mockData.js`
- Cần tích hợp với backend API để có chức năng thực tế
- Chưa có authentication thực sự, cần implement JWT/OAuth

## Tác giả

XeNow Team - 2026
