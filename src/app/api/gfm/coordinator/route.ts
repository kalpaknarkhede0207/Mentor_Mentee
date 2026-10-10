import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const data = db.getCoordinatorData();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching coordinator data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'allocate') {
      const { mentorId, division, batch } = body;
      if (!mentorId || !division || !batch) {
        return NextResponse.json({ success: false, error: 'Missing required allocation fields' }, { status: 400 });
      }

      const updated = db.allocateMentorToBatch(mentorId, division, batch);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Mentor not found or allocation failed' }, { status: 404 });
      }

      const freshData = db.getCoordinatorData();
      return NextResponse.json({ 
        success: true, 
        message: `Successfully allocated mentor to ${division} (${batch})`,
        data: freshData 
      });
    }

    if (action === 'acknowledge_report') {
      const { reportId, authorityRemarks } = body;
      if (!reportId || !authorityRemarks) {
        return NextResponse.json({ success: false, error: 'Missing reportId or remarks' }, { status: 400 });
      }

      const acked = db.acknowledgeAuthorityReport(reportId, authorityRemarks);
      if (!acked) {
        return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
      }

      const freshData = db.getCoordinatorData();
      return NextResponse.json({ 
        success: true, 
        message: 'Authority report acknowledged with coordinator feedback',
        data: freshData 
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error processing coordinator request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
