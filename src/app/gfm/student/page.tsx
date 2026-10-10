'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookMarked, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  FileText, 
  User, 
  Phone, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight, 
  Bell, 
  GraduationCap, 
  ExternalLink, 
  Award,
  Layers,
  ArrowRight,
  Info,
  Check,
  History,
  Download,
  BookOpen,
  Users,
  Target,
  TrendingUp,
  X,
  AlertTriangle,
  Sliders,
  FileSpreadsheet
} from 'lucide-react';
import { 
  AcademicGreenBookDetails, 
  GfmAnnouncement, 
  StudentGrievance, 
  GfmOneOnOneSession,
  MenteeProfile,
  MeetingHistoryEntry,
  ParentMeetingSchedule,
  ActivityPointRecord,
  PeerTutor,
  AcademicResource,
  ExamCountdown
} from '@/types/mentorship';

export default function StudentGfmPage() {
  const router = useRouter();
  const [studentUser, setStudentUser] = useState<{
    role: string;
    studentId: string;
    name: string;
    rollNo: string;
    batchId: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<MenteeProfile | null>(null);
  const [greenBook, setGreenBook] = useState<AcademicGreenBookDetails | null>(null);
  const [announcements, setAnnouncements] = useState<GfmAnnouncement[]>([]);
  const [grievances, setGrievances] = useState<StudentGrievance[]>([]);
  const [oneOnOnes, setOneOnOnes] = useState<GfmOneOnOneSession[]>([]);

  // Modals
  const [showGreenBookModal, setShowGreenBookModal] = useState(false);
  const [showMeetingHistoryModal, setShowMeetingHistoryModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showSubmitActivityModal, setShowSubmitActivityModal] = useState(false);

  // Feature 1: Attendance Runway What-If Simulator
  const [whatIfLectures, setWhatIfLectures] = useState<number>(5);
  const [whatIfAction, setWhatIfAction] = useState<'ATTEND' | 'MISS'>('ATTEND');

  // Feature 3: Meeting History
  const [meetingHistories, setMeetingHistories] = useState<MeetingHistoryEntry[]>([]);
  const [loadingMeetingHistories, setLoadingMeetingHistories] = useState(false);

  // Feature 4: Parent-Mentor Meeting
  const [parentMeeting, setParentMeeting] = useState<ParentMeetingSchedule | null>(null);
  const [acknowledgingPmm, setAcknowledgingPmm] = useState(false);
  const [pmmSuccessMsg, setPmmSuccessMsg] = useState<string | null>(null);

  // Feature 6: 100-Point Activity Ledger
  const [activityPoints, setActivityPoints] = useState<ActivityPointRecord[]>([]);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityCategory, setActivityCategory] = useState<ActivityPointRecord['category']>('TECHNICAL_HACKATHON');
  const [activityPointsClaimed, setActivityPointsClaimed] = useState(15);
  const [activityAuthority, setActivityAuthority] = useState('');
  const [submittingActivity, setSubmittingActivity] = useState(false);
  const [activitySuccessMsg, setActivitySuccessMsg] = useState<string | null>(null);

  // Features 7 & 8: Academics (Peer Tutors, Resources, Countdowns)
  const [peerTutors, setPeerTutors] = useState<PeerTutor[]>([]);
  const [academicResources, setAcademicResources] = useState<AcademicResource[]>([]);
  const [examCountdowns, setExamCountdowns] = useState<ExamCountdown[]>([]);
  const [resourceFilter, setResourceFilter] = useState<string>('ALL');
  const [tutorConnectNotice, setTutorConnectNotice] = useState<string | null>(null);

  // Grievance form state
  const [grievanceCategory, setGrievanceCategory] = useState<'ACADEMIC' | 'HOSTEL_CAMPUS' | 'EXAMS_EVALUATION' | 'PERSONAL_COUNSELING'>('ACADEMIC');
  const [grievanceText, setGrievanceText] = useState('');
  const [submittingGrievance, setSubmittingGrievance] = useState(false);
  const [grievanceSuccessMsg, setGrievanceSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // Read logged in user
    const saved = localStorage.getItem('gfm_logged_in_user');
    let userObj = saved ? JSON.parse(saved) : null;

    if (!userObj || userObj.role !== 'STUDENT') {
      // Default to student Karan Vashisht (10A-01) for smooth demo experience
      userObj = {
        role: 'STUDENT',
        studentId: 'stu-1001',
        name: 'Karan Vashisht',
        rollNo: '10A-01',
        batchId: 'group-10a-general'
      };
      localStorage.setItem('gfm_logged_in_user', JSON.stringify(userObj));
    }
    setStudentUser(userObj);

    fetchStudentData(userObj.studentId, userObj.batchId);
  }, []);

  const fetchStudentData = async (studentId: string, batchId: string) => {
    setLoading(true);
    try {
      // 1. Fetch Green Book and profile
      const gbRes = await fetch(`/api/gfm/greenbook?studentId=${studentId}`);
      if (gbRes.ok) {
        const gbJson = await gbRes.json();
        if (gbJson.success) {
          setGreenBook(gbJson.data.greenBook);
          setStudentProfile(gbJson.data.student);
        }
      }

      // 2. Fetch Announcements
      const annRes = await fetch(`/api/gfm/announcements?batchId=${batchId}`);
      if (annRes.ok) {
        const annJson = await annRes.json();
        if (annJson.success && annJson.data?.length > 0) {
          setAnnouncements(annJson.data);
        } else {
          const allAnn = await fetch('/api/gfm/announcements');
          if (allAnn.ok) {
            const allJson = await allAnn.json();
            if (allJson.success) setAnnouncements(allJson.data);
          }
        }
      }

      // 3. Fetch Grievances
      const grvRes = await fetch(`/api/gfm/grievances?studentId=${studentId}`);
      if (grvRes.ok) {
        const grvJson = await grvRes.json();
        if (grvJson.success) {
          setGrievances(grvJson.data);
        }
      }

      // 4. Fetch 1-on-1 Sessions
      const oooRes = await fetch(`/api/gfm/one-on-one?studentId=${studentId}`);
      if (oooRes.ok) {
        const oooJson = await oooRes.json();
        if (oooJson.success) {
          setOneOnOnes(oooJson.data);
        }
      }

      // 5. Fetch Meeting Histories (Feature 3)
      const meetRes = await fetch(`/api/gfm/meeting-history?studentId=${studentId}`);
      if (meetRes.ok) {
        const meetJson = await meetRes.json();
        if (meetJson.success) {
          setMeetingHistories(meetJson.data);
        }
      }

      // 6. Fetch Parent-Mentor Meeting (Feature 4)
      const pmmRes = await fetch(`/api/gfm/parent-meeting?studentId=${studentId}`);
      if (pmmRes.ok) {
        const pmmJson = await pmmRes.json();
        if (pmmJson.success) {
          setParentMeeting(pmmJson.data);
        }
      }

      // 7. Fetch Activity Points (Feature 6)
      const actRes = await fetch(`/api/gfm/activity-points?studentId=${studentId}`);
      if (actRes.ok) {
        const actJson = await actRes.json();
        if (actJson.success) {
          setActivityPoints(actJson.data);
        }
      }

      // 8. Fetch Academics: Peer Tutors, Resources, Countdowns (Features 7 & 8)
      const acadRes = await fetch('/api/gfm/academics');
      if (acadRes.ok) {
        const acadJson = await acadRes.json();
        if (acadJson.success) {
          setPeerTutors(acadJson.data.peerTutors || []);
          setAcademicResources(acadJson.data.resources || []);
          setExamCountdowns(acadJson.data.countdowns || []);
        }
      }
    } catch (err) {
      console.error('Error fetching student portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceText.trim() || !studentUser) return;

    setSubmittingGrievance(true);
    setGrievanceSuccessMsg(null);

    try {
      const res = await fetch('/api/gfm/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentUser.studentId,
          studentName: studentUser.name,
          rollNo: studentUser.rollNo,
          batchId: studentUser.batchId,
          category: grievanceCategory,
          grievanceText: grievanceText.trim()
        })
      });

      const json = await res.json();
      if (json.success) {
        setGrievances(prev => [json.data, ...prev]);
        setGrievanceText('');
        setGrievanceSuccessMsg('Grievance logged directly to your GFM Mentor Dashboard.');
        setTimeout(() => setGrievanceSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('Grievance submit error:', err);
    } finally {
      setSubmittingGrievance(false);
    }
  };

  // Feature 4: Confirm Guardian Attendance Acknowledgment
  const handleAcknowledgePmm = async () => {
    if (!studentUser) return;
    setAcknowledgingPmm(true);
    try {
      const res = await fetch('/api/gfm/parent-meeting', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentUser.studentId,
          acknowledged: true
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setParentMeeting(json.data);
        setPmmSuccessMsg('Parent attendance acknowledgment confirmed and sealed in GFM records.');
        setTimeout(() => setPmmSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Error acknowledging parent meeting:', err);
    } finally {
      setAcknowledgingPmm(false);
    }
  };

  // Feature 6: Submit Activity Point Certificate
  const handleSubmitActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentUser || !activityTitle.trim() || !activityAuthority.trim()) return;

    setSubmittingActivity(true);
    try {
      const res = await fetch('/api/gfm/activity-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentUser.studentId,
          title: activityTitle.trim(),
          category: activityCategory,
          pointsAwarded: Number(activityPointsClaimed),
          issuingAuthority: activityAuthority.trim()
        })
      });
      const json = await res.json();
      if (json.success) {
        setActivityPoints(prev => [...prev, json.data]);
        setActivityTitle('');
        setActivityAuthority('');
        setActivitySuccessMsg('Activity certificate submitted for institutional verification.');
        setTimeout(() => {
          setActivitySuccessMsg(null);
          setShowSubmitActivityModal(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting activity point:', err);
    } finally {
      setSubmittingActivity(false);
    }
  };

  // Feature 7: Peer Tutor Connect Handler
  const handleConnectTutor = (tutor: PeerTutor) => {
    setTutorConnectNotice(`Connection request dispatched to peer tutor ${tutor.name}. Meeting room allocated at ${tutor.venue} (${tutor.availableTime}).`);
    setTimeout(() => setTutorConnectNotice(null), 4000);
  };

  // Calculations for Attendance Runway
  const currentAtt = greenBook?.cumulativeAttendance || 85;
  const totalEstimatedLectures = 80;
  const attendedLectures = Math.round(totalEstimatedLectures * (currentAtt / 100));

  // Safe buffer calculation (attendance >= 75%)
  const safeBuffer = currentAtt >= 75
    ? Math.max(0, Math.floor((attendedLectures - 0.75 * totalEstimatedLectures) / 0.75))
    : 0;

  // Defaulter recovery calculation (attendance < 75%)
  const neededConsecutive = currentAtt < 75
    ? Math.ceil((0.75 * totalEstimatedLectures - attendedLectures) / 0.25)
    : 0;

  // What-if projected attendance
  const simAttended = whatIfAction === 'ATTEND' ? attendedLectures + whatIfLectures : attendedLectures;
  const simTotal = totalEstimatedLectures + whatIfLectures;
  const projectedAtt = Math.round((simAttended / simTotal) * 100);

  // Total Activity Points Earned
  const totalActivityPoints = activityPoints.reduce((acc, p) => acc + (p.status === 'VERIFIED_AND_CREDITED' ? p.pointsAwarded : 0), 0);

  const meetingAnnouncements = announcements.filter(a => a.isMeetingNotice);
  const generalAnnouncements = announcements.filter(a => !a.isMeetingNotice);
  const pendingInvite = oneOnOnes.find(s => s.status === 'INVITED');
  const recentCompletedSession = oneOnOnes.find(s => s.status === 'COMPLETED');

  // Filtered Academic Resources
  const filteredResources = resourceFilter === 'ALL'
    ? academicResources
    : academicResources.filter(r => r.category === resourceFilter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Student GFM &amp; Academic Green Book details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Mentee Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner shrink-0">
              {studentUser?.name.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 px-2.5 py-0.5 rounded-full font-bold">
                  Roll: {studentUser?.rollNo}
                </span>
                <span className="text-xs bg-white/10 text-white/90 px-2.5 py-0.5 rounded-full font-medium">
                  {studentProfile?.section || 'Batch A'} &bull; {studentProfile?.stream || 'Senior School'}
                </span>
                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold tracking-wide">
                  PRN: {greenBook?.prn || 'PRN-2026-DL-100109'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {studentUser?.name}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 flex items-center gap-2">
                <span>Guardian Faculty Member (GFM):</span>
                <strong className="text-white bg-white/15 px-2 py-0.5 rounded-md font-semibold">
                  Dr. Ananya Sen / Mentor Cell
                </strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowGreenBookModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookMarked className="w-4 h-4 text-emerald-700" />
              <span>Academic Green Book</span>
            </button>

            <button
              onClick={() => setShowMeetingHistoryModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 text-white border border-emerald-400/30 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              title="View interaction summaries and past batch & 1-on-1 meeting records"
            >
              <History className="w-4 h-4 text-emerald-300" />
              <span>Meeting History</span>
            </button>

            <a
              href="#grievance-box"
              className="px-4 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-500/30 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Grievance Box</span>
            </a>
          </div>
        </div>

        {/* Quick Academic Health Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-emerald-200 block text-[11px] mb-0.5">Cumulative Attendance</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl font-extrabold ${currentAtt < 75 ? 'text-rose-300' : 'text-white'}`}>
                {currentAtt}%
              </span>
              <span className="text-[10px] text-white/70">
                {currentAtt < 75 ? '(Below 75% Alert)' : '(Compliant Normal)'}
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-emerald-200 block text-[11px] mb-0.5">Cumulative Marks %</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white">
                {greenBook?.cumulativePercentage || 78}%
              </span>
              <span className="text-[10px] text-emerald-300 font-medium">Sessional Average</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-emerald-200 block text-[11px] mb-0.5">Institutional Activity</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-emerald-300">
                {totalActivityPoints}/100
              </span>
              <span className="text-[10px] text-white/70">Points Credited</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-emerald-200 block text-[11px] mb-0.5">GFM Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white text-xs">Batch Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK JUMP ANCHOR BAR (Mobile-Optimized Sticky Bar) */}
      <div className="sticky top-14 sm:top-16 z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-slate-100/90 backdrop-blur-md border-y sm:border sm:rounded-2xl border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold text-slate-600">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">Jump to:</span>
          <a href="#attendance-runway" className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/80 shrink-0 transition-all flex items-center gap-1.5 shadow-2xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Attendance</span>
          </a>
          <a href="#today-meeting" className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/80 shrink-0 transition-all flex items-center gap-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Batch Meet</span>
          </a>
          <a href="#parent-meeting" className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 hover:text-indigo-800 border border-slate-200/80 shrink-0 transition-all flex items-center gap-1.5 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Parent Meet</span>
          </a>
          <a href="#activity-ledger" className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/80 shrink-0 transition-all flex items-center gap-1.5 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>100-Pt Activity</span>
          </a>
          <a href="#notices-feed" className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 hover:text-teal-800 border border-slate-200/80 shrink-0 transition-all flex items-center gap-1.5 shadow-2xs">
            <Bell className="w-3.5 h-3.5 text-teal-600" />
            <span>Notices</span>
          </a>
          <a href="#resource-vault" className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 hover:text-teal-800 border border-slate-200/80 shrink-0 transition-all flex items-center gap-1.5 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            <span>Vault &amp; Timers</span>
          </a>
          <a href="#study-buddies" className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/80 shrink-0 transition-all flex items-center gap-1.5 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Study Buddies</span>
          </a>
          <a href="#grievance-box" className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shrink-0 transition-all flex items-center gap-1.5 shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Grievance Box</span>
          </a>
        </div>
      </div>

      {/* FEATURE 2: High-Priority Meeting Absence & Parent Alert Escalation Banner */}
      {((studentProfile?.missingMeetingCount || 0) >= 2 || studentProfile?.parentAlertIssued) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                  Urgent Faculty Notice
                </span>
                <span className="text-xs text-rose-700 font-semibold">
                  Missed {studentProfile?.missingMeetingCount || 2} Mandatory GFM Meetings
                </span>
              </div>
              <h3 className="font-extrabold text-rose-900 text-sm sm:text-base mt-1">
                Mentorship Attendance Escalation &amp; Parent Intimation
              </h3>
              <p className="text-xs text-rose-800 mt-0.5 max-w-2xl leading-relaxed">
                {studentProfile?.parentAlertIssued ? (
                  <>
                    An official absence notice has been dispatched to your registered parent contact ({greenBook?.guardianDetails?.fatherPhone || 'Guardian Contact'}). Mentorship participation is mandatory for Academic Green Book clearance and examination admit cards.
                  </>
                ) : (
                  <>
                    You have been flagged for repeated unexcused absences from weekly GFM batch check-ins and 1-on-1 counseling. Please report immediately to Dr. Ananya Sen during morning zero period.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => setShowMeetingHistoryModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Review Missed Meetings</span>
            </button>
          </div>
        </div>
      )}

      {/* FEATURE 1: Smart Attendance Runway & Defaulter Defense Calculator */}
      <div id="attendance-runway" className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
              currentAtt >= 75 ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Smart Attendance Runway &amp; Defaulter Defense
                </h2>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  currentAtt >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {currentAtt >= 75 ? 'Safe Runway' : 'Defaulter Zone'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Calculated against the mandatory 75% institutional attendance threshold
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500">Current Pacing:</span>
            <span className={`text-lg font-black ${currentAtt >= 75 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {currentAtt}%
            </span>
            <span className="text-[10px] text-slate-400">({attendedLectures}/{totalEstimatedLectures} Lectures)</span>
          </div>
        </div>

        {/* Runway Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Buffer / Recovery Status */}
          <div className={`p-4.5 rounded-2xl border ${
            currentAtt >= 75 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-rose-50/70 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {currentAtt >= 75 ? 'Safe Buffer Lectures' : 'Consecutive Recovery Needed'}
              </span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                currentAtt >= 75 ? 'bg-emerald-200/80 text-emerald-900' : 'bg-rose-200/80 text-rose-900'
              }`}>
                {currentAtt >= 75 ? 'Margin Available' : 'Critical Defaulter'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-3xl sm:text-4xl font-black ${currentAtt >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {currentAtt >= 75 ? safeBuffer : neededConsecutive}
              </span>
              <span className="text-xs font-bold text-slate-600">Lectures</span>
            </div>

            <p className="text-xs mt-2 leading-relaxed text-slate-700">
              {currentAtt >= 75 ? (
                <>
                  You can safely miss up to <strong>{safeBuffer} upcoming lectures</strong> without dipping below the mandatory 75% threshold.
                </>
              ) : (
                <>
                  You must attend the next <strong>{neededConsecutive} consecutive lectures without absence</strong> to climb back over the mandatory 75% limit.
                </>
              )}
            </p>
          </div>

          {/* Interactive What-If Simulator */}
          <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>What-If Attendance Simulator</span>
              </span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                projectedAtt >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                Projected: {projectedAtt}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWhatIfAction('ATTEND')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  whatIfAction === 'ATTEND' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                }`}
              >
                If I Attend Next
              </button>
              <button
                type="button"
                onClick={() => setWhatIfAction('MISS')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  whatIfAction === 'MISS' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                }`}
              >
                If I Miss Next
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setWhatIfLectures(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs active:scale-95 transition-all cursor-pointer"
                title="Decrease 1 lecture"
              >
                -
              </button>
              <input
                type="range"
                min={1}
                max={20}
                value={whatIfLectures}
                onChange={(e) => setWhatIfLectures(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2"
              />
              <button
                type="button"
                onClick={() => setWhatIfLectures(prev => Math.min(20, prev + 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs active:scale-95 transition-all cursor-pointer"
                title="Increase 1 lecture"
              >
                +
              </button>
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 w-14 text-right shrink-0">
                {whatIfLectures} lec
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Simulating: If you {whatIfAction.toLowerCase()} the next {whatIfLectures} scheduled classes, your attendance becomes <strong className={projectedAtt >= 75 ? 'text-emerald-700' : 'text-rose-600'}>{projectedAtt}%</strong>.
            </p>
          </div>
        </div>

        {/* Subject-wise Attendance Breakdown */}
        {greenBook?.termAssessments && greenBook.termAssessments.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Subject-by-Subject Attendance Breakdown:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {greenBook.termAssessments.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-slate-800 text-xs block truncate">{t.subject}</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-lg font-black ${t.attendancePercent < 75 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {t.attendancePercent}%
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-2 inline-block text-center ${
                    t.attendancePercent < 75 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {t.attendancePercent < 75 ? 'Remedial Alert' : 'Safe'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 1-on-1 Guidance Session Banner (If Invited) */}
      {pendingInvite && (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Action Required
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Invited by {pendingInvite.mentorName}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mt-1">
                1-on-1 Academic &amp; Personal Guidance Session Scheduled
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                &ldquo;{pendingInvite.inviteMessage}&rdquo;
              </p>
            </div>
          </div>

          <Link
            href={`/gfm/session/${pendingInvite.studentId}`}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <span>Open 1-on-1 Session Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main Grid: Left Column (Meetings & Announcements), Right Column (Grievance Box & Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Meetings, PMM Hub, Activity Ledger, Notices (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TODAY'S GFM BATCH MEETING CARD */}
          <div id="today-meeting" className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs scroll-mt-24">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Today&apos;s GFM Batch Meeting
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Mandatory weekly cohort check-in by your Guardian Faculty Member
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                Weekly Cadence
              </span>
            </div>

            {meetingAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {meetingAnnouncements.slice(0, 1).map((m) => (
                  <div key={m.id} className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {m.title}
                      </h3>
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shrink-0">
                        Official Notice
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                      {m.content}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-emerald-200/60 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span><strong>Time:</strong> {m.meetingTime || '08:30 AM'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span><strong>Date:</strong> {m.meetingDate || 'Today'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span><strong>Venue:</strong> {m.venue || 'Classroom / LH-2'}</span>
                      </div>
                    </div>

                    <div className="mt-3.5 p-2.5 rounded-lg bg-white/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Attendance is recorded live in the Academic Green Book roster.</span>
                      </div>
                      <span className="font-semibold text-emerald-800 text-[11px] shrink-0">
                        Conducted by: {m.mentorName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-60" />
                <p className="font-semibold text-slate-700">No batch meeting scheduled for today.</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Your GFM will broadcast the next weekly slot shortly.</p>
              </div>
            )}
          </div>

          {/* FEATURE 4: MID-SEMESTER PARENT-MENTOR MEETING (PMM) HUB */}
          <div id="parent-meeting" className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Mid-Semester Parent-Mentor Meeting (PMM)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Mandatory mid-term guardian interaction on student progress &amp; attendance
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                Semester Milestone
              </span>
            </div>

            {pmmSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pmmSuccessMsg}</span>
              </div>
            )}

            {parentMeeting ? (
              <div className="bg-gradient-to-br from-indigo-50/60 to-slate-50 border border-indigo-200/80 rounded-2xl p-4.5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full">
                      Confirmed Mid-Sem Appointment
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1">
                      One-on-One Guardian Progress Review
                    </h3>
                  </div>

                  <button
                    onClick={() => setShowDossierModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-700" />
                    <span>View Progress Dossier</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-indigo-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">Scheduled Date:</span>
                    <strong className="text-slate-800 font-bold">{parentMeeting.scheduledDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">Time Window:</span>
                    <strong className="text-slate-800 font-bold">{parentMeeting.timeSlot}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">Venue / Room:</span>
                    <strong className="text-slate-800 font-bold">{parentMeeting.venue}</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 text-[11px] block">Agenda &amp; Discussion Focus:</span>
                  <p className="leading-relaxed text-[11px]">{parentMeeting.dossierSummary.gfmObservation}</p>
                </div>

                {/* Acknowledgment Slip */}
                <div className="pt-3 border-t border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Parent Acknowledgment Slip:</span>
                    <span className="text-[11px] text-slate-500">
                      {parentMeeting.status === 'CONFIRMED_BY_PARENT' ? (
                        <span className="text-emerald-700 font-bold">
                          ✓ Confirmed by Guardian ({parentMeeting.parentAttendanceMode === 'IN_PERSON' ? 'In-Person Campus Meet' : 'Virtual Session'})
                        </span>
                      ) : (
                        'Confirmation pending by Guardian or Student'
                      )}
                    </span>
                  </div>

                  {parentMeeting.status !== 'CONFIRMED_BY_PARENT' ? (
                    <button
                      onClick={handleAcknowledgePmm}
                      disabled={acknowledgingPmm}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{acknowledgingPmm ? 'Confirming...' : 'Sign Guardian Acknowledgment'}</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                      ✓ Confirmed &amp; Scheduled
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                Mid-semester parent meeting schedule being finalized by GFM cell.
              </div>
            )}
          </div>

          {/* FEATURE 6: 100-POINT INSTITUTIONAL ACTIVITY LEDGER */}
          <div id="activity-ledger" className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    100-Point Institutional Activity Ledger
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Mandatory non-academic credits required for degree &amp; institutional clearance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitActivityModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                + Submit Certificate
              </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Cumulative Activity Credit Progress:</span>
                <span className="font-black text-emerald-700 text-sm">
                  {totalActivityPoints} / 100 Points
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalActivityPoints / 100) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Minimum 100 points required across 4 distinct categories before final semester clearance.
              </p>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 block">Technical / Hackathons</span>
                <strong className="text-base font-extrabold text-blue-900 block mt-1">15 Pts</strong>
                <span className="text-[9px] text-blue-700">Robotics &amp; Coding</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200">
                <span className="text-[10px] font-bold text-purple-800 block">Sports &amp; Cultural</span>
                <strong className="text-base font-extrabold text-purple-900 block mt-1">15 Pts</strong>
                <span className="text-[9px] text-purple-700">Badminton Tournaments</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 block">Community Outreach</span>
                <strong className="text-base font-extrabold text-amber-900 block mt-1">15 Pts</strong>
                <span className="text-[9px] text-amber-700">Campus Tree Drives</span>
              </div>
              <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200">
                <span className="text-[10px] font-bold text-teal-800 block">Value-Added Courses</span>
                <strong className="text-base font-extrabold text-teal-900 block mt-1">15 Pts</strong>
                <span className="text-[9px] text-teal-700">Python Data Analytics</span>
              </div>
            </div>

            {/* Submitted Activity Records */}
            {activityPoints.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-700 block">Verified Activity Submissions:</span>
                <div className="space-y-2">
                  {activityPoints.map((act) => (
                    <div key={act.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <strong className="text-slate-900 block">{act.title}</strong>
                        <span className="text-[10px] text-slate-400">
                          {act.category.replace('_', ' ')} &bull; {act.issuingAuthority}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-emerald-700 block">+{act.pointsAwarded} Pts</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {act.status === 'VERIFIED_AND_CREDITED' ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* GFM NOTICES & ANNOUNCEMENTS FEED */}
          <div id="notices-feed" className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs scroll-mt-24">
            <div className="flex items-start sm:items-center justify-between gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-extrabold text-slate-900 text-sm sm:text-base truncate sm:whitespace-normal">
                    GFM Notice Board
                  </h2>
                  <p className="text-[11px] text-slate-500 line-clamp-1 sm:line-clamp-none">
                    Official instructions &amp; academic updates from GFM
                  </p>
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap shadow-2xs">
                {announcements.length} {announcements.length === 1 ? 'Notice' : 'Notices'}
              </span>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div 
                  key={ann.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    ann.isMeetingNotice 
                      ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300' 
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ann.isMeetingNotice 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {ann.isMeetingNotice ? 'Batch Meeting' : 'Notice'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(ann.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {ann.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {ann.content}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Issued by: <strong className="text-slate-700">{ann.mentorName}</strong></span>
                    <span className="text-emerald-700 font-medium">Verified by GFM Cell</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT 1-ON-1 GUIDANCE RECORD (IF PRESENT) */}
          {recentCompletedSession && recentCompletedSession.aiSummaryPoints && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Latest 1-on-1 Guidance Summary
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      AI-synthesized coaching notes sealed into your Academic Green Book
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Green Book Sealed
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">
                    Core Challenge Discussed
                  </span>
                  <p className="text-slate-800 font-medium mt-0.5">
                    {recentCompletedSession.aiSummaryPoints.identifiedBlocker}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">
                    Mentor Advice Given
                  </span>
                  <p className="text-slate-800 mt-0.5 leading-relaxed">
                    {recentCompletedSession.aiSummaryPoints.guidanceGiven}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">
                    Committed Action Items for Mentee
                  </span>
                  <ul className="mt-1 space-y-1">
                    {recentCompletedSession.aiSummaryPoints.actionItemsForMentee.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Countdowns, Resource Vault, Study Buddies & Grievance Box (Span 1) */}
        <div className="space-y-6" id="grievance-box">
          
          {/* FEATURE 8: EXAM & SUBMISSION COUNTDOWN TIMERS */}
          {examCountdowns.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Academic Exam Timers
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Pacing Pointers</span>
              </div>

              <div className="space-y-2.5">
                {examCountdowns.map((ex) => (
                  <div key={ex.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-slate-900 block text-xs">{ex.title}</strong>
                      <span className="text-[10px] text-slate-400">Date: {ex.date}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                        ex.daysRemaining <= 14 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ex.daysRemaining} Days
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FEATURE 8: ACADEMIC RESOURCE VAULT */}
          <div id="resource-vault" className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3.5 scroll-mt-24">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-700" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Academic Resource Vault
                </h3>
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                Repository
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
              {['ALL', 'QUESTION_BANK', 'FORMULA_SHEET', 'PYQ'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setResourceFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
                    resourceFilter === cat ? 'bg-teal-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredResources.map((res) => (
                <div key={res.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-all flex items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-slate-900 block text-xs truncate max-w-[180px]">{res.title}</strong>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {res.subject} &bull; {res.size}
                    </span>
                  </div>
                  <a
                    href={res.downloadUrl}
                    className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors shrink-0 cursor-pointer"
                    title={`Download ${res.title}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURE 7: BATCH STUDY BUDDIES & PEER-TUTOR CONNECT */}
          <div id="study-buddies" className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3.5 scroll-mt-24">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Batch Study Buddies &amp; Tutors
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Peer Support
              </span>
            </div>

            {tutorConnectNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold">
                {tutorConnectNotice}
              </div>
            )}

            <div className="space-y-2.5">
              {peerTutors.map((tutor) => (
                <div key={tutor.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block text-xs">{tutor.name}</strong>
                      <span className="text-[10px] text-slate-400">Roll: {tutor.rollNo} &bull; {tutor.venue}</span>
                    </div>
                    <button
                      onClick={() => handleConnectTutor(tutor)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                    >
                      Connect
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                      {tutor.subject}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                    <span>{tutor.availableTime}</span>
                    <span className="text-emerald-700 font-bold">{tutor.contactNote}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ON-DEVICE GRIEVANCE SUBMISSION BOX */}
          <div className="bg-white rounded-2xl border-2 border-emerald-600/30 p-5 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/60 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  On-Device Grievance Box
                </h3>
                <p className="text-[11px] text-slate-500">
                  Direct submission to your GFM Mentor Dashboard
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              Have any academic struggle, hostel/campus concern, or exam query? Fill your concern directly on your device. Your GFM will address it privately.
            </p>

            {grievanceSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{grievanceSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleGrievanceSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Grievance Category
                </label>
                <select
                  value={grievanceCategory}
                  onChange={(e: any) => setGrievanceCategory(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="ACADEMIC">Academic / Subject Difficulty</option>
                  <option value="EXAMS_EVALUATION">Exams &amp; Evaluation Queries</option>
                  <option value="HOSTEL_CAMPUS">Hostel, Mess &amp; Campus Facilities</option>
                  <option value="PERSONAL_COUNSELING">Personal Counseling &amp; Wellbeing</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Describe Your Grievance / Concern
                </label>
                <textarea
                  value={grievanceText}
                  onChange={(e) => setGrievanceText(e.target.value)}
                  placeholder="Type your concern here... e.g. Facing difficulty with subject derivations, or mess water issue in hostel."
                  rows={4}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingGrievance || !grievanceText.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submittingGrievance ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending to Mentor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Grievance to GFM</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* PREVIOUS GRIEVANCES & RESOLUTION STATUS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center justify-between">
              <span>My Grievance Log</span>
              <span className="text-[11px] text-slate-500 font-semibold">{grievances.length} Logged</span>
            </h3>

            {grievances.length > 0 ? (
              <div className="space-y-3">
                {grievances.map((g) => (
                  <div key={g.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md">
                        {g.category.replace('_', ' ')}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        g.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : g.status === 'REVIEWED_BY_GFM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {g.status === 'RESOLVED' ? '✓ Resolved' : g.status === 'REVIEWED_BY_GFM' ? 'Under Review' : 'Submitted'}
                      </span>
                    </div>

                    <p className="text-slate-700 font-medium leading-relaxed">
                      {g.grievanceText}
                    </p>

                    {g.gfmFeedback ? (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                        <strong className="block text-emerald-950 font-bold mb-0.5">
                          GFM Resolution Feedback:
                        </strong>
                        <span>{g.gfmFeedback}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">
                        Awaiting review by GFM Mentor...
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 text-right pt-1 border-t border-slate-200/50">
                      {new Date(g.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No active grievances logged.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ACADEMIC GREEN BOOK MODAL DOSSIER */}
      {showGreenBookModal && greenBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative">
              <button
                onClick={() => setShowGreenBookModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full">
                      Academic Green Book Official Record
                    </span>
                    <span className="text-xs text-emerald-100 font-mono font-bold">
                      PRN: {greenBook.prn}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold mt-0.5">
                    Student Green Book Cumulative Record
                  </h2>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              
              {/* Profile Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 block">Student Name</span>
                  <strong className="text-slate-900 text-sm">{studentUser?.name}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Roll Number</span>
                  <strong className="text-slate-900 text-sm">{studentUser?.rollNo}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Admission Year</span>
                  <strong className="text-slate-900 text-sm">{greenBook.admissionYear}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Blood Group</span>
                  <strong className="text-slate-900 text-sm">{greenBook.bloodGroup}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Father / Guardian</span>
                  <strong className="text-slate-900 text-sm">{greenBook.guardianDetails.fatherName}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Guardian Phone</span>
                  <strong className="text-slate-900 text-sm">{greenBook.guardianDetails.fatherPhone}</strong>
                </div>
              </div>

              {/* Attendance & Performance Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${
                  greenBook.cumulativeAttendance < 75 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Cumulative Attendance</span>
                    <span className={`text-xl font-extrabold ${
                      greenBook.cumulativeAttendance < 75 ? 'text-rose-700' : 'text-emerald-700'
                    }`}>
                      {greenBook.cumulativeAttendance}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {greenBook.cumulativeAttendance < 75 
                      ? '⚠️ Warning: Below mandatory minimum 75% requirement. Parent counseling required.' 
                      : '✓ Compliant with institutional attendance norms.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border bg-slate-50 border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Cumulative Academic %</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {greenBook.cumulativePercentage}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Calculated across all term assessments and laboratory practicals.
                  </p>
                </div>
              </div>

              {/* Term Assessments Table */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-2.5 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Term Sessional Assessments</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-x-auto no-scrollbar">
                  <table className="w-full text-left min-w-[500px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold text-[11px]">
                      <tr>
                        <th className="p-2.5">Subject</th>
                        <th className="p-2.5">Marks Obtained</th>
                        <th className="p-2.5">Total Marks</th>
                        <th className="p-2.5">Percentage</th>
                        <th className="p-2.5">Subject Attendance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {greenBook.termAssessments.map((term, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-800">{term.subject}</td>
                          <td className="p-2.5 font-bold text-emerald-800">{term.marksObtained}</td>
                          <td className="p-2.5 text-slate-500">{term.totalMarks}</td>
                          <td className="p-2.5 font-bold">{Math.round((term.marksObtained / term.totalMarks) * 100)}%</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              term.attendancePercent < 75 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {term.attendancePercent}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GFM Remarks History */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-2.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>GFM Teacher-Guardian Remarks History</span>
                </h4>
                <div className="space-y-2.5">
                  {greenBook.gfmRemarksHistory.map((rem, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <strong className="text-slate-800">{rem.gfmName}</strong>
                        <span className="text-slate-500 font-mono">{rem.date}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{rem.remark}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <span className="text-[11px] text-slate-500">
                Official Academic Green Book Record &bull; Digitally Signed
              </span>
              <button
                onClick={() => setShowGreenBookModal(false)}
                className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 3: MEETING HISTORY MODAL */}
      {showMeetingHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    My Mentorship Meeting History
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Past GFM Batch Check-ins, 1-on-1 Guidance &amp; Guidance Minutes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMeetingHistoryModal(false)}
                className="p-1.5 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {meetingHistories.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  <History className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No meeting history records logged yet.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {meetingHistories.map((entry) => (
                    <div 
                      key={entry.id} 
                      className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 shadow-2xs space-y-2.5 transition-all"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] ${
                              entry.type === 'BATCH_HUDDLE'
                                ? 'bg-blue-100 text-blue-800'
                                : entry.type === 'ONE_ON_ONE_GUIDANCE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {entry.type === 'BATCH_HUDDLE' ? 'Weekly Batch Meeting' : entry.type === 'ONE_ON_ONE_GUIDANCE' ? '1-on-1 Mentoring' : 'Parent-Mentor Meet'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900">{entry.title}</h4>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {entry.attendanceStatus && (
                            <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                              entry.attendanceStatus === 'PRESENT'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {entry.attendanceStatus}
                            </span>
                          )}
                          {entry.sealedToGreenBook && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                              Sealed in Green Book
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Discussion Summary */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 block text-[10px] uppercase tracking-wider text-slate-500">Summary of Interaction:</span>
                        <p className="leading-relaxed">{entry.discussionSummary}</p>
                      </div>

                      {/* Guidance Provided */}
                      {entry.guidanceGiven && (
                        <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-[11px] text-emerald-950 space-y-1">
                          <span className="font-bold text-emerald-900 block text-[10px] uppercase tracking-wider">Mentor Guidance Given:</span>
                          <p className="leading-relaxed italic">&ldquo;{entry.guidanceGiven}&rdquo;</p>
                        </div>
                      )}

                      {/* Action Takeaways */}
                      {entry.keyActionTakeaways && entry.keyActionTakeaways.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wider block mb-1">Takeaways &amp; Commitments:</span>
                          <ul className="space-y-1 text-[11px] text-slate-600">
                            {entry.keyActionTakeaways.map((takeaway, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{takeaway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setShowMeetingHistoryModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 4: PROGRESS DOSSIER PREVIEW MODAL */}
      {showDossierModal && parentMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-indigo-800 to-slate-900 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">Mid-Semester Progress Dossier</h3>
                <p className="text-[11px] text-indigo-200">
                  Compiled for Guardian Consultation &bull; AY 2026-27
                </p>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                className="p-1.5 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Student: {studentUser?.name}</span>
                  <span>Roll: {studentUser?.rollNo}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Guardian: {greenBook?.guardianDetails?.fatherName} ({greenBook?.guardianDetails?.fatherPhone})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 block">Attendance Pacing</span>
                  <strong className="text-xl font-black text-emerald-900">{currentAtt}%</strong>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">
                    {currentAtt >= 75 ? 'Above 75% norm' : 'Below 75% warning'}
                  </span>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                  <span className="text-[10px] font-bold text-indigo-800 block">Sessional CIA Marks</span>
                  <strong className="text-xl font-black text-indigo-900">{greenBook?.cumulativePercentage || 78}%</strong>
                  <span className="text-[10px] text-indigo-700 block mt-0.5">Continuous Assessment</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Mentor Evaluation Notes:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed text-[11px] italic">
                  &ldquo;Karan is demonstrating consistent cognitive clarity in lab practicals. Theoretical physics proofs require structured morning revision blocks. Parent alignment requested during PMM on 24 October.&rdquo;
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Official GFM Progress Sheet</span>
              <button
                onClick={() => setShowDossierModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 6: SUBMIT ACTIVITY POINT CERTIFICATE MODAL */}
      {showSubmitActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Submit Institutional Activity Credit</h3>
                  <p className="text-[11px] text-emerald-100">
                    Upload certificate details for 100-Point Ledger accreditation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitActivityModal(false)}
                className="p-1.5 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitActivity} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              {activitySuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{activitySuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Activity / Competition / Course Title:
                </label>
                <input
                  type="text"
                  required
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder="e.g. State Level Hackathon 2nd Place / NSS Cleanliness Drive"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Activity Category:
                  </label>
                  <select
                    value={activityCategory}
                    onChange={(e: any) => setActivityCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="TECHNICAL_HACKATHON">Technical &amp; Hackathon</option>
                    <option value="SPORTS_CULTURAL">Sports &amp; Cultural</option>
                    <option value="COMMUNITY_OUTREACH">Community &amp; NSS</option>
                    <option value="CERTIFICATIONS_MOOC">Leadership &amp; Courses</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Points Claimed:
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={25}
                    value={activityPointsClaimed}
                    onChange={(e) => setActivityPointsClaimed(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Issuing Authority / Organizer:
                </label>
                <input
                  type="text"
                  required
                  value={activityAuthority}
                  onChange={(e) => setActivityAuthority(e.target.value)}
                  placeholder="e.g. Technical Innovation Council / State Badminton Assoc."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSubmitActivityModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingActivity}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingActivity ? 'Submitting...' : 'Submit for Credit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
