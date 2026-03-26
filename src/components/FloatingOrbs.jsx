import { motion } from 'framer-motion';

export default function FloatingOrbs() {
  const orbs = [
    { size: 400, color: 'rgba(21, 93, 252, 0.15)', duration: 20, delay: 0, x: '10%', y: '20%' },
    { size: 300, color: 'rgba(81, 162, 255, 0.1)', duration: 25, delay: 2, x: '70%', y: '60%' },
    { size: 350, color: 'rgba(20, 71, 230, 0.12)', duration: 22, delay: 4, x: '80%', y: '10%' },
    { size: 250, color: 'rgba(51, 162, 255, 0.08)', duration: 18, delay: 1, x: '20%', y: '70%' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
