# Hướng dẫn đặt ảnh

## Cấu trúc thư mục

```
public/images/
├── logo.webp              # Logo XeNow (khuyến nghị: 200x60px)
├── hero-bg.webp           # Ảnh nền trang chủ (khuyến nghị: 1920x600px)
├── car-toyota-camry.webp  # Ảnh xe Toyota Camry
├── car-honda-crv.webp     # Ảnh xe Honda CR-V
├── car-mercedes.webp      # Ảnh xe Mercedes-Benz
├── car-kia-carnival.webp  # Ảnh xe Kia Carnival
├── car-mazda3.webp        # Ảnh xe Mazda3
└── car-ford-everest.webp  # Ảnh xe Ford Everest
```

## Quy tắc đặt tên

1. **Logo**: `logo.webp` hoặc `logo.png`
   - Kích thước khuyến nghị: 200x60px
   - Format: WebP hoặc PNG với nền trong suốt

2. **Ảnh nền**: `hero-bg.webp` hoặc `hero-bg.jpg`
   - Kích thước khuyến nghị: 1920x600px
   - Format: WebP hoặc JPG

3. **Ảnh xe**: `car-{brand}-{model}.webp`
   - Kích thước khuyến nghị: 800x600px (tỷ lệ 4:3)
   - Format: WebP hoặc JPG
   - Đặt tên theo format: `car-toyota-camry.webp`

## Cách sử dụng trong code

### Trong JSX:
```jsx
// Logo
<img src="/images/logo.webp" alt="XeNow Logo" />

// Ảnh nền
<div style={{ backgroundImage: 'url(/images/hero-bg.webp)' }} />

// Ảnh xe
<img src="/images/car-toyota-camry.webp" alt="Toyota Camry" />
```

### Trong CSS:
```css
.hero {
  background-image: url('/images/hero-bg.webp');
}
```

## Tối ưu hóa ảnh

### Khuyến nghị:
- Sử dụng format WebP để giảm dung lượng
- Nén ảnh trước khi upload
- Kích thước file không nên quá 500KB

### Tools để tối ưu:
- [TinyPNG](https://tinypng.com/) - Nén PNG/JPG
- [Squoosh](https://squoosh.app/) - Convert sang WebP
- [ImageOptim](https://imageoptim.com/) - Tối ưu ảnh (Mac)

## Danh sách ảnh cần có

### Bắt buộc:
- [ ] logo.webp - Logo XeNow
- [ ] hero-bg.webp - Ảnh nền trang chủ

### Ảnh xe (theo mockData.js):
- [ ] car-toyota-camry.webp - Toyota Camry 2023
- [ ] car-honda-crv.webp - Honda CR-V 2024
- [ ] car-mercedes.webp - Mercedes-Benz E-Class 2024
- [ ] car-kia-carnival.webp - Kia Carnival 2023
- [ ] car-mazda3.webp - Mazda3 Sport 2023
- [ ] car-ford-everest.webp - Ford Everest 2024

### Tùy chọn:
- [ ] placeholder.webp - Ảnh placeholder khi không có ảnh xe
- [ ] user-avatar.webp - Avatar mặc định cho user

## Lưu ý

1. **Đường dẫn tuyệt đối**: Luôn bắt đầu bằng `/images/` (không phải `./images/`)
2. **Fallback**: Code đã có xử lý khi ảnh không tồn tại (onError handler)
3. **Lazy loading**: Có thể thêm `loading="lazy"` cho ảnh không quan trọng
4. **Alt text**: Luôn thêm alt text cho accessibility

## Ví dụ component với ảnh

```jsx
function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <img 
        src={`/images/${vehicle.image}`}
        alt={vehicle.name}
        loading="lazy"
        onError={(e) => {
          e.target.src = '/images/placeholder.webp';
        }}
      />
      <h3>{vehicle.name}</h3>
    </div>
  );
}
```
