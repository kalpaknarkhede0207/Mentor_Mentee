import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json({ success: false, error: 'Student ID is required' }, { status: 400 });
  }

  const greenBook = db.getGreenBook(studentId);
  const mentee = db.getMenteeById(studentId);

  if (!greenBook) {
    return NextResponse.json({ success: false, error: 'Green book record not found' }, { status: 404 });
  }

  return NextResponse.json({ 
    success: true, 
    data: {
      student: mentee,
      greenBook
    }
  });
}
