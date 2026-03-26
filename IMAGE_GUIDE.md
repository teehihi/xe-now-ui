# Hướng dẫn sử dụng ảnh trong XeNow

## Đã cập nhật

✅ Tất cả các component đã được cập nhật để sử dụng ảnh từ `/public/images/`

## Danh sách ảnh đã có

### Logo & Branding
- ✅ `/images/logo.webp` - Logo XeNow chính

### Background
- ✅ `/images/hero-bg.webp` - Ảnh nền trang chủ

### Ảnh xe
- ✅ `/images/car-toyota-camry.webp` - Toyota Camry 2023
- ✅ `/images/car-honda-crv.webp` - Honda CR-V 2024
- ✅ `/images/car-mercedes.webp` - Mercedes-Benz E-Class 2024
- ✅ `/images/car-kia-carnival.webp` - Kia Carnival 2023
- ✅ `/images/car-mazda3.webp` - Mazda3 Sport 2023
- ✅ `/images/car-ford-everest.webp` - Ford Everest 2024

## Các component đã cập nhật

### User Components
1. **UserLayout.jsx**
   - Header: Logo XeNow
   - Footer: Logo XeNow (với filter brightness-0 invert cho nền tối)

2. **Home.jsx**
   - Hero section: Background image từ `/images/hero-bg.webp`
   - Vehicle cards: Ảnh xe từ mockData

3. **Login.jsx & Register.jsx**
   - Logo XeNow ở header form

4. **VehicleDetail.jsx**
   - Ảnh xe chi tiết

5. **MyBookings.jsx**
   - Ảnh xe trong danh sách booking

6. **BookingForm.jsx**
   - Ảnh xe trong summary

### Admin Components
1. **AdminSidebar.jsx**
   - Logo XeNow (với filter brightness-0 invert)

## Cách ảnh được sử dụng

### Logo trong header (sáng)
```jsx
<img src="/images/logo.webp" alt="XeNow" className="h-10" />
```

### Logo trong nền tối (admin/footer)
```jsx
<img src="/images/logo.webp" alt="XeNow" 
  className="h-8 brightness-0 invert" />
```

### Background image
```jsx
<div style={{ backgroundImage: 'url(/images/hero-bg.webp)' }} />
```

### Ảnh xe
```jsx
<img src={vehicle.image} alt={vehicle.name} 
  className="w-full h-full object-cover" />
```

## Fallback handling

Tất cả logo có fallback về text:
```jsx
<img src="/images/logo.webp" alt="XeNow" 
  onError={(e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'inline';
  }} />
<span style={{ display: 'none' }}>
  <span className="text-[#1B83A1]">Xe</span>Now
</span>
```

## Tối ưu hóa

### Đã áp dụng:
- ✅ Sử dụng format WebP
- ✅ Đường dẫn tuyệt đối từ `/images/`
- ✅ Alt text cho accessibility
- ✅ Object-cover cho ảnh xe
- ✅ Fallback cho logo

### Có thể thêm:
- [ ] Lazy loading cho ảnh xe: `loading="lazy"`
- [ ] Responsive images với srcset
- [ ] Placeholder blur khi loading

## Kiểm tra

Để kiểm tra ảnh hiển thị đúng:

```bash
# Chạy dev server
cd XeNowUI
npm run dev

# Mở browser và kiểm tra:
# - Logo ở header
# - Hero background
# - Ảnh xe trong danh sách
# - Logo trong admin sidebar
```

## Lưu ý

1. **Đường dẫn**: Luôn dùng `/images/` (không phải `./images/` hay `../images/`)
2. **Format**: WebP được ưu tiên vì dung lượng nhỏ
3. **Kích thước**: 
   - Logo: ~200x60px
   - Hero: ~1920x600px
   - Xe: ~800x600px
4. **Fallback**: Logo có fallback về text nếu ảnh không load được
