import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Navbar from "@/components/dashboard/Navbar";
import LovelyBackground from "@/components/visuals/LovelyBackground";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // 1. Security Check: No Session? -> Go to Login
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen relative font-sans text-red-950 selection:bg-pink-200 selection:text-red-900">
      {/* Global Background */}
      <LovelyBackground />
      
      {/* Navigation */}
      <Navbar userEmail={session.user.email} />

      {/* Main Content */}
      <main className="pt-24 px-4 md:px-8 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}