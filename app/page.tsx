import Link from "next/link";
import { Heart, Lock, ArrowRight, Zap } from "lucide-react";
import LovelyBackground from "@/components/visuals/LovelyBackground";
import FloatingHearts from "@/components/visuals/FloatingHearts";
import GlassCard from "@/components/visuals/GlassCard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Visuals */}
      <LovelyBackground />
      <FloatingHearts />

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left: The Hook */}
        <div className="text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-800 text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            Live for 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-red-950 tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-700">
            SECTION<span className="text-red-600">-14</span>
          </h1>
          
          <p className="text-lg text-red-900/70 leading-relaxed max-w-md mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100">
            The annual <b>double-blind</b> matching experiment. 
            List your crushes secretly. If they list you back, you both get an email. 
            If not, no one ever knows.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200">
            <Link href="/login">
              <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xl shadow-red-500/20 transition-all hover:scale-105 flex items-center gap-2">
                Enter The Portal <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/about">
              <button className="px-8 py-4 bg-white/40 hover:bg-white/60 text-red-900 font-bold rounded-xl border border-white/60 backdrop-blur-md transition-all">
                How it Works
              </button>
            </Link>
          </div>
        </div>

        {/* Right: The Feature Cards (Desktop Only) */}
        <div className="hidden lg:grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right-16 duration-1000">
          <GlassCard className="p-6 flex items-start gap-4 transform rotate-2 hover:rotate-0 transition-transform">
            <div className="bg-red-100 p-3 rounded-xl">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-950">100% Private</h3>
              <p className="text-sm text-red-900/60 mt-1">
                Your data is encrypted. We only reveal names if there is a mutual match.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-start gap-4 transform -rotate-1 hover:rotate-0 transition-transform translate-x-8">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-950">The Algorithm</h3>
              <p className="text-sm text-red-900/60 mt-1">
                Our matching logic runs once on Feb 14th. No human intervention.
              </p>
            </div>
          </GlassCard>
        </div>

      </div>
    </main>
  );
}