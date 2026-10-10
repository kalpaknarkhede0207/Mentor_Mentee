import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const division = searchParams.get('division') || undefined;
  const batch = searchParams.get('batch') || undefined;
  const academicYear = searchParams.get('academicYear') || undefined;
  const mentorId = searchParams.get('mentorId') || undefined;
  const id = searchParams.get('id') || undefined;

  if (id) {
    const report = db.getAuthorityReportById(id);
    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: report });
  }

  const reports = db.getAuthorityReports({ division, batch, academicYear, mentorId });
  return NextResponse.json({ success: true, count: reports.length, data: reports });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      mentorId, 
      mentorName, 
      division, 
      batch, 
      academicYear, 
      grade, 
      stream, 
      totalMentees, 
      completedOneOnOnes, 
      averageAttendance, 
      summaryObservations, 
      mentorRemarks,
      actionPlanForAuthority, 
      highPriorityStudents 
    } = body;

    const observations = summaryObservations || mentorRemarks || body.notes;

    if (!mentorId || !division || !batch || !academicYear || !observations) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required report fields (division, batch, year, observations/remarks)' 
      }, { status: 400 });
    }

    const newReport = db.createAuthorityReport({
      mentorId,
      mentorName: mentorName || 'Assigned Mentor',
      division,
      batch,
      academicYear,
      grade: grade || 'GRADE_10',
      stream: stream || 'GENERAL',
      totalMentees: totalMentees || 12,
      completedOneOnOnes: completedOneOnOnes || 0,
      averageAttendance: averageAttendance || 85,
      summaryObservations: observations,
      actionPlanForAuthority: actionPlanForAuthority || observations || 'Continue weekly monitoring.',
      highPriorityStudents: highPriorityStudents || [],
      status: 'SUBMITTED'
    });

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, authorityRemarks } = body;

    if (!id || !authorityRemarks) {
      return NextResponse.json({ success: false, error: 'Report ID and authority remarks required' }, { status: 400 });
    }

    const updated = db.acknowledgeAuthorityReport(id, authorityRemarks);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
