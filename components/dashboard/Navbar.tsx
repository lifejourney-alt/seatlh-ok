'use client';
import { UserCircle, LogOut, Heart } from "lucide-react";
import { signOut } from "next-auth/react";

interface NavbarProps {
  userEmail: string;
}

export default function Navbar({ userEmail }: NavbarProps) {
  // Extract name: "21bce045@nirma..." -> "21BCE045"
  const name = userEmail ? userEmail.split('@')[0].toUpperCase() : "STUDENT";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center transition-all duration-300">
      {/* Logo Area */}
      <div className="flex items-center gap-2 bg-white/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm hover:bg-white/40 transition-colors">
        <Heart className="w-4 h-4 text-red-600 fill-red-600 animate-pulse" />
        <span className="font-bold text-red-950 tracking-tight text-sm">
          SECTION-14
        </span>
      </div>

      {/* User Profile & Logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/30 backdrop-blur-md pl-1 pr-4 py-1 rounded-full border border-white/50 shadow-sm transition-transform hover:scale-105">
          <div className="bg-gradient-to-br from-red-400 to-pink-500 p-1.5 rounded-full shadow-inner">
            <UserCircle className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-red-900 truncate max-w-[100px] md:max-w-none font-mono tracking-wide">
            {name}
          </span>
        </div>

        {/* Logout Button */}
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="bg-white/30 backdrop-blur-md p-2 rounded-full border border-white/50 text-red-900 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
