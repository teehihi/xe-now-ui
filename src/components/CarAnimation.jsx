import { motion } from 'framer-motion';
import { Car, Zap, Wind } from 'lucide-react';

export default function CarAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main Car */}
      <motion.div
        className="absolute left-0 top-1/2"
        initial={{ x: '-100%', y: '-50%' }}
        animate={{ x: '120%' }}
        transition={{
          duration: 3,
          delay: 0.5,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
      >
        <div className="relative">
          {/* Car Icon */}
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Car size={80} className="text-blue-400 drop-shadow-2xl" strokeWidth={1.5} />
          </motion.div>

          {/* Speed Effect */}
          <motion.div
            className="absolute -left-20 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Wind size={40} className="text-blue-300/50" />
          </motion.div>

          {/* Spark Effect */}
          <motion.div
            className="absolute -right-10 top-0"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
            }}
          >
            <Zap size={24} className="text-yellow-400" />
          </motion.div>
        </div>
      </motion.div>

      {/* Trail Effect */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 top-1/2 w-20 h-1 bg-gradient-to-r from-blue-400/50 to-transparent rounded-full"
          initial={{ x: '-100%', y: '-50%', opacity: 0 }}
          animate={{ x: '120%', opacity: [0, 1, 0] }}
          transition={{
            duration: 3,
            delay: 0.5 + i * 0.1,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
