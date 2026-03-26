# Hướng dẫn cài đặt và chạy XeNow UI

## Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm hoặc yarn

## Các bước cài đặt

### 1. Cài đặt dependencies

```bash
cd XeNowUI
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### 3. Build cho production

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`

### 4. Preview production build

```bash
npm run preview
```

## Cấu trúc dự án

```
XeNowUI/
├── public/              # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/          # Images, fonts
│   ├── components/      # Reusable components
│   ├── data/           # Mock data
│   ├── layouts/        # Layout components
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin pages
│   │   └── user/       # User pages
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Tính năng đã hoàn thành

### User Interface
✅ Trang chủ với tìm kiếm xe
✅ Chi tiết xe và form đặt xe
✅ Quản lý booking cá nhân
✅ Trang thông tin tài khoản
✅ Đăng nhập / Đăng ký

### Admin Interface
✅ Dashboard với thống kê
✅ Quản lý xe
✅ Quản lý booking
✅ Quản lý khách hàng
✅ Quản lý chi nhánh
✅ Quản lý bảo trì
✅ Báo cáo & thống kê

## Các trang chính

### User Pages
- `/` - Trang chủ
- `/vehicles/:id` - Chi tiết xe
- `/booking` - Form đặt xe
- `/my-bookings` - Danh sách booking
- `/profile` - Thông tin cá nhân
- `/login` - Đăng nhập
- `/register` - Đăng ký

### Admin Pages
- `/admin/dashboard` - Tổng quan
- `/admin/vehicles` - Quản lý xe
- `/admin/bookings` - Quản lý booking
- `/admin/customers` - Quản lý khách hàng
- `/admin/branches` - Quản lý chi nhánh
- `/admin/maintenance` - Quản lý bảo trì
- `/admin/reports` - Báo cáo

## Công nghệ sử dụng

- **React 19.2.4** - UI Library
- **Vite 8.0.1** - Build Tool
- **React Router 7.13.2** - Routing
- **TailwindCSS 4.2.2** - CSS Framework
- **Lucide React 1.7.0** - Icon Library
- **Recharts 3.8.1** - Chart Library

## Lưu ý

1. **Mock Data**: Hiện tại ứng dụng sử dụng mock data trong `src/data/mockData.js`. Để kết nối với backend thực, cần:
   - Tạo API service layer
   - Implement axios hoặc fetch
   - Cập nhật các component để gọi API

2. **Authentication**: Chưa có authentication thực sự. Cần implement:
   - JWT token management
   - Protected routes
   - User context/state management

3. **State Management**: Hiện tại sử dụng local state. Có thể cân nhắc:
   - Redux Toolkit
   - Zustand
   - React Query

4. **Form Validation**: Cần thêm validation cho các form:
   - React Hook Form
   - Yup/Zod schema validation

## Troubleshooting

### Port đã được sử dụng
```bash
# Thay đổi port trong vite.config.js
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Module not found
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clear cache và build lại
npm run build -- --force
```

## Liên hệ

Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ team phát triển.
