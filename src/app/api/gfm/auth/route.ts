import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { rollNo, password } = await request.json();
    if (!rollNo) {
      return NextResponse.json({ success: false, error: 'Roll Number is required' }, { status: 400 });
    }

    const account = db.authenticateStudent(rollNo, password);
    if (!account) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid Roll Number or Password. (Demo: Try Roll "10A-01" or "11A-01" with password "password123")' 
      }, { status: 401 });
    }

    const mentee = db.getMenteeById(account.studentId);
    return NextResponse.json({ 
      success: true, 
      data: {
        account,
        mentee
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
