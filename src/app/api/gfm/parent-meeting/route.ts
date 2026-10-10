import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId') || 'stu-1001';

  const schedule = db.getParentMeeting(studentId);
  if (!schedule) {
    return NextResponse.json({ success: false, error: 'Parent meeting schedule not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: schedule });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { studentId, mode, notes } = body;

    if (!studentId || !mode) {
      return NextResponse.json({ success: false, error: 'studentId and mode are required' }, { status: 400 });
    }

    const updated = db.updateParentMeetingAcknowledgment(studentId, mode, notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update acknowledgment' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
