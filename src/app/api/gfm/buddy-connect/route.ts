import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId') || undefined;

  const connections = db.getBuddyConnections(studentId);
  return NextResponse.json({
    success: true,
    count: connections.length,
    data: connections
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      studentId, 
      studentName, 
      rollNo, 
      tutorId, 
      tutorName, 
      tutorRollNo, 
      subject, 
      venue, 
      scheduledTime, 
      contactNote,
      status 
    } = body;

    if (!studentId || !tutorId || !subject) {
      return NextResponse.json({ success: false, error: 'Missing mandatory fields' }, { status: 400 });
    }

    const created = db.connectWithPeerTutor({
      studentId,
      studentName: studentName || 'Student',
      rollNo: rollNo || 'N/A',
      tutorId,
      tutorName: tutorName || 'Peer Tutor',
      tutorRollNo: tutorRollNo || 'N/A',
      subject,
      venue: venue || 'Classroom LH-2',
      scheduledTime: scheduledTime || 'Zero Period',
      status: status || 'ACTIVE_STUDY_PARTNER',
      contactNote: contactNote || 'Peer doubt solving and subject guidance session.'
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
