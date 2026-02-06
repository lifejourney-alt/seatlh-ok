'use client';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Mail, Frown, ArrowRight, Lock } from "lucide-react";
import GlassCard from "@/components/visuals/GlassCard";

interface MatchRevealProps {
  matchedWith: string | null;
  myRollNo: string;
}

export default function MatchReveal({ matchedWith, myRollNo }: MatchRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Trigger Confetti ONLY if there is a match and user clicks reveal
  const handleReveal = () => {
    setIsRevealed(true);

    if (matchedWith) {
      // The Celebration Explosion
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  };

  if (!isRevealed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse" />
          <Lock className="w-24 h-24 text-red-900 relative z-10" />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-red-950">Results Are In</h1>
          <p className="text-red-900/60">The algorithm has finished processing.</p>
        </div>

        <button 
          onClick={handleReveal}
          className="group relative px-8 py-4 bg-red-600 text-white font-bold rounded-2xl text-xl shadow-xl shadow-red-500/30 overflow-hidden hover:scale-105 transition-transform"
        >
          <span className="relative z-10 flex items-center gap-2">
            Reveal My Destiny <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      {matchedWith ? (
        // STATE A: IT'S A MATCH
        <GlassCard className="p-8 md:p-12 text-center space-y-8 border-pink-400/50 bg-white/60">
          <div className="inline-block p-4 rounded-full bg-red-100 mb-4 animate-bounce">
            <Heart className="w-16 h-16 text-red-600 fill-red-600" />
          </div>

          <div>
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 tracking-tight">
              IT'S A MATCH!
            </h2>
            <p className="text-xl text-red-900/70 mt-4 font-medium">
              The feeling is mutual.
            </p>
          </div>

          <div className="py-8">
            <div className="text-sm font-bold text-red-900/40 uppercase tracking-widest mb-2">
              Your Valentine Is
            </div>
            <div className="text-4xl md:text-5xl font-mono font-bold text-red-950 tracking-wider bg-white/50 inline-block px-8 py-4 rounded-2xl border border-red-200">
              {matchedWith}
            </div>
          </div>

          <div className="space-y-4">
            <a 
              href={`mailto:${matchedWith.toLowerCase()}@nirmauni.ac.in?subject=Hey... We Matched on Section-14!`}
              className="block w-full"
            >
              <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all">
                <Mail className="w-5 h-5" /> Send an Email
              </button>
            </a>
            <p className="text-xs text-red-900/50">
              Go ahead. Don't leave them waiting.
            </p>
          </div>
        </GlassCard>
      ) : (
        // STATE B: NO MATCH
        <GlassCard className="p-8 text-center space-y-6 max-w-md mx-auto">
          <div className="flex justify-center">
            <div className="bg-gray-100 p-4 rounded-full">
              <Frown className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800">No Match This Time</h2>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Unfortunately, the people you listed didn't list you back (or they didn't register).
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <p className="text-red-800 text-sm italic">
              "The course of true love never did run smooth."
              <br/><span className="text-xs opacity-60">— Shakespeare</span>
            </p>
          </div>

          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="text-sm text-gray-500 font-bold hover:text-red-600 transition-colors"
          >
            Check again later or Logout
          </button>
        </GlassCard>
      )}
    </motion.div>
  );
}