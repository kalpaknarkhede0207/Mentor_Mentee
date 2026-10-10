import { 
  TeacherMentor, 
  MentorshipGroup, 
  MenteeProfile, 
  MentoringSession, 
  BatchHuddleRecord,
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
  AcademicResource,
  ExamCountdown
} from '@/types/mentorship';

export const SEED_MENTORS: TeacherMentor[] = [
  {
    id: 'mentor-1',
    name: 'Mr. R.K. Sharma',
    email: 'rk.sharma@delhipublic.edu.in',
    subject: 'Senior Physics',
    designation: 'HOD Science & Senior Wing Mentor',
    assignedGrade: 'GRADE_11',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'mentor-2',
    name: 'Mrs. Sunita Roy',
    email: 'sunita.roy@delhipublic.edu.in',
    subject: 'Senior Accountancy & Business Studies',
    designation: 'Senior Commerce Mentor & Career Guide',
    assignedGrade: 'GRADE_12',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'mentor-3',
    name: 'Dr. Ananya Sen',
    email: 'ananya.sen@delhipublic.edu.in',
    subject: 'Senior English & Humanities',
    designation: 'Academic Coordinator & Grade 10 Lead',
    assignedGrade: 'GRADE_10',
    avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80'
  }
];

export const SEED_GROUPS: MentorshipGroup[] = [
  {
    id: 'group-11a-science',
    mentorId: 'mentor-1',
    mentorName: 'Mr. R.K. Sharma',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    academicYear: '2026-27',
    huddleSchedule: {
      kickoffDay: 'MONDAY',
      kickoffTime: '08:15 AM',
      clinicDay: 'THURSDAY',
      clinicTime: '08:15 AM'
    },
    studentIds: [
      'stu-1101', 'stu-1102', 'stu-1103', 'stu-1104',
      'stu-1105', 'stu-1106', 'stu-1107', 'stu-1108',
      'stu-1109', 'stu-1110', 'stu-1111', 'stu-1112'
    ]
  },
  {
    id: 'group-12b-commerce',
    mentorId: 'mentor-2',
    mentorName: 'Mrs. Sunita Roy',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    academicYear: '2026-27',
    huddleSchedule: {
      kickoffDay: 'TUESDAY',
      kickoffTime: '08:15 AM',
      clinicDay: 'FRIDAY',
      clinicTime: '08:15 AM'
    },
    studentIds: [
      'stu-1201', 'stu-1202', 'stu-1203', 'stu-1204',
      'stu-1205', 'stu-1206', 'stu-1207', 'stu-1208',
      'stu-1209', 'stu-1210', 'stu-1211', 'stu-1212'
    ]
  },
  {
    id: 'group-10a-general',
    mentorId: 'mentor-3',
    mentorName: 'Dr. Ananya Sen',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    academicYear: '2026-27',
    huddleSchedule: {
      kickoffDay: 'MONDAY',
      kickoffTime: '08:15 AM',
      clinicDay: 'THURSDAY',
      clinicTime: '08:15 AM'
    },
    studentIds: [
      'stu-1001', 'stu-1002', 'stu-1003', 'stu-1004',
      'stu-1005', 'stu-1006', 'stu-1007', 'stu-1008',
      'stu-1009', 'stu-1010', 'stu-1011', 'stu-1012'
    ]
  }
];

export const SEED_MENTEES: MenteeProfile[] = [
  // COHORT 1: Grade 11-A (Science PCM) - Mentor: Mr. R.K. Sharma
  {
    id: 'profile-1101',
    studentId: 'stu-1101',
    name: 'Aarav Mehta',
    rollNo: '11A-01',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'aarav.m@delhischool.edu.in',
      parentPhone: '+91 98201 44521',
      parentEmail: 'sanjay.mehta@corp.in'
    },
    academicMetrics: {
      overallAttendance: 71.5,
      lastTermPercentage: 54.0,
      weakSubjects: ['Physics (Rotational Dynamics)', 'Mathematics (Calculus)'],
      competitiveAspirations: ['JEE Main', 'BITSAT']
    },
    ragRiskStatus: 'RED',
    lastOneOnOneDate: '2026-09-11T10:00:00Z',
    daysSinceLastSession: 28
  },
  {
    id: 'profile-1102',
    studentId: 'stu-1102',
    name: 'Rohan Deshmukh',
    rollNo: '11A-02',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'rohan.d@delhischool.edu.in',
      parentPhone: '+91 98112 99014',
      parentEmail: 'm.deshmukh@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 73.0,
      lastTermPercentage: 58.5,
      weakSubjects: ['Chemistry (Organic)', 'Physics'],
      competitiveAspirations: ['JEE Advanced']
    },
    ragRiskStatus: 'RED',
    lastOneOnOneDate: '2026-09-13T11:30:00Z',
    daysSinceLastSession: 26
  },
  {
    id: 'profile-1103',
    studentId: 'stu-1103',
    name: 'Ishaan Verma',
    rollNo: '11A-03',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'ishaan.v@delhischool.edu.in',
      parentPhone: '+91 98765 43210',
      parentEmail: 'verma.vikas@yahoo.com'
    },
    academicMetrics: {
      overallAttendance: 79.5,
      lastTermPercentage: 66.0,
      weakSubjects: ['Physics derivations'],
      competitiveAspirations: ['JEE Main']
    },
    ragRiskStatus: 'AMBER',
    lastOneOnOneDate: '2026-09-20T09:00:00Z',
    daysSinceLastSession: 19
  },
  {
    id: 'profile-1104',
    studentId: 'stu-1104',
    name: 'Priya Nambiar',
    rollNo: '11A-04',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'priya.n@delhischool.edu.in',
      parentPhone: '+91 99200 11234',
      parentEmail: 'nambiar.family@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 81.0,
      lastTermPercentage: 69.5,
      weakSubjects: ['Mathematics (Trigonometry)'],
      competitiveAspirations: ['IISER IAT', 'NEET']
    },
    ragRiskStatus: 'AMBER',
    lastOneOnOneDate: '2026-09-21T10:30:00Z',
    daysSinceLastSession: 18
  },
  {
    id: 'profile-1105',
    studentId: 'stu-1105',
    name: 'Tanvi Saxena',
    rollNo: '11A-05',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'tanvi.s@delhischool.edu.in',
      parentPhone: '+91 98450 88712',
      parentEmail: 'saxena.rajiv@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 80.5,
      lastTermPercentage: 71.0,
      weakSubjects: ['Physical Chemistry'],
      competitiveAspirations: ['JEE Main', 'CUET']
    },
    ragRiskStatus: 'AMBER',
    lastOneOnOneDate: '2026-09-22T08:30:00Z',
    daysSinceLastSession: 17
  },
  {
    id: 'profile-1106',
    studentId: 'stu-1106',
    name: 'Aditya Kulkarni',
    rollNo: '11A-06',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'aditya.k@delhischool.edu.in',
      parentPhone: '+91 98220 54321',
      parentEmail: 'kulkarni.hemant@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 92.0,
      lastTermPercentage: 88.5,
      weakSubjects: [],
      competitiveAspirations: ['JEE Advanced', 'Olympiad (Physics)']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-02T11:00:00Z',
    daysSinceLastSession: 7
  },
  {
    id: 'profile-1107',
    studentId: 'stu-1107',
    name: 'Diya Kapoor',
    rollNo: '11A-07',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'diya.k@delhischool.edu.in',
      parentPhone: '+91 98100 23456',
      parentEmail: 'kapoor.anil@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 89.0,
      lastTermPercentage: 84.0,
      weakSubjects: [],
      competitiveAspirations: ['JEE Main', 'Architecture NATA']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-03T10:00:00Z',
    daysSinceLastSession: 6
  },
  {
    id: 'profile-1108',
    studentId: 'stu-1108',
    name: 'Kavya Singhania',
    rollNo: '11A-08',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'kavya.s@delhischool.edu.in',
      parentPhone: '+91 97110 34567',
      parentEmail: 'singhania.p@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 95.0,
      lastTermPercentage: 92.5,
      weakSubjects: [],
      competitiveAspirations: ['JEE Advanced', 'KVPY/INSPIRE']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-04T09:30:00Z',
    daysSinceLastSession: 5
  },
  {
    id: 'profile-1109',
    studentId: 'stu-1109',
    name: 'Manish Rawat',
    rollNo: '11A-09',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'manish.r@delhischool.edu.in',
      parentPhone: '+91 98118 45678',
      parentEmail: 'rawat.sunil@rediffmail.com'
    },
    academicMetrics: {
      overallAttendance: 88.0,
      lastTermPercentage: 79.0,
      weakSubjects: ['Inorganic Chemistry'],
      competitiveAspirations: ['NDA Exam', 'JEE Main']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-09-30T10:00:00Z',
    daysSinceLastSession: 9
  },
  {
    id: 'profile-1110',
    studentId: 'stu-1110',
    name: 'Nikhil Bansal',
    rollNo: '11A-10',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'nikhil.b@delhischool.edu.in',
      parentPhone: '+91 98990 56789',
      parentEmail: 'bansal.ashok@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 87.5,
      lastTermPercentage: 81.5,
      weakSubjects: [],
      competitiveAspirations: ['JEE Main']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-01T11:30:00Z',
    daysSinceLastSession: 8
  },
  {
    id: 'profile-1111',
    studentId: 'stu-1111',
    name: 'Sanya Pillai',
    rollNo: '11A-11',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'sanya.p@delhischool.edu.in',
      parentPhone: '+91 98400 67890',
      parentEmail: 'pillai.k@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 90.0,
      lastTermPercentage: 85.0,
      weakSubjects: [],
      competitiveAspirations: ['JEE Advanced']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-05T09:00:00Z',
    daysSinceLastSession: 4
  },
  {
    id: 'profile-1112',
    studentId: 'stu-1112',
    name: 'Yuvraj Chawla',
    rollNo: '11A-12',
    grade: 'GRADE_11',
    section: '11-A',
    stream: 'SCIENCE',
    mentorId: 'mentor-1',
    contact: {
      studentEmail: 'yuvraj.c@delhischool.edu.in',
      parentPhone: '+91 98180 78901',
      parentEmail: 'chawla.harsh@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 86.0,
      lastTermPercentage: 76.5,
      weakSubjects: ['Physics Numerical Practice'],
      competitiveAspirations: ['BITSAT', 'VITEEE']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-06T10:00:00Z',
    daysSinceLastSession: 3
  },

  // COHORT 2: Grade 12-B (Commerce) - Mentor: Mrs. Sunita Roy
  {
    id: 'profile-1201',
    studentId: 'stu-1201',
    name: 'Sameer Juneja',
    rollNo: '12B-01',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'sameer.j@delhischool.edu.in',
      parentPhone: '+91 98111 22334',
      parentEmail: 'juneja.vikram@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 69.0, // Critical CBSE < 75%
      lastTermPercentage: 51.0,
      weakSubjects: ['Accountancy (Cash Flow Statements)', 'Applied Mathematics'],
      competitiveAspirations: ['CA Foundation', 'CUET']
    },
    ragRiskStatus: 'RED',
    lastOneOnOneDate: '2026-09-08T10:00:00Z',
    daysSinceLastSession: 31
  },
  {
    id: 'profile-1202',
    studentId: 'stu-1202',
    name: 'Meera Iyer',
    rollNo: '12B-02',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'meera.i@delhischool.edu.in',
      parentPhone: '+91 98200 33445',
      parentEmail: 'iyer.srinivas@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 72.5,
      lastTermPercentage: 55.5,
      weakSubjects: ['Economics (Macro)', 'Accountancy Partnership'],
      competitiveAspirations: ['IPMAT', 'CUET']
    },
    ragRiskStatus: 'RED',
    lastOneOnOneDate: '2026-09-12T11:00:00Z',
    daysSinceLastSession: 27
  },
  {
    id: 'profile-1203',
    studentId: 'stu-1203',
    name: 'Arjun Khanna',
    rollNo: '12B-03',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'arjun.k@delhischool.edu.in',
      parentPhone: '+91 98330 44556',
      parentEmail: 'khanna.neeraj@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 78.0,
      lastTermPercentage: 64.0,
      weakSubjects: ['Business Studies Case Studies'],
      competitiveAspirations: ['CUET (SRCC)', 'DU-JAT']
    },
    ragRiskStatus: 'AMBER',
    lastOneOnOneDate: '2026-09-19T10:00:00Z',
    daysSinceLastSession: 20
  },
  {
    id: 'profile-1204',
    studentId: 'stu-1204',
    name: 'Ananya Goel',
    rollNo: '12B-04',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'ananya.g@delhischool.edu.in',
      parentPhone: '+91 98104 55667',
      parentEmail: 'goel.alok@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 81.5,
      lastTermPercentage: 68.0,
      weakSubjects: ['Accountancy Company Accounts'],
      competitiveAspirations: ['CLAT', 'CUET']
    },
    ragRiskStatus: 'AMBER',
    lastOneOnOneDate: '2026-09-21T11:00:00Z',
    daysSinceLastSession: 18
  },
  {
    id: 'profile-1205',
    studentId: 'stu-1205',
    name: 'Devansh Tiwari',
    rollNo: '12B-05',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'devansh.t@delhischool.edu.in',
      parentPhone: '+91 98711 66778',
      parentEmail: 'tiwari.pradeep@rediffmail.com'
    },
    academicMetrics: {
      overallAttendance: 79.0,
      lastTermPercentage: 65.5,
      weakSubjects: ['Macro Economics'],
      competitiveAspirations: ['CUET']
    },
    ragRiskStatus: 'AMBER',
    lastOneOnOneDate: '2026-09-22T09:30:00Z',
    daysSinceLastSession: 17
  },
  {
    id: 'profile-1206',
    studentId: 'stu-1206',
    name: 'Rhea Sengupta',
    rollNo: '12B-06',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'rhea.s@delhischool.edu.in',
      parentPhone: '+91 98300 77889',
      parentEmail: 'sengupta.subir@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 94.0,
      lastTermPercentage: 91.0,
      weakSubjects: [],
      competitiveAspirations: ['CUET (St. Stephen\'s)', 'CLAT']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-02T10:30:00Z',
    daysSinceLastSession: 7
  },
  {
    id: 'profile-1207',
    studentId: 'stu-1207',
    name: 'Kabir Batra',
    rollNo: '12B-07',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'kabir.b@delhischool.edu.in',
      parentPhone: '+91 98119 88990',
      parentEmail: 'batra.manoj@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 88.5,
      lastTermPercentage: 82.0,
      weakSubjects: [],
      competitiveAspirations: ['CA Foundation', 'B.Com Hons']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-03T11:30:00Z',
    daysSinceLastSession: 6
  },
  {
    id: 'profile-1208',
    studentId: 'stu-1208',
    name: 'Simran Bajaj',
    rollNo: '12B-08',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'simran.b@delhischool.edu.in',
      parentPhone: '+91 98188 99001',
      parentEmail: 'bajaj.gurpreet@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 91.0,
      lastTermPercentage: 86.5,
      weakSubjects: [],
      competitiveAspirations: ['IPMAT IIM Indore', 'CUET']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-04T10:00:00Z',
    daysSinceLastSession: 5
  },
  {
    id: 'profile-1209',
    studentId: 'stu-1209',
    name: 'Varun Grover',
    rollNo: '12B-09',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'varun.g@delhischool.edu.in',
      parentPhone: '+91 98108 00112',
      parentEmail: 'grover.anil@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 86.0,
      lastTermPercentage: 78.0,
      weakSubjects: ['Business Law basics'],
      competitiveAspirations: ['CUET']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-09-29T11:00:00Z',
    daysSinceLastSession: 10
  },
  {
    id: 'profile-1210',
    studentId: 'stu-1210',
    name: 'Natasha Seth',
    rollNo: '12B-10',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'natasha.s@delhischool.edu.in',
      parentPhone: '+91 98710 11223',
      parentEmail: 'seth.deepak@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 89.0,
      lastTermPercentage: 83.5,
      weakSubjects: [],
      competitiveAspirations: ['CUET', 'Design NID']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-01T10:00:00Z',
    daysSinceLastSession: 8
  },
  {
    id: 'profile-1211',
    studentId: 'stu-1211',
    name: 'Hardik Taneja',
    rollNo: '12B-11',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'hardik.t@delhischool.edu.in',
      parentPhone: '+91 98991 22334',
      parentEmail: 'taneja.vinod@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 85.5,
      lastTermPercentage: 77.0,
      weakSubjects: [],
      competitiveAspirations: ['CA Foundation']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-05T10:30:00Z',
    daysSinceLastSession: 4
  },
  {
    id: 'profile-1212',
    studentId: 'stu-1212',
    name: 'Zoya Siddiqui',
    rollNo: '12B-12',
    grade: 'GRADE_12',
    section: '12-B',
    stream: 'COMMERCE',
    mentorId: 'mentor-2',
    contact: {
      studentEmail: 'zoya.s@delhischool.edu.in',
      parentPhone: '+91 98212 33445',
      parentEmail: 'siddiqui.farhan@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 92.0,
      lastTermPercentage: 87.0,
      weakSubjects: [],
      competitiveAspirations: ['CUET Economics Hons', 'IPMAT']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-06T09:30:00Z',
    daysSinceLastSession: 3
  },

  // COHORT 3: Grade 10-A (General) - Mentor: Dr. Ananya Sen
  {
    id: 'profile-1001',
    studentId: 'stu-1001',
    name: 'Karan Vashisht',
    rollNo: '10A-01',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'karan.v@delhischool.edu.in',
      parentPhone: '+91 98114 44332',
      parentEmail: 'vashisht.p@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 70.0,
      lastTermPercentage: 52.0,
      weakSubjects: ['Mathematics (Standard)', 'Science (Physics)'],
      competitiveAspirations: ['Stream Selection Dilemma (Science vs Commerce)']
    },
    ragRiskStatus: 'RED',
    lastOneOnOneDate: '2026-09-09T09:00:00Z',
    daysSinceLastSession: 30
  },
  {
    id: 'profile-1002',
    studentId: 'stu-1002',
    name: 'Tanya Bhardwaj',
    rollNo: '10A-02',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'tanya.b@delhischool.edu.in',
      parentPhone: '+91 98205 55443',
      parentEmail: 'bhardwaj.tarun@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 73.5,
      lastTermPercentage: 59.0,
      weakSubjects: ['Science (Chemistry)', 'Social Science (History)'],
      competitiveAspirations: ['Humanities vs Commerce']
    },
    ragRiskStatus: 'RED',
    lastOneOnOneDate: '2026-09-14T10:00:00Z',
    daysSinceLastSession: 25
  },
  {
    id: 'profile-1003',
    studentId: 'stu-1003',
    name: 'Reyansh Gupta',
    rollNo: '10A-03',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'reyansh.g@delhischool.edu.in',
      parentPhone: '+91 98310 66554',
      parentEmail: 'gupta.sanjay@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 78.5,
      lastTermPercentage: 67.0,
      weakSubjects: ['Mathematics (Geometry)'],
      competitiveAspirations: ['Science PCM']
    },
    ragRiskStatus: 'AMBER',
    lastOneOnOneDate: '2026-09-20T11:00:00Z',
    daysSinceLastSession: 19
  },
  {
    id: 'profile-1004',
    studentId: 'stu-1004',
    name: 'Anika Nair',
    rollNo: '10A-04',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'anika.n@delhischool.edu.in',
      parentPhone: '+91 98402 77665',
      parentEmail: 'nair.radhakrishnan@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 80.0,
      lastTermPercentage: 70.0,
      weakSubjects: ['Hindi Grammar'],
      competitiveAspirations: ['Science PCB / Medicine']
    },
    ragRiskStatus: 'AMBER',
    lastOneOnOneDate: '2026-09-21T09:30:00Z',
    daysSinceLastSession: 18
  },
  {
    id: 'profile-1005',
    studentId: 'stu-1005',
    name: 'Siddharth Jain',
    rollNo: '10A-05',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'siddharth.j@delhischool.edu.in',
      parentPhone: '+91 98117 88776',
      parentEmail: 'jain.kamal@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 79.5,
      lastTermPercentage: 66.5,
      weakSubjects: ['Science (Physics light chapter)'],
      competitiveAspirations: ['Commerce with Math']
    },
    ragRiskStatus: 'AMBER',
    lastOneOnOneDate: '2026-09-22T10:30:00Z',
    daysSinceLastSession: 17
  },
  {
    id: 'profile-1006',
    studentId: 'stu-1006',
    name: 'Miraal Hashmi',
    rollNo: '10A-06',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'miraal.h@delhischool.edu.in',
      parentPhone: '+91 98209 99887',
      parentEmail: 'hashmi.tariq@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 96.0,
      lastTermPercentage: 94.0,
      weakSubjects: [],
      competitiveAspirations: ['Science PCM / Astronomy']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-02T09:00:00Z',
    daysSinceLastSession: 7
  },
  {
    id: 'profile-1007',
    studentId: 'stu-1007',
    name: 'Pranav Murthy',
    rollNo: '10A-07',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'pranav.m@delhischool.edu.in',
      parentPhone: '+91 98453 00998',
      parentEmail: 'murthy.sundar@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 90.0,
      lastTermPercentage: 86.0,
      weakSubjects: [],
      competitiveAspirations: ['Science PCM']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-03T09:30:00Z',
    daysSinceLastSession: 6
  },
  {
    id: 'profile-1008',
    studentId: 'stu-1008',
    name: 'Khushi Aggarwal',
    rollNo: '10A-08',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'khushi.a@delhischool.edu.in',
      parentPhone: '+91 98106 11009',
      parentEmail: 'aggarwal.pankaj@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 92.5,
      lastTermPercentage: 89.0,
      weakSubjects: [],
      competitiveAspirations: ['Humanities / Psychology']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-04T11:00:00Z',
    daysSinceLastSession: 5
  },
  {
    id: 'profile-1009',
    studentId: 'stu-1009',
    name: 'Farhan Zaidi',
    rollNo: '10A-09',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'farhan.z@delhischool.edu.in',
      parentPhone: '+91 98715 22110',
      parentEmail: 'zaidi.ali@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 88.0,
      lastTermPercentage: 80.0,
      weakSubjects: ['Social Science Geography maps'],
      competitiveAspirations: ['Commerce']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-09-30T09:30:00Z',
    daysSinceLastSession: 9
  },
  {
    id: 'profile-1010',
    studentId: 'stu-1010',
    name: 'Avani Patil',
    rollNo: '10A-10',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'avani.p@delhischool.edu.in',
      parentPhone: '+91 98224 33221',
      parentEmail: 'patil.ganesh@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 91.0,
      lastTermPercentage: 84.5,
      weakSubjects: [],
      competitiveAspirations: ['Science PCB']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-01T11:00:00Z',
    daysSinceLastSession: 8
  },
  {
    id: 'profile-1011',
    studentId: 'stu-1011',
    name: 'Harshit Tyagi',
    rollNo: '10A-11',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'harshit.t@delhischool.edu.in',
      parentPhone: '+91 98993 44332',
      parentEmail: 'tyagi.naresh@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 87.0,
      lastTermPercentage: 78.5,
      weakSubjects: ['English Literature answers'],
      competitiveAspirations: ['Commerce']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-05T11:30:00Z',
    daysSinceLastSession: 4
  },
  {
    id: 'profile-1012',
    studentId: 'stu-1012',
    name: 'Sara Mathew',
    rollNo: '10A-12',
    grade: 'GRADE_10',
    section: '10-A',
    stream: 'GENERAL',
    mentorId: 'mentor-3',
    contact: {
      studentEmail: 'sara.m@delhischool.edu.in',
      parentPhone: '+91 98409 55443',
      parentEmail: 'mathew.thomas@gmail.com'
    },
    academicMetrics: {
      overallAttendance: 93.0,
      lastTermPercentage: 88.0,
      weakSubjects: [],
      competitiveAspirations: ['Humanities / Law']
    },
    ragRiskStatus: 'GREEN',
    lastOneOnOneDate: '2026-10-06T11:00:00Z',
    daysSinceLastSession: 3
  }
];

export const SEED_SESSIONS: MentoringSession[] = [
  {
    id: 'sess-101',
    sessionType: 'COMPULSORY_1_ON_1',
    mentorId: 'mentor-1',
    groupId: 'group-11a-science',
    studentId: 'stu-1101', // Aarav Mehta
    date: '2026-09-11T10:00:00Z',
    durationMinutes: 20,
    pillar: 'ACADEMIC',
    studentConcern: 'Severe anxiety regarding rotational dynamics derivations and calculus integration pacing. Struggling to balance coaching module sheets with NCERT backlog.',
    teacherAdvice: 'Focus on NCERT solved examples first before attempting advanced Level-2 modules. Attend peer clinic with Aditya Kulkarni on Thursday zero period.',
    actionItem: {
      task: 'Complete NCERT Physics Ch 7 Exercises (Q1 to Q15) and submit by Friday',
      targetDate: '2026-09-18',
      status: 'PENDING'
    },
    parentDigestSent: true,
    confidentialNote: 'Student expressed feeling overwhelmed by parent expectations for top 1000 JEE rank. Needs ongoing stress monitoring.',
    hasAiAudioSummary: true,
    audioDurationSeconds: 42,
    status: 'APPROVED_AND_SEALED'
  },
  {
    id: 'sess-102',
    sessionType: 'COMPULSORY_1_ON_1',
    mentorId: 'mentor-1',
    groupId: 'group-11a-science',
    studentId: 'stu-1106', // Aditya Kulkarni
    date: '2026-10-02T11:00:00Z',
    durationMinutes: 18,
    pillar: 'COMPETITIVE_CAREER',
    studentConcern: 'Wants guidance on balancing INPhO stage 2 olympiad prep with school mid-term exams.',
    teacherAdvice: 'Allocate 60-min daily slot after dinner strictly for INPhO problems. Keep school practical files updated proactively.',
    actionItem: {
      task: 'Submit 3 past olympiad problem sheets and verified practical file index',
      targetDate: '2026-10-12',
      status: 'COMPLETED'
    },
    parentDigestSent: true,
    hasAiAudioSummary: true,
    audioDurationSeconds: 38,
    status: 'APPROVED_AND_SEALED'
  },
  {
    id: 'sess-103',
    sessionType: 'COMPULSORY_1_ON_1',
    mentorId: 'mentor-2',
    groupId: 'group-12b-commerce',
    studentId: 'stu-1201', // Sameer Juneja
    date: '2026-09-08T10:00:00Z',
    durationMinutes: 22,
    pillar: 'DISCIPLINE_PARENT',
    studentConcern: 'Missing morning zero periods due to late-night coaching classes. Falling below 75% CBSE mandatory cutoff.',
    teacherAdvice: 'Reset sleep cycle to 11 PM to 6 AM. Must not skip school lectures as Board attendance cannot be condoned.',
    actionItem: {
      task: 'Provide parent-signed undertaking for morning punctuality and attend 100% classes this week',
      targetDate: '2026-09-15',
      status: 'PENDING'
    },
    parentDigestSent: true,
    confidentialNote: 'Father contacted on phone; committed to monitoring morning bus departure.',
    hasAiAudioSummary: true,
    audioDurationSeconds: 44,
    status: 'APPROVED_AND_SEALED'
  },
  {
    id: 'sess-104',
    sessionType: 'COMPULSORY_1_ON_1',
    mentorId: 'mentor-3',
    groupId: 'group-10a-general',
    studentId: 'stu-1001', // Karan Vashisht
    date: '2026-09-09T09:00:00Z',
    durationMinutes: 20,
    pillar: 'COMPETITIVE_CAREER',
    studentConcern: 'Parent pushing for Science PCM while student is inclined towards Commerce with Entrepreneurship. Marks dipping due to lack of interest in Standard Math.',
    teacherAdvice: 'Schedule a joint career counseling session during upcoming PTM. Introduce Aptitude Diagnostic test.',
    actionItem: {
      task: 'Take school career interest diagnostic survey and draft 3 career pathway profiles',
      targetDate: '2026-09-19',
      status: 'PENDING'
    },
    parentDigestSent: true,
    confidentialNote: 'High parental resistance anticipated. Wing Head briefing recommended before PTM.',
    hasAiAudioSummary: true,
    audioDurationSeconds: 40,
    status: 'APPROVED_AND_SEALED'
  }
];

export const SEED_HUDDLES: BatchHuddleRecord[] = [
  {
    id: 'huddle-11a-01',
    groupId: 'group-11a-science',
    mentorId: 'mentor-1',
    date: '2026-10-05T08:15:00Z',
    huddleType: 'SPRINT_KICKOFF',
    agendaTopic: 'Weekly Sprint Kickoff: Thermodynamics chapter pacing & Formula sheet audit',
    attendeeStudentIds: [
      'stu-1103', 'stu-1104', 'stu-1105', 'stu-1106',
      'stu-1107', 'stu-1108', 'stu-1109', 'stu-1110',
      'stu-1111', 'stu-1112'
    ],
    absentStudentIds: ['stu-1101', 'stu-1102'],
    groupNotes: 'Discussed high-yield formulas for Carnot engine and First Law. Aditya shared a mind-map. Aarav and Rohan absent due to morning bus delays.'
  },
  {
    id: 'huddle-12b-01',
    groupId: 'group-12b-commerce',
    mentorId: 'mentor-2',
    date: '2026-10-06T08:15:00Z',
    huddleType: 'SPRINT_KICKOFF',
    agendaTopic: 'Sprint Kickoff: Pre-Board exam timeline & Cash Flow Statement masterclass',
    attendeeStudentIds: [
      'stu-1202', 'stu-1203', 'stu-1204', 'stu-1205',
      'stu-1206', 'stu-1207', 'stu-1208', 'stu-1209',
      'stu-1210', 'stu-1211', 'stu-1212'
    ],
    absentStudentIds: ['stu-1201'],
    groupNotes: 'Covered Operating Activities adjustment tricks. Rhea highlighted common mistakes in depreciation treatment.'
  },
  {
    id: 'huddle-10a-01',
    groupId: 'group-10a-general',
    mentorId: 'mentor-3',
    date: '2026-10-05T08:15:00Z',
    huddleType: 'SPRINT_KICKOFF',
    agendaTopic: 'Sprint Kickoff: Time Management Strategy for Pre-Boards & Stream Exploration',
    attendeeStudentIds: [
      'stu-1003', 'stu-1004', 'stu-1005', 'stu-1006',
      'stu-1007', 'stu-1008', 'stu-1009', 'stu-1010',
      'stu-1011', 'stu-1012'
    ],
    absentStudentIds: ['stu-1001', 'stu-1002'],
    groupNotes: 'Emphasized daily 2-hour self-study blocks. Provided sample timetable planner templates.'
  }
];

export const SEED_AUTHORITY_REPORTS: AuthorityReport[] = [
  {
    id: 'auth-rep-101',
    mentorId: 'mentor-3',
    mentorName: 'Dr. Ananya Sen',
    division: 'Div A (10-A)',
    batch: 'Batch 2026-27',
    academicYear: '2026-27',
    grade: 'GRADE_10',
    stream: 'GENERAL',
    submittedAt: '2026-10-06T14:30:00Z',
    totalMentees: 12,
    completedOneOnOnes: 10,
    averageAttendance: 84.8,
    summaryObservations: 'Cohort showing strong foundational engagement. Shifted focus from high-stress board anxiety to continuous habit formation, self-paced study blocks, and early stream discovery. 10 of 12 mentees completed private guidance sessions.',
    actionPlanForAuthority: 'Recommend organizing a light stream orientation seminar with Senior Wing faculty. Karan Vashisht requires foundational math support; parent counseling initiated without board pressure.',
    highPriorityStudents: [
      {
        studentId: 'stu-1001',
        name: 'Karan Vashisht',
        rollNo: '10A-01',
        concern: 'Needs conceptual clarity in Standard Math; stream dilemma between Commerce and Science.'
      },
      {
        studentId: 'stu-1002',
        name: 'Tanya Bhardwaj',
        rollNo: '10A-02',
        concern: 'Chemistry formula retention friction; paired with peer mentor for weekly review.'
      }
    ],
    status: 'REVIEWED_AND_ACKNOWLEDGED',
    authorityRemarks: 'Commendable focus on student mental wellness and stream exploration. Approved additional math clinic.',
    reviewedAt: '2026-10-07T10:15:00Z'
  },
  {
    id: 'auth-rep-102',
    mentorId: 'mentor-1',
    mentorName: 'Mr. R.K. Sharma',
    division: 'Div A (11-A)',
    batch: 'Batch 2026-27',
    academicYear: '2026-27',
    grade: 'GRADE_11',
    stream: 'SCIENCE',
    submittedAt: '2026-10-07T11:00:00Z',
    totalMentees: 12,
    completedOneOnOnes: 9,
    averageAttendance: 83.5,
    summaryObservations: 'Mid-term calculus and rotational dynamics pacing discussed in Monday batch huddles. Peer study circles activated during Thursday clinic. 3 students flagged for extra conceptual assistance.',
    actionPlanForAuthority: 'Special zero-period derivation masterclasses scheduled for Friday mornings. Coordinating with physics department for extra lab exposure.',
    highPriorityStudents: [
      {
        studentId: 'stu-1101',
        name: 'Aarav Mehta',
        rollNo: '11A-01',
        concern: 'Attendance at 71.5%; academic stress around calculus backlog. Undertaking signed.'
      },
      {
        studentId: 'stu-1102',
        name: 'Rohan Deshmukh',
        rollNo: '11A-02',
        concern: 'Organic chemistry reaction mechanisms hesitation; assigned peer guide Aditya.'
      }
    ],
    status: 'SUBMITTED'
  },
  {
    id: 'auth-rep-103',
    mentorId: 'mentor-2',
    mentorName: 'Mrs. Sunita Roy',
    division: 'Div B (12-B)',
    batch: 'Batch 2026-27',
    academicYear: '2026-27',
    grade: 'GRADE_12',
    stream: 'COMMERCE',
    submittedAt: '2026-10-08T09:45:00Z',
    totalMentees: 12,
    completedOneOnOnes: 11,
    averageAttendance: 84.1,
    summaryObservations: 'Accountancy partnership company balance sheet clinics completed. Student morale is steady. Focused on CUET / IPMAT scheduling alongside school projects.',
    actionPlanForAuthority: 'Requesting permission to conduct 20-minute mock case-study discussions in alternate zero periods.',
    highPriorityStudents: [
      {
        studentId: 'stu-1201',
        name: 'Sameer Juneja',
        rollNo: '12B-01',
        concern: 'Late-night study habits impacting morning punctuality (69% attendance). Parent conference held.'
      }
    ],
    status: 'SUBMITTED'
  }
];

export const SEED_STUDENT_ACCOUNTS: StudentAccount[] = [
  { rollNo: '10A-01', password: 'password123', studentId: 'stu-1001', name: 'Karan Vashisht', batchId: 'group-10a-general', division: '10-A' },
  { rollNo: '10A-02', password: 'password123', studentId: 'stu-1002', name: 'Tanya Bhardwaj', batchId: 'group-10a-general', division: '10-A' },
  { rollNo: '11A-01', password: 'password123', studentId: 'stu-1101', name: 'Aarav Mehta', batchId: 'group-11a-science', division: '11-A' },
  { rollNo: '11A-02', password: 'password123', studentId: 'stu-1102', name: 'Rohan Deshmukh', batchId: 'group-11a-science', division: '11-A' },
  { rollNo: '11A-06', password: 'password123', studentId: 'stu-1106', name: 'Aditya Kulkarni', batchId: 'group-11a-science', division: '11-A' },
  { rollNo: '12B-01', password: 'password123', studentId: 'stu-1201', name: 'Sameer Juneja', batchId: 'group-12b-commerce', division: '12-B' },
  { rollNo: '12B-06', password: 'password123', studentId: 'stu-1206', name: 'Rhea Sengupta', batchId: 'group-12b-commerce', division: '12-B' }
];

export const SEED_GREEN_BOOKS: Record<string, AcademicGreenBookDetails> = {
  'stu-1001': {
    prn: 'PRN-2026-DL-100109',
    admissionYear: '2025-26',
    bloodGroup: 'B+',
    address: 'B-42, Sector 14, Rohini, New Delhi - 110085',
    guardianDetails: {
      fatherName: 'Prakash Vashisht',
      fatherPhone: '+91 98114 44332',
      motherName: 'Sunita Vashisht',
      occupation: 'Government Service'
    },
    termAssessments: [
      { subject: 'Standard Mathematics', marksObtained: 48, totalMarks: 100, attendancePercent: 68 },
      { subject: 'Science (Physics/Chem)', marksObtained: 54, totalMarks: 100, attendancePercent: 71 },
      { subject: 'Social Science', marksObtained: 68, totalMarks: 100, attendancePercent: 74 },
      { subject: 'English Communicative', marksObtained: 72, totalMarks: 100, attendancePercent: 82 }
    ],
    cumulativeAttendance: 70.0,
    cumulativePercentage: 52.0,
    gfmRemarksHistory: [
      { date: '2026-09-09', gfmName: 'Dr. Ananya Sen', remark: 'Advised on stream choice. Student shows keen aptitude in Commerce; standard math requires foundational revision without test pressure.' }
    ]
  },
  'stu-1101': {
    prn: 'PRN-2026-DL-110245',
    admissionYear: '2024-25',
    bloodGroup: 'O+',
    address: 'C-12, Vasant Kunj, New Delhi - 110070',
    guardianDetails: {
      fatherName: 'Sanjay Mehta',
      fatherPhone: '+91 98201 44521',
      motherName: 'Kavita Mehta',
      occupation: 'Chartered Accountant'
    },
    termAssessments: [
      { subject: 'Physics (Theory + Practical)', marksObtained: 46, totalMarks: 100, attendancePercent: 69 },
      { subject: 'Mathematics (Calculus)', marksObtained: 51, totalMarks: 100, attendancePercent: 71 },
      { subject: 'Chemistry', marksObtained: 62, totalMarks: 100, attendancePercent: 75 },
      { subject: 'English Core', marksObtained: 76, totalMarks: 100, attendancePercent: 80 }
    ],
    cumulativeAttendance: 71.5,
    cumulativePercentage: 54.0,
    gfmRemarksHistory: [
      { date: '2026-09-11', gfmName: 'Mr. R.K. Sharma', remark: 'Physics derivations need regular practice. Pacing plan created in zero period.' }
    ]
  }
};

export const SEED_ANNOUNCEMENTS: GfmAnnouncement[] = [
  {
    id: 'ann-1',
    mentorId: 'mentor-3',
    mentorName: 'Dr. Ananya Sen',
    batchId: 'group-10a-general',
    title: 'Weekly GFM Batch Meeting & Stream Discovery Session',
    content: 'All mentees of Batch 10-A must assemble for our weekly GFM meeting tomorrow at Zero Period (08:15 AM). We will discuss term project timelines and review your personal habit trackers.',
    date: '2026-10-09T08:00:00Z',
    isMeetingNotice: true,
    meetingDate: 'Today (Friday)',
    meetingTime: '08:15 AM (Zero Period)',
    venue: 'Room 204 / Audio-Visual Hall'
  },
  {
    id: 'ann-2',
    mentorId: 'mentor-1',
    mentorName: 'Mr. R.K. Sharma',
    batchId: 'group-11a-science',
    title: 'Thermodynamics Chapter Doubt Clinic & Attendance Notice',
    content: 'Students with attendance under 75% are advised to attend morning doubt clinics. We will solve Level-1 NCERT problems together.',
    date: '2026-10-08T09:30:00Z',
    isMeetingNotice: false
  }
];

export const SEED_GRIEVANCES: StudentGrievance[] = [
  {
    id: 'grv-1',
    studentId: 'stu-1001',
    studentName: 'Karan Vashisht',
    rollNo: '10A-01',
    batchId: 'group-10a-general',
    category: 'ACADEMIC',
    grievanceText: 'Facing difficulty understanding quadratic equations and trigonometry proofs in regular lectures. Need extra guidance during zero period.',
    status: 'REVIEWED_BY_GFM',
    submittedAt: '2026-10-08T15:20:00Z',
    gfmFeedback: 'Noted. Arranging a 15-minute doubt clearing session with peer tutor on Thursday.'
  },
  {
    id: 'grv-2',
    studentId: 'stu-1101',
    studentName: 'Aarav Mehta',
    rollNo: '11A-01',
    batchId: 'group-11a-science',
    category: 'PERSONAL_COUNSELING',
    grievanceText: 'Balancing school coaching with school lab work is causing extreme tiredness in morning periods.',
    status: 'SUBMITTED',
    submittedAt: '2026-10-09T10:10:00Z'
  }
];

export const SEED_GFM_ONE_ON_ONES: GfmOneOnOneSession[] = [
  {
    id: 'gfm-sess-1',
    studentId: 'stu-1001',
    studentName: 'Karan Vashisht',
    rollNo: '10A-01',
    mentorId: 'mentor-3',
    mentorName: 'Dr. Ananya Sen',
    batchId: 'group-10a-general',
    status: 'INVITED',
    inviteMessage: 'Hi Karan, let us have a quick 1-on-1 chat regarding your stream options and math practice schedule this Thursday.',
    scheduledAt: '2026-10-15T08:30:00Z',
    sealedToGreenBook: false
  }
];

export const SEED_MEETING_HISTORIES: MeetingHistoryEntry[] = [
  {
    id: 'meet-hist-1',
    studentId: 'stu-1001',
    date: '2026-10-09T08:15:00Z',
    title: 'Weekly Batch Huddle: Unit Test Review & Zero-Period Protocol',
    type: 'BATCH_HUDDLE',
    mentorName: 'Dr. Ananya Sen',
    attendanceStatus: 'ABSENT',
    discussionSummary: 'Cohort-wide analysis of Unit Test-1 results, syllabus pacing across applied sciences, and on-device grievance logging walkthrough.',
    guidanceGiven: 'Students falling below 75% attendance must mandatorily report for morning zero period. Grievances regarding physics derivations were noted for clinic allocation.',
    keyActionTakeaways: [
      'Attend mandatory morning doubt clearing at 08:15 AM',
      'Submit sessional journal entries to lab instructor before Friday',
      'Log confidential hostel or academic concerns on student dashboard'
    ],
    sealedToGreenBook: true
  },
  {
    id: 'meet-hist-2',
    studentId: 'stu-1001',
    date: '2026-10-02T08:15:00Z',
    title: 'Weekly Batch Huddle: Sessional Pacing & Mid-Term Guidelines',
    type: 'BATCH_HUDDLE',
    mentorName: 'Dr. Ananya Sen',
    attendanceStatus: 'ABSENT',
    discussionSummary: 'Briefing on continuous internal assessments, minimum attendance benchmarks, and mid-semester parent-mentor interaction schedule.',
    guidanceGiven: 'Issued caution regarding unexcused absences. Outlined peer tutoring arrangements in LH-2.',
    keyActionTakeaways: [
      'Collect Unit Test question banks from GFM repository',
      'Coordinate with peer tutor for trigonometry problem sets'
    ],
    sealedToGreenBook: true
  },
  {
    id: 'meet-hist-3',
    studentId: 'stu-1001',
    date: '2026-09-24T10:00:00Z',
    title: '1-on-1 Guidance: Academic Pacing & Habit Tracker Counseling',
    type: 'ONE_ON_ONE_GUIDANCE',
    mentorName: 'Dr. Ananya Sen',
    attendanceStatus: 'PRESENT',
    discussionSummary: 'Confidential review of Mathematics and Science test marks. Student shared feeling overwhelmed balancing daily homework with foundational concept gaps.',
    guidanceGiven: 'Prescribed 20 minutes daily formula recitation. Recommended paired study with Aarav Mehta for trigonometric derivations. Encouraged maintaining healthy sleep hours.',
    keyActionTakeaways: [
      'Daily 20-min formula practice',
      'Meet peer tutor on Tuesday and Thursday zero periods',
      'Submit weekly progress check-in to GFM cabin'
    ],
    sealedToGreenBook: true
  }
];

export const SEED_PARENT_MEETINGS: Record<string, ParentMeetingSchedule> = {
  'stu-1001': {
    id: 'pmm-1001',
    studentId: 'stu-1001',
    mentorId: 'mentor-3',
    mentorName: 'Dr. Ananya Sen',
    scheduledDate: '2026-10-24',
    timeSlot: '10:30 AM - 10:50 AM',
    venue: 'Classroom LH-2 / Mentor Cabin',
    status: 'SCHEDULED',
    parentAttendanceMode: 'IN_PERSON',
    parentNotes: 'Father will visit institute in-person to discuss Mathematics marks recovery.',
    dossierSummary: {
      cumulativeAttendance: 70.0,
      sessionalAverage: 52.0,
      gfmObservation: 'Student shows sincere attitude but has missed consecutive morning batch check-ins and requires disciplined formula practice in Mathematics.',
      complianceStatus: 'Requires attendance improvement to reach mandatory 75% threshold.'
    }
  }
};

export const SEED_ACTIVITY_POINTS: Record<string, ActivityPointRecord[]> = {
  'stu-1001': [
    {
      id: 'act-1',
      studentId: 'stu-1001',
      title: 'Annual Campus Tree Plantation & Cleanliness Drive',
      category: 'COMMUNITY_OUTREACH',
      pointsAwarded: 15,
      status: 'VERIFIED_AND_CREDITED',
      date: '2026-08-15',
      issuingAuthority: 'Institutional Social Responsibility Cell'
    },
    {
      id: 'act-2',
      studentId: 'stu-1001',
      title: 'Inter-College Science & Robotics Exhibition Participant',
      category: 'TECHNICAL_HACKATHON',
      pointsAwarded: 15,
      status: 'VERIFIED_AND_CREDITED',
      date: '2026-09-05',
      issuingAuthority: 'Technical Innovation Council'
    },
    {
      id: 'act-3',
      studentId: 'stu-1001',
      title: 'State Level Badminton Tournament (Quarter Finalist)',
      category: 'SPORTS_CULTURAL',
      pointsAwarded: 15,
      status: 'VERIFIED_AND_CREDITED',
      date: '2026-09-18',
      issuingAuthority: 'Department of Physical Education'
    }
  ]
};

export const SEED_PEER_TUTORS: PeerTutor[] = [
  {
    id: 'tutor-1',
    name: 'Aarav Mehta',
    rollNo: '11A-01',
    subject: 'Applied Mathematics & Trigonometry',
    availableTime: 'Zero Period (08:15 AM - 08:50 AM)',
    venue: 'Classroom LH-2 (Row 1-2)',
    contactNote: 'Available every Tuesday and Thursday for problem set solving.'
  },
  {
    id: 'tutor-2',
    name: 'Tanvi Saxena',
    rollNo: '11A-05',
    subject: 'Applied Chemistry & Lab Calculations',
    availableTime: 'Lunch Recess (01:00 PM - 01:30 PM)',
    venue: 'Chemistry Senior Lab',
    contactNote: 'Focuses on reaction mechanisms and lab journal review.'
  },
  {
    id: 'tutor-3',
    name: 'Aditya Kulkarni',
    rollNo: '11A-06',
    subject: 'Physics Derivations & Mechanics',
    availableTime: 'Post-Lecture (04:00 PM - 04:30 PM)',
    venue: 'Audio-Visual Hall',
    contactNote: 'Assists with NCERT Level-1 derivations and numerical doubts.'
  }
];

export const SEED_ACADEMIC_RESOURCES: AcademicResource[] = [
  {
    id: 'res-1',
    title: 'Unit Test-2 Standard Mathematics Question Bank & Solution Blueprint',
    subject: 'Mathematics',
    fileType: 'PDF',
    size: '2.4 MB',
    category: 'QUESTION_BANK',
    downloadUrl: '#',
    sharedBy: 'Dr. Ananya Sen (GFM)'
  },
  {
    id: 'res-2',
    title: 'Physics Core Derivations & Quick Formula Reference Guide',
    subject: 'Physics',
    fileType: 'PDF',
    size: '1.2 MB',
    category: 'FORMULA_SHEET',
    downloadUrl: '#',
    sharedBy: 'Mr. R.K. Sharma'
  },
  {
    id: 'res-3',
    title: 'Previous 3-Year Sessional Mid-Term Examination Papers with Marking Scheme',
    subject: 'Applied Sciences',
    fileType: 'PDF',
    size: '3.8 MB',
    category: 'PYQ',
    downloadUrl: '#',
    sharedBy: 'Academic Department'
  }
];

export const SEED_EXAM_COUNTDOWNS: ExamCountdown[] = [
  {
    id: 'cnt-1',
    title: 'Unit Test-2 Examination Cycle',
    date: '2026-10-16',
    daysRemaining: 6,
    badgeType: 'URGENT',
    notes: 'Syllabus: Chapters 3 through 5. Zero-period doubt clinics open.'
  },
  {
    id: 'cnt-2',
    title: 'Lab Journal & Sessional Submission Deadline',
    date: '2026-10-23',
    daysRemaining: 13,
    badgeType: 'URGENT',
    notes: 'Mandatory for sessional clearance and exam admit card eligibility.'
  },
  {
    id: 'cnt-3',
    title: 'Mid-Semester Exam Clearance Verification',
    date: '2026-10-28',
    daysRemaining: 18,
    badgeType: 'INFO',
    notes: 'Minimum 75% aggregate attendance required across all subjects.'
  }
];
