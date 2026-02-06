import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Section-14",
  description: "Restricted Access. Authorized Personnel Only.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-red-900 selection:text-white">
      {/* Admin Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            <h1 className="text-xl font-bold tracking-widest text-white font-mono">
              SECTION-14 <span className="text-gray-600">//</span> GOD_MODE
            </h1>
          </div>
          <div className="text-xs text-gray-600 font-mono hidden md:block">
            ENCRYPTED CONNECTION • IP LOGGED
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}