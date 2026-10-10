'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Phone, 
  Send, 
  BookMarked, 
  FileSpreadsheet, 
  ChevronRight, 
  UserCheck, 
  UserX, 
  User, 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  Building2, 
  ExternalLink,
  GraduationCap,
  Award,
  Check,
  Eye,
  Info,
  X,
  XCircle,
  Trash2,
  ArrowRight,
  Megaphone,
  Bell,
  Share2,
  Forward,
  Radio,
  History,
  FileText,
  MapPin,
  BookOpen,
  ShieldCheck,
  Menu,
  TrendingUp
} from 'lucide-react';
import { 
  MenteeProfile, 
  MentorshipGroup, 
  StudentGrievance, 
  GfmAnnouncement, 
  GfmOneOnOneSession,
  AcademicGreenBookDetails,
  AuthorityReport,
  MeetingHistoryEntry,
  ActivityPointRecord,
  BuddyConnectionRecord,
  ParentMeetingSchedule,
  PeerTutor
} from '@/types/mentorship';

export default function GfmMentorPage() {
  const router = useRouter();

  const [activeMentor, setActiveMentor] = useState<{
    id: string;
    name: string;
  }>({
    id: 'mentor-3',
    name: 'Dr. Ananya Sen'
  });

  const [groups, setGroups] = useState<MentorshipGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('group-10a-general');
  const [mentees, setMentees] = useState<MenteeProfile[]>([]);
  const [grievances, setGrievances] = useState<StudentGrievance[]>([]);
  const [oneOnOnes, setOneOnOnes] = useState<GfmOneOnOneSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Encapsulated Navigation Modules & Drawer
  type MentorModule = 'OVERVIEW' | 'NOTICES' | 'BATCH_MEET' | 'ATTENDANCE' | 'PARENT_MEET' | 'ACTIVITIES' | 'BUDDIES' | 'ROSTER' | 'GRIEVANCES';
  const [activeModule, setActiveModule] = useState<MentorModule>('OVERVIEW');
  const [showDrawerMenu, setShowDrawerMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('ROSTER');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH_RISK' | 'HEALTHY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Batch Announcement & Broadcast State
  const [announcements, setAnnouncements] = useState<GfmAnnouncement[]>([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementCategory, setAnnouncementCategory] = useState<'GENERAL' | 'FORWARDED' | 'EXAM' | 'ATTENDANCE' | 'WELFARE'>('GENERAL');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementSubmitting, setAnnouncementSubmitting] = useState(false);
  const [announcementSuccessMsg, setAnnouncementSuccessMsg] = useState<string | null>(null);

  // Weekly Meeting Conduct Modal & Attendance Roster
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('Weekly GFM Academic & Welfare Batch Check-in');
  const [meetingVenue, setMeetingVenue] = useState('Classroom LH-2 / Zero Period');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingTime, setMeetingTime] = useState('08:15 AM - 08:50 AM');
  const [meetingAgenda, setMeetingAgenda] = useState('Unit test review, low attendance counseling, and on-device grievance logging.');
  const [attendanceRoster, setAttendanceRoster] = useState<{ [studentId: string]: 'PRESENT' | 'ABSENT' }>({});
  const [meetingSubmitting, setMeetingSubmitting] = useState(false);
  const [meetingSuccessMsg, setMeetingSuccessMsg] = useState<string | null>(null);

  // 1-on-1 Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMenteeForInvite, setSelectedMenteeForInvite] = useState<MenteeProfile | null>(null);
  const [inviteMessage, setInviteMessage] = useState('Please meet me during the guidance period to review your recent test marks and syllabus pacing.');
  const [inviteScheduledAt, setInviteScheduledAt] = useState(new Date().toISOString().split('T')[0]);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  // Grievance Feedback Modal
  const [selectedGrievance, setSelectedGrievance] = useState<StudentGrievance | null>(null);
  const [resolutionFeedback, setResolutionFeedback] = useState('');
  const [resolvingGrievance, setResolvingGrievance] = useState(false);

  // Green Book Preview Modal
  const [previewGreenBook, setPreviewGreenBook] = useState<{ student: MenteeProfile; details: AcademicGreenBookDetails } | null>(null);
  const [loadingGreenBook, setLoadingGreenBook] = useState(false);

  // Authority Report Submission Modal
  const [showAuthorityModal, setShowAuthorityModal] = useState(false);
  const [authDivision, setAuthDivision] = useState('Div-B');
  const [authBatch, setAuthBatch] = useState('Batch-2');
  const [authYear, setAuthYear] = useState('2026-27');
  const [authRemarks, setAuthRemarks] = useState('All 1-on-1 interventions completed for high-risk students. Sessional attendance warnings issued.');
  const [submittingAuthReport, setSubmittingAuthReport] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Parent Absence Alert Modal State (Feature 2)
  const [showParentAlertModal, setShowParentAlertModal] = useState(false);
  const [selectedMenteeForAlert, setSelectedMenteeForAlert] = useState<MenteeProfile | null>(null);
  const [alertCustomMessage, setAlertCustomMessage] = useState('');
  const [sendingParentAlert, setSendingParentAlert] = useState(false);
  const [parentAlertSuccessMsg, setParentAlertSuccessMsg] = useState<string | null>(null);

  // Meeting History Modal State (Feature 3)
  const [showMeetingHistoryModal, setShowMeetingHistoryModal] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<MenteeProfile | null>(null);
  const [meetingHistories, setMeetingHistories] = useState<MeetingHistoryEntry[]>([]);
  const [loadingMeetingHistories, setLoadingMeetingHistories] = useState(false);

  // Student Detail Modal & AI Analysis & Inline Green Book
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<MenteeProfile | null>(null);
  const [showStudentDetailModal, setShowStudentDetailModal] = useState(false);
  const [studentModalTab, setStudentModalTab] = useState<'GREEN_BOOK' | 'ACTIVITIES' | 'BUDDY_SYSTEM' | 'MEETINGS' | 'PARENT_MEET' | 'GRIEVANCES'>('GREEN_BOOK');
  const [studentGreenBook, setStudentGreenBook] = useState<AcademicGreenBookDetails | null>(null);
  const [loadingStudentGreenBook, setLoadingStudentGreenBook] = useState(false);
  
  // Student-specific data loaded strictly for the clicked student:
  const [studentActivityPoints, setStudentActivityPoints] = useState<ActivityPointRecord[]>([]);
  const [loadingStudentActivityPoints, setLoadingStudentActivityPoints] = useState(false);
  const [studentBuddyConnections, setStudentBuddyConnections] = useState<BuddyConnectionRecord[]>([]);
  const [loadingStudentBuddies, setLoadingStudentBuddies] = useState(false);
  const [studentMeetingHistoryList, setStudentMeetingHistoryList] = useState<MeetingHistoryEntry[]>([]);
  const [loadingStudentMeetingHistory, setLoadingStudentMeetingHistory] = useState(false);
  const [studentGrievancesList, setStudentGrievancesList] = useState<StudentGrievance[]>([]);
  const [studentParentMeeting, setStudentParentMeeting] = useState<ParentMeetingSchedule | null>(null);
  const [verifyingPointId, setVerifyingPointId] = useState<string | null>(null);
  const [verifySuccessNotice, setVerifySuccessNotice] = useState<string | null>(null);
  const [peerTutorsList, setPeerTutorsList] = useState<PeerTutor[]>([]);
  const [showAssignBuddyInline, setShowAssignBuddyInline] = useState(false);
  const [assigningBuddy, setAssigningBuddy] = useState(false);

  // Parent-Mentor Meeting scheduling state for GFM
  const [pmmDate, setPmmDate] = useState('2026-10-24');
  const [pmmTime, setPmmTime] = useState('10:30 AM - 11:00 AM');
  const [pmmVenue, setPmmVenue] = useState('Classroom LH-2 / GFM Cabin');
  const [pmmNotes, setPmmNotes] = useState('Mid-semester academic progress review and attendance discussion.');
  const [schedulingPmm, setSchedulingPmm] = useState(false);
  const [pmmNotice, setPmmNotice] = useState<string | null>(null);

  const [generatingSuggestion, setGeneratingSuggestion] = useState(false);
  const [mentorSuggestion, setMentorSuggestion] = useState<string | null>(null);
  const [generatingAiReport, setGeneratingAiReport] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [dataActionNotice, setDataActionNotice] = useState<string | null>(null);
  const [deletingMenteeId, setDeletingMenteeId] = useState<string | null>(null);

  // Helper to map student section to division and batch
  const getStudentDivBatch = (section: string) => {
    if (section?.includes('10')) return { div: 'Div-A', batch: 'Batch-1' };
    if (section?.includes('11')) return { div: 'Div-B', batch: 'Batch-2' };
    return { div: 'Div-C', batch: 'Batch-3' };
  };

  // Open Student Modal & Automatically Load ALL Details for this specific student only
  const handleSelectStudent = async (student: MenteeProfile) => {
    setSelectedStudentDetail(student);
    setShowStudentDetailModal(true);
    setStudentModalTab('GREEN_BOOK');
    setMentorSuggestion(null);
    setAiReport(null);
    setVerifySuccessNotice(null);
    setShowAssignBuddyInline(false);
    
    setLoadingStudentGreenBook(true);
    setLoadingStudentActivityPoints(true);
    setLoadingStudentBuddies(true);
    setLoadingStudentMeetingHistory(true);
    setStudentGreenBook(null);
    setStudentActivityPoints([]);
    setStudentBuddyConnections([]);
    setStudentMeetingHistoryList([]);
    setStudentGrievancesList([]);
    setStudentParentMeeting(null);

    try {
      // 1. Green Book
      fetch(`/api/gfm/greenbook?studentId=${student.studentId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data?.greenBook) {
            setStudentGreenBook(json.data.greenBook);
          }
        })
        .catch(err => console.error('Error loading green book:', err))
        .finally(() => setLoadingStudentGreenBook(false));

      // 2. Activity Points & Certificates submitted by this student
      fetch(`/api/gfm/activity-points?studentId=${student.studentId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setStudentActivityPoints(json.data || []);
          }
        })
        .catch(err => console.error('Error loading activity points:', err))
        .finally(() => setLoadingStudentActivityPoints(false));

      // 3. Study Buddy & Peer Tutor connections for this student
      fetch(`/api/gfm/buddy-connect?studentId=${student.studentId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setStudentBuddyConnections(json.data || []);
          }
        })
        .catch(err => console.error('Error loading buddy connections:', err))
        .finally(() => setLoadingStudentBuddies(false));

      // 4. Meeting Histories for this student
      fetch(`/api/gfm/meeting-history?studentId=${student.studentId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setStudentMeetingHistoryList(json.data || []);
          }
        })
        .catch(err => console.error('Error loading meeting history:', err))
        .finally(() => setLoadingStudentMeetingHistory(false));

      // 5. Grievances submitted on-device by this student
      fetch(`/api/gfm/grievances?studentId=${student.studentId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setStudentGrievancesList(json.data || []);
          }
        })
        .catch(err => console.error('Error loading student grievances:', err));

      // 6. Parent Meeting schedule for this student
      fetch(`/api/gfm/parent-meeting?studentId=${student.studentId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setStudentParentMeeting(json.data || null);
          }
        })
        .catch(err => console.error('Error loading parent meeting:', err));

    } catch (err) {
      console.error('Error loading student details:', err);
    }
  };

  // Mentor One-Click Certificate Verification Handler
  const handleVerifyCertificate = async (pointId: string) => {
    if (!selectedStudentDetail) return;
    setVerifyingPointId(pointId);
    try {
      const res = await fetch('/api/gfm/activity-points', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentDetail.studentId,
          pointId,
          verifiedBy: activeMentor.name || 'Dr. Ananya Sen (GFM)'
        })
      });
      const json = await res.json();
      if (json.success) {
        setStudentActivityPoints(prev => prev.map(p => p.id === pointId ? json.data : p));
        setVerifySuccessNotice(`✓ Certificate verified! Institutional activity points credited for ${selectedStudentDetail.name}.`);
        setTimeout(() => setVerifySuccessNotice(null), 4000);
      }
    } catch (err) {
      console.error('Error verifying certificate:', err);
    } finally {
      setVerifyingPointId(null);
    }
  };

  // Mentor Assigns Peer Tutor / Study Buddy directly to this student
  const handleAssignBuddyToStudent = async (tutor: PeerTutor) => {
    if (!selectedStudentDetail) return;
    setAssigningBuddy(true);
    try {
      const res = await fetch('/api/gfm/buddy-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentDetail.studentId,
          studentName: selectedStudentDetail.name,
          rollNo: selectedStudentDetail.rollNo,
          tutorId: tutor.id,
          tutorName: tutor.name,
          tutorRollNo: tutor.rollNo,
          subject: tutor.subject,
          venue: tutor.venue,
          scheduledTime: tutor.availableTime,
          contactNote: `GFM mentor allocated peer coaching session for ${selectedStudentDetail.name}.`
        })
      });
      const json = await res.json();
      if (json.success) {
        setStudentBuddyConnections(prev => [json.data, ...prev]);
        setShowAssignBuddyInline(false);
        setVerifySuccessNotice(`✓ Peer tutor ${tutor.name} assigned to ${selectedStudentDetail.name} for ${tutor.subject}.`);
        setTimeout(() => setVerifySuccessNotice(null), 4000);
      }
    } catch (err) {
      console.error('Error assigning peer tutor:', err);
    } finally {
      setAssigningBuddy(false);
    }
  };

  // GFM Schedules Parent-Mentor Meeting (Pushes Notification to Student)
  const handleSchedulePmm = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = selectedStudentDetail || mentees[0];
    if (!targetStudent) return;
    setSchedulingPmm(true);
    setPmmNotice(null);
    try {
      const res = await fetch('/api/gfm/parent-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: targetStudent.studentId,
          scheduledDate: pmmDate,
          timeSlot: pmmTime,
          venue: pmmVenue,
          parentNotes: pmmNotes,
          mentorName: activeMentor.name || 'Dr. Ananya Sen'
        })
      });
      const json = await res.json();
      if (json.success) {
        setStudentParentMeeting(json.data);
        setPmmNotice(`✓ Meeting scheduled on ${pmmDate} (${pmmTime})! Notification pushed to ${targetStudent.name}.`);
        setTimeout(() => setPmmNotice(null), 5000);
      }
    } catch (err) {
      console.error('Error scheduling parent meeting:', err);
    } finally {
      setSchedulingPmm(false);
    }
  };

  const handleCancelPmm = async () => {
    if (!selectedStudentDetail) return;
    try {
      const res = await fetch(`/api/gfm/parent-meeting?studentId=${selectedStudentDetail.studentId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setStudentParentMeeting(null);
        setPmmNotice(`Scheduled meeting cancelled for ${selectedStudentDetail.name}.`);
        setTimeout(() => setPmmNotice(null), 4000);
      }
    } catch (err) {
      console.error('Error cancelling parent meeting:', err);
    }
  };

  useEffect(() => {
    // Check saved user
    const saved = localStorage.getItem('gfm_logged_in_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role === 'MENTOR') {
          setActiveMentor({ id: u.mentorId || 'mentor-3', name: u.name || 'Dr. Ananya Sen' });
        }
      } catch (e) {}
    }

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Groups
      const grpRes = await fetch('/api/mentorship/groups');
      if (grpRes.ok) {
        const grpJson = await grpRes.json();
        if (grpJson.success && grpJson.data?.length > 0) {
          setGroups(grpJson.data);
          setSelectedGroup(grpJson.data[0].id);
        }
      }

      // 2. Mentees
      const mentRes = await fetch('/api/mentorship/mentees');
      if (mentRes.ok) {
        const mentJson = await mentRes.json();
        if (mentJson.success) {
          setMentees(mentJson.data);
          // Initialize attendance roster
          const rosterInit: { [studentId: string]: 'PRESENT' | 'ABSENT' } = {};
          mentJson.data.forEach((m: MenteeProfile) => {
            rosterInit[m.studentId] = 'PRESENT';
          });
          setAttendanceRoster(rosterInit);
        }
      }

      // 3. Grievances
      const grvRes = await fetch('/api/gfm/grievances');
      if (grvRes.ok) {
        const grvJson = await grvRes.json();
        if (grvJson.success) {
          setGrievances(grvJson.data);
        }
      }

      // 4. One-on-Ones
      const oooRes = await fetch('/api/gfm/one-on-one');
      if (oooRes.ok) {
        const oooJson = await oooRes.json();
        if (oooJson.success) {
          setOneOnOnes(oooJson.data);
        }
      }

      // 5. Batch Announcements
      const annRes = await fetch('/api/gfm/announcements');
      if (annRes.ok) {
        const annJson = await annRes.json();
        if (annJson.success) {
          setAnnouncements(annJson.data);
        }
      }

      // 6. Peer Tutors for Study Buddy Allocation
      const acadRes = await fetch('/api/gfm/academics');
      if (acadRes.ok) {
        const acadJson = await acadRes.json();
        if (acadJson.success && acadJson.data?.peerTutors) {
          setPeerTutorsList(acadJson.data.peerTutors);
        }
      }
    } catch (err) {
      console.error('Error loading mentor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // High Risk Classifier: Low Attendance (<75%) OR Low Marks (<50%)
  const isHighRiskStudent = (m: MenteeProfile) => {
    const att = m.academicMetrics.overallAttendance;
    const marks = m.academicMetrics.lastTermPercentage;
    return att < 75 || marks < 50;
  };

  // Filtered Mentees
  const filteredMentees = mentees.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (riskFilter === 'HIGH_RISK') {
      return isHighRiskStudent(m);
    }
    if (riskFilter === 'HEALTHY') {
      return !isHighRiskStudent(m);
    }
    return true;
  });

  const highRiskCount = mentees.filter(m => isHighRiskStudent(m)).length;
  const avgAttendance = mentees.length > 0 
    ? Math.round(mentees.reduce((acc, m) => acc + m.academicMetrics.overallAttendance, 0) / mentees.length)
    : 0;
  const avgMarks = mentees.length > 0
    ? Math.round(mentees.reduce((acc, m) => acc + m.academicMetrics.lastTermPercentage, 0) / mentees.length)
    : 0;

  // Broadcast Announcement / Forward Message to Whole Batch Handler
  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementContent.trim()) return;

    setAnnouncementSubmitting(true);
    setAnnouncementSuccessMsg(null);

    let formattedTitle = announcementTitle.trim();
    if (announcementCategory === 'FORWARDED' && !formattedTitle.toLowerCase().includes('forwarded')) {
      formattedTitle = `[Forwarded] ${formattedTitle}`;
    } else if (announcementCategory === 'EXAM' && !formattedTitle.toLowerCase().includes('exam') && !formattedTitle.toLowerCase().includes('test')) {
      formattedTitle = `[Exam & Syllabus] ${formattedTitle}`;
    } else if (announcementCategory === 'ATTENDANCE' && !formattedTitle.toLowerCase().includes('attendance')) {
      formattedTitle = `[Attendance Alert] ${formattedTitle}`;
    } else if (announcementCategory === 'WELFARE' && !formattedTitle.toLowerCase().includes('guidance')) {
      formattedTitle = `[GFM Guidance] ${formattedTitle}`;
    }

    try {
      const res = await fetch('/api/gfm/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: activeMentor.id,
          mentorName: activeMentor.name,
          batchId: selectedGroup || 'group-10a-general',
          title: formattedTitle,
          content: announcementContent.trim(),
          isMeetingNotice: false
        })
      });

      const json = await res.json();
      if (json.success) {
        setAnnouncements(prev => [json.data, ...prev]);
        setAnnouncementSuccessMsg('✓ Announcement successfully broadcasted to whole batch (Div-B • Batch-2, 36 students)! Live on student notice boards.');
        setDataActionNotice(`Announcement broadcasted to all 36 students in Div-B • Batch-2.`);
        setTimeout(() => {
          setAnnouncementSuccessMsg(null);
          setShowAnnouncementModal(false);
          setAnnouncementTitle('');
          setAnnouncementContent('');
        }, 2200);
      }
    } catch (err) {
      console.error('Error broadcasting announcement:', err);
    } finally {
      setAnnouncementSubmitting(false);
    }
  };

  // Conduct Weekly Meeting Handler
  const handleConductMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setMeetingSubmitting(true);
    setMeetingSuccessMsg(null);

    try {
      // 1. Publish official announcement to batch mentees
      const annRes = await fetch('/api/gfm/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: activeMentor.id,
          mentorName: activeMentor.name,
          batchId: selectedGroup,
          title: meetingTitle,
          content: `${meetingAgenda}. Venue: ${meetingVenue}. Time: ${meetingTime}. All students must attend and record grievances on their device.`,
          isMeetingNotice: true,
          meetingDate,
          meetingTime,
          venue: meetingVenue
        })
      });

      const annJson = await annRes.json();
      const meetingId = annJson.data?.id || 'latest';

      setShowMeetingModal(false);
      // Navigate directly to the dedicated meeting workspace for attendance marking & grievance box
      router.push(`/gfm/meeting/${meetingId}`);
    } catch (err) {
      console.error('Error conducting meeting:', err);
    } finally {
      setMeetingSubmitting(false);
    }
  };

  // Send 1-on-1 Invite Handler
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenteeForInvite) return;

    setSendingInvite(true);
    setInviteSuccessMsg(null);

    try {
      const res = await fetch('/api/gfm/one-on-one', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedMenteeForInvite.studentId,
          mentorId: activeMentor.id,
          inviteMessage: inviteMessage.trim(),
          scheduledAt: inviteScheduledAt
        })
      });

      const json = await res.json();
      if (json.success) {
        setOneOnOnes(prev => [json.data, ...prev]);
        setInviteSuccessMsg(`1-on-1 invitation sent to ${selectedMenteeForInvite.name} (${selectedMenteeForInvite.rollNo}). Notification visible on their device.`);
        setTimeout(() => {
          setInviteSuccessMsg(null);
          setShowInviteModal(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error sending invite:', err);
    } finally {
      setSendingInvite(false);
    }
  };

  // Resolve Grievance Handler
  const handleResolveGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance || !resolutionFeedback.trim()) return;

    setResolvingGrievance(true);
    try {
      const res = await fetch('/api/gfm/grievances', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedGrievance.id,
          feedback: resolutionFeedback.trim()
        })
      });

      const json = await res.json();
      if (json.success) {
        setGrievances(prev => prev.map(g => g.id === selectedGrievance.id ? json.data : g));
        setSelectedGrievance(null);
        setResolutionFeedback('');
      }
    } catch (err) {
      console.error('Error resolving grievance:', err);
    } finally {
      setResolvingGrievance(false);
    }
  };

  // Fetch Green Book Preview
  const handleOpenGreenBookPreview = async (student: MenteeProfile) => {
    setLoadingGreenBook(true);
    try {
      const res = await fetch(`/api/gfm/greenbook?studentId=${student.studentId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setPreviewGreenBook({ student, details: json.data.greenBook });
        }
      }
    } catch (err) {
      console.error('Error previewing green book:', err);
    } finally {
      setLoadingGreenBook(false);
    }
  };

  // Submit Authority Report Handler
  const handleSubmitAuthorityReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAuthReport(true);
    setAuthSuccessMsg(null);

    try {
      const res = await fetch('/api/mentorship/authority-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          division: authDivision,
          batch: authBatch,
          academicYear: authYear,
          mentorId: activeMentor.id,
          mentorName: activeMentor.name,
          mentorRemarks: authRemarks,
          summaryObservations: authRemarks,
          actionPlanForAuthority: 'All high-risk students assigned dedicated 1-on-1 counseling.',
          totalMentees: mentees.length,
          ragBreakdown: {
            green: mentees.filter(m => !isHighRiskStudent(m)).length,
            amber: 0,
            red: highRiskCount
          },
          highRiskStudents: mentees.filter(m => isHighRiskStudent(m)).map(m => ({
            name: m.name,
            rollNo: m.rollNo,
            issue: m.academicMetrics.overallAttendance < 75 
              ? `Attendance ${m.academicMetrics.overallAttendance}% (Below Mandatory 75%)` 
              : `Marks ${m.academicMetrics.lastTermPercentage}% in core subjects`
          }))
        })
      });

      const json = await res.json();
      if (json.success) {
        setAuthSuccessMsg(`Division ${authDivision} Batch ${authBatch} Report submitted directly to Academic Coordinator & Authority.`);
        setTimeout(() => {
          setAuthSuccessMsg(null);
          setShowAuthorityModal(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error submitting authority report:', err);
    } finally {
      setSubmittingAuthReport(false);
    }
  };

  // Student Detail AI Handlers
  const handleGenerateSuggestion = () => {
    if (!selectedStudentDetail) return;
    setGeneratingSuggestion(true);
    setMentorSuggestion(null);
    setTimeout(() => {
      const { academicMetrics, name } = selectedStudentDetail;
      const att = academicMetrics.overallAttendance;
      const marks = academicMetrics.lastTermPercentage;
      const weaks = academicMetrics.weakSubjects || [];

      let suggestion = `Maintain positive reinforcement for ${name}. Performance is on track.`;
      if (att === 0 || marks === 0) {
        suggestion = `Baseline academic metrics were reset. Recommend administering a 20-minute diagnostic check-in and re-entering current attendance and marks.`;
      } else if (att < 75 && marks < 50) {
        suggestion = `Urgent Dual-Intervention: Low attendance (${att}%) combined with critical subject marks (${marks}%). Immediately summon parent counseling, issue an Academic Green Book sessional undertaking, and mandate alternate-day doubt clinics for ${weaks.join(', ') || 'core syllabus'}.`;
      } else if (att < 75) {
        suggestion = `Attendance Defaulter Protocol: Student attendance is ${att}% (below mandatory 75% threshold). Issue official warning letter to parents and schedule daily zero-period attendance reporting with GFM.`;
      } else if (marks < 50) {
        suggestion = `Academic Recovery Plan: Last term marks stand at ${marks}%. Assign a dedicated peer mentor from the batch and allocate 30 minutes weekly practice drills in ${weaks.join(', ') || 'weak subjects'}.`;
      } else if (weaks.length > 0) {
        suggestion = `Subject Remediation: Overall performance is steady (${marks}%), but focused coaching is recommended in ${weaks.join(' & ')}. Provide unit test question banks and formula sheets.`;
      }
      setMentorSuggestion(suggestion);
      setGeneratingSuggestion(false);
    }, 1000);
  };

  const handleGenerateAiReport = () => {
    if (!selectedStudentDetail) return;
    setGeneratingAiReport(true);
    setAiReport(null);
    setTimeout(() => {
      const { name, rollNo, section, academicMetrics } = selectedStudentDetail;
      const att = academicMetrics.overallAttendance;
      const marks = academicMetrics.lastTermPercentage;
      const weaks = academicMetrics.weakSubjects || [];

      const riskLevel = (att < 75 || marks < 50) ? 'HIGH RISK' : (att < 83 || marks < 60) ? 'MODERATE ATTENTION' : 'HEALTHY CADENCE';
      const report = `[ACADEMIC GFM AI ANALYTICS REPORT]\n` +
        `• Mentee: ${name} (Roll: ${rollNo}, ${section})\n` +
        `• Risk Classification: ${riskLevel}\n` +
        `• Current Telemetry: Attendance ${att}% | Term Score: ${marks}%\n` +
        `• Subject Friction Points: ${weaks.length > 0 ? weaks.join(', ') : 'None currently flagged'}\n` +
        `• Predictive Trajectory: ${att < 75 ? 'Risk of board debarment / detention if zero-period attendance is not recovered.' : 'Eligible for end-semester exams with standard continuous internal assessment.'}\n` +
        `• Action Recommendation: Conduct compulsory 1-on-1 every 7 days. Record 30-45s voice summary to seal action points to Academic Green Book.`;

      setAiReport(report);
      setGeneratingAiReport(false);
    }, 1200);
  };

  // Open Parent Absence Alert Modal (Feature 2)
  const handleOpenParentAlert = (mentee: MenteeProfile) => {
    setSelectedMenteeForAlert(mentee);
    const missed = mentee.missingMeetingCount || 2;
    setAlertCustomMessage(
      `Dear Parent, your ward ${mentee.name} (Roll: ${mentee.rollNo}) has missed ${missed} consecutive mandatory weekly GFM batch check-in and 1-on-1 counseling meetings. As per institutional guidelines, regular mentorship attendance is required for semester evaluation. Please contact the Faculty Mentor at your earliest convenience.`
    );
    setShowParentAlertModal(true);
    setParentAlertSuccessMsg(null);
  };

  // Dispatch Parent Alert via API
  const handleSendParentAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenteeForAlert) return;
    setSendingParentAlert(true);
    try {
      const res = await fetch('/api/gfm/parent-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedMenteeForAlert.studentId,
          customMessage: alertCustomMessage
        })
      });
      const json = await res.json();
      if (json.success) {
        setMentees(prev => prev.map(m => m.studentId === selectedMenteeForAlert.studentId ? { ...m, parentAlertIssued: true } : m));
        if (selectedStudentDetail && selectedStudentDetail.studentId === selectedMenteeForAlert.studentId) {
          setSelectedStudentDetail(prev => prev ? { ...prev, parentAlertIssued: true } : null);
        }
        setParentAlertSuccessMsg(`Official absence alert dispatched to parents of ${selectedMenteeForAlert.name}. Recorded in Green Book ledger.`);
        setTimeout(() => {
          setParentAlertSuccessMsg(null);
          setShowParentAlertModal(false);
        }, 2200);
      }
    } catch (err) {
      console.error('Error dispatching parent alert:', err);
    } finally {
      setSendingParentAlert(false);
    }
  };

  // Open Meeting History Modal (Feature 3)
  const handleOpenMeetingHistory = async (student?: MenteeProfile) => {
    setSelectedStudentForHistory(student || null);
    setShowMeetingHistoryModal(true);
    setLoadingMeetingHistories(true);
    try {
      const url = student ? `/api/gfm/meeting-history?studentId=${student.studentId}` : '/api/gfm/meeting-history';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setMeetingHistories(json.data);
        }
      }
    } catch (err) {
      console.error('Error loading meeting histories:', err);
    } finally {
      setLoadingMeetingHistories(false);
    }
  };

  // Delete Individual Student Data with Red Crosses
  const handleDeleteStudentData = async (dataType: 'marks' | 'attendance' | 'weakSubject' | 'all', extraSubject?: string) => {
    if (!selectedStudentDetail) return;

    if (dataType === 'all') {
      await handleDeleteMentee(selectedStudentDetail);
      return;
    }

    const updatedMetrics = { ...selectedStudentDetail.academicMetrics };
    let noticeText = '';

    if (dataType === 'attendance') {
      updatedMetrics.overallAttendance = 0;
      noticeText = `Attendance data cleared for ${selectedStudentDetail.name}.`;
    } else if (dataType === 'marks') {
      updatedMetrics.lastTermPercentage = 0;
      noticeText = `Last term marks record cleared for ${selectedStudentDetail.name}.`;
    } else if (dataType === 'weakSubject' && extraSubject) {
      updatedMetrics.weakSubjects = updatedMetrics.weakSubjects.filter(s => s !== extraSubject);
      noticeText = `Removed "${extraSubject}" from weak subjects.`;
    }

    // Update local state
    const updatedMentee: MenteeProfile = {
      ...selectedStudentDetail,
      academicMetrics: updatedMetrics
    };

    setMentees(prev => prev.map(m => m.studentId === updatedMentee.studentId ? updatedMentee : m));
    setSelectedStudentDetail(updatedMentee);
    setDataActionNotice(noticeText);
    setTimeout(() => setDataActionNotice(null), 4000);

    // Persist to server
    try {
      await fetch('/api/mentorship/mentees', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: updatedMentee.studentId,
          updates: { academicMetrics: updatedMetrics }
        })
      });
    } catch (err) {
      console.error('Error persisting metric update:', err);
    }
  };

  // Delete Mentee completely from Batch Roster
  const handleDeleteMentee = async (student: MenteeProfile) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete mentee record for ${student.name} (${student.rollNo})?`);
    if (!confirmDelete) return;

    setDeletingMenteeId(student.studentId);
    try {
      // Optimistic update
      setMentees(prev => prev.filter(m => m.studentId !== student.studentId && m.id !== student.id));
      if (selectedStudentDetail?.studentId === student.studentId) {
        setShowStudentDetailModal(false);
        setSelectedStudentDetail(null);
      }

      setDataActionNotice(`Mentee ${student.name} (${student.rollNo}) deleted successfully.`);
      setTimeout(() => setDataActionNotice(null), 4000);

      // Call API
      await fetch(`/api/mentorship/mentees?studentId=${student.studentId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Error deleting mentee:', err);
    } finally {
      setDeletingMenteeId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading GFM Mentor Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* SOLID PROFESSIONAL HEADER */}
      <header className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] bg-slate-800 text-amber-400 border border-slate-700 px-2.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                GFM Mentor Cockpit
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded font-semibold">
                Div-B &bull; Batch-2
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded font-normal hidden sm:inline">
                Assigned Cohort
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {activeMentor.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Guardian Faculty Member &bull; Mentoring Batch Roster, Grievance Resolutions &amp; Weekly Meetings
            </p>
          </div>

          {/* Quick Action Buttons & 3-Line Menu Trigger */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Megaphone className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Notice</span>
            </button>

            <button
              onClick={() => setShowMeetingModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-300" />
              <span>Conduct Meeting</span>
            </button>

            <button
              onClick={() => setShowAuthorityModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-slate-300" />
              <span>Authority Report</span>
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

        {/* 4 Essential Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Batch Strength</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black tabular-nums text-white">{mentees.length}</span>
              <span className="text-[10px] text-slate-400">Students</span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">High Risk</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-base font-black tabular-nums ${highRiskCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {highRiskCount}
              </span>
              <span className="text-[10px] text-slate-400">Att &lt; 75%</span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Mean Attendance</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black tabular-nums text-emerald-400">{avgAttendance}%</span>
              <span className="text-[10px] text-slate-400">Cohort Mean</span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Grievances</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black tabular-nums text-white">{grievances.length}</span>
              <span className="text-[10px] text-amber-400">
                ({grievances.filter(g => g.status !== 'RESOLVED').length} Pending)
              </span>
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
                <h3 className="font-black text-base text-slate-900">Mentor Modules</h3>
              </div>
              <button 
                onClick={() => setShowDrawerMenu(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider px-1">
              Cohort Navigation
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

              <button
                onClick={() => { setActiveModule('NOTICES'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'NOTICES' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-4 h-4" />
                  <span>Notices &amp; Broadcasts ({announcements.length})</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveModule('BATCH_MEET'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'BATCH_MEET' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span>Batch Meetings &amp; Huddles</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveModule('ATTENDANCE'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'ATTENDANCE' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Attendance &amp; Defaulters</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveModule('PARENT_MEET'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'PARENT_MEET' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Parent Meet (PMM)</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveModule('ACTIVITIES'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'ACTIVITIES' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4" />
                  <span>100-Pt Activity Approvals</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveModule('BUDDIES'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'BUDDIES' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Study Buddies Network</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveModule('ROSTER'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'ROSTER' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Students Roster ({mentees.length})</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

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
                  <span>Grievances ({grievances.filter(g => g.status !== 'RESOLVED').length})</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <button
                onClick={() => { setShowAuthorityModal(true); setShowDrawerMenu(false); }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Submit Authority Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Notification Banner */}
      {dataActionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{dataActionNotice}</span>
          </div>
          <button onClick={() => setDataActionNotice(null)} className="text-emerald-700 hover:text-emerald-950 font-bold p-1 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SOLID CAPSULE TAB BAR */}
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

        <button
          onClick={() => setActiveModule('NOTICES')}
          className={`px-3.5 py-1.5 rounded-lg text-xs shrink-0 transition-all duration-150 cursor-pointer ${
            activeModule === 'NOTICES'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          Notices ({announcements.length})
        </button>

        <button
          onClick={() => setActiveModule('BATCH_MEET')}
          className={`px-3.5 py-1.5 rounded-lg text-xs shrink-0 transition-all duration-150 cursor-pointer ${
            activeModule === 'BATCH_MEET'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          Batch Meet
        </button>

        <button
          onClick={() => setActiveModule('ATTENDANCE')}
          className={`px-3.5 py-1.5 rounded-lg text-xs shrink-0 transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
            activeModule === 'ATTENDANCE'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          <span>Attendance</span>
          {highRiskCount > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold tabular-nums">
              {highRiskCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveModule('PARENT_MEET')}
          className={`px-3.5 py-1.5 rounded-lg text-xs shrink-0 transition-all duration-150 cursor-pointer ${
            activeModule === 'PARENT_MEET'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          Parent Meet
        </button>

        <button
          onClick={() => setActiveModule('ACTIVITIES')}
          className={`px-3.5 py-1.5 rounded-lg text-xs shrink-0 transition-all duration-150 cursor-pointer ${
            activeModule === 'ACTIVITIES'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          100-Pt Activity
        </button>

        <button
          onClick={() => setActiveModule('BUDDIES')}
          className={`px-3.5 py-1.5 rounded-lg text-xs shrink-0 transition-all duration-150 cursor-pointer ${
            activeModule === 'BUDDIES'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          Study Buddies
        </button>

        <button
          onClick={() => setActiveModule('ROSTER')}
          className={`px-3.5 py-1.5 rounded-lg text-xs shrink-0 transition-all duration-150 cursor-pointer ${
            activeModule === 'ROSTER'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          Students Roster ({mentees.length})
        </button>

        <button
          onClick={() => setActiveModule('GRIEVANCES')}
          className={`px-3.5 py-1.5 rounded-lg text-xs shrink-0 transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
            activeModule === 'GRIEVANCES'
              ? 'bg-slate-900 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          <span>Grievances</span>
          {grievances.filter(g => g.status !== 'RESOLVED').length > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold tabular-nums">
              {grievances.filter(g => g.status !== 'RESOLVED').length}
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
          MODULE 0: COCKPIT OVERVIEW (De-congested Dashboard)
         ========================================================================= */}
      {activeModule === 'OVERVIEW' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Defaulters / Attendance */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Attendance Status</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{avgAttendance}%</span>
                <span className="text-xs text-slate-500">Cohort Mean</span>
              </div>
              <p className="text-xs text-rose-600 font-bold">
                {highRiskCount} students below 75% threshold
              </p>
              <button
                onClick={() => setActiveModule('ATTENDANCE')}
                className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Inspect Attendance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Batch Meetings */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Weekly Batch Huddle</span>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">Zero Period</span>
                <span className="text-xs text-slate-500">LH-2</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1">
                Unit test remedial &amp; guidance
              </p>
              <button
                onClick={() => setActiveModule('BATCH_MEET')}
                className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open Meeting Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Parent Meet (PMM) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Parent-Mentor Meet</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">Mid-Sem</span>
                <span className="text-xs text-slate-500">Cadence</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1">
                Push schedule to student dashboard
              </p>
              <button
                onClick={() => setActiveModule('PARENT_MEET')}
                className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Configure PMM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4. 100-Pt Activity Submissions */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Activity Points</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">100-Pt</span>
                <span className="text-xs text-slate-500">Verification</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1">
                Evaluate certificate attachments
              </p>
              <button
                onClick={() => setActiveModule('ACTIVITIES')}
                className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Verify Certificates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Focus Split: Notices Snapshot & High-Risk Priority Mentees */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Latest Batch Announcements */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Batch Broadcasts</h3>
                  <p className="text-xs text-slate-500">Announcements sent to all mentees in Div-B Batch-2</p>
                </div>
                <button
                  onClick={() => setActiveModule('NOTICES')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {announcements.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 line-clamp-1">{a.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(a.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2">{a.content}</p>
                  </div>
                ))}

                {announcements.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-6">No announcements broadcasted yet.</p>
                )}
              </div>

              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Megaphone className="w-4 h-4 text-emerald-400" />
                <span>Broadcast New Announcement</span>
              </button>
            </div>

            {/* Right: Urgent Priority Mentees (High Risk / Low Attendance) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Priority Student Attention</h3>
                  <p className="text-xs text-slate-500">Mentees requiring academic or attendance intervention</p>
                </div>
                <button
                  onClick={() => {
                    setActiveModule('ROSTER');
                    setRiskFilter('HIGH_RISK');
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  Filter High Risk &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {mentees.slice(0, 4).map((student) => {
                  const isLow = student.academicMetrics.overallAttendance < 75;
                  return (
                    <div key={student.studentId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-500">Roll: {student.rollNo} &bull; Section {student.section}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isLow 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {student.academicMetrics.overallAttendance}% Att
                        </span>
                        <button
                          onClick={() => handleSelectStudent(student)}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-bold text-[11px] hover:bg-slate-800 cursor-pointer"
                        >
                          Dossier
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setActiveModule('ROSTER')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-slate-700" />
                <span>View Full Batch Roster ({mentees.length} Students)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE: ATTENDANCE & DEFAULTER TRACKER
         ========================================================================= */}
      {activeModule === 'ATTENDANCE' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Batch Attendance &amp; Defaulter Tracking</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time monitoring of aggregate lecture attendance against the 75% institutional threshold
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-200">
                  Cohort Mean: {avgAttendance}%
                </span>
              </div>
            </div>

            {/* Critical Defaulters Warning Card */}
            {highRiskCount > 0 && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Critical Attention: {highRiskCount} Students Below 75% Attendance Threshold</span>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    Action Required
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {mentees.filter(m => m.academicMetrics.overallAttendance < 75).map(student => (
                    <div key={student.studentId} className="p-3 bg-white rounded-xl border border-rose-200 shadow-2xs text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900">{student.name}</h4>
                          <span className="text-[11px] text-slate-500 font-mono">Roll: {student.rollNo}</span>
                        </div>
                        <span className="text-rose-600 font-black text-sm bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                          {student.academicMetrics.overallAttendance}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                        <button
                          onClick={() => handleOpenParentAlert(student)}
                          className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg transition-colors text-center cursor-pointer"
                        >
                          Alert Parent
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMenteeForInvite(student);
                            setShowInviteModal(true);
                          }}
                          className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg transition-colors text-center cursor-pointer"
                        >
                          Invite 1-on-1
                        </button>
                        <button
                          onClick={() => handleSelectStudent(student)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Open Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Batch Attendance Roster */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Cohort Attendance Roster</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Attendance %</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {mentees.map(m => {
                      const att = m.academicMetrics.overallAttendance;
                      const isLow = att < 75;
                      return (
                        <tr key={m.studentId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono text-slate-600">{m.rollNo}</td>
                          <td className="p-3 font-bold text-slate-900">{m.name}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${Math.min(100, att)}%` }}
                                />
                              </div>
                              <span className={`font-bold ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>
                                {att}%
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isLow 
                                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {isLow ? 'Defaulter (<75%)' : 'Compliant'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleSelectStudent(m)}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Dossier
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE: PARENT-MENTOR MEET (PMM) */}
      {activeModule === 'PARENT_MEET' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span>Mid-Semester Parent-Mentor Meeting (PMM) Console</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Schedule PMM sessions for batch parents. Scheduling automatically dispatches notification to mentee dashboards.
                </p>
              </div>
            </div>

            {pmmNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pmmNotice}</span>
              </div>
            )}

            {/* PMM Scheduler Form */}
            <form onSubmit={handleSchedulePmm} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Mentee / Student
                </label>
                <select
                  value={selectedStudentDetail?.studentId || (mentees[0]?.studentId || '')}
                  onChange={(e) => {
                    const st = mentees.find(m => m.studentId === e.target.value);
                    if (st) setSelectedStudentDetail(st);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {mentees.map(m => (
                    <option key={m.studentId} value={m.studentId}>
                      {m.name} ({m.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Scheduled Meeting Date
                </label>
                <input
                  type="date"
                  value={pmmDate}
                  onChange={(e) => setPmmDate(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Time Slot
                </label>
                <input
                  type="text"
                  value={pmmTime}
                  onChange={(e) => setPmmTime(e.target.value)}
                  placeholder="e.g. 10:30 AM - 11:00 AM"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={pmmVenue}
                  onChange={(e) => setPmmVenue(e.target.value)}
                  placeholder="e.g. Classroom LH-2 / GFM Cabin"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Agenda Notes &amp; Topics for Parent Consultation
                </label>
                <textarea
                  value={pmmNotes}
                  onChange={(e) => setPmmNotes(e.target.value)}
                  rows={2}
                  placeholder="Discussion points regarding attendance, unit test sessional marks, and academic progress..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={schedulingPmm}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{schedulingPmm ? 'Pushing Schedule...' : 'Schedule PMM & Push Notification to Student'}</span>
                </button>
              </div>
            </form>

            {/* Info note */}
            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs space-y-1">
              <span className="font-bold block">Institutional PMM Protocol:</span>
              <p className="text-slate-600 leading-relaxed">
                Parent-Mentor Meetings are conducted once per semester (mid-term). The notification will immediately appear on the student&apos;s dashboard without requiring guardian signature paperwork.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE: 100-POINT ACTIVITY APPROVALS */}
      {activeModule === 'ACTIVITIES' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>100-Point Activity Approval Ledger</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Inspect submitted certificates, verify issuing authorities and proof file attachments, and credit approved points
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mentees.map(student => (
                <div key={student.studentId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">Roll: {student.rollNo}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200 text-[11px]">
                      Activity Ledger
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    View student&apos;s claimed points, verify attached certificate PDF, and credit points towards their 100-point total.
                  </p>

                  <button
                    onClick={() => {
                      handleSelectStudent(student);
                      setStudentModalTab('ACTIVITIES');
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inspect Certificates &amp; Verify</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE: STUDY BUDDIES NETWORK */}
      {activeModule === 'BUDDIES' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>Study Buddies &amp; Peer Tutor Network</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Peer academic tutoring network linking batch students for unit test preparation and remedial clinic assistance
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {peerTutorsList.map(tutor => (
                <div key={tutor.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{tutor.name}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">Roll: {tutor.rollNo}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[10px]">
                      Peer Mentor
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-700 text-[11px]">
                    <div>Subject: <strong className="text-slate-900">{tutor.subject}</strong></div>
                    <div>Venue: <strong className="text-slate-900">{tutor.venue}</strong></div>
                    <div>Hours: <strong className="text-slate-900">{tutor.availableTime}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE: BATCH STUDENTS ROSTER */}
      {activeModule === 'ROSTER' && (
        <div className="space-y-4">
          {/* Risk Classification Quick Filter for Roster */}
          <div className="flex items-center justify-between gap-2 text-xs overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-slate-500 font-semibold text-[11px] shrink-0">Filter:</span>
              <button
                onClick={() => setRiskFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  riskFilter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({mentees.length})
              </button>
              <button
                onClick={() => setRiskFilter('HIGH_RISK')}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  riskFilter === 'HIGH_RISK' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>High Risk ({highRiskCount})</span>
              </button>
              <button
                onClick={() => setRiskFilter('HEALTHY')}
                className={`px-3 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  riskFilter === 'HEALTHY' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                Healthy ({mentees.length - highRiskCount})
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search mentee by name or roll number (e.g. 10A-01, Aarav, Karan)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap self-end sm:self-center">
              Showing {filteredMentees.length} of {mentees.length} mentees
            </span>
          </div>

          {/* DESKTOP TABLE VIEW (hidden on mobile, visible on md+) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Roll &amp; Mentee Name</th>
                    <th className="p-4">Attendance Status</th>
                    <th className="p-4">Marks &amp; Performance</th>
                    <th className="p-4">Risk Classification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMentees.map((m) => {
                    const isHigh = isHighRiskStudent(m);
                    const att = m.academicMetrics.overallAttendance;
                    const marks = m.academicMetrics.lastTermPercentage;

                    return (
                      <tr 
                        key={m.id} 
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        onClick={() => handleSelectStudent(m)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isHigh ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {m.rollNo.split('-')[1] || m.rollNo.slice(-2)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{m.name}</div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium mt-0.5">
                                <span className="font-semibold text-slate-700">Roll: {m.rollNo}</span>
                                <span className="text-slate-300">&bull;</span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                                  {getStudentDivBatch(m.section).div} &bull; {getStudentDivBatch(m.section).batch}
                                </span>
                                <span className="text-slate-300">&bull;</span>
                                <span className="text-slate-400">{m.section}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-baseline gap-1.5">
                            <span className={`font-extrabold text-sm ${
                              att < 75 ? 'text-rose-600' : att < 83 ? 'text-amber-600' : 'text-emerald-700'
                            }`}>
                              {att}%
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm ${
                              att < 75 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {att < 75 ? 'Defaulter' : 'Normal'}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-baseline gap-1.5">
                            <span className={`font-extrabold text-sm ${
                              marks < 50 ? 'text-rose-600' : 'text-slate-800'
                            }`}>
                              {marks}%
                            </span>
                            <span className="text-[10px] text-slate-400">Term Score</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="space-y-1">
                            {isHigh ? (
                              <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full font-bold text-[11px]">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                <span>High Risk Alert</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-[11px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Healthy Cadence</span>
                              </span>
                            )}

                            {(m.missingMeetingCount || 0) >= 2 && (
                              <div>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  m.parentAlertIssued 
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                    : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                                }`}>
                                  <Phone className="w-2.5 h-2.5" />
                                  <span>Missed {m.missingMeetingCount} Meets {m.parentAlertIssued ? '(Alerted)' : '(Needs Parent Alert)'}</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {(m.missingMeetingCount || 0) >= 2 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenParentAlert(m);
                                }}
                                className={`h-8 px-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                                  m.parentAlertIssued
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                                }`}
                                title="Dispatch Parent Truancy Alert via SMS / Portal"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>{m.parentAlertIssued ? 'Alert Sent' : 'Alert Parents'}</span>
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMenteeForInvite(m);
                                setShowInviteModal(true);
                              }}
                              className="h-8 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Send 1-on-1 Session Invite"
                            >
                              <Send className="w-3.5 h-3.5 text-emerald-700" />
                              <span>1-1 Invite</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectStudent(m);
                              }}
                              className="h-8 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                              title="View complete student profile, submitted certificates, and Green Book"
                            >
                              <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Profile &amp; Certs</span>
                            </button>

                            <Link
                              href={`/gfm/session/${m.studentId}`}
                              onClick={(e) => e.stopPropagation()}
                              className="h-8 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                              title="Start Live 1-on-1 Guidance"
                            >
                              <User className="w-3.5 h-3.5" />
                              <span>Start 1-1</span>
                            </Link>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMentee(m);
                              }}
                              disabled={deletingMenteeId === m.studentId}
                              className="h-8 w-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                              title={`Delete ${m.name} from batch roster`}
                            >
                              <X className="w-3.5 h-3.5 text-rose-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS VIEW (visible on mobile < md, hidden on md+) */}
          <div className="md:hidden space-y-3">
            {filteredMentees.map((m) => {
              const isHigh = isHighRiskStudent(m);
              const att = m.academicMetrics.overallAttendance;
              const marks = m.academicMetrics.lastTermPercentage;

              return (
                <div 
                  key={m.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer active:scale-[0.99]"
                  onClick={() => handleSelectStudent(m)}
                >
                  {/* Card Top: Avatar, Name, Roll & Risk Badge */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isHigh ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {m.rollNo.split('-')[1] || m.rollNo.slice(-2)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-slate-900 text-sm truncate">{m.name}</h3>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                          <span>Roll: <strong className="text-slate-800">{m.rollNo}</strong></span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                            {getStudentDivBatch(m.section).div} &bull; {getStudentDivBatch(m.section).batch}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {isHigh ? (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-bold text-[10px]">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>High Risk</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Healthy</span>
                        </span>
                      )}

                      {(m.missingMeetingCount || 0) >= 2 && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          m.parentAlertIssued 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                        }`}>
                          <Phone className="w-2.5 h-2.5" />
                          <span>Missed {m.missingMeetingCount} Meets</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metric Pills */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Attendance</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className={`text-base font-extrabold ${
                          att < 75 ? 'text-rose-600' : att < 83 ? 'text-amber-600' : 'text-emerald-700'
                        }`}>
                          {att}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {att < 75 ? '(Defaulter)' : '(Normal)'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Term Marks</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className={`text-base font-extrabold ${
                          marks < 50 ? 'text-rose-600' : 'text-slate-800'
                        }`}>
                          {marks}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {marks < 50 ? '(Critical)' : '(Score)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Footer */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    {(m.missingMeetingCount || 0) >= 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenParentAlert(m);
                        }}
                        className={`h-9 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 ${
                          m.parentAlertIssued
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                        }`}
                        title="Alert Parents of Missed Meetings"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{m.parentAlertIssued ? 'Alerted' : 'Alert'}</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMenteeForInvite(m);
                        setShowInviteModal(true);
                      }}
                      className="flex-1 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-700" />
                      <span>1-1 Invite</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectStudent(m);
                      }}
                      className="h-9 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer shrink-0"
                      title="View complete student profile, certificates, and Green Book"
                    >
                      <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Profile</span>
                    </button>

                    <Link
                      href={`/gfm/session/${m.studentId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Start 1-on-1</span>
                    </Link>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMentee(m);
                      }}
                      disabled={deletingMenteeId === m.studentId}
                      className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      title={`Delete ${m.name} from batch roster`}
                    >
                      <X className="w-4 h-4 text-rose-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODULE: BATCH ANNOUNCEMENTS & FORWARDED MESSAGES */}
      {activeModule === 'NOTICES' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-teal-600" />
                    <span>Batch Announcements &amp; Broadcasts</span>
                  </h2>
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                    Div-B &bull; Batch-2 (Whole Batch)
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Official notices, study directives, and forwarded circulars dispatched to all 36 students in your cohort
                </p>
              </div>

              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New Announcement</span>
              </button>
            </div>

            {/* Whole Batch Guarantee Banner */}
            <div className="mt-4 p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="font-bold block text-teal-900">Whole Batch Broadcast Channel Active</span>
                <p className="text-[11px] text-teal-800 mt-0.5">
                  Any announcement or forwarded message posted here is automatically sent to all <strong>36 students</strong> in Div-B &bull; Batch-2. Messages reflect immediately on the students&apos; GFM Notice Board and Academic Green Book portals.
                </p>
              </div>
            </div>

            {/* Announcements List */}
            <div className="mt-5 space-y-3.5">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-4.5 rounded-2xl border transition-all ${
                      ann.isMeetingNotice
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : ann.title.toLowerCase().includes('forwarded')
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-2.5">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            ann.isMeetingNotice
                              ? 'bg-emerald-600 text-white'
                              : ann.title.toLowerCase().includes('forwarded')
                              ? 'bg-amber-600 text-white'
                              : ann.title.toLowerCase().includes('exam')
                              ? 'bg-purple-600 text-white'
                              : 'bg-teal-600 text-white'
                          }`}>
                            {ann.isMeetingNotice
                              ? 'Batch Meeting'
                              : ann.title.toLowerCase().includes('forwarded')
                              ? 'Forwarded Circular'
                              : ann.title.toLowerCase().includes('exam')
                              ? 'Exam Directive'
                              : 'Batch Notice'}
                          </span>

                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                            Target: Div-B &bull; Batch-2 (All 36 Students)
                          </span>

                          <span className="text-[11px] text-slate-400 font-medium">
                            {new Date(ann.date).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1">
                          {ann.title}
                        </h3>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold self-start shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Delivered to Batch</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs font-medium">
                      {ann.content}
                    </p>

                    {ann.isMeetingNotice && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-emerald-200/60 text-xs text-emerald-950 font-medium">
                        <div>&bull; Time: <strong>{ann.meetingTime || '08:15 AM'}</strong></div>
                        <div>&bull; Date: <strong>{ann.meetingDate || 'Scheduled Day'}</strong></div>
                        <div>&bull; Venue: <strong>{ann.venue || 'LH-2'}</strong></div>
                      </div>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500">
                      <span>Broadcasted by: <strong className="text-slate-800">{ann.mentorName} (GFM)</strong></span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Live on All Student Devices
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <Megaphone className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="font-bold text-slate-700 text-sm">No announcements broadcasted yet.</p>
                  <p className="text-xs text-slate-500">
                    Click &ldquo;New Announcement&rdquo; above to broadcast an official notice or forward a department message to the whole batch.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODULE: STUDENT GRIEVANCE INBOX */}
      {activeModule === 'GRIEVANCES' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">
                  On-Device Student Grievance Inbox
                </h2>
                <p className="text-xs text-slate-500">
                  Concerns and complaints submitted directly from student devices to your GFM console
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                {grievances.length} Total Submissions
              </span>
            </div>

            {grievances.length > 0 ? (
              <div className="space-y-3">
                {grievances.map((g) => (
                  <div key={g.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 text-sm">{g.studentName}</strong>
                        <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                          Roll: {g.rollNo}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                          {g.category.replace('_', ' ')}
                        </span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        g.status === 'RESOLVED' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {g.status === 'RESOLVED' ? '✓ Resolved' : 'Pending Action'}
                      </span>
                    </div>

                    <p className="text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                      &ldquo;{g.grievanceText}&rdquo;
                    </p>

                    {g.gfmFeedback ? (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                        <strong className="block text-emerald-950 font-bold mb-0.5">
                          GFM Resolution Feedback:
                        </strong>
                        <span>{g.gfmFeedback}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-400">
                          Submitted on {new Date(g.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <button
                          onClick={() => {
                            setSelectedGrievance(g);
                            setResolutionFeedback('');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Provide Resolution &bull; Send to Student</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                No student grievances currently pending in this batch.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE: WEEKLY BATCH MEETINGS OVERVIEW */}
      {activeModule === 'BATCH_MEET' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">
                  Weekly Batch Meetings &amp; Attendance Log
                </h2>
                <p className="text-xs text-slate-500">
                  Weekly cohort guidance sessions with 1-click batch attendance marking and live on-device grievance collection
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/gfm/meeting"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Open Active Meeting Workspace</span>
                </Link>

                <button
                  onClick={() => setShowMeetingModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule New Batch Meeting</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <strong className="font-bold flex items-center gap-2 text-sm text-emerald-900">
                <Calendar className="w-4 h-4" />
                <span>Institutional GFM Meeting Workflow</span>
              </strong>
              <p className="leading-relaxed">
                When you schedule a weekly batch meeting, our system automatically performs two synchronized actions:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-emerald-900 font-medium">
                <li>Publishes an official meeting announcement notice directly to all mentees in the batch.</li>
                <li>Opens the dedicated <strong>Meeting Workspace</strong> equipped with the full student roster for attendance marking and a live <strong>Meeting Grievance Box</strong>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST ANNOUNCEMENT TO WHOLE BATCH */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 border-b border-slate-800 relative">
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
                  <Megaphone className="w-6 h-6 text-teal-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-extrabold uppercase bg-teal-400 text-slate-950 px-2 py-0.5 rounded-full">
                      Batch Broadcast
                    </span>
                    <span className="text-xs text-teal-200 font-bold">
                      Div-B &bull; Batch-2
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold">
                    Broadcast Announcement to Whole Batch
                  </h3>
                  <p className="text-xs text-emerald-100/90 mt-0.5">
                    Dispatches live to all 36 students&apos; device notice boards
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleBroadcastAnnouncement} className="p-6 space-y-4 text-xs">
              {announcementSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{announcementSuccessMsg}</span>
                </div>
              )}

              {/* Broadcast Target & Delivery Notice */}
              <div className="p-3.5 bg-teal-50/80 border border-teal-200 rounded-2xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-teal-950 block text-[12px]">
                    Automatic Batch Broadcast Delivery
                  </span>
                  <p className="text-[11px] text-teal-800 mt-0.5 leading-relaxed">
                    Any announcement, forwarded department circular, or message written here is sent to <strong>the whole batch (all 36 mentees)</strong>. It will show immediately on student portal screens.
                  </p>
                </div>
              </div>

              {/* Quick Template Shortcuts */}
              <div>
                <label className="block font-bold text-slate-600 mb-1.5 uppercase tracking-wider text-[10px]">
                  Quick Templates &amp; Forward Shortcuts
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAnnouncementCategory('FORWARDED');
                      setAnnouncementTitle('HoD Directive: Mandatory Journal & Sessional Submission Deadline');
                      setAnnouncementContent('[FORWARDED MESSAGE - HoD & Academic Affairs]: All students of Div-B Batch-2 must complete their journal/lab report submissions before this Friday 4:00 PM. Students who have unverified submissions or attendance below 75% will not be granted sessional clearance.');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] border border-slate-200 transition-colors cursor-pointer"
                  >
                    📋 Forward HoD Circular
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAnnouncementCategory('EXAM');
                      setAnnouncementTitle('Unit Test-2 Syllabus Revision & Doubt Clinic Schedule');
                      setAnnouncementContent('Please note that Unit Test-2 revision worksheets have been uploaded. Extra problem-solving doubt sessions will be conducted during morning zero periods (08:15 AM - 08:50 AM) in LH-2. All batch students are expected to attend.');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] border border-slate-200 transition-colors cursor-pointer"
                  >
                    📝 Unit Test Revision
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAnnouncementCategory('ATTENDANCE');
                      setAnnouncementTitle('Important: Mandatory 75% Attendance Compliance Reminder');
                      setAnnouncementContent('This is an official GFM reminder to all batch students. Under Academic Green Book regulations, minimum 75% aggregate attendance is mandatory to appear for semester end examinations. Those currently flagged under high-risk must meet me during zero period.');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] border border-slate-200 transition-colors cursor-pointer"
                  >
                    ⚠️ Attendance Warning
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAnnouncementCategory('WELFARE');
                      setAnnouncementTitle('GFM Batch Check-in & One-on-One Counseling Slots');
                      setAnnouncementContent('Dear students of Div-B Batch-2, individual guidance slots are available this week during the zero period. Feel free to submit any academic or hostel grievances through your device grievance box so we can resolve them together.');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] border border-slate-200 transition-colors cursor-pointer"
                  >
                    🤝 Welfare Check-in
                  </button>
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Message Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'GENERAL', label: 'General Notice' },
                    { id: 'FORWARDED', label: 'Forwarded Circular' },
                    { id: 'EXAM', label: 'Exam & Syllabus' },
                    { id: 'ATTENDANCE', label: 'Attendance Alert' },
                    { id: 'WELFARE', label: 'GFM Guidance' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setAnnouncementCategory(cat.id as any)}
                      className={`p-2 rounded-xl text-left border text-[11px] font-bold transition-all cursor-pointer ${
                        announcementCategory === cat.id
                          ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Announcement Title / Forwarded Subject
                </label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  required
                  placeholder="e.g. Schedule for Zero Period Doubt Solving or Forwarded Circular from Principal"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Announcement Body or Forwarded Message
                </label>
                <textarea
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  rows={4}
                  required
                  placeholder="Paste forwarded circular, WhatsApp message from department, or type batch instructions here..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Cohort confirmation pill */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span>Recipients: <strong>All 36 Students in Div-B &bull; Batch-2</strong></span>
                </div>
                <span className="text-teal-700 font-bold">100% Cohort Delivery</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={announcementSubmitting}
                  className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {announcementSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Broadcasting to Batch...</span>
                    </>
                  ) : (
                    <>
                      <Megaphone className="w-4 h-4" />
                      <span>Broadcast to Whole Batch (36 Students)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: CONDUCT WEEKLY BATCH MEETING + ATTENDANCE ROSTER */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-6 border-b border-slate-800 relative">
              <button
                onClick={() => setShowMeetingModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">
                    Conduct Weekly Batch Meeting
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Schedules meeting, broadcasts notice to students &amp; opens attendance marking and grievance box workspace
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleConductMeeting} className="p-6 space-y-5 text-xs">
              {meetingSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{meetingSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meeting Title</label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Venue / Classroom</label>
                  <input
                    type="text"
                    value={meetingVenue}
                    onChange={(e) => setMeetingVenue(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meeting Date</label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Agenda &amp; Instructions for Mentees</label>
                <textarea
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  rows={3}
                  required
                  placeholder="Enter agenda topics, syllabus review focus, or instructions..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
                <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Notice Broadcast:</strong> This agenda and instructions will automatically be sent to all batch mentees&apos; devices upon scheduling. The attendance roster and live grievance box will open on the next page.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(false)}
                  className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={meetingSubmitting}
                  className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {meetingSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Broadcasting Notice &amp; Opening Workspace...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Schedule Meeting &amp; Open Attendance / Grievance Page →</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SEND 1-ON-1 INVITATION */}
      {showInviteModal && selectedMenteeForInvite && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 relative">
              <button
                onClick={() => setShowInviteModal(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-all"
              >
                ✕
              </button>

              <h3 className="text-lg font-extrabold">
                Invite for 1-on-1 Guidance Session
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Student: {selectedMenteeForInvite.name} (Roll: {selectedMenteeForInvite.rollNo})
              </p>
            </div>

            <form onSubmit={handleSendInvite} className="p-5 space-y-4 text-xs">
              {inviteSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{inviteSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Guidance Focus &amp; Message</label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={3}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scheduled Date</label>
                <input
                  type="date"
                  value={inviteScheduledAt}
                  onChange={(e) => setInviteScheduledAt(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={sendingInvite}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invite to Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: GRIEVANCE RESOLUTION FEEDBACK */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 relative">
              <button
                onClick={() => setSelectedGrievance(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-all"
              >
                ✕
              </button>

              <h3 className="text-lg font-extrabold">
                Resolve Student Grievance
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                From: {selectedGrievance.studentName} (Roll: {selectedGrievance.rollNo})
              </p>
            </div>

            <form onSubmit={handleResolveGrievance} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Student&apos;s Submitted Grievance:</span>
                <p className="text-slate-800 font-medium">{selectedGrievance.grievanceText}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">GFM Mentor Resolution / Action Feedback</label>
                <textarea
                  value={resolutionFeedback}
                  onChange={(e) => setResolutionFeedback(e.target.value)}
                  placeholder="Enter counseling action or solution provided to the student..."
                  rows={4}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={resolvingGrievance}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Send Resolution to Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: GREEN BOOK PREVIEW FOR MENTOR */}
      {previewGreenBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-6 border-b border-slate-800 relative">
              <button
                onClick={() => setPreviewGreenBook(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full">
                      Academic Green Book
                    </span>
                    <span className="text-xs text-emerald-100 font-mono font-bold">
                      PRN: {previewGreenBook.details.prn}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold mt-0.5">
                    {previewGreenBook.student.name} (Roll: {previewGreenBook.student.rollNo})
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-5 text-xs text-slate-700 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Parent / Guardian:</span>
                  <strong className="text-slate-900">{previewGreenBook.details.guardianDetails.fatherName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Contact Phone:</span>
                  <strong className="text-slate-900">{previewGreenBook.details.guardianDetails.fatherPhone}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Cumulative Attendance:</span>
                  <strong className={`text-sm ${previewGreenBook.details.cumulativeAttendance < 75 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {previewGreenBook.details.cumulativeAttendance}%
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Sessional Percentage:</span>
                  <strong className="text-sm text-slate-900">{previewGreenBook.details.cumulativePercentage}%</strong>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-2">Subject Performance &amp; Attendance</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2">Subject</th>
                        <th className="p-2">Marks</th>
                        <th className="p-2">Attendance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewGreenBook.details.termAssessments.map((term, i) => (
                        <tr key={i}>
                          <td className="p-2 font-semibold text-slate-800">{term.subject}</td>
                          <td className="p-2 font-bold">{term.marksObtained} / {term.totalMarks}</td>
                          <td className="p-2">
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

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-2">GFM Mentoring Remarks Log</h4>
                <div className="space-y-2">
                  {previewGreenBook.details.gfmRemarksHistory.map((rem, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <strong className="text-slate-800">{rem.gfmName}</strong>
                        <span className="text-slate-500">{rem.date}</span>
                      </div>
                      <p className="text-slate-700">{rem.remark}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setPreviewGreenBook(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: SUBMIT REPORT TO AUTHORITY (DIV, BATCH, YEAR) */}
      {showAuthorityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 relative">
              <button
                onClick={() => setShowAuthorityModal(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-all"
              >
                ✕
              </button>

              <h3 className="text-lg font-extrabold">
                Submit Mentee Report to Authority
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Official reporting to Principal / HOD / Academic Coordinator
              </p>
            </div>

            <form onSubmit={handleSubmitAuthorityReport} className="p-5 space-y-4 text-xs">
              {authSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              {/* Fixed Division, Batch, and Academic Year Badge Panel */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Fixed Cohort:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                    Division: Div-B
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                    Batch: Batch-2
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-bold text-[11px]">
                    AY 2026-27
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Assigned Batch
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">Report Snapshot Included:</span>
                <div className="text-slate-600 space-y-0.5">
                  <div>&bull; Total Mentees: <strong>{mentees.length}</strong></div>
                  <div>&bull; High Risk Count: <strong className="text-rose-600">{highRiskCount}</strong></div>
                  <div>&bull; Overall Batch Attendance: <strong>{avgAttendance}%</strong></div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Report Content &amp; Interventions Completed
                </label>
                <textarea
                  value={authRemarks}
                  onChange={(e) => setAuthRemarks(e.target.value)}
                  rows={4}
                  required
                  placeholder="Enter mentor observations, counseling interventions, academic pacing, and student welfare feedback..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthorityModal(false)}
                  className="w-full sm:w-auto text-center px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingAuthReport}
                  className="w-full sm:w-auto text-center justify-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Academic Head</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* STUDENT DETAIL MODAL */}
      {showStudentDetailModal && selectedStudentDetail && (() => {
        const verifiedActivityPoints = studentActivityPoints.reduce((acc, p) => p.status === 'VERIFIED_AND_CREDITED' ? acc + p.pointsAwarded : acc, 0);
        const pendingActivityPoints = studentActivityPoints.reduce((acc, p) => p.status === 'PENDING_APPROVAL' ? acc + p.pointsAwarded : acc, 0);
        const isDefaulter = selectedStudentDetail.academicMetrics.overallAttendance < 75;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
              
              {/* Modal Header */}
              <div className="bg-slate-900 p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm text-white shrink-0 shadow-md ${
                    isDefaulter ? 'bg-gradient-to-tr from-rose-600 to-amber-600' : 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                  }`}>
                    {selectedStudentDetail.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg flex flex-wrap items-center gap-2">
                      <span>{selectedStudentDetail.name}</span>
                      {isHighRiskStudent(selectedStudentDetail) && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                          High Risk
                        </span>
                      )}
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono border border-slate-700">
                        PRN: {studentGreenBook?.prn || 'PRN-2026-DL-100109'}
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-[11px]">
                        Roll: <strong className="text-white font-bold">{selectedStudentDetail.rollNo}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">
                        <span>{getStudentDivBatch(selectedStudentDetail.section).div}</span>
                        <span className="text-emerald-400/60">&bull;</span>
                        <span>{getStudentDivBatch(selectedStudentDetail.section).batch}</span>
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[11px] font-medium border border-slate-700">
                        {selectedStudentDetail.stream} &bull; Section {selectedStudentDetail.section}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Attendance &bull; Marks</span>
                    <span className="text-xs font-bold text-emerald-300">
                      {selectedStudentDetail.academicMetrics.overallAttendance}% &bull; {selectedStudentDetail.academicMetrics.lastTermPercentage}%
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowStudentDetailModal(false)}
                    className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Telemetry Ribbon inside modal */}
              <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800/80 flex items-center gap-3 overflow-x-auto no-scrollbar text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Activity Points: <strong className="text-white font-bold">{verifiedActivityPoints}/100</strong> ({studentActivityPoints.length} Certs)</span>
                </div>
                <span className="text-slate-600">&bull;</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Study Buddies: <strong className="text-white font-bold">{studentBuddyConnections.length}</strong> Active</span>
                </div>
                <span className="text-slate-600">&bull;</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <History className="w-3.5 h-3.5 text-teal-400" />
                  <span>Meetings: <strong className="text-white font-bold">{studentMeetingHistoryList.length}</strong> Sessions</span>
                </div>
                <span className="text-slate-600">&bull;</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Grievances: <strong className="text-white font-bold">{studentGrievancesList.length}</strong> Logged</span>
                </div>
              </div>

              {/* Modal Sub-Tabs */}
              <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setStudentModalTab('GREEN_BOOK')}
                  className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    studentModalTab === 'GREEN_BOOK'
                      ? 'bg-white text-emerald-900 shadow-2xs border border-emerald-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <BookMarked className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Green Book Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentModalTab('ACTIVITIES')}
                  className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    studentModalTab === 'ACTIVITIES'
                      ? 'bg-white text-amber-900 shadow-2xs border border-amber-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>100-Pt Activity ({studentActivityPoints.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentModalTab('BUDDY_SYSTEM')}
                  className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    studentModalTab === 'BUDDY_SYSTEM'
                      ? 'bg-white text-emerald-900 shadow-2xs border border-emerald-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Study Buddies ({studentBuddyConnections.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentModalTab('MEETINGS')}
                  className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    studentModalTab === 'MEETINGS'
                      ? 'bg-white text-teal-900 shadow-2xs border border-teal-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-teal-600" />
                  <span>Meeting History ({studentMeetingHistoryList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentModalTab('PARENT_MEET')}
                  className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    studentModalTab === 'PARENT_MEET'
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-slate-700" />
                  <span>Schedule Parent Meet (PMM)</span>
                  {studentParentMeeting && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStudentModalTab('GRIEVANCES')}
                  className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    studentModalTab === 'GRIEVANCES'
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-700" />
                  <span>Grievances &amp; Parent Alert</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
                
                {/* Notice Banners */}
                {verifySuccessNotice && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-xs flex items-center justify-between shadow-2xs animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{verifySuccessNotice}</span>
                    </div>
                    <button onClick={() => setVerifySuccessNotice(null)} className="text-emerald-700 hover:text-emerald-950 font-bold p-1 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {dataActionNotice && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{dataActionNotice}</span>
                    </div>
                    <button onClick={() => setDataActionNotice(null)} className="text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Truancy & Parent Escalation Banner (Feature 2) */}
                {(selectedStudentDetail.missingMeetingCount || 0) >= 2 && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-extrabold text-xs text-rose-900">
                          Attendance Escalation: Missed {selectedStudentDetail.missingMeetingCount} Consecutive GFM Check-ins
                        </div>
                        <p className="text-[11px] text-rose-700 mt-0.5">
                          {selectedStudentDetail.parentAlertIssued 
                            ? '✓ Official absence alert has been dispatched to guardian.' 
                            : 'Institutional guideline: Mentee absences require immediate parental notification.'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenParentAlert(selectedStudentDetail)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedStudentDetail.parentAlertIssued ? 'Re-send Parent Alert' : 'Alert Parents'}</span>
                    </button>
                  </div>
                )}

                {/* TAB 1: ACADEMIC OVERVIEW & GREEN BOOK RECORD */}
                {studentModalTab === 'GREEN_BOOK' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Attendance Metric Card */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Overall Attendance</span>
                          <span className="text-[10px] text-slate-400 font-medium">Semester Record</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <div className={`text-2xl sm:text-3xl font-extrabold ${isDefaulter ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {selectedStudentDetail.academicMetrics.overallAttendance}%
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isDefaulter ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {isDefaulter ? 'Defaulter' : 'Compliant'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Institutional benchmark: 75% minimum requirement</p>
                      </div>

                      {/* Marks Metric Card */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Last Term Marks</span>
                          <span className="text-[10px] text-slate-400 font-medium">Internal Assessment</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <div className={`text-2xl sm:text-3xl font-extrabold ${
                            selectedStudentDetail.academicMetrics.lastTermPercentage < 50 ? 'text-rose-600' : 'text-slate-800'
                          }`}>
                            {selectedStudentDetail.academicMetrics.lastTermPercentage}%
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            selectedStudentDetail.academicMetrics.lastTermPercentage < 50 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {selectedStudentDetail.academicMetrics.lastTermPercentage < 50 ? 'Critical' : 'Normal'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Continuous Internal Assessment score</p>
                      </div>
                    </div>

                    {/* DIRECTLY INTEGRATED ACADEMIC GREEN BOOK RECORD */}
                    <div className="bg-white border border-emerald-300/80 rounded-2xl overflow-hidden shadow-xs">
                      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-3.5 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">
                            <BookMarked className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs">Academic Green Book Official Ledger</span>
                              <span className="text-[9px] uppercase tracking-wider bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-full font-extrabold">
                                Verified
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-200">
                              Permanent Academic &amp; Attendance Record
                            </span>
                          </div>
                        </div>

                        {studentGreenBook?.prn && (
                          <span className="text-[11px] font-mono font-bold bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-lg text-emerald-100">
                            PRN: {studentGreenBook.prn}
                          </span>
                        )}
                      </div>

                      {loadingStudentGreenBook ? (
                        <div className="p-6 flex items-center justify-center gap-2 text-slate-500">
                          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-semibold">Loading official Green Book ledger...</span>
                        </div>
                      ) : studentGreenBook ? (
                        <div className="p-4 space-y-3 text-xs">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px]">
                            <div>
                              <span className="text-slate-400 block font-bold text-[10px]">Guardian / Father:</span>
                              <strong className="text-slate-800">{studentGreenBook.guardianDetails?.fatherName || 'N/A'}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-bold text-[10px]">Emergency Phone:</span>
                              <strong className="text-slate-800">{studentGreenBook.guardianDetails?.fatherPhone || 'N/A'}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-bold text-[10px]">Cumulative Attendance:</span>
                              <strong className={`font-extrabold ${studentGreenBook.cumulativeAttendance < 75 ? 'text-rose-600' : 'text-emerald-700'}`}>
                                {studentGreenBook.cumulativeAttendance}%
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-bold text-[10px]">Sessional %:</span>
                              <strong className="text-slate-800 font-extrabold">{studentGreenBook.cumulativePercentage}%</strong>
                            </div>
                          </div>

                          {studentGreenBook.termAssessments && studentGreenBook.termAssessments.length > 0 && (
                            <div>
                              <span className="font-bold text-slate-800 text-[11px] block mb-1.5">
                                Subject Continuous Internal Assessment (CIA) &amp; Attendance:
                              </span>
                              <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-[11px]">
                                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                                    <tr>
                                      <th className="p-2">Subject</th>
                                      <th className="p-2">CIA Marks</th>
                                      <th className="p-2">Attendance</th>
                                      <th className="p-2 text-right">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {studentGreenBook.termAssessments.map((term, i) => (
                                      <tr key={i} className="hover:bg-slate-50/50">
                                        <td className="p-2 font-semibold text-slate-800">{term.subject}</td>
                                        <td className="p-2 font-bold text-slate-700">{term.marksObtained} / {term.totalMarks}</td>
                                        <td className="p-2">
                                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            term.attendancePercent < 75 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                                          }`}>
                                            {term.attendancePercent}%
                                          </span>
                                        </td>
                                        <td className="p-2 text-right">
                                          <span className={`text-[10px] font-bold ${
                                            term.marksObtained < term.totalMarks * 0.5 || term.attendancePercent < 75
                                              ? 'text-rose-600'
                                              : 'text-emerald-600'
                                          }`}>
                                            {term.marksObtained < term.totalMarks * 0.5 || term.attendancePercent < 75 ? 'Remedial' : 'Satisfactory'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {studentGreenBook.gfmRemarksHistory && studentGreenBook.gfmRemarksHistory.length > 0 && (
                            <div>
                              <span className="font-bold text-slate-800 text-[11px] block mb-1.5">
                                GFM Mentoring &amp; Counseling Log:
                              </span>
                              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                                {studentGreenBook.gfmRemarksHistory.map((rem, i) => (
                                  <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5 font-medium">
                                      <span className="font-bold text-slate-700">{rem.gfmName}</span>
                                      <span>{rem.date}</span>
                                    </div>
                                    <p className="text-slate-700 italic">&ldquo;{rem.remark}&rdquo;</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-slate-500 italic text-xs">
                          Green Book record initialized with batch baseline metrics.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: 100-POINT ACTIVITY & CERTIFICATES SUBMITTED (Strictly for this student) */}
                {studentModalTab === 'ACTIVITIES' && (
                  <div className="space-y-4 animate-in fade-in">
                    {/* Activity Points Overview Card */}
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-600" />
                            <h4 className="font-extrabold text-sm text-slate-900">
                              100-Point Activity Ledger for {selectedStudentDetail.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1">
                            Verified non-academic activity certificates and institutional credits claimed by this mentee.
                          </p>
                        </div>

                        <div className="flex items-baseline gap-2 bg-white px-3.5 py-2 rounded-xl border border-amber-300 shadow-2xs">
                          <span className="text-2xl font-extrabold text-amber-600">{verifiedActivityPoints}</span>
                          <span className="text-xs text-slate-500 font-bold">/ 100 Pts Credited</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-semibold">
                          <span>Institutional Completion Pacing</span>
                          <span>{verifiedActivityPoints}% Achieved ({pendingActivityPoints} Pts Pending)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, verifiedActivityPoints)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submitted Certificates List */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-slate-900 text-xs">
                          Submitted Certificates &amp; Evidence ({studentActivityPoints.length})
                        </h5>
                        <span className="text-[11px] text-slate-400">
                          {studentActivityPoints.filter(p => p.status === 'PENDING_APPROVAL').length} Requiring Mentor Review
                        </span>
                      </div>

                      {loadingStudentActivityPoints ? (
                        <div className="p-8 text-center text-slate-500">
                          <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading activity certificates for {selectedStudentDetail.name}...</span>
                        </div>
                      ) : studentActivityPoints.length === 0 ? (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500 italic">
                          No activity certificates submitted yet by {selectedStudentDetail.name}.
                        </div>
                      ) : (
                        studentActivityPoints.map((cert) => {
                          const isVerified = cert.status === 'VERIFIED_AND_CREDITED';

                          return (
                            <div 
                              key={cert.id} 
                              className={`p-3.5 rounded-2xl border transition-all ${
                                isVerified 
                                  ? 'bg-white border-slate-200 hover:border-emerald-300' 
                                  : 'bg-amber-50/50 border-amber-300 shadow-2xs'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                      cert.category === 'TECHNICAL_HACKATHON' ? 'bg-blue-100 text-blue-800' :
                                      cert.category === 'COMMUNITY_OUTREACH' ? 'bg-emerald-100 text-emerald-800' :
                                      cert.category === 'SPORTS_CULTURAL' ? 'bg-purple-100 text-purple-800' :
                                      'bg-amber-100 text-amber-800'
                                    }`}>
                                      {cert.category.replace('_', ' ')}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">Submitted: {cert.date}</span>
                                    <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                                      Claimed: +{cert.pointsAwarded} Pts
                                    </span>
                                  </div>

                                  <h6 className="font-extrabold text-slate-900 text-sm">
                                    {cert.title}
                                  </h6>

                                  <p className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                                    <span>Issuing Authority: <strong className="text-slate-700">{cert.issuingAuthority}</strong></span>
                                    {cert.certificateFileName && (
                                      <span className="inline-flex items-center gap-1 text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                        <FileText className="w-3 h-3 text-slate-500" />
                                        <span>File: {cert.certificateFileName}</span>
                                      </span>
                                    )}
                                    {isVerified && cert.verifiedBy && (
                                      <span className="text-emerald-700 font-medium">
                                        &bull; Verified by {cert.verifiedBy} ({cert.verificationDate})
                                      </span>
                                    )}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {isVerified ? (
                                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-300">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Verified &amp; Credited</span>
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleVerifyCertificate(cert.id)}
                                      disabled={verifyingPointId === cert.id}
                                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                      title="Verify certificate and credit points to student ledger"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>{verifyingPointId === cert.id ? 'Verifying...' : 'Verify & Credit Points'}</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: STUDY BUDDIES & PEER TUTOR CONNECTIONS (Strictly for this student) */}
                {studentModalTab === 'BUDDY_SYSTEM' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 rounded-2xl p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-700" />
                            <h4 className="font-extrabold text-sm text-slate-900">
                              Study Buddy &amp; Peer Tutor Network for {selectedStudentDetail.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1">
                            Tracks which senior peer mentors this student has connected with for doubt clearing and remedial guidance.
                          </p>
                        </div>

                        <button
                          onClick={() => setShowAssignBuddyInline(!showAssignBuddyInline)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{showAssignBuddyInline ? 'Close Tutor Selector' : 'Assign New Peer Tutor'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Peer Tutor Selector for Mentor */}
                    {showAssignBuddyInline && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 text-xs">Select Senior Peer Tutor to Assign:</strong>
                          <span className="text-[10px] text-slate-400">Allocates weekly zero-period doubt clinic</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {peerTutorsList.map((tutor) => (
                            <div key={tutor.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs shadow-2xs">
                              <div className="flex items-center justify-between">
                                <strong className="text-slate-900 font-bold">{tutor.name}</strong>
                                <span className="text-[10px] text-slate-400">{tutor.rollNo}</span>
                              </div>
                              <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                                {tutor.subject}
                              </span>
                              <div className="text-[10px] text-slate-500">
                                <div>{tutor.venue}</div>
                                <div>{tutor.availableTime}</div>
                              </div>
                              <button
                                onClick={() => handleAssignBuddyToStudent(tutor)}
                                disabled={assigningBuddy}
                                className="w-full mt-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
                              >
                                {assigningBuddy ? 'Assigning...' : `Assign to ${selectedStudentDetail.name.split(' ')[0]}`}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Connected Buddies List */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-slate-900 text-xs">
                          Active Study Buddies Connected ({studentBuddyConnections.length})
                        </h5>
                        <span className="text-[11px] text-slate-400">
                          Remedial Doubts &bull; Peer Mentoring
                        </span>
                      </div>

                      {loadingStudentBuddies ? (
                        <div className="p-8 text-center text-slate-500">
                          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading study buddy connections for {selectedStudentDetail.name}...</span>
                        </div>
                      ) : studentBuddyConnections.length === 0 ? (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500 italic">
                          No study buddy connections logged yet for {selectedStudentDetail.name}. Click &ldquo;Assign New Peer Tutor&rdquo; above to link a senior student.
                        </div>
                      ) : (
                        studentBuddyConnections.map((conn) => (
                          <div key={conn.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                              <div>
                                <div className="flex items-center gap-2">
                                  <strong className="text-slate-900 font-extrabold text-sm">{conn.tutorName}</strong>
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                                    Roll: {conn.tutorRollNo}
                                  </span>
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                                    {conn.status.replace(/_/g, ' ')}
                                  </span>
                                </div>
                                <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                                  Subject: {conn.subject}
                                </div>
                              </div>

                              <div className="text-left sm:text-right text-[11px] text-slate-400 font-medium">
                                <div>Connected On: <strong className="text-slate-700">{conn.connectedAt}</strong></div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                              <div>
                                <span className="text-slate-400 block font-bold text-[10px]">Session Venue &amp; Time Slot:</span>
                                <strong>{conn.venue} &bull; {conn.scheduledTime}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-bold text-[10px]">Focus Objective:</span>
                                <span className="italic">{conn.contactNote || 'Weekly problem-solving and doubt clarification.'}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: MEETING HISTORY & INTERACTION SUMMARIES (Strictly for this student) */}
                {studentModalTab === 'MEETINGS' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="bg-gradient-to-r from-teal-500/10 via-teal-50 to-emerald-50 border border-teal-200/80 rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-teal-700" />
                        <h4 className="font-extrabold text-sm text-slate-900">
                          Interaction &amp; Meeting History for {selectedStudentDetail.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Review discussions, identified bottlenecks, and action items sealed from past weekly batch meetings and 1-on-1 counseling.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {loadingStudentMeetingHistory ? (
                        <div className="p-8 text-center text-slate-500">
                          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading meeting logs for {selectedStudentDetail.name}...</span>
                        </div>
                      ) : studentMeetingHistoryList.length === 0 ? (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500 italic">
                          No previous meetings recorded for {selectedStudentDetail.name}. Log attendance in weekly meetings or conduct a 1-on-1 session to create historical entries.
                        </div>
                      ) : (
                        studentMeetingHistoryList.map((meet) => (
                          <div key={meet.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 text-xs shadow-2xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-extrabold text-slate-900 text-sm">{meet.title}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                                  {meet.type?.replace(/_/g, ' ') || 'MEETING'}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  meet.attendanceStatus === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {meet.attendanceStatus}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 font-medium">{meet.date}</span>
                            </div>

                            <div className="space-y-1.5 text-[11px]">
                              <div>
                                <span className="text-slate-400 font-bold block">Summary of Interaction:</span>
                                <p className="text-slate-700 leading-relaxed font-medium">{meet.discussionSummary}</p>
                              </div>

                              {meet.keyActionTakeaways && meet.keyActionTakeaways.length > 0 && (
                                <div className="pt-1">
                                  <span className="text-slate-400 font-bold block mb-1">Committed Action Items:</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {meet.keyActionTakeaways.map((item, idx) => (
                                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-semibold">
                                        &bull; {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: SCHEDULE PARENT-MENTOR MEETING (PMM) */}
                {studentModalTab === 'PARENT_MEET' && (
                  <div className="space-y-4 animate-in fade-in">
                    {pmmNotice && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center justify-between text-xs">
                        <span>{pmmNotice}</span>
                        <button onClick={() => setPmmNotice(null)} className="text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-800" />
                          <h4 className="font-extrabold text-sm text-slate-900">
                            Parent-Mentor Meeting (PMM) for {selectedStudentDetail.name}
                          </h4>
                        </div>
                        {studentParentMeeting && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Currently Scheduled
                          </span>
                        )}
                      </div>

                      {studentParentMeeting ? (
                        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[10px] font-semibold">Scheduled Date &amp; Time:</span>
                              <strong className="text-slate-900">{studentParentMeeting.scheduledDate} &bull; {studentParentMeeting.timeSlot}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] font-semibold">Meeting Venue:</span>
                              <strong className="text-slate-900">{studentParentMeeting.venue}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] font-semibold">Assigned Mentor:</span>
                              <strong className="text-slate-900">{studentParentMeeting.mentorName}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] font-semibold">Status:</span>
                              <strong className="text-emerald-700 font-bold">{studentParentMeeting.status} (Notification Pushed to Student)</strong>
                            </div>
                          </div>

                          {studentParentMeeting.parentNotes && (
                            <div className="pt-2 border-t border-slate-100 text-slate-700 text-[11px]">
                              <span className="text-slate-400 font-semibold block text-[10px]">Agenda / Remarks:</span>
                              <p className="italic mt-0.5">{studentParentMeeting.parentNotes}</p>
                            </div>
                          )}

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={handleCancelPmm}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs transition-colors cursor-pointer"
                            >
                              Cancel Scheduled Meeting
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSchedulePmm} className="space-y-3 pt-1">
                          <p className="text-[11px] text-slate-600">
                            Schedule an official consultation with the guardian of {selectedStudentDetail.name}. Once scheduled, a notification will be pushed immediately to the student dashboard.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 text-[11px] mb-1">Meeting Date:</label>
                              <input
                                type="date"
                                required
                                value={pmmDate}
                                onChange={(e) => setPmmDate(e.target.value)}
                                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 text-[11px] mb-1">Time Slot:</label>
                              <input
                                type="text"
                                required
                                value={pmmTime}
                                onChange={(e) => setPmmTime(e.target.value)}
                                placeholder="e.g. 10:30 AM - 11:00 AM"
                                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 text-[11px] mb-1">Venue / Room:</label>
                            <input
                              type="text"
                              required
                              value={pmmVenue}
                              onChange={(e) => setPmmVenue(e.target.value)}
                              placeholder="e.g. Classroom LH-2 / GFM Cabin"
                              className="w-full p-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 text-[11px] mb-1">Meeting Agenda &amp; Remarks for Guardian:</label>
                            <textarea
                              rows={2}
                              value={pmmNotes}
                              onChange={(e) => setPmmNotes(e.target.value)}
                              placeholder="e.g. Mid-semester academic progress review and attendance discussion."
                              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={schedulingPmm}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>{schedulingPmm ? 'Scheduling...' : 'Schedule Meeting & Push Notification'}</span>
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 6: GRIEVANCES & PARENT ESCALATION (Strictly for this student) */}
                {studentModalTab === 'GRIEVANCES' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-slate-800" />
                          <h4 className="font-extrabold text-sm text-slate-900">
                            On-Device Grievances Lodged by {selectedStudentDetail.name} ({studentGrievancesList.length})
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-400">Strictly confidential</span>
                      </div>

                      {studentGrievancesList.length === 0 ? (
                        <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-500 italic text-[11px]">
                          No grievances submitted by {selectedStudentDetail.name}.
                        </div>
                      ) : (
                        studentGrievancesList.map((grv) => (
                          <div key={grv.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {grv.category.replace('_', ' ')}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                grv.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {grv.status}
                              </span>
                            </div>
                            <p className="text-slate-800 italic">&ldquo;{grv.grievanceText}&rdquo;</p>
                            {grv.gfmFeedback && (
                              <p className="text-emerald-700 font-semibold pt-1 border-t border-slate-200/80">
                                GFM Feedback: {grv.gfmFeedback}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>
              
              {/* Modal Footer with Direct Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <button
                  onClick={() => handleDeleteStudentData('all')}
                  className="w-full sm:w-auto h-9 px-3.5 rounded-xl text-rose-700 hover:text-white hover:bg-rose-600 border border-rose-300 font-bold transition-all flex items-center justify-center gap-1.5 text-xs shadow-xs cursor-pointer"
                  title="Delete Mentee record from this batch"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600 group-hover:text-white" />
                  <span>Delete Mentee Record</span>
                </button>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <Link
                    href={`/gfm/session/${selectedStudentDetail.studentId}`}
                    className="w-full sm:w-auto h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Start 1-on-1 Session</span>
                  </Link>

                  <button
                    onClick={() => setShowStudentDetailModal(false)}
                    className="w-full sm:w-auto h-9 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition-all text-xs cursor-pointer flex items-center justify-center"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PARENT ABSENCE ALERT MODAL (Feature 2) */}
      {showParentAlertModal && selectedMenteeForAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 border-b border-slate-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Dispatch Parent Absence Alert</h3>
                  <p className="text-[11px] text-rose-100">
                    Mandatory GFM Truancy &amp; Meeting Absence Notification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowParentAlertModal(false)}
                className="p-1.5 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendParentAlert} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              {parentAlertSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{parentAlertSuccessMsg}</span>
                </div>
              )}

              {/* Student & Guardian Telemetry Card */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{selectedMenteeForAlert.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-extrabold text-[10px]">
                    Missed {selectedMenteeForAlert.missingMeetingCount || 2} Meetings
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>Roll No: <strong className="text-slate-800">{selectedMenteeForAlert.rollNo}</strong></div>
                  <div>Cohort: <strong className="text-slate-800">Div-B &bull; Batch-2</strong></div>
                  <div>Attendance: <strong className={selectedMenteeForAlert.academicMetrics.overallAttendance < 75 ? 'text-rose-600 font-bold' : 'text-slate-800'}>{selectedMenteeForAlert.academicMetrics.overallAttendance}%</strong></div>
                  <div>Status: <strong className="text-amber-700">Absent from Batch Check-ins</strong></div>
                </div>
              </div>

              {/* Message Composer */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                  Guardian Notification Message (SMS / Student-Parent Portal):
                </label>
                <textarea
                  value={alertCustomMessage}
                  onChange={(e) => setAlertCustomMessage(e.target.value)}
                  rows={4}
                  required
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed font-sans"
                  placeholder="Enter notice message to parents..."
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Dispatched via institutional SMS gateway and permanently logged in the Academic Green Book record.
                </span>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowParentAlertModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingParentAlert}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingParentAlert ? 'Dispatching Notice...' : 'Send Alert to Parents'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEETING HISTORY MODAL (Feature 3) */}
      {showMeetingHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 border-b border-slate-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    {selectedStudentForHistory ? `Meeting History: ${selectedStudentForHistory.name}` : 'Batch Mentorship Meeting History'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Past GFM Batch Check-ins, 1-on-1 Guidance &amp; Parent Interactions
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
              {/* Header filter banner if student selected */}
              {selectedStudentForHistory && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Filtered for Mentee:</span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 font-extrabold text-[11px]">
                      {selectedStudentForHistory.name} ({selectedStudentForHistory.rollNo})
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenMeetingHistory()}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                  >
                    View All Batch Meetings
                  </button>
                </div>
              )}

              {loadingMeetingHistories ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-medium text-xs">Loading interaction logs and session minutes...</p>
                </div>
              ) : meetingHistories.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  <History className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No past meeting records logged yet.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Conducted batch check-ins and 1-on-1 sessions appear here.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {meetingHistories.map((entry) => (
                    <div 
                      key={entry.id} 
                      className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 shadow-2xs space-y-2.5 transition-all"
                    >
                      {/* Top Bar: Title, Date, Type & Attendance */}
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

                      {/* Guidance & Recommendations */}
                      {entry.guidanceGiven && (
                        <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-[11px] text-emerald-950 space-y-1">
                          <span className="font-bold text-emerald-900 block text-[10px] uppercase tracking-wider">Faculty Guidance Provided:</span>
                          <p className="leading-relaxed italic">&ldquo;{entry.guidanceGiven}&rdquo;</p>
                        </div>
                      )}

                      {/* Key Action Takeaways */}
                      {entry.keyActionTakeaways && entry.keyActionTakeaways.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wider block mb-1">Agreed Action Points:</span>
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

    </div>
  );
}
