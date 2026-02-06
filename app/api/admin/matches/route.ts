import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // 1. Verify Admin via Session + Email Check
  const session = await getServerSession();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // 2. Pagination Logic
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  // 3. Fetch Matches
  // We filter for users where 'matchedWith' is NOT null
  const matchedUsers = await User.find({ matchedWith: { $ne: null } })
    .select('rollNumber matchedWith') // Only fetch necessary fields
    .skip(skip)
    .limit(limit)
    .lean();

  // 4. Format for Frontend
const formattedMatches = matchedUsers.map((u: any) => ({
  boy: u.rollNumber,
  girl: u.matchedWith,
  score: 100 
}));

  return NextResponse.json({ matches: formattedMatches });
}
