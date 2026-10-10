import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json({ success: false, error: 'Student ID is required' }, { status: 400 });
  }

  const mentee = db.getMenteeById(studentId);
  if (!mentee) {
    return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
  }

  const mentor = db.getMentorById(mentee.mentorId);
  const sessions = db.getSessions({ studentId });

  // Generate an official, print-ready NEP 2020 Cumulative Record Card (CRC) HTML
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NEP 2020 Cumulative Record Card - ${mentee.name} (${mentee.rollNo})</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; margin: 0; padding: 20px; line-height: 1.4; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
    .school-title { font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #0f172a; }
    .sub-title { font-size: 13px; color: #475569; font-weight: 600; margin-top: 4px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 8px; }
    .badge-nep { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 16px; background: #f8fafc; }
    .card-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .field-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
    .field-label { color: #64748b; }
    .field-value { font-weight: 600; color: #0f172a; }
    .rag-red { color: #dc2626; font-weight: 700; }
    .rag-amber { color: #d97706; font-weight: 700; }
    .rag-green { color: #16a34a; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
    th { background: #0f172a; color: #ffffff; text-align: left; padding: 8px 10px; font-weight: 600; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .session-card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-bottom: 10px; background: #ffffff; }
    .session-header { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 40px; text-align: center; }
    .sig-line { border-top: 1px dashed #64748b; padding-top: 8px; font-size: 12px; font-weight: 600; color: #334155; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 15px; text-align: right;">
    <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="header">
    <div class="school-title">Delhi Public Senior Secondary School</div>
    <div class="sub-title">Senior Wing Academic Guidance & Holistic Student Mentorship Cell</div>
    <div class="badge badge-nep">NEP 2020 Holistic Progress Card & Cumulative Record (CRC)</div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Student Profile</div>
      <div class="field-row"><span class="field-label">Student Name:</span><span class="field-value">${mentee.name}</span></div>
      <div class="field-row"><span class="field-label">Roll Number:</span><span class="field-value">${mentee.rollNo}</span></div>
      <div class="field-row"><span class="field-label">Class & Section:</span><span class="field-value">${mentee.section} (${mentee.grade.replace('_', ' ')})</span></div>
      <div class="field-row"><span class="field-label">Stream:</span><span class="field-value">${mentee.stream}</span></div>
      <div class="field-row"><span class="field-label">Assigned Mentor:</span><span class="field-value">${mentor?.name || 'Assigned Mentor'}</span></div>
    </div>

    <div class="card">
      <div class="card-title">Continuous Health Telemetry</div>
      <div class="field-row"><span class="field-label">Overall Attendance:</span><span class="field-value ${mentee.academicMetrics.overallAttendance < 75 ? 'rag-red' : ''}">${mentee.academicMetrics.overallAttendance}% (CBSE Cutoff: 75%)</span></div>
      <div class="field-row"><span class="field-label">Last Term Aggregate:</span><span class="field-value">${mentee.academicMetrics.lastTermPercentage}%</span></div>
      <div class="field-row"><span class="field-label">Current Risk Radar:</span><span class="field-value rag-${mentee.ragRiskStatus.toLowerCase()}">${mentee.ragRiskStatus} ALERT</span></div>
      <div class="field-row"><span class="field-label">Identified Bottlenecks:</span><span class="field-value">${mentee.academicMetrics.weakSubjects.join(', ') || 'None reported'}</span></div>
      <div class="field-row"><span class="field-label">Career Aspirations:</span><span class="field-value">${mentee.academicMetrics.competitiveAspirations.join(', ') || 'Under exploration'}</span></div>
    </div>
  </div>

  <div style="margin-top: 16px;">
    <div style="font-size: 14px; font-weight: 700; margin-bottom: 10px; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
      Compulsory 1-on-1 Guidance & Advisory Audit Log (${sessions.length} Sessions Logged)
    </div>

    ${sessions.length === 0 ? '<p style="font-size: 12px; color: #64748b;">No formal 1-on-1 sessions recorded in current term.</p>' : ''}

    ${sessions.map((s, idx) => `
      <div class="session-card">
        <div class="session-header">
          <span>Session #${sessions.length - idx} &bull; Pillar: ${s.pillar || 'GENERAL'}</span>
          <span>Date: ${new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} (${s.durationMinutes} min)</span>
        </div>
        <div style="font-size: 12px; margin-bottom: 4px;"><strong>Student Reflection / Concern:</strong> ${s.studentConcern || 'Not recorded'}</div>
        <div style="font-size: 12px; margin-bottom: 4px;"><strong>Mentor Pedagogical Guidance:</strong> ${s.teacherAdvice || 'Not recorded'}</div>
        ${s.actionItem ? `
          <div style="font-size: 12px; color: #0369a1; background: #f0f9ff; padding: 6px 8px; border-radius: 4px; margin-top: 6px;">
            <strong>Committed Milestone:</strong> ${s.actionItem.task} (Target: ${s.actionItem.targetDate}) &bull; Status: [${s.actionItem.status}]
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>

  <div class="signatures">
    <div class="sig-line">Teacher Mentor<br/>(${mentor?.name || 'Mentor Signature'})</div>
    <div class="sig-line">Senior Wing Head / Principal<br/>(Official School Seal)</div>
    <div class="sig-line">Parent / Guardian<br/>(Acknowledgment)</div>
  </div>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}
