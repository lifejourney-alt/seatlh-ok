import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SystemConfig from '@/models/SystemConfig';
import { runMatchingAlgorithm } from '@/lib/algorithm'; // <--- Import it

// Force dynamic to prevent caching issues
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { secretKey } = await req.json();

    // 1. Security Check
    if (secretKey !== process.env.ADMIN_LAUNCH_KEY) {
      return NextResponse.json(
        { error: "ACCESS DENIED: Invalid Launch Key" }, 
        { status: 401 }
      );
    }

    // 2. RUN THE ALGORITHM
    // We await this so we know it finished before releasing
    const totalMatches = await runMatchingAlgorithm();

    // 3. Update System State to "Released"
    await dbConnect();
    await SystemConfig.findOneAndUpdate(
      { eventName: "Section-14" }, // Ensure we target the right config
      { 
        isReleased: true,
        releaseDate: new Date() 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: `System Released. ${totalMatches} pairs generated.` 
    });

  } catch (error) {
    console.error("Release Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}