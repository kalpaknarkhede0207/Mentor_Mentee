import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mentorId = searchParams.get('mentorId') || undefined;
  const studentId = searchParams.get('studentId') || undefined;
  const id = searchParams.get('id') || undefined;

  if (id) {
    const session = db.getGfmOneOnOneById(id);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: session });
  }

  const list = db.getGfmOneOnOnes(mentorId, studentId);
  return NextResponse.json({ success: true, count: list.length, data: list });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, mentorId, inviteMessage, scheduledAt } = body;

    if (!studentId || !mentorId || !inviteMessage) {
      return NextResponse.json({ success: false, error: 'Missing mandatory invite fields' }, { status: 400 });
    }

    const newInvite = db.createGfmInvite(studentId, mentorId, inviteMessage, scheduledAt);
    if (!newInvite) {
      return NextResponse.json({ success: false, error: 'Failed to create 1-on-1 invite' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: newInvite }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, studentId, mentorId, transcriptText, aiSummaryPoints, audioSeconds } = body;

    if ((!id && !studentId) || !transcriptText || !aiSummaryPoints) {
      return NextResponse.json({ success: false, error: 'Session ID or Student ID, transcript, and AI summary required' }, { status: 400 });
    }

    const completed = db.completeGfmSession(
      id || `gfm-sess-${Date.now()}`, 
      transcriptText, 
      aiSummaryPoints, 
      audioSeconds || 35,
      studentId,
      mentorId
    );
    if (!completed) {
      return NextResponse.json({ success: false, error: 'Failed to record completed session' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: completed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
