import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || undefined;
  const batchId = searchParams.get('batchId') || undefined;

  if (id) {
    const item = db.getAnnouncementById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Announcement not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  }

  const list = db.getAnnouncements(batchId);
  return NextResponse.json({ success: true, count: list.length, data: list });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mentorId, mentorName, batchId, title, content, isMeetingNotice, meetingDate, meetingTime, venue } = body;

    if (!mentorId || !title || !content) {
      return NextResponse.json({ success: false, error: 'Missing mandatory announcement fields' }, { status: 400 });
    }

    const newAnn = db.createAnnouncement({
      mentorId,
      mentorName: mentorName || 'Guardian Faculty Member',
      batchId: batchId || 'group-10a-general',
      title,
      content,
      isMeetingNotice: Boolean(isMeetingNotice),
      meetingDate,
      meetingTime,
      venue
    });

    return NextResponse.json({ success: true, data: newAnn }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
