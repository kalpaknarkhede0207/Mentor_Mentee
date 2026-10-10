import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GradeLevel, RagStatus } from '@/types/mentorship';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mentorId = searchParams.get('mentorId') || undefined;
  const grade = (searchParams.get('grade') as GradeLevel) || undefined;
  const ragStatus = (searchParams.get('ragStatus') as RagStatus) || undefined;
  const studentId = searchParams.get('studentId') || undefined;

  if (studentId) {
    const mentee = db.getMenteeById(studentId);
    if (!mentee) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: mentee });
  }

  const mentees = db.getMentees({ mentorId, grade, ragStatus });
  return NextResponse.json({ success: true, count: mentees.length, data: mentees });
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const id = searchParams.get('id');
    const targetId = studentId || id;

    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Student ID or Profile ID is required' }, { status: 400 });
    }

    const deleted = db.deleteMentee(targetId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Mentee not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Mentee ${targetId} successfully removed.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { studentId, updates } = body;

    if (!studentId || !updates) {
      return NextResponse.json({ success: false, error: 'studentId and updates are required' }, { status: 400 });
    }

    const updated = db.updateMentee(studentId, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
