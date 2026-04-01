# XeNow UI - Frontend Web Application

![XeNow Demo](public/images/logo.webp)

## 📌 Giới Thiệu
XeNow là nền tảng quản lý và cho thuê xe hơi/xe máy trực tuyến tân tiến dành cho mô hình kinh doanh B2C/C2C. Giao diện được thiết kế hiện đại, mượt mà dựa trên React.

## 🚀 Các Luồng Hoạt Động Chính (Feature Workflows)

Chúng tôi đã thiết kế UI chặt chẽ, chú trọng trải nghiệm Navigation liền mạch:

### 1. Luồng Lọc và Xem Danh Sách Xe
Trang `/vehicles` cung cấp Navbar đa dạng (Loại xe, Hãng, Giá, Vị trí) kết nối trực tiếp với Database, tải mượt bằng kỹ thuật Pagination Page.

> *(Bạn hãy chụp ảnh trang Danh Sách Xe và lưu bằng tên dưới đây để chèn vào Github nha)*
`![Filter & Discover Flow](public/docs/filter_flow.png)`

### 2. Luồng Booking (Đặt Xe & Xác Thực Thông Tin)
Chức năng eKYC tự động tích hợp form tải ảnh. 
Giao diện Modal thay cho Alert khó chịu, Validation được hiển thị trực tiếp báo lỗi realtime.

> *(Chụp ảnh Modal Loading và OCR form dán ảnh dưới đây)*
`![Booking Flow](public/docs/booking_flow.png)`

### 3. Luồng Thanh Toán Đa Phương Thức
Sử dụng Popup thông báo VietQR động (Với Regex xóa dấu, đồng bộ hóa chuỗi BankInfo) và giao diện chờ của VNPAY. Điều hướng (`useNavigate`) mượt mà vào My Bookings sau khi xong thao tác.

> *(Chụp ảnh Flow quét QR Code dán dứoi đây)*
`![Payment Flow](public/docs/payment_flow.png)`

### 4. Luồng Trả Xe & Quản Trị Hệ Thống (Admin)
Admin Dashboard `/admin` quản lý đa tác vụ với React Router Outlets theo cơ chế Nesting gọn gàng. Hỗ trợ thay đổi status đơn đặt thành Hoàn thành và thu nợ phí phát sinh.

> *(Chụp ảnh giao diện Admin Dashboard - phần Return Vehicle dán dưới đây)*
`![Admin Return Flow](public/docs/admin_return_flow.png)`

## 🛠 Tech Stack Sử Dụng
* **Framework:** React 18, Vite
* **Styling:** TailwindCSS
* **Icons & Components:** Lucide React

## 📝 Cài Đặt và Chạy

**Yêu cầu:** Node.js version 18+

```bash
# Cài đặt các thư viện gói Node Module
npm install

# Khởi chạy Front-End Dev Server (Mặc định Port 5173)
npm run dev
```
