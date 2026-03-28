import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    role: 'CEO, TechCorp',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=3b82f6&color=fff&size=128&bold=true',
    rating: 5,
    quote: 'Quy trình thuê xe nhanh chóng chưa từng có. Ứng dụng mượt mà, công nghệ Smart Key thực sự rất tiện lợi, tôi không cần phải gặp nhân viên để lấy chìa.'
  },
  {
    id: 2,
    name: 'Trần Thị Thu',
    role: 'Freelancer',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+Thu&background=a855f7&color=fff&size=128&bold=true',
    rating: 5,
    quote: 'Giá cả minh bạch, không phụ phí ẩn. Chất lượng xe cực kỳ tốt, nội thất sạch sẽ thơm tho. Tôi đã thuê xe ở XeNow 3 lần và luôn cảm thấy hài lòng.'
  },
  {
    id: 3,
    name: 'Lê Hoàng Minh',
    role: 'Nhiếp ảnh gia',
    avatar: 'https://ui-avatars.com/api/?name=Le+Hoang+Minh&background=10b981&color=fff&size=128&bold=true',
    rating: 4,
    quote: 'Rất ấn tượng với giao diện ứng dụng. Tìm kiếm xe lân cận rất nhanh. Đội ngũ hỗ trợ nhiệt tình khi tôi cần đổi lịch trình giữa chừng.'
  },
  {
    id: 4,
    name: 'Phạm Thanh Hương',
    role: 'Trưởng nhóm Marketing',
    avatar: 'https://ui-avatars.com/api/?name=Pham+Thanh+Huong&background=f59e0b&color=fff&size=128&bold=true',
    rating: 5,
    quote: 'Trải nghiệm thuê xe sang cho chuyến công tác quá tuyệt vời. Các xe thuộc phân khúc cao cấp luôn sẵn sàng với mức giá hợp lý. Tuyệt vời!'
  },
  {
    id: 5,
    name: 'Vũ Đức Duy',
    role: 'Kỹ sư phần mềm',
    avatar: 'https://ui-avatars.com/api/?name=Vu+Duc+Duy&background=ef4444&color=fff&size=128&bold=true',
    rating: 5,
    quote: 'Cách thức thanh toán rất đa dạng. XeNow đã mang đến trải nghiệm thuê xe hoàn toàn mới mẻ, hiện đại như các sản phẩm công nghệ tiên tiến nhất.'
  }
];

export default function Testimonials() {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials-section" className="py-24 bg-[#0a0f1c] relative overflow-hidden snap-start snap-always">
      {/* Background flares */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 mb-16 relative z-10 text-center">
        <h2 className="text-sm font-bold tracking-widest text-[#51A2FF] uppercase mb-3">
          Khách Hàng Nói Gì Về Chúng Tôi
        </h2>
        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Trải Nghiệm Thực Tế
        </h3>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Hàng ngàn khách hàng đã tin tưởng XeNow cho những chuyến đi quan trọng của họ. Khám phá những câu chuyện thực tế bên dưới.
        </p>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative w-full overflow-hidden flex scroll-container before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-32 before:bg-gradient-to-r before:from-[#0a0f1c] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-32 after:bg-gradient-to-l after:from-[#0a0f1c] after:to-transparent">
        
        <motion.div
          animate={{ x: [0, -1920] }} // Adjust duration and width based on items length
          transition={{
            repeat: Infinity,
            duration: 30, // Smooth steady crawl
            ease: "linear",
          }}
          className="flex gap-6 w-max px-4 py-8 hover:[animation-play-state:paused]"

        >
          {duplicatedTestimonials.map((testimonial, idx) => (
            <div
              key={`${testimonial.id}-${idx}`}
              className="w-[350px] md:w-[450px] relative group shrink-0"
            >
              {/* Card Hover Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              
              <div className="relative h-full bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col hover:-translate-y-2 transition-transform duration-500 shadow-xl">
                <Quote className="absolute top-6 right-8 text-white/5" size={64} />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < testimonial.rating ? "fill-amber-400 text-amber-400" : "fill-gray-600 text-gray-600"}
                    />
                  ))}
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-grow relative z-10 italic">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4 pt-6 border-t border-white/10 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 border-2 border-transparent rounded-full" style={{ background: 'linear-gradient(to right, #3b82f6, #a855f7) border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)' }} />
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-transparent"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
