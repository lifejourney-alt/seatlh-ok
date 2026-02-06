'use client';
import { useState, useEffect } from "react";
import { Heart, Search, Lock, Sparkles, Check, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CrushFormProps {
  myRollNo: string;
  initialCrushes?: string[];
  initialOpenToAll?: boolean;
}

export default function CrushForm({ myRollNo, initialCrushes, initialOpenToAll }: CrushFormProps) {
  // Initialize state with props or defaults
  const [crushes, setCrushes] = useState<string[]>(initialCrushes || ["", "", "", "", ""]);
  const [isOpenToAll, setIsOpenToAll] = useState(initialOpenToAll || false);
  
  // UI States
  const [isSealed, setIsSealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // DEADLINE: Feb 13, 2026 at 6:00 PM
  const DEADLINE = new Date("2026-02-13T18:00:00").getTime();
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    // Check deadline on client mount
    if (Date.now() > DEADLINE) {
      setIsDeadlinePassed(true);
    }
    // If user already had data saved (from props), mark as sealed initially if you want
    // But usually we let them edit until they click seal or deadline passes
  }, []);

  const updateCrush = (index: number, value: string) => {
    if (isSealed || isDeadlinePassed) return;
    const newCrushes = [...crushes];
    // Force uppercase, remove spaces/special chars, limit to 10 chars
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    newCrushes[index] = cleaned;
    setCrushes(newCrushes);
    
    // Clear messages on edit
    if (errorMsg) setErrorMsg("");
    if (successMsg) setSuccessMsg("");
  };

  const handleSubmit = async () => {
    if (isDeadlinePassed) {
      setErrorMsg("Voting line is officially closed!");
      return;
    }

    // Basic Validation: Check if at least one field is filled or Wildcard is on
    const hasVotes = crushes.some(c => c.length >= 5) || isOpenToAll;
    if (!hasVotes) {
      setErrorMsg("Please enter at least one Roll Number or enable 'Open to Everyone'.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch('/api/user/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crushes, isOpenToAll }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSealed(true);
        setSuccessMsg("Choices locked securely! Come back on Feb 14.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(data.error || "Something went wrong. Try again.");
      }
    } catch (e) {
      setErrorMsg("Connection error. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-20 relative">
      
      {/* Messages */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="bg-red-100 border border-red-200 text-red-800 p-3 rounded-xl flex items-center gap-2 text-sm font-bold">
            <AlertTriangle className="w-4 h-4" /> {errorMsg}
          </motion.div>
        )}
        {successMsg && (
          <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="bg-green-100 border border-green-200 text-green-800 p-3 rounded-xl flex items-center gap-2 text-sm font-bold">
            <Check className="w-4 h-4" /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Identity Card */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 p-4 rounded-xl flex items-center justify-between shadow-sm transition-transform hover:scale-[1.01]">
        <div>
          <p className="text-[10px] uppercase font-bold text-red-900/50 tracking-wider mb-1">Matching For Identity</p>
          <p className="text-2xl font-mono font-black text-red-900 tracking-wide">{myRollNo}</p>
        </div>
        <div className="bg-green-100 p-2 rounded-full border border-green-200">
          <Check className="w-5 h-5 text-green-600" />
        </div>
      </div>

      {/* Inputs Grid */}
      <div className={`space-y-3 transition-all duration-500 ${isDeadlinePassed || isSealed ? 'opacity-70 grayscale-[0.5] pointer-events-none' : ''}`}>
        {crushes.map((crush, index) => {
          // Visual validation logic (e.g., must be 8+ chars to show heart)
          const isValid = crush.length >= 8; 
          
          return (
            <motion.div 
              key={index} 
              className="relative group"
              whileFocusWithin={{ scale: 1.02, zIndex: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <input
                type="text"
                disabled={isSealed || isDeadlinePassed}
                placeholder={isOpenToAll && index > 2 ? "Wildcard Active (Optional)" : `Crush #${index + 1} (Roll No)`}
                value={crush}
                onChange={(e) => updateCrush(index, e.target.value)}
                className="w-full bg-white/50 backdrop-blur-md border-2 border-white/60 focus:border-pink-500/50 focus:bg-white/80 rounded-xl p-4 pl-12 text-lg font-bold text-red-900 placeholder:text-red-900/30 outline-none transition-all shadow-sm disabled:cursor-not-allowed font-mono tracking-wide"
              />
              
              {/* Animated Icon Container */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <AnimatePresence mode="wait">
                  {isValid ? (
                    <motion.div
                      key="heart"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.2 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-red-500 drop-shadow-sm" />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="number" 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      exit={{ scale: 0 }}
                    >
                      <span className="text-xs font-mono font-bold text-red-900/30 w-5 text-center block">
                        #{index + 1}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Wildcard Toggle */}
      {!isDeadlinePassed && !isSealed && (
        <motion.div 
          onClick={() => setIsOpenToAll(!isOpenToAll)}
          whileTap={{ scale: 0.98 }}
          className={`cursor-pointer border-2 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 shadow-sm ${
            isOpenToAll 
              ? 'bg-purple-500/10 border-purple-500/30 shadow-purple-500/10' 
              : 'bg-white/40 border-transparent hover:bg-white/60'
          }`}
        >
          <div className={`p-2.5 rounded-full transition-colors ${isOpenToAll ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className={`font-bold text-sm transition-colors ${isOpenToAll ? 'text-purple-900' : 'text-red-900'}`}>
              Open to Everyone
            </p>
            <p className="text-xs text-red-900/60 leading-tight mt-0.5">
              Match me with anyone who lists me, even if I don't list them.
            </p>
          </div>
          {/* Custom Switch UI */}
          <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${isOpenToAll ? 'bg-purple-500 justify-end' : 'bg-gray-300 justify-start'}`}>
            <motion.div 
              layout 
              className="w-4 h-4 bg-white rounded-full shadow-sm" 
            />
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      {!isSealed ? (
        <button
          onClick={handleSubmit}
          disabled={loading || isDeadlinePassed}
          className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-xl shadow-red-500/20 transition-all active:scale-[0.98] hover:scale-[1.01] flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <span className="animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
              Securing Data...
            </span>
          ) : isDeadlinePassed ? (
            <>
              <Lock className="w-4 h-4" /> Voting Closed
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
              Seal & Submit Choices
            </>
          )}
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100/80 backdrop-blur-md border border-green-500/30 p-6 rounded-xl text-center shadow-lg"
        >
          <div className="flex justify-center mb-3">
            <div className="bg-green-500 text-white p-3 rounded-full shadow-md shadow-green-500/30">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-green-900 font-bold text-lg">Choices Secured!</h3>
          <p className="text-green-800/70 text-sm mt-1 font-medium">
            Your preferences are encrypted. <br/> 
            The algorithm runs on Feb 14th. Good luck!
          </p>
        </motion.div>
      )}
    </div>
  );
}