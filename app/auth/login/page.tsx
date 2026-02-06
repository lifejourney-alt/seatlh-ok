'use client';
import { signIn } from "next-auth/react";
import { Heart, Lock, ArrowRight } from "lucide-react";
import GlassCard from "@/components/visuals/GlassCard";
import FloatingHearts from "@/components/visuals/FloatingHearts";
import LovelyBackground from "@/components/visuals/LovelyBackground";

export default function LoginPage() {
  // const handleLogin = () => {
  //   // Redirect to dashboard after successful login
  //   signIn('google', { callbackUrl: '/dashboard' });
  // };
const handleLogin = () => {
  // Use 'undefined' to show the list of providers (Google + Dev Login)
  // OR use 'credentials' to force the Dev Login immediately
  signIn(undefined, { callbackUrl: '/dashboard' });
};
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* 1. Background Layers */}
      <LovelyBackground />
      <FloatingHearts />

      {/* 2. The Main Card */}
      <GlassCard className="w-full max-w-md p-8 md:p-12 text-center space-y-8 animate-in zoom-in duration-500">
        
        {/* Logo / Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400 blur-xl opacity-20 animate-pulse" />
            <div className="bg-white/50 p-4 rounded-full border border-white/60 shadow-inner relative z-10">
              <Heart className="w-12 h-12 text-red-600 fill-red-600" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-red-950 tracking-tight">
            SECTION-14
          </h1>
          <p className="text-red-900/60 font-medium">
            The Double-Blind Match Experiment
          </p>
        </div>

        {/* Login Button */}
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="group relative w-full py-4 bg-white/60 hover:bg-white/80 border border-red-200 text-red-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/10 flex items-center justify-center gap-3 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <img 
                src="https://authjs.dev/img/providers/google.svg" 
                alt="Google" 
                className="w-5 h-5" 
              />
              Sign in with Nirma Email
            </span>
            {/* Hover shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-red-900/40 uppercase font-bold tracking-widest">
            <Lock className="w-3 h-3" />
            Secure & Private
          </div>
        </div>

        {/* Footer Disclaimer */}
        <p className="text-xs text-red-900/40 leading-relaxed max-w-xs mx-auto">
          By entering, you agree to the rules. 
          <br /> Matches are generated algorithmically on Feb 14.
        </p>
      </GlassCard>
    </div>
  );
}