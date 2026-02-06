import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { SubmitCrushSchema } from '@/lib/validations'; // Zod Schema

export async function POST(req: Request) {
  // 1. Verify Session
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Enforce Deadline (Hardcoded for security)
  const DEADLINE = new Date("2026-02-13T18:00:00").getTime();
  if (Date.now() > DEADLINE) {
    return NextResponse.json(
      { error: "Submission deadline has passed." }, 
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    // 3. Validate Data with Zod
    const { crushes, isOpenToAll } = SubmitCrushSchema.parse(body);

    await dbConnect();

    // 4. Save to DB
    await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        crushes, 
        isOpenToAll,
        // Optional: you can add a 'lastUpdated' field here
      }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid data format or server error" }, 
      { status: 400 }
    );
  }
}