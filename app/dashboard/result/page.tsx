import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SystemConfig from "@/models/SystemConfig";
import MatchReveal from "@/components/dashboard/MatchReveal";

// Ensure data is never cached so the reveal is instant
export const dynamic = 'force-dynamic';

export default async function ResultPage() {
  const session = await getServerSession();
  const email = session?.user?.email!;

  await dbConnect();

  // 1. Security Check: Are results live?
  const config = await SystemConfig.findOne();
  if (!config || !config.isReleased) {
    // If admin hasn't clicked the button, force them back to timer
    redirect("/dashboard"); 
  }

  // 2. Fetch the Verdict
  const user = await User.findOne({ email });

  // 3. Render the Reveal UI
  // We pass the 'matchedWith' roll number (or null) to the client component
  return (
    <div className="w-full max-w-2xl mx-auto py-10">
      <MatchReveal 
        matchedWith={user?.matchedWith || null} 
        myRollNo={user?.rollNumber}
      />
    </div>
  );
}
