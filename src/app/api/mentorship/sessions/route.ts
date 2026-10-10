import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mentorId = searchParams.get('mentorId') || undefined;
  const studentId = searchParams.get('studentId') || undefined;
  const groupId = searchParams.get('groupId') || undefined;
  const sessionId = searchParams.get('sessionId') || undefined;

  if (sessionId) {
    const session = db.getSessionById(sessionId);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: session });
  }

  const sessions = db.getSessions({ mentorId, studentId, groupId });
  return NextResponse.json({ success: true, count: sessions.length, data: sessions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.sessionType || !body.mentorId || !body.groupId) {
      return NextResponse.json({ success: false, error: 'Missing mandatory session fields' }, { status: 400 });
    }

    const newSession = db.createSession({
      sessionType: body.sessionType,
      mentorId: body.mentorId,
      groupId: body.groupId,
      studentId: body.studentId,
      date: body.date || new Date().toISOString(),
      durationMinutes: body.durationMinutes || 20,
      pillar: body.pillar,
      studentConcern: body.studentConcern,
      teacherAdvice: body.teacherAdvice,
      actionItem: body.actionItem,
      parentDigestSent: body.parentDigestSent ?? true,
      confidentialNote: body.confidentialNote,
      hasAiAudioSummary: Boolean(body.hasAiAudioSummary),
      audioDurationSeconds: body.audioDurationSeconds,
      status: body.status || 'DRAFT'
    });

    return NextResponse.json({ success: true, data: newSession }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Session id is required' }, { status: 400 });
    }

    const updated = db.updateSession(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
