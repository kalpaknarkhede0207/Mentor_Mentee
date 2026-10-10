'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  Filter, 
  Search, 
  Plus, 
  UserCheck, 
  UserX, 
  Radio, 
  RefreshCw, 
  Check, 
  BookMarked,
  Info
} from 'lucide-react';
import { 
  MenteeProfile, 
  StudentGrievance, 
  GfmAnnouncement,
  BatchHuddleRecord 
} from '@/types/mentorship';

export default function GfmWeeklyMeetingPage() {
  const params = useParams();
  const router = useRouter();
  
  const meetingId = (params?.id as string) || 'latest';

  const [loading, setLoading] = useState(true);
  const [meetingInfo, setMeetingInfo] = useState<GfmAnnouncement | null>(null);
  const [mentees, setMentees] = useState<MenteeProfile[]>([]);
  const [grievances, setGrievances] = useState<StudentGrievance[]>([]);

  // Attendance state: { [studentId]: 'PRESENT' | 'ABSENT' | 'LATE' }
  const [attendance, setAttendance] = useState<{ [studentId: string]: 'PRESENT' | 'ABSENT' | 'LATE' }>({});
  const [studentNotes, setStudentNotes] = useState<{ [studentId: string]: string }>({});
  const [filterRoster, setFilterRoster] = useState<'ALL' | 'PRESENT' | 'ABSENT' | 'DEFAULTERS'>('ALL');
  const [searchRoster, setSearchRoster] = useState('');
  
  // Locking & Saving State
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceLocked, setAttendanceLocked] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Grievance Box State
  const [grievanceMode, setGrievanceMode] = useState<'INBOX' | 'LOG_NEW'>('INBOX');
  const [selectedStudentForGrievance, setSelectedStudentForGrievance] = useState<string>('');
  const [newGrievanceCategory, setNewGrievanceCategory] = useState<'ACADEMIC' | 'HOSTEL_CAMPUS' | 'EXAMS_EVALUATION' | 'PERSONAL_COUNSELING'>('ACADEMIC');
  const [newGrievanceText, setNewGrievanceText] = useState('');
  const [submittingGrievance, setSubmittingGrievance] = useState(false);
  const [grievanceNotice, setGrievanceNotice] = useState<string | null>(null);

  // Quick Grievance Resolution Modal
  const [activeResolvingGrievance, setActiveResolvingGrievance] = useState<StudentGrievance | null>(null);
  const [resolutionFeedback, setResolutionFeedback] = useState('');
  const [resolvingGrievance, setResolvingGrievance] = useState(false);

  useEffect(() => {
    loadMeetingData();
  }, [meetingId]);

  const loadMeetingData = async () => {
    setLoading(true);
    try {
      // 1. Load meeting details
      let resolvedMeeting: GfmAnnouncement | null = null;
      if (meetingId && meetingId !== 'latest') {
        const mRes = await fetch(`/api/gfm/announcements?id=${meetingId}`);
        if (mRes.ok) {
          const mJson = await mRes.json();
          if (mJson.success && mJson.data) {
            resolvedMeeting = mJson.data;
          }
        }
      }

      // If no specific meeting found, fetch latest meeting announcement
      if (!resolvedMeeting) {
        const allAnnRes = await fetch('/api/gfm/announcements');
        if (allAnnRes.ok) {
          const allAnnJson = await allAnnRes.json();
          if (allAnnJson.success && allAnnJson.data?.length > 0) {
            resolvedMeeting = allAnnJson.data.find((a: GfmAnnouncement) => a.isMeetingNotice) || allAnnJson.data[0];
          }
        }
      }

      if (resolvedMeeting) {
        setMeetingInfo(resolvedMeeting);
      }

      // 2. Load Mentees
      const mentRes = await fetch('/api/mentorship/mentees');
      if (mentRes.ok) {
        const mentJson = await mentRes.json();
        if (mentJson.success && mentJson.data) {
          setMentees(mentJson.data);
          
          // Initialize attendance default: PRESENT
          const initAtt: { [studentId: string]: 'PRESENT' | 'ABSENT' | 'LATE' } = {};
          mentJson.data.forEach((m: MenteeProfile) => {
            initAtt[m.studentId] = 'PRESENT';
          });
          setAttendance(initAtt);
          if (!selectedStudentForGrievance && mentJson.data.length > 0) {
            setSelectedStudentForGrievance(mentJson.data[0].studentId);
          }
        }
      }

      // 3. Load Grievances
      loadGrievances();

    } catch (err) {
      console.error('Error loading meeting page data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadGrievances = async () => {
    try {
      const grvRes = await fetch('/api/gfm/grievances');
      if (grvRes.ok) {
        const grvJson = await grvRes.json();
        if (grvJson.success) {
          setGrievances(grvJson.data);
        }
      }
    } catch (err) {
      console.error('Error loading grievances:', err);
    }
  };

  // Toggle single student attendance
  const setStudentAttendanceStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Bulk actions
  const markAll = (status: 'PRESENT' | 'ABSENT') => {
    const updated: { [studentId: string]: 'PRESENT' | 'ABSENT' | 'LATE' } = {};
    mentees.forEach(m => {
      updated[m.studentId] = status;
    });
    setAttendance(updated);
  };

  // Save / Seal Attendance to Academic Green Book
  const handleSaveAttendance = async () => {
    setSavingAttendance(true);
    setSuccessBanner(null);

    const attendees = Object.keys(attendance).filter(id => attendance[id] === 'PRESENT' || attendance[id] === 'LATE');
    const absentees = Object.keys(attendance).filter(id => attendance[id] === 'ABSENT');

    try {
      const res = await fetch('/api/mentorship/huddles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: meetingInfo?.batchId || 'group-10a-general',
          mentorId: meetingInfo?.mentorId || 'mentor-3',
          huddleType: 'SPRINT_KICKOFF',
          agendaTopic: meetingInfo?.title || 'Weekly GFM Batch Meeting',
          attendeeStudentIds: attendees,
          absentStudentIds: absentees,
          groupNotes: `Batch Attendance verified: ${attendees.length} Present, ${absentees.length} Absent. Meeting held at ${meetingInfo?.venue || 'LH-2'}.`
        })
      });

      if (res.ok) {
        setAttendanceLocked(true);
        setSuccessBanner(`✓ Meeting attendance locked! Recorded ${attendees.length} Present and ${absentees.length} Absent into Academic Green Book.`);
        setTimeout(() => setSuccessBanner(null), 5000);
      }
    } catch (err) {
      console.error('Error locking attendance:', err);
    } finally {
      setSavingAttendance(false);
    }
  };

  // Log Grievance on the Spot
  const handleLogGrievanceOnSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForGrievance || !newGrievanceText.trim()) return;

    const studentObj = mentees.find(m => m.studentId === selectedStudentForGrievance);
    if (!studentObj) return;

    setSubmittingGrievance(true);
    setGrievanceNotice(null);

    try {
      const res = await fetch('/api/gfm/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentObj.studentId,
          studentName: studentObj.name,
          rollNo: studentObj.rollNo,
          batchId: meetingInfo?.batchId || 'group-10a-general',
          category: newGrievanceCategory,
          grievanceText: `[Logged in Weekly Meeting] ${newGrievanceText.trim()}`
        })
      });

      const json = await res.json();
      if (json.success) {
        setGrievances(prev => [json.data, ...prev]);
        setNewGrievanceText('');
        setGrievanceNotice(`Grievance for ${studentObj.name} (${studentObj.rollNo}) recorded directly to the mentor dashboard.`);
        setGrievanceMode('INBOX');
        setTimeout(() => setGrievanceNotice(null), 4000);
      }
    } catch (err) {
      console.error('Error logging grievance:', err);
    } finally {
      setSubmittingGrievance(false);
    }
  };

  // Quick Resolve Grievance
  const handleResolveGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResolvingGrievance || !resolutionFeedback.trim()) return;

    setResolvingGrievance(true);
    try {
      const res = await fetch('/api/gfm/grievances', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeResolvingGrievance.id,
          feedback: resolutionFeedback.trim()
        })
      });

      const json = await res.json();
      if (json.success) {
        setGrievances(prev => prev.map(g => g.id === activeResolvingGrievance.id ? json.data : g));
        setActiveResolvingGrievance(null);
        setResolutionFeedback('');
      }
    } catch (err) {
      console.error('Error resolving grievance:', err);
    } finally {
      setResolvingGrievance(false);
    }
  };

  // Filtered Roster
  const filteredMentees = mentees.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchRoster.toLowerCase()) ||
      m.rollNo.toLowerCase().includes(searchRoster.toLowerCase());
    if (!matchesSearch) return false;

    const status = attendance[m.studentId] || 'PRESENT';
    if (filterRoster === 'PRESENT') return status === 'PRESENT' || status === 'LATE';
    if (filterRoster === 'ABSENT') return status === 'ABSENT';
    if (filterRoster === 'DEFAULTERS') return m.academicMetrics.overallAttendance < 75;

    return true;
  });

  const presentCount = Object.values(attendance).filter(s => s === 'PRESENT' || s === 'LATE').length;
  const absentCount = Object.values(attendance).filter(s => s === 'ABSENT').length;
  const attendanceRate = mentees.length > 0 ? Math.round((presentCount / mentees.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Weekly Meeting Workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <Link
          href="/gfm/mentor"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to GFM Mentor Cockpit</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Live Meeting Session Active</span>
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
            Academic Green Book Registry
          </span>
        </div>
      </div>

      {/* Meeting Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 px-3 py-0.5 rounded-full font-bold">
                Batch: {meetingInfo?.batchId || 'Div 10-A'}
              </span>
              <span className="text-xs bg-white/10 text-white/90 px-3 py-0.5 rounded-full font-medium">
                Conducted by: {meetingInfo?.mentorName || 'Dr. Ananya Sen'}
              </span>
              <span className="text-xs bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-bold">
                Notice Broadcasted to Students
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {meetingInfo?.title || 'Weekly GFM Academic & Welfare Batch Meeting'}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              {meetingInfo?.content || 'Mandatory weekly check-in: verifying student presence, reviewing unit test progress, and collecting on-device student grievances.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                <span>Date: <strong>{meetingInfo?.meetingDate || 'Today'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                <span>Time: <strong>{meetingInfo?.meetingTime || '08:15 AM - 08:50 AM'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                <span>Venue: <strong>{meetingInfo?.venue || 'LH-2 Classroom'}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Attendance Counter & Lock Action */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 w-full lg:w-auto lg:min-w-[260px] text-xs space-y-3">
            <span className="text-emerald-200 block font-bold text-[11px] uppercase tracking-wider">
              Live Attendance Snapshot
            </span>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-emerald-950/40 p-2 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-200 block">Present</span>
                <strong className="text-xl font-extrabold text-white">{presentCount}</strong>
              </div>
              <div className="bg-rose-950/40 p-2 rounded-xl border border-white/10">
                <span className="text-[10px] text-rose-200 block">Absent</span>
                <strong className="text-xl font-extrabold text-rose-300">{absentCount}</strong>
              </div>
              <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                <span className="text-[10px] text-white/80 block">Turnout</span>
                <strong className="text-xl font-extrabold text-white">{attendanceRate}%</strong>
              </div>
            </div>

            <button
              onClick={handleSaveAttendance}
              disabled={savingAttendance}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                attendanceLocked 
                  ? 'bg-emerald-400 text-emerald-950 hover:bg-emerald-300' 
                  : 'bg-white text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              {savingAttendance ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-emerald-900 border-t-transparent rounded-full animate-spin" />
                  <span>Locking to Green Book...</span>
                </>
              ) : attendanceLocked ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-900" />
                  <span>Attendance Sealed ✓</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-emerald-700" />
                  <span>Lock Attendance to Green Book</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Main Grid: Left Side (List of Students for Attendance) & Right Side (Grievance Box) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================
            LEFT COLUMN: LIST OF STUDENTS FOR ATTENDANCE MARKING (7 cols)
           ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
            
            {/* Roster Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Batch Attendance Marking Roster
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Verify presence for all {mentees.length} mentees in today&apos;s weekly meeting
                  </p>
                </div>
              </div>

              {/* Bulk Quick Actions */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => markAll('PRESENT')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] transition-colors"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAll('ABSENT')}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[11px] transition-colors"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 pb-2 text-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter student by name or roll..."
                  value={searchRoster}
                  onChange={(e) => setSearchRoster(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0 shrink-0">
                <button
                  onClick={() => setFilterRoster('ALL')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap cursor-pointer transition-colors ${
                    filterRoster === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({mentees.length})
                </button>
                <button
                  onClick={() => setFilterRoster('PRESENT')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap cursor-pointer transition-colors ${
                    filterRoster === 'PRESENT' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  Present ({presentCount})
                </button>
                <button
                  onClick={() => setFilterRoster('ABSENT')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap cursor-pointer transition-colors ${
                    filterRoster === 'ABSENT' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800'
                  }`}
                >
                  Absent ({absentCount})
                </button>
                <button
                  onClick={() => setFilterRoster('DEFAULTERS')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap cursor-pointer transition-colors ${
                    filterRoster === 'DEFAULTERS' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  Defaulters &lt;75%
                </button>
              </div>
            </div>

            {/* Students List */}
            <div className="space-y-2 mt-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredMentees.map((m) => {
                const status = attendance[m.studentId] || 'PRESENT';
                const isDefaulter = m.academicMetrics.overallAttendance < 75;

                return (
                  <div
                    key={m.studentId}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      status === 'PRESENT'
                        ? 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300'
                        : status === 'LATE'
                        ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                        : 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                    }`}
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isDefaulter 
                           ? 'bg-rose-100 text-rose-800' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {m.rollNo.split('-')[1] || m.rollNo.slice(-2)}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <strong className="text-slate-900 text-sm">{m.name}</strong>
                          <span className="font-mono text-slate-500 font-bold text-[11px]">
                            {m.rollNo}
                          </span>
                          {isDefaulter && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-md">
                              Defaulter ({m.academicMetrics.overallAttendance}%)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                          <span>Overall Att: <strong>{m.academicMetrics.overallAttendance}%</strong></span>
                          <span>&bull;</span>
                          <span>Last Term: <strong>{m.academicMetrics.lastTermPercentage}%</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Attendance Marking Buttons */}
                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 shrink-0">
                      <button
                        type="button"
                        onClick={() => setStudentAttendanceStatus(m.studentId, 'PRESENT')}
                        className={`flex-1 sm:flex-initial justify-center px-3 py-2 sm:py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                          status === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Present</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStudentAttendanceStatus(m.studentId, 'LATE')}
                        className={`flex-1 sm:flex-initial justify-center px-3 py-2 sm:py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                          status === 'LATE'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Late</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStudentAttendanceStatus(m.studentId, 'ABSENT')}
                        className={`flex-1 sm:flex-initial justify-center px-3 py-2 sm:py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                          status === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Absent</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: MEETING GRIEVANCE BOX (5 cols)
           ======================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-emerald-600/30 p-5 shadow-sm space-y-4">
            
            {/* Grievance Box Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Meeting Grievance Box
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live device complaints &amp; on-the-spot logging
                  </p>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setGrievanceMode('INBOX')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    grievanceMode === 'INBOX' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Live Inbox ({grievances.length})
                </button>
                <button
                  type="button"
                  onClick={() => setGrievanceMode('LOG_NEW')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    grievanceMode === 'LOG_NEW' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Log on Spot</span>
                </button>
              </div>
            </div>

            {/* Classroom Broadcast Notice */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Classroom Prompt for Mentees:</strong>
                <p className="mt-0.5 text-[11px] leading-relaxed text-emerald-900">
                  Instruct students: <em>&ldquo;Please open the GFM App on your mobile/laptop right now and submit any grievance or academic blocker in your Grievance Box.&rdquo;</em>
                </p>
              </div>
            </div>

            {grievanceNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{grievanceNotice}</span>
              </div>
            )}

            {/* TAB A: LIVE INBOX OF SUBMITTED GRIEVANCES */}
            {grievanceMode === 'INBOX' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Student Submissions in Batch:</span>
                  <button
                    type="button"
                    onClick={loadGrievances}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh Live</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {grievances.map((g) => (
                    <div key={g.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <strong className="text-slate-900 text-xs block">{g.studentName}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">Roll: {g.rollNo}</span>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          g.status === 'RESOLVED' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {g.status === 'RESOLVED' ? '✓ Resolved' : 'Pending'}
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium leading-relaxed">
                        &ldquo;{g.grievanceText}&rdquo;
                      </div>

                      {g.gfmFeedback ? (
                        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                          <strong>GFM Feedback: </strong>
                          <span>{g.gfmFeedback}</span>
                        </div>
                      ) : (
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            Category: {g.category.replace('_', ' ')}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveResolvingGrievance(g);
                              setResolutionFeedback('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Counsel / Resolve</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {grievances.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No student complaints logged yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB B: LOG GRIEVANCE ON THE SPOT (VERBAL COMPLAINT BY STUDENT) */}
            {grievanceMode === 'LOG_NEW' && (
              <form onSubmit={handleLogGrievanceOnSpot} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Mentee Raising Concern
                  </label>
                  <select
                    value={selectedStudentForGrievance}
                    onChange={(e) => setSelectedStudentForGrievance(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {mentees.map((m) => (
                      <option key={m.studentId} value={m.studentId}>
                        {m.name} (Roll: {m.rollNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category of Concern
                  </label>
                  <select
                    value={newGrievanceCategory}
                    onChange={(e: any) => setNewGrievanceCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ACADEMIC">Academic / Subject Bottleneck</option>
                    <option value="EXAMS_EVALUATION">Unit Test &amp; Evaluation Query</option>
                    <option value="HOSTEL_CAMPUS">Hostel, Mess &amp; Campus Facility</option>
                    <option value="PERSONAL_COUNSELING">Personal Counseling / Wellbeing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Grievance Notes / Verbal Issue Expressed
                  </label>
                  <textarea
                    value={newGrievanceText}
                    onChange={(e) => setNewGrievanceText(e.target.value)}
                    placeholder="Enter what the student reported during this batch meeting..."
                    rows={4}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingGrievance || !newGrievanceText.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submittingGrievance ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Logging to Record...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Record Grievance in Batch Session</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* QUICK RESOLVE MODAL */}
      {activeResolvingGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 relative">
              <button
                onClick={() => setActiveResolvingGrievance(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-all"
              >
                ✕
              </button>

              <h3 className="text-lg font-extrabold">
                Counsel &amp; Resolve Grievance
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                For {activeResolvingGrievance.studentName} (Roll: {activeResolvingGrievance.rollNo})
              </p>
            </div>

            <form onSubmit={handleResolveGrievance} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Student Concern:</span>
                <p className="text-slate-800 font-medium">{activeResolvingGrievance.grievanceText}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  GFM Resolution / Immediate Action Feedback
                </label>
                <textarea
                  value={resolutionFeedback}
                  onChange={(e) => setResolutionFeedback(e.target.value)}
                  placeholder="Enter counseling action or solution agreed upon..."
                  rows={4}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveResolvingGrievance(null)}
                  className="w-full sm:w-auto text-center px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={resolvingGrievance}
                  className="w-full sm:w-auto text-center justify-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Send Resolution to Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
