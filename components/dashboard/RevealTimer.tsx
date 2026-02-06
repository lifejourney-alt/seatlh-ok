'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RevealTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        return false; // Stop interval
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        });
        return true; // Continue interval
      }
    };

    // Run immediately then interval
    if (calculateTime()) {
      const interval = setInterval(() => {
        if (!calculateTime()) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [targetDate]);

  // Individual Number Box Component
  const TimeBox = ({ val, label }: { val: number; label: string }) => (
    <div className="flex flex-col items-center mx-1 md:mx-3">
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-2 md:p-4 min-w-[50px] md:min-w-[70px] text-center shadow-lg shadow-pink-500/10 transition-transform hover:scale-105">
        <motion.span 
          key={val} // Triggers animation on change
          initial={{ y: -5, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl md:text-3xl font-mono font-black text-red-900 block"
        >
          {val.toString().padStart(2, '0')}
        </motion.span>
      </div>
      <span className="text-[9px] md:text-xs font-bold text-red-900/60 mt-2 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );

  // Don't render on server to avoid hydration mismatch
  if (!isClient) return null;

  if (isExpired) {
    return (
      <div className="text-center p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/40 mb-8 animate-pulse shadow-xl">
        <h2 className="text-2xl font-black text-red-900 tracking-tight">AWAITING RELEASE</h2>
        <p className="text-sm text-red-800 font-medium mt-1">The Admin is verifying matches...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-8 md:mb-12">
      <TimeBox val={timeLeft.d} label="Days" />
      <TimeBox val={timeLeft.h} label="Hours" />
      <TimeBox val={timeLeft.m} label="Mins" />
      <TimeBox val={timeLeft.s} label="Secs" />
    </div>
  );
}