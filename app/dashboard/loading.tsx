import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
      <p className="text-red-900/50 font-mono text-sm animate-pulse">
        Encrypting connection...
      </p>
    </div>
  );
}