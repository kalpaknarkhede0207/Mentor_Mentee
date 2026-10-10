import { 
  TeacherMentor, 
  MentorshipGroup, 
  MenteeProfile, 
  MentoringSession, 
  BatchHuddleRecord,
  RagStatus,
  GradeLevel,
  AuthorityReport,
  StudentAccount,
  AcademicGreenBookDetails,
  GfmAnnouncement,
  StudentGrievance,
  GfmOneOnOneSession,
  MeetingHistoryEntry,
  ParentMeetingSchedule,
  ActivityPointRecord,
  PeerTutor,
  BuddyConnectionRecord,
  AcademicResource,
  ExamCountdown
} from '@/types/mentorship';
import { 
  SEED_MENTORS, 
  SEED_GROUPS, 
  SEED_MENTEES, 
  SEED_SESSIONS, 
  SEED_HUDDLES,
  SEED_AUTHORITY_REPORTS,
  SEED_STUDENT_ACCOUNTS,
  SEED_GREEN_BOOKS,
  SEED_ANNOUNCEMENTS,
  SEED_GRIEVANCES,
  SEED_GFM_ONE_ON_ONES,
  SEED_MEETING_HISTORIES,
  SEED_PARENT_MEETINGS,
  SEED_ACTIVITY_POINTS,
  SEED_BUDDY_CONNECTIONS,
  SEED_PEER_TUTORS,
  SEED_ACADEMIC_RESOURCES,
  SEED_EXAM_COUNTDOWNS
} from './seed-data';

// Singleton in-memory database store for dev and serverless runtime persistence
class MentorshipDatabase {
  private mentors: TeacherMentor[] = [...SEED_MENTORS];
  private groups: MentorshipGroup[] = [...SEED_GROUPS];
  private mentees: MenteeProfile[] = [...SEED_MENTEES];
  private sessions: MentoringSession[] = [...SEED_SESSIONS];
  private huddles: BatchHuddleRecord[] = [...SEED_HUDDLES];
  private authorityReports: AuthorityReport[] = [...SEED_AUTHORITY_REPORTS];
  private studentAccounts: StudentAccount[] = [...SEED_STUDENT_ACCOUNTS];
  private greenBooks: Record<string, AcademicGreenBookDetails> = { ...SEED_GREEN_BOOKS };
  private announcements: GfmAnnouncement[] = [...SEED_ANNOUNCEMENTS];
  private grievances: StudentGrievance[] = [...SEED_GRIEVANCES];
  private gfmOneOnOnes: GfmOneOnOneSession[] = [...SEED_GFM_ONE_ON_ONES];
  private meetingHistories: MeetingHistoryEntry[] = [...SEED_MEETING_HISTORIES];
  private parentMeetings: Record<string, ParentMeetingSchedule> = { ...SEED_PARENT_MEETINGS };
  private activityPoints: Record<string, ActivityPointRecord[]> = { ...SEED_ACTIVITY_POINTS };
  private buddyConnections: Record<string, BuddyConnectionRecord[]> = { ...SEED_BUDDY_CONNECTIONS };
  private peerTutors: PeerTutor[] = [...SEED_PEER_TUTORS];
  private academicResources: AcademicResource[] = [...SEED_ACADEMIC_RESOURCES];
  private examCountdowns: ExamCountdown[] = [...SEED_EXAM_COUNTDOWNS];

  constructor() {
    this.recalculateAllRagStatuses();
  }

  // --- Mentors ---
  public getMentors(): TeacherMentor[] {
    return this.mentors;
  }

  public getMentorById(id: string): TeacherMentor | undefined {
    return this.mentors.find(m => m.id === id);
  }

  // --- Groups ---
  public getGroups(mentorId?: string): MentorshipGroup[] {
    if (mentorId) {
      return this.groups.filter(g => g.mentorId === mentorId);
    }
    return this.groups;
  }

  public getGroupById(id: string): MentorshipGroup | undefined {
    return this.groups.find(g => g.id === id);
  }

  public createGroup(groupData: Omit<MentorshipGroup, 'id'>): MentorshipGroup {
    const newGroup: MentorshipGroup = {
      ...groupData,
      id: `group-${Date.now()}`
    };
    this.groups.push(newGroup);
    return newGroup;
  }

  public allocateStudentsToGroup(groupId: string, studentIds: string[]): MentorshipGroup | undefined {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return undefined;
    
    // Add unique students
    const set = new Set([...group.studentIds, ...studentIds]);
    group.studentIds = Array.from(set);

    // Update mentee mentorId
    studentIds.forEach(sId => {
      const mentee = this.mentees.find(m => m.studentId === sId);
      if (mentee) {
        mentee.mentorId = group.mentorId;
      }
    });

    return group;
  }

  // --- Mentees ---
  public getMentees(filters?: { mentorId?: string; grade?: GradeLevel; ragStatus?: RagStatus }): MenteeProfile[] {
    let result = [...this.mentees];
    if (filters?.mentorId) {
      result = result.filter(m => m.mentorId === filters.mentorId);
    }
    if (filters?.grade) {
      result = result.filter(m => m.grade === filters.grade);
    }
    if (filters?.ragStatus) {
      result = result.filter(m => m.ragRiskStatus === filters.ragStatus);
    }
    return result;
  }

  public getMenteeById(studentIdOrProfileId: string): MenteeProfile | undefined {
    return this.mentees.find(m => m.studentId === studentIdOrProfileId || m.id === studentIdOrProfileId);
  }

  public updateMentee(studentId: string, updates: Partial<MenteeProfile>): MenteeProfile | undefined {
    const index = this.mentees.findIndex(m => m.studentId === studentId || m.id === studentId);
    if (index === -1) return undefined;

    this.mentees[index] = {
      ...this.mentees[index],
      ...updates
    };

    this.recalculateRagStatus(this.mentees[index]);
    return this.mentees[index];
  }

  public deleteMentee(studentIdOrProfileId: string): boolean {
    const initialLen = this.mentees.length;
    this.mentees = this.mentees.filter(m => m.studentId !== studentIdOrProfileId && m.id !== studentIdOrProfileId);
    return this.mentees.length < initialLen;
  }

  // --- Sessions ---
  public getSessions(filters?: { mentorId?: string; studentId?: string; groupId?: string }): MentoringSession[] {
    let result = [...this.sessions];
    if (filters?.mentorId) {
      result = result.filter(s => s.mentorId === filters.mentorId);
    }
    if (filters?.studentId) {
      result = result.filter(s => s.studentId === filters.studentId);
    }
    if (filters?.groupId) {
      result = result.filter(s => s.groupId === filters.groupId);
    }
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getSessionById(id: string): MentoringSession | undefined {
    return this.sessions.find(s => s.id === id);
  }

  public createSession(sessionData: Omit<MentoringSession, 'id'>): MentoringSession {
    const newSession: MentoringSession = {
      ...sessionData,
      id: `sess-${Date.now()}`
    };
    this.sessions.unshift(newSession);

    // If 1-on-1 session is approved, update mentee's last session date
    if (newSession.studentId && newSession.status === 'APPROVED_AND_SEALED') {
      const mentee = this.mentees.find(m => m.studentId === newSession.studentId);
      if (mentee) {
        mentee.lastOneOnOneDate = newSession.date;
        mentee.daysSinceLastSession = 0;
        this.recalculateRagStatus(mentee);
      }
    }

    return newSession;
  }

  public updateSession(id: string, updates: Partial<MentoringSession>): MentoringSession | undefined {
    const index = this.sessions.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    this.sessions[index] = {
      ...this.sessions[index],
      ...updates
    };

    const updated = this.sessions[index];
    if (updated.studentId && updated.status === 'APPROVED_AND_SEALED') {
      const mentee = this.mentees.find(m => m.studentId === updated.studentId);
      if (mentee) {
        mentee.lastOneOnOneDate = updated.date;
        mentee.daysSinceLastSession = 0;
        this.recalculateRagStatus(mentee);
      }
    }

    return updated;
  }

  // --- Huddles ---
  public getHuddles(groupId?: string): BatchHuddleRecord[] {
    if (groupId) {
      return this.huddles.filter(h => h.groupId === groupId);
    }
    return [...this.huddles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public createHuddle(huddleData: Omit<BatchHuddleRecord, 'id'>): BatchHuddleRecord {
    const newHuddle: BatchHuddleRecord = {
      ...huddleData,
      id: `huddle-${Date.now()}`
    };
    this.huddles.unshift(newHuddle);
    return newHuddle;
  }

  // --- Authority Reports (Div, Batch, Year Reporting) ---
  public getAuthorityReports(filters?: { division?: string; batch?: string; academicYear?: string; mentorId?: string }): AuthorityReport[] {
    let result = [...this.authorityReports];
    if (filters?.division && filters.division !== 'ALL') {
      result = result.filter(r => r.division.toLowerCase().includes(filters.division!.toLowerCase()));
    }
    if (filters?.batch && filters.batch !== 'ALL') {
      result = result.filter(r => r.batch.toLowerCase().includes(filters.batch!.toLowerCase()));
    }
    if (filters?.academicYear && filters.academicYear !== 'ALL') {
      result = result.filter(r => r.academicYear === filters.academicYear);
    }
    if (filters?.mentorId && filters.mentorId !== 'ALL') {
      result = result.filter(r => r.mentorId === filters.mentorId);
    }
    return result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  public getAuthorityReportById(id: string): AuthorityReport | undefined {
    return this.authorityReports.find(r => r.id === id);
  }

  public createAuthorityReport(reportData: Omit<AuthorityReport, 'id' | 'submittedAt'>): AuthorityReport {
    const newReport: AuthorityReport = {
      ...reportData,
      id: `auth-rep-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    this.authorityReports.unshift(newReport);
    return newReport;
  }

  public acknowledgeAuthorityReport(id: string, authorityRemarks: string): AuthorityReport | undefined {
    const index = this.authorityReports.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    this.authorityReports[index].status = 'REVIEWED_AND_ACKNOWLEDGED';
    this.authorityReports[index].authorityRemarks = authorityRemarks;
    this.authorityReports[index].reviewedAt = new Date().toISOString();
    return this.authorityReports[index];
  }

  // --- GFM Specific Operations ---

  public authenticateStudent(rollNo: string, password?: string): StudentAccount | undefined {
    const acc = this.studentAccounts.find(s => s.rollNo.toLowerCase() === rollNo.trim().toLowerCase());
    if (!acc) return undefined;
    if (password && acc.password !== password) return undefined;
    return acc;
  }

  public getGreenBook(studentId: string): AcademicGreenBookDetails | undefined {
    if (this.greenBooks[studentId]) {
      return this.greenBooks[studentId];
    }
    // Generate synthetic realistic Academic Green Book if not hardcoded
    const mentee = this.mentees.find(m => m.studentId === studentId);
    if (!mentee) return undefined;
    
    return {
      prn: `PRN-2026-${mentee.section}-${mentee.rollNo.replace(/[^0-9]/g, '') || '101'}`,
      admissionYear: '2025-26',
      bloodGroup: 'B+',
      address: 'Hostel Block-A / Sector 12, Delhi NCR',
      guardianDetails: {
        fatherName: 'Guardian of ' + mentee.name,
        fatherPhone: mentee.contact.parentPhone,
        motherName: 'Mother of ' + mentee.name,
        occupation: 'Professional'
      },
      termAssessments: [
        { subject: 'Applied Core I', marksObtained: Math.round(mentee.academicMetrics.lastTermPercentage * 0.95), totalMarks: 100, attendancePercent: mentee.academicMetrics.overallAttendance },
        { subject: 'Applied Core II', marksObtained: Math.round(mentee.academicMetrics.lastTermPercentage * 1.05), totalMarks: 100, attendancePercent: mentee.academicMetrics.overallAttendance + 2 },
        { subject: 'Elective & Lab', marksObtained: Math.round(mentee.academicMetrics.lastTermPercentage), totalMarks: 100, attendancePercent: mentee.academicMetrics.overallAttendance }
      ],
      cumulativeAttendance: mentee.academicMetrics.overallAttendance,
      cumulativePercentage: mentee.academicMetrics.lastTermPercentage,
      gfmRemarksHistory: [
        { date: '2026-09-10', gfmName: 'Assigned GFM', remark: 'Initial batch counseling and orientation completed.' }
      ]
    };
  }

  public getAnnouncements(batchId?: string): GfmAnnouncement[] {
    if (batchId) {
      const filtered = this.announcements.filter(a => 
        a.batchId === batchId || 
        a.batchId === 'ALL' || 
        a.batchId.toLowerCase().includes('general')
      );
      if (filtered.length > 0) {
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    }
    return [...this.announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getAnnouncementById(id: string): GfmAnnouncement | undefined {
    if (id === 'latest') {
      return this.announcements.find(a => a.isMeetingNotice) || this.announcements[0];
    }
    return this.announcements.find(a => a.id === id);
  }

  public createAnnouncement(annData: Omit<GfmAnnouncement, 'id' | 'date'>): GfmAnnouncement {
    const newAnn: GfmAnnouncement = {
      ...annData,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString()
    };
    this.announcements.unshift(newAnn);
    return newAnn;
  }

  public getGrievances(batchId?: string, studentId?: string): StudentGrievance[] {
    let result = [...this.grievances];
    if (batchId) result = result.filter(g => g.batchId === batchId);
    if (studentId) result = result.filter(g => g.studentId === studentId);
    return result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  public createGrievance(grvData: Omit<StudentGrievance, 'id' | 'submittedAt' | 'status'>): StudentGrievance {
    const newGrv: StudentGrievance = {
      ...grvData,
      id: `grv-${Date.now()}`,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString()
    };
    this.grievances.unshift(newGrv);
    return newGrv;
  }

  public resolveGrievance(id: string, feedback: string): StudentGrievance | undefined {
    const index = this.grievances.findIndex(g => g.id === id);
    if (index === -1) return undefined;
    this.grievances[index].status = 'RESOLVED';
    this.grievances[index].gfmFeedback = feedback;
    return this.grievances[index];
  }

  public getGfmOneOnOnes(mentorId?: string, studentId?: string): GfmOneOnOneSession[] {
    let result = [...this.gfmOneOnOnes];
    if (mentorId) result = result.filter(s => s.mentorId === mentorId);
    if (studentId) result = result.filter(s => s.studentId === studentId);
    return result.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }

  public getGfmOneOnOneById(id: string): GfmOneOnOneSession | undefined {
    return this.gfmOneOnOnes.find(s => s.id === id);
  }

  public createGfmInvite(studentId: string, mentorId: string, inviteMessage: string, scheduledAt: string): GfmOneOnOneSession | undefined {
    const mentee = this.mentees.find(m => m.studentId === studentId);
    const mentor = this.mentors.find(m => m.id === mentorId);
    if (!mentee || !mentor) return undefined;

    const newInvite: GfmOneOnOneSession = {
      id: `gfm-sess-${Date.now()}`,
      studentId: mentee.studentId,
      studentName: mentee.name,
      rollNo: mentee.rollNo,
      mentorId: mentor.id,
      mentorName: mentor.name,
      batchId: `group-${mentee.grade.toLowerCase()}`,
      status: 'INVITED',
      inviteMessage,
      scheduledAt: scheduledAt || new Date().toISOString(),
      sealedToGreenBook: false
    };

    this.gfmOneOnOnes.unshift(newInvite);
    return newInvite;
  }

  public completeGfmSession(
    sessionId: string, 
    transcriptText: string, 
    aiSummaryPoints: any, 
    audioSeconds: number,
    studentId?: string,
    mentorId?: string
  ): GfmOneOnOneSession | undefined {
    let index = this.gfmOneOnOnes.findIndex(s => s.id === sessionId);

    // If not found by sessionId, find active or invited session for this student
    if (index === -1 && studentId) {
      index = this.gfmOneOnOnes.findIndex(s => s.studentId === studentId && s.status !== 'COMPLETED');
    }

    // If still not found, create a new completed session on the fly
    if (index === -1) {
      const targetStudentId = studentId || sessionId;
      const mentee = this.mentees.find(m => m.studentId === targetStudentId || m.id === targetStudentId);
      const mentor = this.mentors.find(m => m.id === mentorId) || this.mentors[0];

      if (mentee) {
        const newSession: GfmOneOnOneSession = {
          id: sessionId.startsWith('gfm-sess-') ? sessionId : `gfm-sess-${Date.now()}`,
          studentId: mentee.studentId,
          studentName: mentee.name,
          rollNo: mentee.rollNo,
          mentorId: mentor?.id || 'mentor-3',
          mentorName: mentor?.name || 'Dr. Ananya Sen',
          batchId: `group-${mentee.grade.toLowerCase()}`,
          status: 'COMPLETED',
          inviteMessage: '1-on-1 Guidance Session',
          scheduledAt: new Date().toISOString(),
          audioRecordedDurationSeconds: audioSeconds,
          transcriptText,
          aiSummaryPoints,
          sealedToGreenBook: true
        };
        this.gfmOneOnOnes.unshift(newSession);

        // Ensure green book exists and append remark
        this.getGreenBook(mentee.studentId);
        if (this.greenBooks[mentee.studentId]) {
          this.greenBooks[mentee.studentId].gfmRemarksHistory.unshift({
            date: new Date().toISOString().split('T')[0],
            gfmName: newSession.mentorName,
            remark: `1-on-1 Guidance Session: ${aiSummaryPoints.identifiedBlocker || 'Academic & habit review'}. Action: ${aiSummaryPoints.actionItemsForMentee?.[0] || 'Continued follow-up'}.`
          });
        }

        mentee.lastOneOnOneDate = new Date().toISOString();
        mentee.daysSinceLastSession = 0;
        this.recalculateRagStatus(mentee);

        return newSession;
      }
      return undefined;
    }

    this.gfmOneOnOnes[index].status = 'COMPLETED';
    this.gfmOneOnOnes[index].transcriptText = transcriptText;
    this.gfmOneOnOnes[index].aiSummaryPoints = aiSummaryPoints;
    this.gfmOneOnOnes[index].audioRecordedDurationSeconds = audioSeconds;
    this.gfmOneOnOnes[index].sealedToGreenBook = true;

    // Update Green Book remarks history
    const sId = this.gfmOneOnOnes[index].studentId;
    this.getGreenBook(sId);
    if (this.greenBooks[sId]) {
      this.greenBooks[sId].gfmRemarksHistory.unshift({
        date: new Date().toISOString().split('T')[0],
        gfmName: this.gfmOneOnOnes[index].mentorName,
        remark: `1-on-1 Guidance Session: ${aiSummaryPoints.identifiedBlocker || 'Academic & habit review'}. Action: ${aiSummaryPoints.actionItemsForMentee?.[0] || 'Continued follow-up'}.`
      });
    }

    const mentee = this.mentees.find(m => m.studentId === sId);
    if (mentee) {
      mentee.lastOneOnOneDate = new Date().toISOString();
      mentee.daysSinceLastSession = 0;
      this.recalculateRagStatus(mentee);
    }

    return this.gfmOneOnOnes[index];
  }

  // --- Meeting Histories ---
  public getMeetingHistories(studentId?: string): MeetingHistoryEntry[] {
    if (studentId) {
      return this.meetingHistories
        .filter(m => !m.studentId || m.studentId === studentId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [...this.meetingHistories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // --- Parent-Mentor Meetings (PMM) ---
  public getParentMeeting(studentId: string): ParentMeetingSchedule | undefined {
    if (this.parentMeetings[studentId]) {
      return this.parentMeetings[studentId];
    }
    const mentee = this.mentees.find(m => m.studentId === studentId);
    if (!mentee) return undefined;

    const defaultPmm: ParentMeetingSchedule = {
      id: `pmm-${studentId}`,
      studentId,
      mentorId: mentee.mentorId || 'mentor-3',
      mentorName: 'Dr. Ananya Sen',
      scheduledDate: '2026-10-24',
      timeSlot: '10:30 AM - 10:50 AM',
      venue: 'Classroom LH-2 / GFM Cabin',
      status: 'SCHEDULED',
      parentAttendanceMode: 'IN_PERSON',
      parentNotes: 'Father / Guardian invited for mid-semester progress review.',
      dossierSummary: {
        cumulativeAttendance: mentee.academicMetrics.overallAttendance,
        sessionalAverage: mentee.academicMetrics.lastTermPercentage,
        gfmObservation: `${mentee.name} academic performance stands at ${mentee.academicMetrics.lastTermPercentage}%. Attendance is ${mentee.academicMetrics.overallAttendance}%.`,
        complianceStatus: mentee.academicMetrics.overallAttendance < 75 
          ? 'Requires attendance recovery to reach mandatory 75% threshold.' 
          : 'Compliant with mandatory 75% attendance threshold.'
      }
    };
    this.parentMeetings[studentId] = defaultPmm;
    return defaultPmm;
  }

  public updateParentMeetingAcknowledgment(studentId: string, mode: 'IN_PERSON' | 'VIRTUAL_MEET', notes?: string): ParentMeetingSchedule | undefined {
    const existing = this.getParentMeeting(studentId);
    if (!existing) return undefined;
    existing.parentAttendanceMode = mode;
    if (notes) existing.parentNotes = notes;
    existing.status = 'CONFIRMED_BY_PARENT';
    return existing;
  }

  // --- Student Activity Points ---
  public getActivityPoints(studentId: string): ActivityPointRecord[] {
    if (!this.activityPoints[studentId] || this.activityPoints[studentId].length === 0) {
      const mentee = this.mentees.find(m => m.studentId === studentId);
      if (mentee) {
        this.activityPoints[studentId] = [
          {
            id: `act-${studentId}-1`,
            studentId,
            title: 'Campus Environmental Sustainability & Cleanliness Initiative',
            category: 'COMMUNITY_OUTREACH',
            pointsAwarded: 15,
            status: 'VERIFIED_AND_CREDITED',
            date: '2026-08-20',
            issuingAuthority: 'Institutional Social Responsibility Cell',
            verifiedBy: 'Dr. Ananya Sen',
            verificationDate: '2026-08-24'
          },
          {
            id: `act-${studentId}-2`,
            studentId,
            title: 'Inter-Department Science & Engineering Innovation Exhibition',
            category: 'TECHNICAL_HACKATHON',
            pointsAwarded: 20,
            status: 'VERIFIED_AND_CREDITED',
            date: '2026-09-10',
            issuingAuthority: 'Technical Student Council',
            verifiedBy: 'Dr. Ananya Sen',
            verificationDate: '2026-09-15'
          },
          {
            id: `act-${studentId}-3`,
            studentId,
            title: 'Skill Development Certificate: Technical Communication & Drafting',
            category: 'CERTIFICATIONS_MOOC',
            pointsAwarded: 15,
            status: 'PENDING_APPROVAL',
            date: '2026-10-02',
            issuingAuthority: 'National Technical Skill Registry'
          }
        ];
      }
    }
    return this.activityPoints[studentId] || [];
  }

  public submitActivityPoint(studentId: string, item: Omit<ActivityPointRecord, 'id' | 'status'>): ActivityPointRecord {
    if (!this.activityPoints[studentId]) {
      this.activityPoints[studentId] = [];
    }
    const newRecord: ActivityPointRecord = {
      ...item,
      id: `act-${Date.now()}`,
      status: 'PENDING_APPROVAL'
    };
    this.activityPoints[studentId].unshift(newRecord);
    return newRecord;
  }

  public verifyActivityPoint(studentId: string, pointId: string, verifiedBy: string = 'Dr. Ananya Sen'): ActivityPointRecord | undefined {
    const list = this.getActivityPoints(studentId);
    const target = list.find(p => p.id === pointId);
    if (!target) return undefined;
    target.status = 'VERIFIED_AND_CREDITED';
    target.verifiedBy = verifiedBy;
    target.verificationDate = new Date().toISOString().split('T')[0];
    return target;
  }

  // --- Study Buddies & Peer Tutor Connections ---
  public getBuddyConnections(studentId?: string): BuddyConnectionRecord[] {
    if (studentId) {
      if (!this.buddyConnections[studentId] || this.buddyConnections[studentId].length === 0) {
        const mentee = this.mentees.find(m => m.studentId === studentId);
        if (mentee) {
          const weak = mentee.academicMetrics.weakSubjects[0] || 'Mathematics';
          const tutor = this.peerTutors.find(t => t.subject.toLowerCase().includes(weak.toLowerCase())) || this.peerTutors[0];
          this.buddyConnections[studentId] = [
            {
              id: `buddy-${studentId}-1`,
              studentId,
              studentName: mentee.name,
              rollNo: mentee.rollNo,
              tutorId: tutor.id,
              tutorName: tutor.name,
              tutorRollNo: tutor.rollNo,
              subject: tutor.subject,
              venue: tutor.venue,
              scheduledTime: tutor.availableTime,
              status: 'ACTIVE_STUDY_PARTNER',
              connectedAt: '2026-09-18',
              contactNote: `Remedial peer coaching initiated for ${weak}.`
            }
          ];
        }
      }
      return this.buddyConnections[studentId] || [];
    }
    return Object.values(this.buddyConnections).flat();
  }

  public connectWithPeerTutor(connection: Omit<BuddyConnectionRecord, 'id' | 'connectedAt'>): BuddyConnectionRecord {
    if (!this.buddyConnections[connection.studentId]) {
      this.buddyConnections[connection.studentId] = [];
    }
    const newConn: BuddyConnectionRecord = {
      ...connection,
      id: `buddy-${Date.now()}`,
      connectedAt: new Date().toISOString().split('T')[0]
    };
    this.buddyConnections[connection.studentId].unshift(newConn);
    return newConn;
  }

  // --- Peer Tutors ---
  public getPeerTutors(): PeerTutor[] {
    return this.peerTutors;
  }

  // --- Academic Resources & Exam Countdowns ---
  public getAcademicResources(): AcademicResource[] {
    return this.academicResources;
  }

  public getExamCountdowns(): ExamCountdown[] {
    return this.examCountdowns;
  }

  // --- Meeting Truancy & Parent Alert ---
  public notifyParentOfMeetingAbsence(studentId: string, customMessage?: string): { success: boolean; message: string; mentee?: MenteeProfile } {
    const mentee = this.mentees.find(m => m.studentId === studentId);
    if (!mentee) {
      return { success: false, message: 'Student not found in batch roster.' };
    }
    mentee.parentAlertIssued = true;
    mentee.parentAlertTimestamp = new Date().toISOString();
    mentee.missingMeetingCount = Math.max(mentee.missingMeetingCount || 2, 2);

    // Also record an entry in green book remarks history
    const gb = this.getGreenBook(studentId);
    if (gb) {
      gb.gfmRemarksHistory.unshift({
        date: new Date().toISOString().split('T')[0],
        gfmName: 'Dr. Ananya Sen',
        remark: `Meeting Truancy Notice: Parent alerted for unexcused absences in consecutive batch mentorship check-ins.`
      });
    }

    return { 
      success: true, 
      message: `Official absence escalation dispatched to ${mentee.contact.parentPhone} (${mentee.contact.parentEmail}).`,
      mentee
    };
  }

  // --- Coordinator Operations ---
  public getCoordinatorData() {
    const totalMentors = this.mentors.length;
    const totalStudents = this.mentees.length;
    const reports = [...this.authorityReports].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const mentorsData = this.mentors.map(mentor => {
      // Find mentees assigned to this mentor
      const assignedMentees = this.mentees.filter(m => m.mentorId === mentor.id);
      
      // CRITICAL: STRICTLY student names only for privacy/minimal view!
      const studentNames = assignedMentees.map(m => m.name);

      // Reports submitted by this mentor
      const mentorReports = reports.filter(r => r.mentorId === mentor.id);
      
      // Huddles / Meetings conducted
      const mentorHuddles = this.huddles.filter(h => h.mentorId === mentor.id);

      // Current Division / Batch assigned
      const mentorGroup = this.groups.find(g => g.mentorId === mentor.id);
      let division = 'Div-A';
      let batch = 'Batch-1';
      if (mentorGroup) {
        division = mentorGroup.section.includes('10') ? 'Div-A' : mentorGroup.section.includes('11') ? 'Div-B' : 'Div-C';
        batch = mentorGroup.section.includes('10') ? 'Batch-1' : mentorGroup.section.includes('11') ? 'Batch-2' : 'Batch-3';
      }

      // Activity Flag according to report submission & meeting cadence:
      // Green: >= 1 report submitted AND active meetings
      // Orange: Report submitted OR active meetings
      // Red: 0 reports AND 0 meetings (defaulter)
      let activityFlag: 'GREEN' | 'ORANGE' | 'RED' = 'RED';
      let activityFlagReason = 'Overdue: No mentee reports submitted to coordinator';

      if (mentorReports.length >= 1 && mentorHuddles.length >= 1) {
        activityFlag = 'GREEN';
        activityFlagReason = `Compliant: ${mentorReports.length} reports submitted & regular batch meetings active`;
      } else if (mentorReports.length >= 1 || mentorHuddles.length >= 1) {
        activityFlag = 'ORANGE';
        activityFlagReason = mentorReports.length === 0 
          ? 'Meeting logged but official batch report pending submission' 
          : 'Report submitted, next cycle meeting check pending';
      }

      return {
        id: mentor.id,
        name: mentor.name,
        subject: mentor.subject,
        designation: mentor.designation,
        avatarUrl: mentor.avatarUrl,
        division,
        batch,
        totalMentees: assignedMentees.length,
        studentNames, // Strictly names only!
        reportsCount: mentorReports.length,
        huddlesCount: mentorHuddles.length,
        lastReportDate: mentorReports[0]?.submittedAt || null,
        activityFlag,
        activityFlagReason
      };
    });

    return {
      totalMentors,
      totalStudents,
      totalReports: reports.length,
      reports,
      mentors: mentorsData
    };
  }

  public allocateMentorToBatch(mentorId: string, division: string, batch: string): boolean {
    const mentor = this.mentors.find(m => m.id === mentorId);
    if (!mentor) return false;

    // Find section corresponding to division
    let targetSection = division === 'Div-A' ? '10-A' : division === 'Div-B' ? '11-A' : '12-B';
    
    // Update group mentor
    const group = this.groups.find(g => g.section === targetSection);
    if (group) {
      group.mentorId = mentor.id;
      group.mentorName = mentor.name;
    }

    // Update mentees in that section
    this.mentees.forEach(m => {
      if (m.section === targetSection) {
        m.mentorId = mentor.id;
      }
    });

    return true;
  }

  // --- RAG Early Warning Engine ---
  private recalculateRagStatus(mentee: MenteeProfile): void {
    const att = mentee.academicMetrics.overallAttendance;
    const days = mentee.daysSinceLastSession;
    const weakSubjectsCount = mentee.academicMetrics.weakSubjects.length;
    const marks = mentee.academicMetrics.lastTermPercentage;

    // Red Alert Thresholds:
    // 1. Attendance < 75% (CBSE board exam mandatory threshold)
    // 2. Failing/low marks (< 60%) with 2+ weak subjects
    // 3. > 25 days without compulsory 1-on-1 session
    if (att < 75 || days > 25 || (marks < 60 && weakSubjectsCount >= 2)) {
      mentee.ragRiskStatus = 'RED';
    } 
    // Amber Thresholds:
    // 1. Attendance 75% - 82%
    // 2. > 18 days without 1-on-1
    // 3. Dipping marks (60% - 72%) or 1+ weak subjects
    else if (att < 83 || days > 17 || marks < 72 || weakSubjectsCount > 0) {
      mentee.ragRiskStatus = 'AMBER';
    } 
    // Green Status:
    // Attendance > 85%, marks > 75%, active 1-on-1 logged within 17 days
    else {
      mentee.ragRiskStatus = 'GREEN';
    }
  }

  private recalculateAllRagStatuses(): void {
    this.mentees.forEach(m => this.recalculateRagStatus(m));
  }
}

// Global declaration for hot reload singleton in Next.js dev
const globalForDb = globalThis as unknown as {
  mentorshipDb?: MentorshipDatabase;
};

export const db = globalForDb.mentorshipDb ?? new MentorshipDatabase();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.mentorshipDb = db;
}
