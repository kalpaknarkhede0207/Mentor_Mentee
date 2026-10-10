import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get('groupId') || undefined;

  const huddles = db.getHuddles(groupId);
  return NextResponse.json({ success: true, count: huddles.length, data: huddles });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { groupId, mentorId, huddleType, agendaTopic, attendeeStudentIds, absentStudentIds, groupNotes } = body;

    if (!groupId || !mentorId || !agendaTopic || !Array.isArray(attendeeStudentIds)) {
      return NextResponse.json({ success: false, error: 'Missing required huddle fields' }, { status: 400 });
    }

    const newHuddle = db.createHuddle({
      groupId,
      mentorId,
      date: body.date || new Date().toISOString(),
      huddleType: huddleType || 'SPRINT_KICKOFF',
      agendaTopic,
      attendeeStudentIds,
      absentStudentIds: absentStudentIds || [],
      groupNotes: groupNotes || ''
    });

    return NextResponse.json({ success: true, data: newHuddle }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
