import React from 'react';
import { motion } from 'framer-motion';

const Sparkle = ({ color, size, delay }) => (
  <motion.div
    initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
    animate={{ 
      scale: [0, 1, 0.5, 0], 
      opacity: [1, 1, 0],
      x: (Math.random() - 0.5) * 150,
      y: (Math.random() - 0.5) * 150,
      rotate: Math.random() * 360
    }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    style={{
      position: 'absolute',
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: '50%',
      zIndex: 100,
      pointerEvents: 'none',
      boxShadow: `0 0 10px ${color}`
    }}
  />
);

const Sparkles = ({ active, color = "var(--color-completed)" }) => {
  if (!active) return null;

  const sparkles = Array.from({ length: 20 });

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
      {sparkles.map((_, i) => (
        <Sparkle 
          key={i} 
          color={color} 
          size={Math.random() * 8 + 4} 
          delay={Math.random() * 0.2} 
        />
      ))}
    </div>
  );
};

export default Sparkles;
