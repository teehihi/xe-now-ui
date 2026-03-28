import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, useSpring } from 'framer-motion';
import { Search, CreditCard, Key, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: '1. Đặt xe',
    desc: 'Khách tìm xe → nhập thời gian → gửi yêu cầu.',
    icon: Search,
    color: 'from-blue-500 to-cyan-400',
    glow: 'shadow-cyan-500/50',
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-64 h-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col items-center justify-center gap-6 shadow-2xl"
        >
          <Search size={56} className="text-cyan-400 drop-shadow-lg" />
          <p className="text-white font-bold text-lg tracking-wide border-b border-cyan-400/30 pb-1">Đang tìm xe...</p>
          <div className="w-3/4 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="h-full w-1/2 bg-cyan-400" />
          </div>
        </motion.div>
      </div>
    )
  },
  {
    id: 2,
    title: '2. Duyệt & thanh toán',
    desc: 'Nhân viên duyệt đơn → tạo hợp đồng. Khách thanh toán tiền cọc.',
    icon: CreditCard,
    color: 'from-purple-500 to-pink-500',
    glow: 'shadow-pink-500/50',
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-72 h-48 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center gap-4"
        >
          <CreditCard size={56} className="text-pink-400 drop-shadow-lg" />
          <p className="text-white font-bold text-lg tracking-wide border-b border-pink-400/30 pb-1">Thanh toán an toàn</p>
          <div className="w-3/4 h-1.5 bg-white/20 rounded-full overflow-hidden mt-2">
            <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="h-full w-1/2 bg-pink-400" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -right-4 -bottom-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50"
          >
            <CheckCircle2 size={24} className="text-white" />
          </motion.div>
        </motion.div>
      </div>
    )
  },
  {
    id: 3,
    title: '3. Nhận xe',
    desc: 'Khách đến nhận xe. Nhân viên bàn giao, ghi nhận tình trạng.',
    icon: Key,
    color: 'from-green-400 to-emerald-600',
    glow: 'shadow-emerald-500/50',
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-64 h-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex flex-col items-center justify-center gap-4 shadow-[inset_0_0_40px_rgba(255,255,255,0.1)] shadow-2xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30"
          />
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 cursor-pointer relative z-20"
          >
            <Key size={40} className="text-white drop-shadow-md" />
          </motion.div>
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm z-20 drop-shadow-md">Tap to Unlock</p>
        </motion.div>
      </div>
    )
  }
];

export default function RentalProcess() {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isInside, setIsInside] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) {
      setActiveStep(0);
    } else if (latest >= 0.33 && latest < 0.66) {
      setActiveStep(1);
    } else {
      setActiveStep(2);
    }

    const currentlyInside = latest > 0.05 && latest < 0.95;
    if (currentlyInside !== isInside) {
      setIsInside(currentlyInside);
      window.dispatchEvent(new CustomEvent('toggle-header', { detail: { hide: currentlyInside } }));
    }
  });

  return (
    <div ref={containerRef} className="relative bg-[#0a0f1c] h-[300vh] snap-start snap-always">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">

          {/* Left Side: Text and Progress */}
          <div className="flex flex-col justify-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Trải nghiệm tương lai của việc thuê xe</h3>
              <p className="text-gray-400 text-lg">Hệ sinh thái thông minh của XeNow đưa bạn lên xe chỉ trong vài phút.</p>
            </motion.div>

            <div className="space-y-8 relative">
              {/* Vertical Progress Line Background */}
              <div className="absolute left-[38px] top-8 bottom-8 w-0.5 bg-white/10 rounded-full" />

              {/* Vertical Active Progress Line */}
              <motion.div
                className="absolute left-[38px] top-8 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full origin-top"
                style={{ scaleY: scrollYProgress }}
              />

              {steps.map((step, index) => {
                const isActive = index === activeStep;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={`relative flex gap-6 p-6 rounded-2xl transition-all duration-500 ${isActive ? 'bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-md' : 'opacity-40'}`}
                  >
                    <div className="shrink-0 relative z-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-900 border transition-all duration-500 ${isActive ? `border-transparent bg-gradient-to-br ${step.color} shadow-lg ${step.glow}` : 'border-gray-700 text-gray-500'}`}>
                        <Icon size={24} className={isActive ? 'text-white' : ''} />
                      </div>
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                        {step.title}
                      </h4>
                      <motion.div
                        initial={false}
                        animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0, marginTop: isActive ? 8 : 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="text-gray-400 leading-relaxed text-sm md:text-base pr-4">
                          {step.desc}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Illustrations */}
          <div className="hidden lg:flex items-center justify-center relative h-full min-h-[500px]">
            {/* Center Glow container */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />

            {steps.map((step, index) => (
              <div
                key={`illus-${step.id}`}
                className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-center ${index === activeStep ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                {step.illustration}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
