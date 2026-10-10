'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Flame, 
  FileText, 
  User, 
  Send, 
  BookOpen, 
  Target, 
  Award,
  Sparkles,
  HeartHandshake,
  Lightbulb,
  Check,
  Compass
} from 'lucide-react';
import { MenteeProfile, MentoringSession, TeacherMentor } from '@/types/mentorship';
import { SEED_MENTORS, SEED_MENTEES } from '@/lib/db/seed-data';
import { RagBadge } from '@/components/mentorship/RagBadge';

export default function StudentSpacePage() {
  // Default to a Grade 10 student to highlight the non-board simple foundational flow
  const [studentId, setStudentId] = useState('stu-1001'); // Karan Vashisht (Grade 10-A)
  const [menteesList, setMenteesList] = useState<MenteeProfile[]>(SEED_MENTEES);
  const [mentee, setMentee] = useState<MenteeProfile | null>(() => SEED_MENTEES.find(m => m.studentId === 'stu-1001') || SEED_MENTEES[0]);
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [loading, setLoading] = useState(false);

  // Guidance request state
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotTopic, setSlotTopic] = useState('');
  const [slotSubmitted, setSlotSubmitted] = useState(false);

  // Interactive Action Items Checklist
  const [localActionItems, setLocalActionItems] = useState<{ id: string; task: string; targetDate: string; completed: boolean }[]>([
    {
      id: 'task-1',
      task: 'Take school career & stream interest exploration survey',
      targetDate: '2026-10-18',
      completed: false
    },
    {
      id: 'task-2',
      task: 'Solve 10 practice problems in Standard Math with study partner',
      targetDate: '2026-10-20',
      completed: true
    },
    {
      id: 'task-3',
      task: 'Maintain consistent 2-hour daily evening revision routine',
      targetDate: '2026-10-22',
      completed: false
    }
  ]);

  // Fetch all mentees for switching & load current student
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/mentorship/mentees');
        const json = await res.json();
        if (json.success) {
          setMenteesList(json.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchCurrentStudent = async () => {
      setLoading(true);
      try {
        const [menteeRes, sessionsRes] = await Promise.all([
          fetch(`/api/mentorship/mentees?studentId=${studentId}`),
          fetch(`/api/mentorship/sessions?studentId=${studentId}`)
        ]);

        const menteeJson = await menteeRes.json();
        const sessionsJson = await sessionsRes.json();

        if (menteeJson.success) {
          setMentee(menteeJson.data);
        }
        if (sessionsJson.success) {
          setSessions(sessionsJson.data);
          // populate action items from sessions if available
          const itemsFromSessions = sessionsJson.data
            .filter((s: MentoringSession) => s.actionItem)
            .map((s: MentoringSession, idx: number) => ({
              id: `task-sess-${idx}`,
              task: s.actionItem!.task,
              targetDate: s.actionItem!.targetDate,
              completed: s.actionItem!.status === 'COMPLETED'
            }));
          if (itemsFromSessions.length > 0) {
            setLocalActionItems(itemsFromSessions);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentStudent();
  }, [studentId]);

  const toggleTask = (id: string) => {
    setLocalActionItems(prev =>
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const handleRequestSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setSlotSubmitted(true);
    setTimeout(() => {
      setShowSlotModal(false);
      setSlotSubmitted(false);
      setSlotTopic('');
    }, 2000);
  };

  const mentorObj: TeacherMentor = SEED_MENTORS.find(m => m.id === mentee?.mentorId) || SEED_MENTORS[0];

  const isJuniorSenior = mentee?.grade === 'GRADE_9' || mentee?.grade === 'GRADE_10';

  return (
    <div className="space-y-6">
      {/* Student Profile Switcher Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-3 py-1 rounded-full uppercase">
              Student Space &bull; Class {mentee?.section || '10-A'}
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-0.5 rounded-full">
              {isJuniorSenior ? 'Foundational Stage (Grades 9–10)' : 'Senior Stage (Grades 11–12)'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hello, {mentee?.name || 'Karan Vashisht'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Your Teacher Mentor is <strong>{mentorObj.name}</strong> ({mentorObj.subject}). 
            Division: <strong>{mentee?.section}</strong> &bull; Roll No: <strong>{mentee?.rollNo}</strong>.
          </p>
        </div>

        {/* Actions: Request Guidance & Switch student */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowSlotModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <HeartHandshake className="w-4 h-4 text-indigo-200" />
            <span>Ask {mentorObj.name.split(' ')[0]} for Guidance</span>
          </button>

          <a
            href={`/api/mentorship/export-crc?studentId=${studentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-xs transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Cumulative Record</span>
          </a>

          {/* Student Switcher dropdown */}
          <div className="relative">
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {menteesList.map((m) => (
                <option key={m.studentId} value={m.studentId}>
                  Switch to: {m.name} ({m.section} - {m.grade.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards: Clean & Supportive without Board Pressure for 9-10 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Academic Growth Focus (Foundational Milestone for 9-10) */}
        {isJuniorSenior ? (
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-300" />
                <span>Foundational Term Milestones</span>
              </span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full font-semibold">
                Class 10-A
              </span>
            </div>

            <div className="space-y-2.5 my-2">
              <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-200">Term 1 Concept Clarity</div>
                  <div className="text-[11px] text-slate-400">Regular self-study blocks</div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                  On Track
                </span>
              </div>

              <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-200">Stream Exploration</div>
                  <div className="text-[11px] text-slate-400">Science / Commerce / Humanities</div>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded">
                  In Progress
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 mt-2">
              Focus on conceptual understanding and curiosity &bull; Zero high-stakes test pressure
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-indigo-900/60 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Senior Academic Roadmap</span>
              </span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-mono">
                {mentee?.stream} Stream
              </span>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 my-2">
              <div className="text-xs font-bold text-indigo-200 mb-1">Target Aspirations</div>
              <div className="text-xs text-slate-300">
                {mentee?.academicMetrics.competitiveAspirations.join(', ') || 'Higher Education Pathways'}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Balancing school curriculum with personal interests and higher education goals
            </p>
          </div>
        )}

        {/* Card 2: Attendance & Classroom Regularity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Regularity</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              {mentee?.academicMetrics.overallAttendance}% Present
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full mt-2 relative overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${Math.min(mentee?.academicMetrics.overallAttendance || 0, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Regular attendance builds steady habits</span>
            <span>Last term: {mentee?.academicMetrics.lastTermPercentage}%</span>
          </div>

          <div className="mt-3 text-[11px] bg-slate-50 border border-slate-200/70 text-slate-700 p-2.5 rounded-xl flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Consistent presence in morning zero period ensures you never miss peer discussions.</span>
          </div>
        </div>

        {/* Card 3: Mentor Connection & Next Meeting */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mentorship Touchpoint</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>

          <div className="text-xl font-bold text-slate-900 mt-1">
            Last Met: {mentee?.daysSinceLastSession} Days Ago
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Teacher: {mentorObj.name} ({mentorObj.subject})
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs">
            <span className="text-slate-500 block text-[11px]">Next Group Huddle:</span>
            <span className="font-bold text-indigo-700">Monday / Thursday Zero Period (35 min)</span>
          </div>
        </div>
      </div>

      {/* Action Items Checklist from Mentor */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Personal Action Item Checklist</span>
            </h2>
            <p className="text-xs text-slate-500">
              Clear milestone targets agreed with {mentorObj.name}. Tap any item to mark complete.
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">
            {localActionItems.filter(i => i.completed).length} of {localActionItems.length} Done
          </span>
        </div>

        <div className="space-y-2.5">
          {localActionItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleTask(item.id)}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                item.completed
                  ? 'bg-slate-50/70 border-slate-200 text-slate-400 line-through'
                  : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium">{item.task}</span>
              </div>

              <div className="text-[11px] text-slate-400 whitespace-nowrap font-mono">
                Target: {item.targetDate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor Advice & Conversation Records */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Advice &amp; Coaching History from {mentorObj.name} ({sessions.length} Sessions)</span>
        </h2>

        {sessions.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No guidance sessions logged yet for this academic term.
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.map((sess) => (
              <div key={sess.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded text-[10px]">
                    {sess.pillar || 'ACADEMIC'}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {new Date(sess.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="text-slate-700">
                  <strong>What you discussed:</strong> {sess.studentConcern}
                </div>

                <div className="text-slate-700 bg-white p-3 rounded-lg border border-slate-100">
                  <strong className="text-indigo-900">Mentor&apos;s Advice:</strong> {sess.teacherAdvice}
                </div>

                {sess.actionItem && (
                  <div className="text-emerald-700 font-medium">
                    &bull; Committed Action: {sess.actionItem.task} (Target: {sess.actionItem.targetDate})
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ask Mentor for Guidance Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-indigo-600" />
              <span>Ask {mentorObj.name} for Guidance</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Share what you&apos;d like to discuss. {mentorObj.name.split(' ')[0]} will schedule a quick 1-on-1 chat during zero period.
            </p>

            {slotSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs text-center font-semibold">
                ✅ Message sent to {mentorObj.name}! They will touch base with you soon.
              </div>
            ) : (
              <form onSubmit={handleRequestSlot} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    What would you like help with?
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={slotTopic}
                    onChange={(e) => setSlotTopic(e.target.value)}
                    placeholder="e.g. Need help with understanding geometry proofs, study routine planning, or exploring stream options..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSlotModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                  >
                    Send to Mentor
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
