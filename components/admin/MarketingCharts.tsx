'use client';
import { useState } from 'react';
import { Lock, Rocket, AlertTriangle } from 'lucide-react';

export default function ReleaseControl({ isReleased }: { isReleased: boolean }) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(isReleased ? "RELEASED" : "LOCKED");

  const handleRelease = async () => {
    if (!key) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: key }),
      });

      if (res.ok) {
        setStatus("RELEASED");
        alert("🚀 RESULTS ARE LIVE! Godspeed.");
      } else {
        alert("❌ INVALID KEY. Access Denied.");
      }
    } catch (error) {
      alert("System Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black border border-red-900/50 rounded-xl p-8 max-w-2xl mx-auto shadow-2xl shadow-red-900/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Rocket className="text-red-500" />
          Launch Control
        </h2>
        <span className={`px-3 py-1 rounded text-xs font-mono font-bold ${status === 'RELEASED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          STATUS: {status}
        </span>
      </div>

      <div className="space-y-4">
        {status === "LOCKED" ? (
          <>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="password"
                placeholder="Enter Launch Key..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>

            <button
              onClick={handleRelease}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "🔴 EXECUTE RELEASE"}
            </button>
            
            <p className="text-xs text-red-500/60 flex items-center gap-1 justify-center mt-2">
              <AlertTriangle className="w-3 h-3" />
              Warning: This action cannot be undone.
            </p>
          </>
        ) : (
          <div className="text-center p-6 bg-green-900/20 rounded-lg border border-green-900/50">
            <h3 className="text-green-400 font-bold text-lg">Event is Live</h3>
            <p className="text-green-600/70 text-sm">Matches have been distributed.</p>
          </div>
        )}
      </div>
    </div>
  );
}