import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const batchId = searchParams.get('batchId') || undefined;
  const studentId = searchParams.get('studentId') || undefined;

  const list = db.getGrievances(batchId, studentId);
  return NextResponse.json({ success: true, count: list.length, data: list });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, studentName, rollNo, batchId, category, grievanceText } = body;

    if (!studentId || !grievanceText) {
      return NextResponse.json({ success: false, error: 'Student ID and grievance details required' }, { status: 400 });
    }

    const newGrv = db.createGrievance({
      studentId,
      studentName: studentName || 'Student',
      rollNo: rollNo || '',
      batchId: batchId || 'group-10a-general',
      category: category || 'ACADEMIC',
      grievanceText
    });

    return NextResponse.json({ success: true, data: newGrv }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, feedback } = await request.json();
    if (!id || !feedback) {
      return NextResponse.json({ success: false, error: 'ID and feedback required' }, { status: 400 });
    }

    const resolved = db.resolveGrievance(id, feedback);
    if (!resolved) {
      return NextResponse.json({ success: false, error: 'Grievance not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: resolved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
