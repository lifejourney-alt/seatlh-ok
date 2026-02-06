import dbConnect from "@/lib/db";
import User from "@/models/User";

interface UserDoc {
  _id: any;
  rollNumber: string;
  crushes: string[];
  isOpenToAll: boolean;
  matchedWith: string | null;
  save: () => Promise<void>;
}

export async function runMatchingAlgorithm() {
  await dbConnect();

  console.log("💕 STARTING MATCHMAKING SEQUENCE...");

  // 1. Fetch all eligible users
  // We need their full crush lists and wildcard status
  const users = await User.find({}) as UserDoc[];
  
  // Create a quick lookup map for performance (RollNo -> User Object)
  const userMap = new Map<string, UserDoc>();
  users.forEach(u => userMap.set(u.rollNumber, u));

  let matchCount = 0;

  // 2. Clear previous matches (Safety reset)
  // This allows you to re-run the algo if you made a mistake
  for (const user of users) {
    user.matchedWith = null;
  }

  // 3. THE ALGORITHM: Round-Robin Priority
  // We check everyone's 1st choice, then 2nd, etc.
  for (let priority = 0; priority < 5; priority++) {
    console.log(`🔄 Processing Priority Round #${priority + 1}`);

    // Shuffle users randomly within the round to be fair to people with same priority mutuals
    // (Fisher-Yates Shuffle)
    const roundUsers = [...users].sort(() => Math.random() - 0.5);

    for (const boy of roundUsers) {
      // SKIP if this person is already taken
      if (boy.matchedWith) continue;

      // Get the crush at the current priority slot
      const targetRoll = boy.crushes[priority];

      // SKIP if the slot is empty
      if (!targetRoll || targetRoll.length < 5) continue;

      // Find the "Girl" (Target) in our map
      const girl = userMap.get(targetRoll);

      // SKIP if target doesn't exist in DB (e.g., they didn't register)
      if (!girl) continue;

      // SKIP if target is already taken
      if (girl.matchedWith) continue;

      // --- CHECK MUTUALITY ---
      
      // Condition A: She explicitly listed him (at ANY priority level)
      const sheLikesHimBack = girl.crushes.includes(boy.rollNumber);

      // Condition B: She is a "Wildcard" (Open to everyone)
      const sheIsWildcard = girl.isOpenToAll;

      if (sheLikesHimBack || sheIsWildcard) {
        // 💘 IT'S A MATCH!
        
        // Lock them in
        boy.matchedWith = girl.rollNumber;
        girl.matchedWith = boy.rollNumber;

        console.log(`✨ MATCH FOUND: ${boy.rollNumber} ❤️ ${girl.rollNumber} (Round ${priority + 1})`);
        matchCount++;
      }
    }
  }

  // 4. Save results to Database
  console.log("💾 Saving results...");
  const savePromises = users.map(u => u.save());
  await Promise.all(savePromises);

  console.log(`✅ COMPLETE. Total Matches: ${matchCount}`);
  return matchCount;
}