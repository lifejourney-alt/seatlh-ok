import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  const session = await getServerSession();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // Get total count
  const count = await User.countDocuments();
  
  // Get activity over time (Aggregate by hour/day)
  // This is a simplified version; normally you'd use MongoDB Aggregation
  const users = await User.find({}, 'createdAt').lean();

  return NextResponse.json({ count, users });
}