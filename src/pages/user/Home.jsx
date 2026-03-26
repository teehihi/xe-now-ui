import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Car, Shield, Clock, Star, ArrowRight, Zap, TrendingUp, Users } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';
import { vehicles } from '../../data/mockData';
import FloatingOrbs from '../../components/FloatingOrbs';
import AnimatedCounter from '../../components/AnimatedCounter';
import MouseTracker from '../../components/MouseTracker';
import ParticleField from '../../components/ParticleField';
import SpeedLines from '../../components/SpeedLines';
import CarAnimation from '../../components/CarAnimation';
import ScrollProgress from '../../components/ScrollProgress';
import ParallaxSection from '../../components/ParallaxSection';
import RentalProcess from '../../components/RentalProcess';
import Testimonials from '../../components/Testimonials';

const features = [
  { icon: Shield, title: 'Bảo hiểm toàn diện', desc: 'Xe được bảo hiểm đầy đủ, yên tâm trên mọi hành trình', color: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { icon: Clock, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn', color: 'bg-green-50 border-green-100', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { icon: Car, title: 'Xe chất lượng cao', desc: 'Đa dạng dòng xe từ phổ thông đến cao cấp', color: 'bg-purple-50 border-purple-100', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { icon: Star, title: 'Giá tốt nhất', desc: 'Cam kết giá cạnh tranh, nhiều ưu đãi hấp dẫn', color: 'bg-orange-50 border-orange-100', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('Tất cả');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const availableVehicles = vehicles.filter(v => v.status === 'available');
  const filtered = availableVehicles.filter(v =>
    (searchType === 'Tất cả' || v.type === searchType) &&
    (searchLocation === '' || v.location.toLowerCase().includes(searchLocation.toLowerCase()))
  );

  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <ScrollProgress />
      
      {/* Hero */}
      <section className="relative h-[600px] overflow-hidden">
        <FloatingOrbs />
        <ParticleField />
        <SpeedLines />
        <CarAnimation />
        
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero-bg.webp)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172B]/90 to-[#1C398E]/80" />
        
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-6xl mx-auto px-8 h-full flex flex-col items-center justify-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
          >
            <h1 className="text-7xl font-bold text-white leading-tight mb-4">
              Thuê Xe Chất Lượng<br />
              <span className="bg-gradient-to-r from-[#51A2FF] via-[#3B82F6] to-[#155DFC] bg-clip-text text-transparent animate-gradient">
                Trải Nghiệm Đỉnh Cao
              </span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-[#E2E8F0] mb-12 max-w-3xl"
          >
            Đặt xe dễ dàng, lái xe an toàn cùng XeNow - Nền tảng cho thuê xe hàng đầu Việt Nam
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-4xl border border-white/20"
          >
            <div className="grid grid-cols-5 gap-0">
              <div className="px-3">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <MapPin size={14} /> Địa điểm
                </label>
                <button className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-[#717182] text-left flex items-center justify-between">
                  <span>Chọn địa điểm</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="opacity-50">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              
              <div className="px-3">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <Calendar size={14} /> Ngày nhận xe
                </label>
                <input type="date" className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-[#717182] outline-none" />
              </div>
              
              <div className="px-3">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <Calendar size={14} /> Ngày trả xe
                </label>
                <input type="date" className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-[#717182] outline-none" />
              </div>
              
              <div className="px-3">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <Search size={14} /> Loại xe
                </label>
                <button className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-[#717182] text-left flex items-center justify-between">
                  <span>Tất cả</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="opacity-50">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              
              <div className="px-3 flex items-end">
                <button className="w-full py-2.5 bg-gradient-to-r from-[#155DFC] to-[#1447E6] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <Search size={16} /> Tìm kiếm
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <ParallaxSection speed={0.1}>
        <section className="relative py-16 bg-gradient-to-b from-white to-[#F8FAFC] overflow-hidden">
          <FloatingOrbs />
          <div className="relative z-10 max-w-6xl mx-auto px-8">
            <motion.div
              ref={statsRef}
              variants={containerVariants}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              className="grid grid-cols-4 gap-8"
            >
              {[
                { icon: Car, value: 500, suffix: '+', label: 'Xe chất lượng cao', color: 'from-blue-500 to-blue-600' },
                { icon: Users, value: 10000, suffix: '+', label: 'Khách hàng hài lòng', color: 'from-purple-500 to-purple-600' },
                { icon: TrendingUp, value: 98, suffix: '%', label: 'Tỷ lệ hài lòng', color: 'from-green-500 to-green-600' },
                { icon: Zap, value: 24, suffix: '/7', label: 'Hỗ trợ nhanh chóng', color: 'from-orange-500 to-orange-600' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                      <stat.icon size={24} className="text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </ParallaxSection>

      {/* Why XeNow */}
      <ParallaxSection speed={0.05}>
        <section className="relative max-w-6xl mx-auto px-8 py-16 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Tại sao chọn XeNow?</h2>
            <p className="text-gray-500 text-lg">Dịch vụ chuyên nghiệp, uy tín và đáng tin cậy</p>
          </motion.div>
          
          <motion.div
            ref={featuresRef}
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid grid-cols-4 gap-6"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative rounded-2xl border p-6 ${f.color} group cursor-pointer overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <f.icon size={22} className={f.iconColor} />
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </ParallaxSection>

      <RentalProcess />

      {/* Available vehicles */}
      <section className="bg-[#F8FAFC] py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Xe hiện có</h2>
              <p className="text-gray-500 mt-1">{availableVehicles.length} xe đang sẵn sàng cho bạn</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-white bg-white">
              Xem tất cả <ArrowRight size={16} />
            </button>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-6"
          >
            {filtered.slice(0, 6).map((v) => (
              <Tilt
                key={v.id}
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                scale={1.02}
                transitionSpeed={2000}
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full"
                  onClick={() => navigate(`/vehicles/${v.id}`)}
                >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-medium">Sẵn sàng</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 text-gray-700 rounded-lg text-xs font-medium">{v.type}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{v.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{v.brand}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Car size={12} /> {v.seats} chỗ</span>
                    <span>{v.transmission}</span>
                    <span>{v.fuel}</span>
                    <span>{v.mileage.toLocaleString('vi-VN')} km</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Giá thuê/ngày</p>
                      <p className="text-lg font-bold text-[#1B83A1]">{v.pricePerDay.toLocaleString('vi-VN')} ₫</p>
                    </div>
                    <button className="text-sm text-[#1B83A1] font-medium hover:underline">Xem chi tiết →</button>
                  </div>
                </div>
              </motion.div>
              </Tilt>
            ))}
          </motion.div>
        </div>
      </section>

      <Testimonials />

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-[#155DFC] to-[#1447E6] py-20 overflow-hidden">
        <FloatingOrbs />
        <div className="absolute inset-0 bg-[url('/images/hero-bg.webp')] bg-cover bg-center opacity-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-6xl mx-auto px-8 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Sẵn sàng bắt đầu hành trình?</h2>
          <p className="text-blue-100 text-xl mb-8">Đăng ký ngay để nhận ưu đãi đặc biệt cho lần thuê xe đầu tiên</p>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-white text-[#155DFC] font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-2xl"
          >
            Đăng ký ngay
          </motion.button>
        </motion.div>
      </section>
    </>
  );
}
