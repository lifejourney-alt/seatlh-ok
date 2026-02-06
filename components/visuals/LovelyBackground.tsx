'use client';
import { motion } from "framer-motion";

export default function LovelyBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-rose-50">
      {/* 1. The Deep Red Passion Blob (Top Left) */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-40"
      />

      {/* 2. The Hot Pink Playful Blob (Bottom Right) */}
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-40"
      />

      {/* 3. The Soft Peach Depth Blob (Center Left) */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"
      />
    </div>
  );
}