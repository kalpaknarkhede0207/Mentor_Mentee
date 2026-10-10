export type GradeLevel = 'GRADE_9' | 'GRADE_10' | 'GRADE_11' | 'GRADE_12';
export type AcademicStream = 'SCIENCE' | 'COMMERCE' | 'HUMANITIES' | 'GENERAL';
export type RagStatus = 'GREEN' | 'AMBER' | 'RED';
export type MentoringPillar = 
  | 'ACADEMIC' 
  | 'COMPETITIVE_CAREER' 
  | 'WELLBEING_HABITS' 
  | 'DISCIPLINE_PARENT';

export interface TeacherMentor {
  id: string;
  name: string;
  email: string;
  subject: string;
  designation: string;
  assignedGrade: GradeLevel;
  avatarUrl?: string;
}

export interface MentorshipGroup {
  id: string;
  mentorId: string;
  mentorName: string;
  grade: GradeLevel;
  section: string; // e.g. "11-A"
  stream: AcademicStream;
  academicYear: string; // "2026-27"
  huddleSchedule: {
    kickoffDay: 'MONDAY' | 'TUESDAY';
    kickoffTime: string; // "08:15 AM"
    clinicDay: 'THURSDAY' | 'FRIDAY';
    clinicTime: string; // "08:15 AM"
  };
  studentIds: string[];
}

export interface MenteeProfile {
  id: string;
  studentId: string;
  name: string;
  rollNo: string;
  grade: GradeLevel;
  section: string;
  stream: AcademicStream;
  mentorId: string;
  contact: {
    studentEmail: string;
    parentPhone: string;
    parentEmail: string;
  };
  academicMetrics: {
    overallAttendance: number; // e.g. 74 (%)
    lastTermPercentage: number; // e.g. 68.2 (%)
    weakSubjects: string[]; // ["Physics", "Mathematics"]
    competitiveAspirations: string[]; // ["JEE Main", "CUET"]
  };
  ragRiskStatus: RagStatus;
  lastOneOnOneDate?: string;
  daysSinceLastSession: number;
  missingMeetingCount?: number;
  parentAlertIssued?: boolean;
  parentAlertTimestamp?: string;
}

export interface MentoringSession {
  id: string;
  sessionType: 'BATCH_HUDDLE' | 'COMPULSORY_1_ON_1' | 'CRISIS_INTERVENTION';
  mentorId: string;
  groupId: string;
  studentId?: string; // Present for 1-on-1
  date: string; // ISO
  durationMinutes: number;
  
  // 1-on-1 Content
  pillar?: MentoringPillar;
  studentConcern?: string;
  teacherAdvice?: string;
  actionItem?: {
    task: string;
    targetDate: string;
    status: 'PENDING' | 'COMPLETED';
  };
  parentDigestSent: boolean;
  confidentialNote?: string;
  
  // AI Voice Wrap-up Metadata
  hasAiAudioSummary: boolean;
  audioDurationSeconds?: number;
  
  status: 'DRAFT' | 'APPROVED_AND_SEALED';
}

export interface BatchHuddleRecord {
  id: string;
  groupId: string;
  mentorId: string;
  date: string;
  huddleType: 'SPRINT_KICKOFF' | 'REVIEW_AND_CLINIC';
  agendaTopic: string;
  attendeeStudentIds: string[];
  absentStudentIds: string[];
  groupNotes: string;
}

export interface AiVoiceExtractionDraft {
  pillar: MentoringPillar;
  studentConcern: string;
  teacherAdvice: string;
  actionItem: {
    task: string;
    targetDate: string;
    status: 'PENDING';
  };
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'ANXIOUS' | 'CRITICAL';
  recommendedRagStatus: RagStatus;
  confidenceScore: number;
  audioDurationSeconds?: number;
  confidentialNote?: string;
}

export interface AuthorityReport {
  id: string;
  mentorId: string;
  mentorName: string;
  division: string; // e.g. "Div A", "10-A", "11-A"
  batch: string; // e.g. "Batch 2026-27"
  academicYear: string; // e.g. "2026-27"
  grade: GradeLevel;
  stream: AcademicStream;
  submittedAt: string;
  totalMentees: number;
  completedOneOnOnes: number;
  averageAttendance: number;
  summaryObservations: string;
  actionPlanForAuthority: string;
  highPriorityStudents: {
    studentId: string;
    name: string;
    rollNo: string;
    concern: string;
  }[];
  status: 'SUBMITTED' | 'REVIEWED_AND_ACKNOWLEDGED';
  authorityRemarks?: string;
  reviewedAt?: string;
}

// ================= GFM (GUARDIAN FACULTY MEMBER) SPECIFICATIONS =================

export interface StudentAccount {
  rollNo: string;
  password: string;
  studentId: string;
  name: string;
  batchId: string;
  division: string;
}

export interface AcademicGreenBookDetails {
  prn: string; // Institutional Permanent Registration Number
  admissionYear: string;
  bloodGroup: string;
  address: string;
  guardianDetails: {
    fatherName: string;
    fatherPhone: string;
    motherName: string;
    occupation: string;
  };
  termAssessments: {
    subject: string;
    marksObtained: number;
    totalMarks: number;
    attendancePercent: number;
  }[];
  cumulativeAttendance: number;
  cumulativePercentage: number;
  gfmRemarksHistory: {
    date: string;
    gfmName: string;
    remark: string;
  }[];
}

export interface MeetingHistoryEntry {
  id: string;
  studentId?: string;
  date: string;
  title: string;
  type: 'BATCH_HUDDLE' | 'ONE_ON_ONE_GUIDANCE';
  mentorName: string;
  attendanceStatus: 'PRESENT' | 'ABSENT';
  discussionSummary: string;
  guidanceGiven: string;
  keyActionTakeaways: string[];
  sealedToGreenBook: boolean;
}

export interface ParentMeetingSchedule {
  id: string;
  studentId: string;
  mentorId: string;
  mentorName: string;
  scheduledDate: string;
  timeSlot: string;
  venue: string;
  status: 'SCHEDULED' | 'CONFIRMED_BY_PARENT' | 'COMPLETED';
  parentAttendanceMode: 'IN_PERSON' | 'VIRTUAL_MEET';
  parentNotes?: string;
  dossierSummary: {
    cumulativeAttendance: number;
    sessionalAverage: number;
    gfmObservation: string;
    complianceStatus: string;
  };
}

export interface ActivityPointRecord {
  id: string;
  studentId: string;
  title: string;
  category: 'TECHNICAL_HACKATHON' | 'COMMUNITY_OUTREACH' | 'SPORTS_CULTURAL' | 'CERTIFICATIONS_MOOC';
  pointsAwarded: number;
  status: 'VERIFIED_AND_CREDITED' | 'PENDING_APPROVAL';
  date: string;
  issuingAuthority: string;
  verifiedBy?: string;
  verificationDate?: string;
}

export interface PeerTutor {
  id: string;
  name: string;
  rollNo: string;
  subject: string;
  availableTime: string;
  venue: string;
  contactNote: string;
}

export interface BuddyConnectionRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  tutorId: string;
  tutorName: string;
  tutorRollNo: string;
  subject: string;
  venue: string;
  scheduledTime: string;
  status: 'ACTIVE_STUDY_PARTNER' | 'SESSION_SCHEDULED' | 'COMPLETED';
  connectedAt: string;
  contactNote?: string;
}

export interface AcademicResource {
  id: string;
  title: string;
  subject: string;
  fileType: string;
  size: string;
  category: 'QUESTION_BANK' | 'FORMULA_SHEET' | 'PYQ' | 'BLUEPRINT';
  downloadUrl: string;
  sharedBy: string;
}

export interface ExamCountdown {
  id: string;
  title: string;
  date: string;
  daysRemaining: number;
  badgeType: 'URGENT' | 'UPCOMING' | 'INFO';
  notes: string;
}

export interface GfmAnnouncement {
  id: string;
  mentorId: string;
  mentorName: string;
  batchId: string;
  title: string;
  content: string;
  date: string;
  isMeetingNotice: boolean;
  meetingDate?: string;
  meetingTime?: string;
  venue?: string;
}

export interface StudentGrievance {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  batchId: string;
  category: 'ACADEMIC' | 'HOSTEL_CAMPUS' | 'EXAMS_EVALUATION' | 'PERSONAL_COUNSELING';
  grievanceText: string;
  status: 'SUBMITTED' | 'REVIEWED_BY_GFM' | 'RESOLVED';
  submittedAt: string;
  gfmFeedback?: string;
}

export interface GfmOneOnOneSession {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  mentorId: string;
  mentorName: string;
  batchId: string;
  status: 'INVITED' | 'IN_PROGRESS' | 'COMPLETED';
  inviteMessage: string;
  scheduledAt: string;
  audioRecordedDurationSeconds?: number;
  transcriptText?: string;
  aiSummaryPoints?: {
    identifiedBlocker: string;
    guidanceGiven: string;
    actionItemsForMentee: string[];
    suggestedFollowUpDate: string;
    riskClassification: 'GREEN' | 'AMBER' | 'HIGH_RISK';
  };
  sealedToGreenBook: boolean;
}
