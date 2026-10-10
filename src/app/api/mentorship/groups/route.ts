import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mentorId = searchParams.get('mentorId') || undefined;
  
  const groups = db.getGroups(mentorId);
  return NextResponse.json({ success: true, data: groups });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'allocate') {
      const { groupId, studentIds } = body;
      if (!groupId || !Array.isArray(studentIds)) {
        return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
      }
      const updated = db.allocateStudentsToGroup(groupId, studentIds);
      return NextResponse.json({ success: true, data: updated });
    }

    // Create group
    const newGroup = db.createGroup(body);
    return NextResponse.json({ success: true, data: newGroup }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
