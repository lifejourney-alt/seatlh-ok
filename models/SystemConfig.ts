import mongoose from 'mongoose';

const SystemConfigSchema = new mongoose.Schema({
  eventName: { 
    type: String, 
    default: "Section-14" 
  },
  
  // The Target Date for the Countdown
  // e.g., 2026-02-14T12:00:00.000Z
  revealTime: { 
    type: Date, 
    required: true 
  },
  
  // The "Red Button" State
  // false = Timer runs, /result page redirects to /dashboard
  // true = Timer stops, /result page shows the MatchReveal component
  isReleased: { 
    type: Boolean, 
    default: false 
  },
});

export default mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);
