import Link from "next/link";
import { HeartCrack, Home } from "lucide-react";
import LovelyBackground from "@/components/visuals/LovelyBackground";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <LovelyBackground />
      
      <div className="bg-white/30 backdrop-blur-xl border border-white/50 p-12 rounded-3xl text-center space-y-6 shadow-2xl max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-100 p-6 rounded-full animate-pulse">
            <HeartCrack className="w-16 h-16 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-red-950">404</h1>
          <h2 className="text-xl font-bold text-red-900">Heartbreak!</h2>
          <p className="text-red-900/60">
            The page you are looking for has been ghosted or does not exist.
          </p>
        </div>

        <Link href="/">
          <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}