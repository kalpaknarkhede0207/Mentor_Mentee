import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId') || undefined;

  const list = db.getMeetingHistories(studentId);
  return NextResponse.json({ success: true, count: list.length, data: list });
}
