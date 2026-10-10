import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const peerTutors = db.getPeerTutors();
  const resources = db.getAcademicResources();
  const countdowns = db.getExamCountdowns();

  return NextResponse.json({
    success: true,
    data: {
      peerTutors,
      resources,
      countdowns
    }
  });
}
