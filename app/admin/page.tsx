import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SystemConfig from "@/models/SystemConfig";
import MarketingCharts from "@/components/admin/MarketingCharts";
import ReleaseControl from "@/components/admin/ReleaseControl";
import MatchTable from "@/components/admin/MatchTable";

// Disable caching so admin always sees fresh data
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await dbConnect();

  // 1. Fetch System Config (Create default if missing)
  let config = await SystemConfig.findOne();
  if (!config) {
    config = await SystemConfig.create({
      revealTime: new Date("2026-02-14T12:00:00"),
      isReleased: false
    });
  }

  // 2. Fetch User Data for Analytics
  // We only need the createdAt field to build the chart
  const users = await User.find({}, 'createdAt').lean();
  
  // 3. Process Data for Charts (Group Signups by Date)
  // Format: { time: "Feb 10", signups: 15 }
  const rawData: Record<string, number> = {};
  
  users.forEach((user: any) => {
    const date = new Date(user.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    rawData[date] = (rawData[date] || 0) + 1;
  });

  // Convert to array and sort by date
  const chartData = Object.entries(rawData)
    .map(([time, signups]) => ({ time, signups }))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  // 4. Calculate Key Metrics
  const totalUsers = users.length;

  return (
    <div className="space-y-12">
      {/* SECTION A: STATUS OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* The Launch Control (Takes up 1/3) */}
        <div className="lg:col-span-1">
          <ReleaseControl isReleased={config.isReleased} />
        </div>

        {/* The Charts (Takes up 2/3) */}
        <div className="lg:col-span-2">
           {/* We pass the calculated data and total count to the client component */}
           <div className="bg-gray-900 border border-gray-800 rounded-xl p-1 shadow-xl">
              <MarketingCharts data={chartData} />
           </div>
           
           {/* Simple Stats Grid */}
           <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Total Users</p>
                <p className="text-4xl font-mono text-white mt-2 font-bold">{totalUsers}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                 <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Est. Pairs</p>
                 {/* This is a rough estimate placeholder until the algorithm runs */}
                 <p className="text-4xl font-mono text-gray-500 mt-2 font-bold">--</p>
              </div>
           </div>
        </div>
      </div>

      {/* SECTION B: THE DATA VAULT */}
      <div className="border-t border-gray-800 pt-12">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-red-600">#</span> DATABASE_LEDGER
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Access restricted. All queries are logged for security purposes.
        </p>
        
        <MatchTable />
      </div>
    </div>
  );
}