import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId') || 'stu-1001';

  const schedule = db.getParentMeeting(studentId);
  return NextResponse.json({ success: true, data: schedule || null });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, scheduledDate, timeSlot, venue, parentNotes, mentorName } = body;

    if (!studentId || !scheduledDate || !timeSlot) {
      return NextResponse.json({ success: false, error: 'studentId, scheduledDate, and timeSlot are required' }, { status: 400 });
    }

    const scheduled = db.scheduleParentMeeting(studentId, {
      scheduledDate,
      timeSlot,
      venue: venue || 'Classroom LH-2 / GFM Cabin',
      parentNotes: parentNotes || 'Mid-semester performance review and academic progress discussion.',
      mentorName: mentorName || 'Dr. Ananya Sen'
    });

    return NextResponse.json({ success: true, data: scheduled });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ success: false, error: 'studentId is required' }, { status: 400 });
    }

    const canceled = db.cancelParentMeeting(studentId);
    return NextResponse.json({ success: true, canceled });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
