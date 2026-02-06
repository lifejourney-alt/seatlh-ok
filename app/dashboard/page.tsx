import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SystemConfig from "@/models/SystemConfig";
import RevealTimer from "@/components/dashboard/RevealTimer";
import CrushForm from "@/components/dashboard/CrushForm";

// Force dynamic rendering so time/data is always fresh
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession();
  const email = session?.user?.email!;

  await dbConnect();

  // 1. Fetch Global Config (Timer)
  let config = await SystemConfig.findOne();
  // Fallback if config doesn't exist yet
  if (!config) {
    config = { revealTime: new Date("2026-02-14T12:00:00").toISOString() };
  }

  // 2. Fetch User Data (Pre-fill Form)
  let user = await User.findOne({ email });

  // If user is new (didn't go through auth hook properly), create basic record
  if (!user) {
    const rollNo = email.split('@')[0].toUpperCase();
    user = await User.create({
      email,
      rollNumber: rollNo,
      crushes: ["", "", "", "", ""],
      isOpenToAll: false
    });
  }

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-700">
      
      {/* Section 1: The Countdown */}
      <div className="mb-10 w-full text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 mb-6 shadow-sm">
          <span className="text-[10px] md:text-xs font-bold text-red-900 uppercase tracking-[0.2em]">
            Time Until Matches Reveal
          </span>
        </div>
        <RevealTimer targetDate={config.revealTime.toString()} />
      </div>

      {/* Section 2: The Interaction Form */}
      <div className="w-full max-w-lg">
        <CrushForm 
          myRollNo={user.rollNumber} 
          initialCrushes={user.crushes}
          initialOpenToAll={user.isOpenToAll}
        />
      </div>

      {/* Footer Info */}
      <div className="mt-12 mb-8 text-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-red-900 font-bold uppercase tracking-widest">
          Double Blind • 100% Private • Automated
        </p>
        <p className="text-xs text-red-900/60 max-w-xs mx-auto leading-relaxed">
          Your choices are encrypted. <br/>
          Results are only generated if the feeling is mutual.
        </p>
      </div>
    </div>
  );
}