import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SystemConfig from '@/models/SystemConfig';

export const dynamic = 'force-dynamic'; // Never cache this

export async function GET() {
  await dbConnect();
  
  // Fetch the singleton config
  let config = await SystemConfig.findOne();
  
  // Create default if DB is empty
  if (!config) {
    config = await SystemConfig.create({
      revealTime: new Date("2026-02-14T12:00:00"), // Default Target
      isReleased: false
    });
  }

  return NextResponse.json({
    now: new Date(), // Server time (Source of Truth)
    revealTime: config.revealTime,
    isReleased: config.isReleased
  });
}