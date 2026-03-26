import { motion } from 'framer-motion';

export default function SpeedLines() {
  const lines = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: i * 0.1,
    duration: 1.5 + Math.random() * 1,
    y: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
          style={{
            top: `${line.y}%`,
            width: '100%',
          }}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{
            x: '100%',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: line.duration,
            delay: line.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
