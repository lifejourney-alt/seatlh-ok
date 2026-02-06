import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    trim: true,
    lowercase: true 
  },
  
  rollNumber: { 
    type: String, 
    required: [true, "Roll Number is required"], 
    unique: true,
    uppercase: true,
    trim: true 
  },
  
  // The 5 Slots (Array of Roll Numbers)
  // Default is ["", "", "", "", ""] to simplify frontend index logic
  crushes: { 
    type: [String], 
    default: ["", "", "", "", ""] 
  },
  
  // The "Wildcard" Toggle
  // If true, this user matches with ANYONE who listed them
  isOpenToAll: { 
    type: Boolean, 
    default: false 
  },

  // The Result (Populated by your Algo on Feb 14)
  // Stores the Roll Number of the match (e.g., "21BCE001")
  matchedWith: { 
    type: String, 
    default: null 
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Next.js Hot Reload Fix:
// Check if model exists in cache before compiling a new one.
export default mongoose.models.User || mongoose.model('User', UserSchema);
