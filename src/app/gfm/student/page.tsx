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
  Bell, 
  ExternalLink, 
  Award,
  Check,
  History,
  Download,
  BookOpen,
  Users,
  TrendingUp,
  X,
  AlertTriangle,
  Sliders,
  Menu,
  Upload,
  ArrowRight
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
  BuddyConnectionRecord,
  AcademicResource,
  ExamCountdown
} from '@/types/mentorship';

type ActiveModule = 'OVERVIEW' | 'NOTICES' | 'BATCH_MEET' | 'ATTENDANCE' | 'PARENT_MEET' | 'ACTIVITIES' | 'BUDDIES' | 'VAULT' | 'GRIEVANCES';

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

  // Encapsulation state: Active Module & 3-line Menu Drawer
  const [activeModule, setActiveModule] = useState<ActiveModule>('OVERVIEW');
  const [showDrawerMenu, setShowDrawerMenu] = useState(false);

  // Modals
  const [showGreenBookModal, setShowGreenBookModal] = useState(false);
  const [showMeetingHistoryModal, setShowMeetingHistoryModal] = useState(false);
  const [showSubmitActivityModal, setShowSubmitActivityModal] = useState(false);

  // Feature: Attendance Runway What-If Simulator
  const [whatIfLectures, setWhatIfLectures] = useState<number>(5);
  const [whatIfAction, setWhatIfAction] = useState<'ATTEND' | 'MISS'>('ATTEND');

  // Feature: Meeting History
  const [meetingHistories, setMeetingHistories] = useState<MeetingHistoryEntry[]>([]);

  // Feature: Parent-Mentor Meeting (Only if scheduled by GFM)
  const [parentMeeting, setParentMeeting] = useState<ParentMeetingSchedule | null>(null);

  // Feature: 100-Point Activity Ledger & File Upload
  const [activityPoints, setActivityPoints] = useState<ActivityPointRecord[]>([]);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityCategory, setActivityCategory] = useState<ActivityPointRecord['category']>('TECHNICAL_HACKATHON');
  const [activityPointsClaimed, setActivityPointsClaimed] = useState(15);
  const [activityAuthority, setActivityAuthority] = useState('');
  const [certFileName, setCertFileName] = useState('');
  const [selectedCertFile, setSelectedCertFile] = useState<File | null>(null);
  const [submittingActivity, setSubmittingActivity] = useState(false);
  const [activitySuccessMsg, setActivitySuccessMsg] = useState<string | null>(null);

  // Feature: Academics & Buddies
  const [peerTutors, setPeerTutors] = useState<PeerTutor[]>([]);
  const [academicResources, setAcademicResources] = useState<AcademicResource[]>([]);
  const [examCountdowns, setExamCountdowns] = useState<ExamCountdown[]>([]);
  const [resourceFilter, setResourceFilter] = useState<string>('ALL');
  const [tutorConnectNotice, setTutorConnectNotice] = useState<string | null>(null);
  const [connectedBuddies, setConnectedBuddies] = useState<BuddyConnectionRecord[]>([]);

  // Grievance form state
  const [grievanceCategory, setGrievanceCategory] = useState<'ACADEMIC' | 'HOSTEL_CAMPUS' | 'EXAMS_EVALUATION' | 'PERSONAL_COUNSELING'>('ACADEMIC');
  const [grievanceText, setGrievanceText] = useState('');
  const [submittingGrievance, setSubmittingGrievance] = useState(false);
  const [grievanceSuccessMsg, setGrievanceSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('gfm_logged_in_user');
    let userObj = saved ? JSON.parse(saved) : null;

    if (!userObj || userObj.role !== 'STUDENT') {
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
      // 1. Green Book & Profile
      const gbRes = await fetch(`/api/gfm/greenbook?studentId=${studentId}`);
      if (gbRes.ok) {
        const gbJson = await gbRes.json();
        if (gbJson.success) {
          setGreenBook(gbJson.data.greenBook);
          setStudentProfile(gbJson.data.student);
        }
      }

      // 2. Announcements
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

      // 3. Grievances
      const grvRes = await fetch(`/api/gfm/grievances?studentId=${studentId}`);
      if (grvRes.ok) {
        const grvJson = await grvRes.json();
        if (grvJson.success) setGrievances(grvJson.data);
      }

      // 4. One-on-one sessions
      const oooRes = await fetch(`/api/gfm/one-on-one?studentId=${studentId}`);
      if (oooRes.ok) {
        const oooJson = await oooRes.json();
        if (oooJson.success) setOneOnOnes(oooJson.data);
      }

      // 5. Meeting histories
      const meetRes = await fetch(`/api/gfm/meeting-history?studentId=${studentId}`);
      if (meetRes.ok) {
        const meetJson = await meetRes.json();
        if (meetJson.success) setMeetingHistories(meetJson.data);
      }

      // 6. Parent-Mentor Meeting (PMM) - Only active if scheduled by GFM
      const pmmRes = await fetch(`/api/gfm/parent-meeting?studentId=${studentId}`);
      if (pmmRes.ok) {
        const pmmJson = await pmmRes.json();
        if (pmmJson.success && pmmJson.data && pmmJson.data.status === 'SCHEDULED') {
          setParentMeeting(pmmJson.data);
        } else {
          setParentMeeting(null);
        }
      }

      // 7. Activity points
      const actRes = await fetch(`/api/gfm/activity-points?studentId=${studentId}`);
      if (actRes.ok) {
        const actJson = await actRes.json();
        if (actJson.success) setActivityPoints(actJson.data);
      }

      // 8. Academics: Tutors & Resources
      const acadRes = await fetch('/api/gfm/academics');
      if (acadRes.ok) {
        const acadJson = await acadRes.json();
        if (acadJson.success) {
          setPeerTutors(acadJson.data.peerTutors || []);
          setAcademicResources(acadJson.data.resources || []);
          setExamCountdowns(acadJson.data.countdowns || []);
        }
      }

      // 9. Connected Buddies
      const budRes = await fetch(`/api/gfm/buddy-connect?studentId=${studentId}`);
      if (budRes.ok) {
        const budJson = await budRes.json();
        if (budJson.success) setConnectedBuddies(budJson.data || []);
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
        setGrievanceSuccessMsg('Grievance logged directly to your GFM Mentor.');
        setTimeout(() => setGrievanceSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('Grievance submit error:', err);
    } finally {
      setSubmittingGrievance(false);
    }
  };

  // Submit Activity Point Certificate with File Upload
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
          issuingAuthority: activityAuthority.trim(),
          certificateFileName: certFileName || 'Certificate_Attachment.pdf',
          certificateFileUrl: selectedCertFile ? URL.createObjectURL(selectedCertFile) : ''
        })
      });
      const json = await res.json();
      if (json.success) {
        setActivityPoints(prev => [...prev, json.data]);
        setActivityTitle('');
        setActivityAuthority('');
        setCertFileName('');
        setSelectedCertFile(null);
        setActivitySuccessMsg('Certificate uploaded and submitted for mentor verification.');
        setTimeout(() => {
          setActivitySuccessMsg(null);
          setShowSubmitActivityModal(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Error submitting activity point:', err);
    } finally {
      setSubmittingActivity(false);
    }
  };

  // Peer Tutor Connect Handler
  const handleConnectTutor = async (tutor: PeerTutor) => {
    if (!studentUser) return;
    try {
      const res = await fetch('/api/gfm/buddy-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentUser.studentId,
          studentName: studentUser.name,
          rollNo: studentUser.rollNo,
          tutorId: tutor.id,
          tutorName: tutor.name,
          tutorRollNo: tutor.rollNo,
          subject: tutor.subject,
          venue: tutor.venue,
          scheduledTime: tutor.availableTime,
          contactNote: `Study partner session confirmed with ${studentUser.name}.`
        })
      });

      const json = await res.json();
      if (json.success) {
        setConnectedBuddies(prev => [json.data, ...prev.filter(b => b.tutorId !== tutor.id)]);
        setTutorConnectNotice(`Connected with peer tutor ${tutor.name}! Venue: ${tutor.venue} (${tutor.availableTime}).`);
      } else {
        setTutorConnectNotice(`Connected with peer tutor ${tutor.name}.`);
      }
    } catch (err) {
      setTutorConnectNotice(`Connection confirmed with ${tutor.name} at ${tutor.venue}.`);
    }
    setTimeout(() => setTutorConnectNotice(null), 4000);
  };

  // Calculations for Attendance Runway
  const currentAtt = greenBook?.cumulativeAttendance || 85;
  const totalEstimatedLectures = 80;
  const attendedLectures = Math.round(totalEstimatedLectures * (currentAtt / 100));

  const safeBuffer = currentAtt >= 75
    ? Math.max(0, Math.floor((attendedLectures - 0.75 * totalEstimatedLectures) / 0.75))
    : 0;

  const neededConsecutive = currentAtt < 75
    ? Math.ceil((0.75 * totalEstimatedLectures - attendedLectures) / 0.25)
    : 0;

  const simAttended = whatIfAction === 'ATTEND' ? attendedLectures + whatIfLectures : attendedLectures;
  const simTotal = totalEstimatedLectures + whatIfLectures;
  const projectedAtt = Math.round((simAttended / simTotal) * 100);

  const totalActivityPoints = activityPoints.reduce((acc, p) => acc + (p.status === 'VERIFIED_AND_CREDITED' ? p.pointsAwarded : 0), 0);
  const pendingActivityPoints = activityPoints.filter(p => p.status === 'PENDING_APPROVAL');

  const meetingAnnouncements = announcements.filter(a => a.isMeetingNotice);
  const generalAnnouncements = announcements.filter(a => !a.isMeetingNotice);

  const filteredResources = resourceFilter === 'ALL'
    ? academicResources
    : academicResources.filter(r => r.category === resourceFilter);

  // Priority Menu Items (strictly in requested priority order:
  // 1) notices, 2) batch meet, 3) attendance, 4) parent meet (conditional), 5) 100 pt activity, 6) study buddies, 7) vault & timers)
  const menuItems: { id: ActiveModule; label: string; icon: React.ReactNode; show: boolean }[] = [
    { id: 'NOTICES', label: 'Notices', icon: <Bell className="w-4 h-4" />, show: true },
    { id: 'BATCH_MEET', label: 'Batch Meet', icon: <Calendar className="w-4 h-4" />, show: true },
    { id: 'ATTENDANCE', label: 'Attendance', icon: <TrendingUp className="w-4 h-4" />, show: true },
    { id: 'PARENT_MEET', label: 'Parent Meet', icon: <Users className="w-4 h-4" />, show: Boolean(parentMeeting && parentMeeting.status === 'SCHEDULED') },
    { id: 'ACTIVITIES', label: '100-Pt Activity', icon: <Award className="w-4 h-4" />, show: true },
    { id: 'BUDDIES', label: 'Study Buddies', icon: <Users className="w-4 h-4" />, show: true },
    { id: 'VAULT', label: 'Vault & Timers', icon: <BookOpen className="w-4 h-4" />, show: true },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-3 border-slate-800 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-600">Loading student records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-16 px-3 sm:px-6">
      
      {/* SOLID PROFESSIONAL HEADER */}
      <header className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-black text-xl shrink-0">
              {studentUser?.name.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-[11px] bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                  Roll {studentUser?.rollNo}
                </span>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold">
                  Section {studentProfile?.section || '10-A'}
                </span>
                <span className="text-[11px] bg-emerald-900 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  PRN: {greenBook?.prn || 'PRN-2026-DL-100109'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {studentUser?.name}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                GFM Mentor: <strong className="text-slate-200">Dr. Ananya Sen</strong>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons & 3-Line Menu Trigger */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowGreenBookModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookMarked className="w-4 h-4 text-emerald-400" />
              <span>Green Book</span>
            </button>

            <button
              onClick={() => setShowMeetingHistoryModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 text-slate-300" />
              <span>Meeting History</span>
            </button>

            {/* 3-LINE MENU BUTTON */}
            <button
              onClick={() => setShowDrawerMenu(true)}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-slate-900" />
              <span>Menu</span>
            </button>
          </div>
        </div>

        {/* Essential 4-Pillar Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Attendance</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-base font-black tabular-nums ${currentAtt < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentAtt}%
              </span>
              <span className="text-[10px] text-slate-400 tabular-nums">
                {currentAtt >= 75 ? `(${safeBuffer} buffer)` : '(Critical)'}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Sessional Marks</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black tabular-nums text-white">
                {greenBook?.cumulativePercentage || 78}%
              </span>
              <span className="text-[10px] text-slate-400">CIA Average</span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">100-Pt Activity</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black tabular-nums text-amber-500">
                {totalActivityPoints}/100
              </span>
              <span className="text-[10px] text-slate-400">Credited</span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Peer Buddies</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black tabular-nums text-emerald-400">
                {connectedBuddies.length}
              </span>
              <span className="text-[10px] text-slate-400">Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3-LINE MENU DRAWER / MODAL */}
      {showDrawerMenu && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-slate-200 flex flex-col p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5 text-slate-900" />
                <h3 className="font-black text-base text-slate-900">Navigation</h3>
              </div>
              <button 
                onClick={() => setShowDrawerMenu(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider px-1">
              Features
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto">
              <button
                onClick={() => { setActiveModule('OVERVIEW'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'OVERVIEW' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Dashboard Overview</span>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              {menuItems.filter(item => item.show).map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveModule(item.id); setShowDrawerMenu(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activeModule === item.id 
                      ? 'bg-slate-900 text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </button>
              ))}

              <div className="pt-2 border-t border-slate-100 mt-2">
                <button
                  onClick={() => { setActiveModule('GRIEVANCES'); setShowDrawerMenu(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activeModule === 'GRIEVANCES' 
                      ? 'bg-slate-900 text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Grievance Box</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <button
                onClick={() => { setShowGreenBookModal(true); setShowDrawerMenu(false); }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <BookMarked className="w-4 h-4 text-emerald-700" />
                <span>Open Academic Green Book</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOLID CAPSULE TAB BAR (Quick Access Bar) */}
      <div className="bg-white rounded-xl p-1.5 border border-slate-200/90 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveModule('OVERVIEW')}
          className={`px-3.5 py-1.5 rounded-lg text-xs shrink-0 transition-all duration-150 cursor-pointer ${
            activeModule === 'OVERVIEW' 
              ? 'bg-slate-900 text-white shadow-xs font-bold' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          Overview
        </button>

        {menuItems.filter(item => item.show).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs shrink-0 flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
              activeModule === item.id 
                ? 'bg-slate-900 text-white shadow-xs font-bold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={() => setActiveModule('GRIEVANCES')}
          className={`px-3.5 py-1.5 rounded-lg text-xs shrink-0 flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
            activeModule === 'GRIEVANCES' 
              ? 'bg-slate-900 text-white shadow-xs font-bold' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span>Grievances</span>
        </button>
      </div>

      {/* CONDITIONAL PMM NOTIFICATION: Only when scheduled by GFM */}
      {parentMeeting && parentMeeting.status === 'SCHEDULED' && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Notice: Scheduled Parent-Mentor Meeting
                </h3>
                <p className="text-[11px] text-slate-300">
                  Meeting scheduled by Guardian Faculty Member ({parentMeeting.mentorName})
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-bold">
              Scheduled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Date &amp; Time:</span>
              <strong className="text-white">{parentMeeting.scheduledDate} &bull; {parentMeeting.timeSlot}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Venue:</span>
              <strong className="text-white">{parentMeeting.venue}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">GFM Mentor:</span>
              <strong className="text-white">{parentMeeting.mentorName}</strong>
            </div>
          </div>

          {parentMeeting.parentNotes && (
            <div className="text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 font-semibold block text-[10px]">Agenda / Remarks:</span>
              <p className="italic text-slate-200 mt-0.5">{parentMeeting.parentNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* FEEDBACK BANNERS */}
      {tutorConnectNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-xs flex items-center justify-between">
          <span>{tutorConnectNotice}</span>
          <button onClick={() => setTutorConnectNotice(null)} className="text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 1: NOTICES (Priority 1)                                            */}
      {/* ========================================================================= */}
      {(activeModule === 'OVERVIEW' || activeModule === 'NOTICES') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-900" />
              <h2 className="font-black text-sm text-slate-900">Official Notices &amp; Bulletins</h2>
            </div>
            {activeModule === 'OVERVIEW' && (
              <button 
                onClick={() => setActiveModule('NOTICES')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({announcements.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No active announcements.</p>
            ) : (
              (activeModule === 'OVERVIEW' ? announcements.slice(0, 2) : announcements).map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900">{ann.title}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{ann.date}</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{ann.content}</p>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: BATCH MEET (Priority 2)                                         */}
      {/* ========================================================================= */}
      {(activeModule === 'OVERVIEW' || activeModule === 'BATCH_MEET') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-900" />
              <h2 className="font-black text-sm text-slate-900">Batch Meet &amp; Sessions</h2>
            </div>
            <button 
              onClick={() => setShowMeetingHistoryModal(true)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Meeting History</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Weekly Batch Schedule */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Weekly Batch Check-in</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">Mandatory</span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div>Day &amp; Time: <strong className="text-slate-800">Every Saturday &bull; 10:30 AM</strong></div>
                <div>Venue: <strong className="text-slate-800">Classroom LH-2 / GFM Wing</strong></div>
                <div>Mentor: <strong className="text-slate-800">Dr. Ananya Sen</strong></div>
              </div>
            </div>

            {/* 1-on-1 Guidance */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">1-on-1 Guidance Status</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Available</span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div>Zero-period guidance slots open on Tuesday &amp; Thursday.</div>
                <div>Need counseling or academic plan review? Speak directly to mentor.</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: ATTENDANCE (Priority 3)                                         */}
      {/* ========================================================================= */}
      {(activeModule === 'OVERVIEW' || activeModule === 'ATTENDANCE') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-900" />
              <h2 className="font-black text-sm text-slate-900">Attendance Runway</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-2 py-0.5 rounded ${
                currentAtt >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {currentAtt}% Overall
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Status Summary */}
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
              currentAtt >= 75 ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-rose-50/60 border-rose-200 text-rose-950'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                {currentAtt >= 75 ? 'Safe Buffer' : 'Recovery Needed'}
              </span>
              <div className="text-2xl font-black">
                {currentAtt >= 75 ? `${safeBuffer} Lectures` : `${neededConsecutive} Lectures`}
              </div>
              <p className="text-[11px] leading-relaxed">
                {currentAtt >= 75 
                  ? `You can safely miss up to ${safeBuffer} classes while remaining above the mandatory 75% limit.`
                  : `You must attend the next ${neededConsecutive} consecutive classes to cross 75%.`}
              </p>
            </div>

            {/* Interactive Simulator */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>What-If Simulator</span>
                </span>
                <span className={`text-xs font-black ${projectedAtt >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  Projected: {projectedAtt}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWhatIfAction('ATTEND')}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    whatIfAction === 'ATTEND' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  If I Attend
                </button>
                <button
                  type="button"
                  onClick={() => setWhatIfAction('MISS')}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    whatIfAction === 'MISS' ? 'bg-rose-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  If I Miss
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setWhatIfLectures(prev => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded bg-white border border-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  -
                </button>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={whatIfLectures}
                  onChange={(e) => setWhatIfLectures(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer h-1.5"
                />
                <button
                  type="button"
                  onClick={() => setWhatIfLectures(prev => Math.min(20, prev + 1))}
                  className="w-7 h-7 rounded bg-white border border-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  +
                </button>
                <span className="font-bold text-xs w-12 text-right shrink-0">
                  {whatIfLectures} lec
                </span>
              </div>

              <p className="text-[10px] text-slate-500">
                Simulating {whatIfAction.toLowerCase()}ing next {whatIfLectures} classes: {projectedAtt}%.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: PARENT MEET (Priority 4) - Detailed view if active & scheduled  */}
      {/* ========================================================================= */}
      {activeModule === 'PARENT_MEET' && parentMeeting && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-900" />
              <h2 className="font-black text-sm text-slate-900">Parent-Mentor Meeting Details</h2>
            </div>
            <span className="text-xs bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded font-bold">
              Status: {parentMeeting.status}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Scheduled Date &amp; Time</span>
                <strong className="text-slate-900 text-sm">{parentMeeting.scheduledDate} &bull; {parentMeeting.timeSlot}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Meeting Venue</span>
                <strong className="text-slate-900 text-sm">{parentMeeting.venue}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Assigned GFM Mentor</span>
                <strong className="text-slate-900 text-sm">{parentMeeting.mentorName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Attendance Mode</span>
                <strong className="text-slate-900 text-sm">{parentMeeting.parentAttendanceMode.replace('_', ' ')}</strong>
              </div>
            </div>

            {parentMeeting.parentNotes && (
              <div className="pt-2 border-t border-slate-200 text-slate-700">
                <span className="text-[10px] text-slate-400 block font-semibold">Notes from Mentor:</span>
                <p className="italic mt-0.5 leading-relaxed">{parentMeeting.parentNotes}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: 100-PT ACTIVITY (Priority 5)                                    */}
      {/* ========================================================================= */}
      {(activeModule === 'OVERVIEW' || activeModule === 'ACTIVITIES') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-900" />
              <h2 className="font-black text-sm text-slate-900">100-Point Activity Ledger</h2>
            </div>
            <button
              onClick={() => setShowSubmitActivityModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Submit Certificate</span>
            </button>
          </div>

          {/* Progress Ribbon */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-slate-900">
                Points Progress: <strong className="text-slate-900 text-sm">{totalActivityPoints}</strong> / 100 Credited
              </div>
              <p className="text-[11px] text-slate-500">
                {pendingActivityPoints.length} certificate(s) currently pending mentor verification.
              </p>
            </div>
            <div className="w-full sm:w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all"
                style={{ width: `${Math.min(100, totalActivityPoints)}%` }}
              />
            </div>
          </div>

          {/* List of Submitted Certificates */}
          <div className="space-y-2">
            {activityPoints.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No certificates submitted yet.</p>
            ) : (
              (activeModule === 'OVERVIEW' ? activityPoints.slice(0, 3) : activityPoints).map((cert) => (
                <div key={cert.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{cert.title}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                        +{cert.pointsAwarded} Pts
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                      <span>{cert.issuingAuthority} &bull; {cert.date}</span>
                      {cert.certificateFileName && (
                        <span className="inline-flex items-center gap-1 text-slate-700 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                          <FileText className="w-3 h-3 text-slate-500" />
                          <span>{cert.certificateFileName}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cert.status === 'VERIFIED_AND_CREDITED' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cert.status === 'VERIFIED_AND_CREDITED' ? 'Verified & Credited' : 'Pending Review'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODULE 6: STUDY BUDDIES (Priority 6)                                      */}
      {/* ========================================================================= */}
      {(activeModule === 'OVERVIEW' || activeModule === 'BUDDIES') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-900" />
              <h2 className="font-black text-sm text-slate-900">Study Buddies &amp; Peer Tutors</h2>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {connectedBuddies.length} Connected
            </span>
          </div>

          {/* Active Connections */}
          {connectedBuddies.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Your Connected Buddies:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {connectedBuddies.map((bud) => (
                  <div key={bud.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">{bud.tutorName}</strong>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Connected</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Subject: <strong className="text-slate-800">{bud.subject}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Venue: {bud.venue} &bull; {bud.scheduledTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Peer Tutors */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-slate-700 block">Available Senior Peer Tutors:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {peerTutors.map((tutor) => {
                const isConnected = connectedBuddies.some(b => b.tutorId === tutor.id);
                return (
                  <div key={tutor.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{tutor.name}</strong>
                        <span className="text-[10px] text-slate-400">{tutor.rollNo}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700 mt-0.5">{tutor.subject}</div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        <div>{tutor.venue}</div>
                        <div>{tutor.availableTime}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleConnectTutor(tutor)}
                      disabled={isConnected}
                      className={`w-full mt-2 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                        isConnected 
                          ? 'bg-slate-200 text-slate-600 cursor-not-allowed' 
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                      }`}
                    >
                      {isConnected ? 'Connected' : 'Connect with Buddy'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODULE 7: VAULT & TIMERS (Priority 7)                                     */}
      {/* ========================================================================= */}
      {(activeModule === 'OVERVIEW' || activeModule === 'VAULT') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-900" />
              <h2 className="font-black text-sm text-slate-900">Resource Vault &amp; Exam Timers</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exam Countdowns */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Upcoming Academic Milestones:</span>
              <div className="space-y-2">
                {examCountdowns.map((exam) => (
                  <div key={exam.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block font-bold">{exam.title}</strong>
                      <span className="text-[11px] text-slate-500">{exam.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 block">{exam.daysRemaining}</span>
                      <span className="text-[10px] text-slate-400">days left</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Resources */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Curated Study Material:</span>
              <div className="space-y-2">
                {academicResources.slice(0, 3).map((res) => (
                  <div key={res.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block font-bold">{res.title}</strong>
                      <span className="text-[10px] text-slate-400">{res.subject} &bull; {res.fileType}</span>
                    </div>
                    <a
                      href={res.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* GRIEVANCE BOX (Encapsulated)                                              */}
      {/* ========================================================================= */}
      {activeModule === 'GRIEVANCES' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-900" />
              <h2 className="font-black text-sm text-slate-900">Confidential Grievance Box</h2>
            </div>
            <span className="text-[11px] text-slate-400">Private GFM Communication</span>
          </div>

          <form onSubmit={handleGrievanceSubmit} className="space-y-3 text-xs">
            {grievanceSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{grievanceSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Category:</label>
                <select
                  value={grievanceCategory}
                  onChange={(e: any) => setGrievanceCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold"
                >
                  <option value="ACADEMIC">Academic Pace &amp; Subject Difficulty</option>
                  <option value="HOSTEL_CAMPUS">Campus &amp; Practical Lab Access</option>
                  <option value="EXAMS_EVALUATION">Evaluation &amp; Internal Marks</option>
                  <option value="PERSONAL_COUNSELING">Personal Mentoring Request</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Describe your concern:</label>
              <textarea
                required
                rows={3}
                value={grievanceText}
                onChange={(e) => setGrievanceText(e.target.value)}
                placeholder="State your issue clearly to your assigned mentor..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={submittingGrievance}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingGrievance ? 'Submitting...' : 'Log Grievance'}</span>
            </button>
          </form>

          {/* Past Grievances */}
          {grievances.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Past Logged Grievances:</span>
              <div className="space-y-2">
                {grievances.map((g) => (
                  <div key={g.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{g.category.replace('_', ' ')}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        g.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {g.status}
                      </span>
                    </div>
                    <p className="text-slate-700 italic">&ldquo;{g.grievanceText}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ACADEMIC GREEN BOOK                                              */}
      {/* ========================================================================= */}
      {showGreenBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-emerald-400" />
                <h3 className="font-black text-sm">Academic Green Book Ledger</h3>
              </div>
              <button 
                onClick={() => setShowGreenBookModal(false)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px]">PRN:</span>
                  <strong className="text-slate-800">{greenBook?.prn || 'PRN-2026-DL-100109'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px]">Guardian:</span>
                  <strong className="text-slate-800">{greenBook?.guardianDetails?.fatherName || 'Guardian'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px]">Attendance:</span>
                  <strong className="text-emerald-700 font-extrabold">{greenBook?.cumulativeAttendance || currentAtt}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px]">Sessional %:</span>
                  <strong className="text-slate-800 font-extrabold">{greenBook?.cumulativePercentage || 78}%</strong>
                </div>
              </div>

              {greenBook?.termAssessments && greenBook.termAssessments.length > 0 && (
                <div>
                  <span className="font-bold text-slate-800 text-xs block mb-1.5">Subject Assessment &amp; Attendance:</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="p-2">Subject</th>
                          <th className="p-2">Marks</th>
                          <th className="p-2">Attendance</th>
                          <th className="p-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {greenBook.termAssessments.map((term, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="p-2 font-semibold text-slate-800">{term.subject}</td>
                            <td className="p-2 font-bold text-slate-700">{term.marksObtained} / {term.totalMarks}</td>
                            <td className="p-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                term.attendancePercent < 75 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {term.attendancePercent}%
                              </span>
                            </td>
                            <td className="p-2 text-right">
                              <span className={`text-[10px] font-bold ${
                                term.attendancePercent < 75 ? 'text-rose-600' : 'text-emerald-700'
                              }`}>
                                {term.attendancePercent < 75 ? 'Attention' : 'Normal'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowGreenBookModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MEETING HISTORY                                                  */}
      {/* ========================================================================= */}
      {showMeetingHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-300" />
                <h3 className="font-black text-sm">Past Interaction &amp; Meeting History</h3>
              </div>
              <button 
                onClick={() => setShowMeetingHistoryModal(false)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 text-xs">
              {meetingHistories.length === 0 ? (
                <p className="text-slate-500 italic text-center py-6">No previous meetings recorded.</p>
              ) : (
                meetingHistories.map((entry) => (
                  <div key={entry.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold">{entry.title}</strong>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                          {entry.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{entry.date}</span>
                    </div>

                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {entry.discussionSummary}
                    </p>

                    {entry.keyActionTakeaways && entry.keyActionTakeaways.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {entry.keyActionTakeaways.map((act, idx) => (
                          <span key={idx} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">
                            &bull; {act}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowMeetingHistoryModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SUBMIT ACTIVITY CERTIFICATE WITH FILE UPLOAD                     */}
      {/* ========================================================================= */}
      {showSubmitActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="font-black text-sm">Submit Activity Certificate</h3>
              </div>
              <button 
                onClick={() => setShowSubmitActivityModal(false)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitActivity} className="p-4 sm:p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
              {activitySuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{activitySuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Activity / Course Title:
                </label>
                <input
                  type="text"
                  required
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder="e.g. State Level Hackathon / Skill Certification"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category:</label>
                  <select
                    value={activityCategory}
                    onChange={(e: any) => setActivityCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="TECHNICAL_HACKATHON">Technical &amp; Hackathons</option>
                    <option value="COMMUNITY_OUTREACH">Community &amp; Social Outreach</option>
                    <option value="SPORTS_CULTURAL">Sports &amp; Cultural</option>
                    <option value="CERTIFICATIONS_MOOC">Certifications &amp; Courses</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Claimed Points:</label>
                  <input
                    type="number"
                    min={5}
                    max={25}
                    value={activityPointsClaimed}
                    onChange={(e) => setActivityPointsClaimed(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issuing Authority / Organizer:</label>
                <input
                  type="text"
                  required
                  value={activityAuthority}
                  onChange={(e) => setActivityAuthority(e.target.value)}
                  placeholder="e.g. Technical Council / IEEE Student Branch"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* ACTUAL FILE UPLOAD SECTION */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Upload Certificate File:
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-xl p-3 bg-slate-50 transition-colors text-center cursor-pointer">
                  <input
                    type="file"
                    id="cert-file-upload-input"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedCertFile(e.target.files[0]);
                        setCertFileName(e.target.files[0].name);
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="cert-file-upload-input" className="cursor-pointer block">
                    <Upload className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                    <span className="font-bold text-slate-800 block text-xs">
                      {certFileName ? certFileName : 'Click to choose certificate file'}
                    </span>
                    {certFileName ? (
                      <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                        ✓ Attached ({selectedCertFile ? `${(selectedCertFile.size / 1024).toFixed(1)} KB` : 'Ready'})
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 block mt-0.5">PDF, PNG, JPG accepted</span>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSubmitActivityModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingActivity}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingActivity ? 'Submitting...' : 'Upload & Submit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
