import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; // <--- Added this
import dbConnect from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    // 1. Google Login (Kept for when you go live)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_secret",
    }),

    // 2. DEV LOGIN (For Localhost Only)
    CredentialsProvider({
      name: "Dev Login (No Password)",
      credentials: {
        email: { label: "Test Email", type: "text", placeholder: "21bce000@nirmauni.ac.in" }
      },
      async authorize(credentials) {
        // Allow any email in dev mode
        const email = credentials?.email?.toLowerCase();
        
        if (!email) return null;

        // Auto-create user in MongoDB (Same logic as Google)
        await dbConnect();
        const rollNumber = email.split('@')[0].toUpperCase();
        
        let user = await User.findOne({ email });
        
        if (!user) {
          user = await User.create({
            email,
            rollNumber,
            crushes: ["", "", "", "", ""],
            isOpenToAll: false
          });
        }

        return { id: user._id.toString(), email: user.email, name: rollNumber };
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      if (session.user?.email) {
        session.user.name = session.user.email.split('@')[0].toUpperCase();
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', 
    error: '/login', 
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-123", // Fallback secret
});

export { handler as GET, handler as POST };








// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import dbConnect from "@/lib/db";
// import User from "@/models/User";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async signIn({ profile }) {
//       if (!profile?.email) return false;

//       // 1. Strict Domain Check (Security)
//       if (!profile.email.endsWith("@nirmauni.ac.in")) {
//         // You can comment this out for testing with personal gmail
//         return false; 
//       }

//       // 2. Connect DB & Sync User
//       await dbConnect();
//       const rollNumber = profile.email.split('@')[0].toUpperCase();
      
//       // Upsert: Create if not exists, otherwise do nothing
//       const userExists = await User.findOne({ email: profile.email });
      
//       if (!userExists) {
//         await User.create({
//           email: profile.email,
//           rollNumber: rollNumber,
//           crushes: ["", "", "", "", ""], // Init with empty slots
//           isOpenToAll: false
//         });
//       }

//       return true;
//     },
//     async session({ session }) {
//       // Pass Roll Number to the client-side session for easy access
//       if (session.user?.email) {
//         session.user.name = session.user.email.split('@')[0].toUpperCase();
//       }
//       return session;
//     }
//   },
//   pages: {
//     signIn: '/login', // Redirect here if not logged in
//     error: '/login',  // Redirect here on auth error
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };
