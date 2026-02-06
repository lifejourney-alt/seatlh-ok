'use client';
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Individual Heart Component
const Heart = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0, scale: 0.5 }}
    animate={{ y: "-10vh", opacity: [0, 1, 0], scale: 1 }}
    transition={{ 
      duration: 12, 
      repeat: Infinity, 
      delay: delay, 
      ease: "linear" 
    }}
    className="absolute text-red-500/10 text-4xl select-none pointer-events-none"
    style={{ left: `${Math.random() * 100}%` }}
  >
    ❤
  </motion.div>
);

export default function FloatingHearts() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for client load
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <Heart key={i} delay={i * 1.5} />
      ))}
    </div>
  );
}