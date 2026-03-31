import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Car, Shield, Clock, Star, ArrowRight, Zap, TrendingUp, Users } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';
import { api } from '../../services/api';
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
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [searchType, setSearchType] = useState('');
  const [locations, setLocations] = useState([]);
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const [showTypeDrop, setShowTypeDrop] = useState(false);

  const vehicleTypes = ['Xe Ô Tô', 'Xe Tay Ga', 'Xe Số'];

  useEffect(() => {
    fetch('http://localhost:8080/api/locations')
      .then(r => r.json())
      .then(data => {
        const list = data.data || data;
        setLocations(Array.isArray(list) ? list : []);
      }).catch(() => {});
  }, []);
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (searchType) params.set('type', searchType);
    if (searchStartDate) params.set('startDate', searchStartDate);
    if (searchEndDate) params.set('endDate', searchEndDate);
    navigate(`/vehicles?${params.toString()}`);
  };
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    // Add scroll snap specifically for home page
    document.documentElement.style.scrollSnapType = 'y mandatory';

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.style.scrollSnapType = '';
    };
  }, []);

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles');
        // api.get returns { success, message, data: { content: [...] } }
        const pageData = response.data || response;
        const content = pageData?.content || [];
        const transformedData = content.map(vehicle => ({
          ...vehicle,
          pricePerDay: Number(vehicle.pricePerDay),
          status: vehicle.status ? vehicle.status.toLowerCase() : 'available',
          image: vehicle.image?.startsWith('http') ? vehicle.image : `http://localhost:8080${vehicle.image || '/images/car-toyota-camry.webp'}`
        }));
        setVehicles(transformedData);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);



  const availableVehicles = vehicles.filter(v => v.status === 'available');
  const filtered = availableVehicles.filter(v =>
    (!searchType || v.type === searchType) &&
    (!searchLocation || v.location?.toLowerCase().includes(searchLocation.toLowerCase()))
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
      <section className="relative h-[600px] snap-start scroll-mt-[81px]">
        {/* Background effects - clipped */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingOrbs />
          <ParticleField />
          <SpeedLines />
        <CarAnimation />

        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero-bg.webp)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172B]/90 to-[#1C398E]/80" />
        </div>{/* end background */}

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
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-4xl border border-white/20 relative z-20"
          >
            <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.5fr] gap-0">
              {/* Địa điểm */}
              <div className="px-3 relative">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <MapPin size={14} /> Địa điểm
                </label>
                <button onClick={() => { setShowLocationDrop(!showLocationDrop); setShowTypeDrop(false); }}
                  className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-left flex items-center justify-between">
                  <span className={searchLocation ? 'text-gray-800' : 'text-[#717182]'}>{searchLocation || 'Chọn địa điểm'}</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="opacity-50 shrink-0">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {showLocationDrop && (
                  <div className="absolute top-full left-3 right-3 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-[9999] max-h-48 overflow-y-auto">
                    <button onClick={() => { setSearchLocation(''); setShowLocationDrop(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50">Tất cả địa điểm</button>
                    {locations.map(l => (
                      <button key={l.locationId} onClick={() => { setSearchLocation(l.branchName); setShowLocationDrop(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 ${searchLocation === l.branchName ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                        {l.branchName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ngày nhận */}
              <div className="px-3">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <Calendar size={14} /> Ngày nhận xe
                </label>
                <input type="date" value={searchStartDate} onChange={e => setSearchStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-[#717182] outline-none" />
              </div>

              {/* Ngày trả */}
              <div className="px-3">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <Calendar size={14} /> Ngày trả xe
                </label>
                <input type="date" value={searchEndDate} onChange={e => setSearchEndDate(e.target.value)}
                  min={searchStartDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-[#717182] outline-none" />
              </div>

              {/* Loại xe */}
              <div className="px-3 relative">
                <label className="flex items-center gap-2 text-xs font-medium text-[#45556C] mb-2">
                  <Search size={14} /> Loại xe
                </label>
                <button onClick={() => { setShowTypeDrop(!showTypeDrop); setShowLocationDrop(false); }}
                  className="w-full px-3 py-2 bg-[#F3F3F5] rounded-lg text-sm text-left flex items-center justify-between">
                  <span className={searchType ? 'text-gray-800' : 'text-[#717182]'}>{searchType || 'Tất cả'}</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="opacity-50 shrink-0">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {showTypeDrop && (
                  <div className="absolute top-full left-3 right-3 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-[9999]">
                    <button onClick={() => { setSearchType(''); setShowTypeDrop(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50">Tất cả</button>
                    {vehicleTypes.map(t => (
                      <button key={t} onClick={() => { setSearchType(t); setShowTypeDrop(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 ${searchType === t ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tìm kiếm */}
              <div className="px-3 flex items-end">
                <button onClick={handleSearch}
                  className="w-full py-2.5 bg-gradient-to-r from-[#155DFC] to-[#1447E6] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <Search size={16} /> Tìm kiếm
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Available vehicles */}
      <section className="bg-[#F8FAFC] pt-24 pb-16 snap-start">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Xe hiện có</h2>
              <p className="text-gray-500 mt-1">{availableVehicles.length} xe đang sẵn sàng cho bạn</p>
            </div>
            <button
              onClick={() => navigate('/vehicles')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-white bg-white transition-all hover:shadow-md hover:border-blue-300"
            >
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
            {loading ? (
              <div className="col-span-3 flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B83A1]"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500">
                Không tìm thấy xe phù hợp
              </div>
            ) : (
              filtered.slice(0, 6).map((v) => (
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
              )))}
          </motion.div>
        </div>
      </section>
      {/* Why XeNow */}
      <ParallaxSection speed={0.05}>
        <section className="relative max-w-6xl mx-auto px-8 pt-28 pb-20 overflow-hidden snap-start">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 rounded-full text-sm font-medium mb-4 shadow-lg"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dịch vụ chuyên nghiệp
              </span>
            </motion.div>

            <h2 className="text-5xl font-bold mb-3">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Tại sao chọn XeNow?
              </span>
            </h2>
            <p className="text-gray-600 text-lg">Dịch vụ uy tín và đáng tin cậy</p>
          </motion.div>

          <motion.div
            ref={featuresRef}
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="relative grid grid-cols-4 gap-6"
          >
            {features.map((f, index) => (
              <motion.div
                key={f.title}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.03 }}
                className="relative group cursor-pointer"
              >
                {/* Gradient Border Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />

                {/* Card */}
                <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl overflow-hidden">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.color.replace('bg-', 'from-').replace('-50', '-50/30')} to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    {/* Icon Container with Glow */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="relative mb-4"
                    >
                      <div className={`absolute inset-0 ${f.iconBg} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className={`relative w-14 h-14 rounded-2xl ${f.iconBg} flex items-center justify-center shadow-lg border border-white/40`}>
                        <f.icon size={24} className={f.iconColor} />
                      </div>
                    </motion.div>

                    {/* Content */}
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{f.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>

                    {/* Hover Arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ArrowRight size={20} className={f.iconColor} />
                    </motion.div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          <div className="absolute bottom-10 left-10 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </section>
      </ParallaxSection>

      <RentalProcess />
      {/* CTA */}
      <section id="cta-section" className="relative min-h-screen flex items-center justify-center overflow-hidden snap-start snap-always">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EFF6FF] via-white to-[#F0F9FF]" />
        <FloatingOrbs />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto px-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-600 font-medium mb-6"
          >
            <Zap size={16} className="text-blue-500" />
            Ưu đãi đặc biệt cho khách hàng mới
          </motion.div>

          <h2 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Sẵn sàng bắt đầu<br />
            <span className="bg-gradient-to-r from-[#1B83A1] to-[#3B82F6] bg-clip-text text-transparent">
              hành trình của bạn?
            </span>
          </h2>

          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt cho lần thuê xe đầu tiên và trải nghiệm dịch vụ tốt nhất
          </p>

          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-[#1B83A1] to-[#3B82F6] text-white font-semibold rounded-xl hover:shadow-xl transition-all flex items-center gap-2"
            >
              Đăng ký ngay
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/vehicles')}
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
            >
              Xem xe ngay
            </motion.button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-500" />
              <span>Bảo hiểm toàn diện</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span>Hỗ trợ 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-orange-500" />
              <span>Đánh giá 4.9/5</span>
            </div>
          </div>
        </motion.div>
      </section>
      <Testimonials />
    </>
  );
}
