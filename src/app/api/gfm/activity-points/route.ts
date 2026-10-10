import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId') || 'stu-1001';

  const list = db.getActivityPoints(studentId);
  return NextResponse.json({ success: true, count: list.length, data: list });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, title, category, pointsAwarded, issuingAuthority, date, certificateFileName, certificateFileUrl } = body;

    if (!studentId || !title || !category || !pointsAwarded) {
      return NextResponse.json({ success: false, error: 'Missing mandatory fields' }, { status: 400 });
    }

    const newRecord = db.submitActivityPoint(studentId, {
      studentId,
      title,
      category,
      pointsAwarded: Number(pointsAwarded) || 10,
      issuingAuthority: issuingAuthority || 'Institutional Department',
      certificateFileName: certificateFileName || 'Certificate_Document.pdf',
      certificateFileUrl: certificateFileUrl || '',
      date: date || new Date().toISOString().split('T')[0]
    });

    return NextResponse.json({ success: true, data: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { studentId, pointId, verifiedBy } = body;

    if (!studentId || !pointId) {
      return NextResponse.json({ success: false, error: 'Missing studentId or pointId' }, { status: 400 });
    }

    const updated = db.verifyActivityPoint(studentId, pointId, verifiedBy || 'Dr. Ananya Sen (GFM)');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Activity point record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
