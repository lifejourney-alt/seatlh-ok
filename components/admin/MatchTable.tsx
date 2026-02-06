'use client';
import { useState } from 'react';
import { Eye, EyeOff, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Match {
  boy: string;
  girl: string;
  score: number;
}

export default function MatchTable() {
  const [isVisible, setIsVisible] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const loadData = async () => {
    setLoading(true);
    setIsVisible(true);
    try {
      const res = await fetch(`/api/admin/matches?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (data.matches) setMatches(data.matches);
    } catch (e) {
      console.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    loadData(); // Re-fetch for new page
  };

  return (
    <div className="mt-12 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950">
        <h3 className="text-gray-300 font-bold">Match Ledger</h3>
        {!isVisible ? (
          <button 
            onClick={loadData}
            className="flex items-center gap-2 text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded transition-colors"
          >
            <Eye className="w-3 h-3" /> Load Data
          </button>
        ) : (
          <button 
            onClick={() => setIsVisible(false)}
            className="flex items-center gap-2 text-xs bg-red-900/20 text-red-400 hover:bg-red-900/30 px-3 py-1.5 rounded transition-colors"
          >
            <EyeOff className="w-3 h-3" /> Hide
          </button>
        )}
      </div>

      {/* Table Content */}
      {isVisible && (
        <div className="p-0">
          {loading ? (
            <div className="p-8 flex justify-center text-gray-500">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <>
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-950 text-gray-500 uppercase font-mono text-xs">
                  <tr>
                    <th className="px-6 py-3">Boy</th>
                    <th className="px-6 py-3">Girl</th>
                    <th className="px-6 py-3 text-right">Strength</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {matches.map((m, i) => (
                    <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-blue-400">{m.boy}</td>
                      <td className="px-6 py-4 font-mono text-pink-400">{m.girl}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                          {m.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {matches.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-600">
                        No matches found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="p-4 border-t border-gray-800 flex justify-between items-center">
                <button 
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-1 hover:bg-gray-800 rounded disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <span className="text-xs text-gray-500 font-mono">Page {page}</span>
                <button 
                  onClick={() => handlePageChange(page + 1)}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}