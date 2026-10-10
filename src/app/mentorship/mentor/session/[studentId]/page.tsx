'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  Send, 
  CheckCircle, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  BookOpen, 
  Award, 
  HeartPulse, 
  Scale, 
  FileText, 
  Phone, 
  Mail,
  Printer
} from 'lucide-react';
import { 
  MenteeProfile, 
  MentoringSession, 
  MentoringPillar, 
  AiVoiceExtractionDraft 
} from '@/types/mentorship';
import { VoiceRecorder } from '@/components/mentorship/VoiceRecorder';
import { RagBadge } from '@/components/mentorship/RagBadge';

export default function OneOnOneSessionWorkspace() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.studentId as string;

  const [mentee, setMentee] = useState<MenteeProfile | null>(null);
  const [pastSessions, setPastSessions] = useState<MentoringSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedPillar, setSelectedPillar] = useState<MentoringPillar>('ACADEMIC');
  const [studentConcern, setStudentConcern] = useState('');
  const [teacherAdvice, setTeacherAdvice] = useState('');
  const [actionTask, setActionTask] = useState('');
  const [actionTargetDate, setActionTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [confidentialNote, setConfidentialNote] = useState('');
  const [parentDigestSent, setParentDigestSent] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [hasAiAudioSummary, setHasAiAudioSummary] = useState(false);
  const [audioDurationSeconds, setAudioDurationSeconds] = useState(35);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApprovedAndLocked, setIsApprovedAndLocked] = useState(false);
  const [sealedSessionId, setSealedSessionId] = useState<string | null>(null);

  // Fetch student profile and session history
  useEffect(() => {
    if (!studentId) return;

    const fetchMenteeData = async () => {
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
          setPastSessions(sessionsJson.data);
        }
      } catch (err) {
        console.error('Error fetching student session workspace', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenteeData();
  }, [studentId]);

  // Handle AI extraction draft auto-population
  const handleAiExtraction = (draft: AiVoiceExtractionDraft) => {
    setSelectedPillar(draft.pillar);
    setStudentConcern(draft.studentConcern);
    setTeacherAdvice(draft.teacherAdvice);
    setActionTask(draft.actionItem.task);
    setActionTargetDate(draft.actionItem.targetDate);
    if (draft.confidentialNote) {
      setConfidentialNote(draft.confidentialNote);
    }
    setHasAiAudioSummary(true);
    if (draft.audioDurationSeconds) {
      setAudioDurationSeconds(draft.audioDurationSeconds);
    }
  };

  // Submit and lock to Cumulative Record
  const handleApproveAndSeal = async () => {
    if (!mentee) return;
    if (!studentConcern.trim() || !teacherAdvice.trim()) {
      alert('Please fill out student concerns and teacher advice, or use the 30s AI Voice wrap-up.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<MentoringSession> = {
        sessionType: 'COMPULSORY_1_ON_1',
        mentorId: mentee.mentorId,
        groupId: `group-${mentee.grade.toLowerCase()}`,
        studentId: mentee.studentId,
        date: new Date().toISOString(),
        durationMinutes,
        pillar: selectedPillar,
        studentConcern,
        teacherAdvice,
        actionItem: actionTask ? {
          task: actionTask,
          targetDate: actionTargetDate,
          status: 'PENDING'
        } : undefined,
        parentDigestSent,
        confidentialNote: confidentialNote.trim() || undefined,
        hasAiAudioSummary,
        audioDurationSeconds,
        status: 'APPROVED_AND_SEALED'
      };

      const res = await fetch('/api/mentorship/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to seal session');
      }

      setSealedSessionId(json.data.id);
      setIsApprovedAndLocked(true);
    } catch (err: any) {
      alert(err.message || 'Error sealing session');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm">
        <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
        <p>Loading 1-on-1 Workspace &amp; Student Context...</p>
      </div>
    );
  }

  if (!mentee) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-600 border border-slate-200">
        <p className="font-semibold text-slate-900">Student not found</p>
        <Link href="/mentorship/mentor" className="text-xs text-indigo-600 underline mt-2 inline-block">
          Return to Mentor Cockpit
        </Link>
      </div>
    );
  }

  const pillarsList: { key: MentoringPillar; title: string; icon: any; hint: string }[] = [
    {
      key: 'ACADEMIC',
      title: 'Academic & Board Prep',
      icon: BookOpen,
      hint: 'Unit tests, pre-boards, NCERT pacing, derivations'
    },
    {
      key: 'COMPETITIVE_CAREER',
      title: 'Competitive & Career',
      icon: Award,
      hint: 'JEE/NEET/CUET/CLAT/SAT, streams, portfolio'
    },
    {
      key: 'WELLBEING_HABITS',
      title: 'Wellbeing & Habits',
      icon: HeartPulse,
      hint: 'Screen time, sleep habits, exam stress, anxiety'
    },
    {
      key: 'DISCIPLINE_PARENT',
      title: 'Discipline & Parents',
      icon: Scale,
      hint: 'Attendance cutoff, punctuality, PTM preparation'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/mentorship/mentor"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Mentor Cockpit</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={`/api/mentorship/export-crc?studentId=${mentee.studentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print NEP Cumulative Record (CRC)</span>
          </a>
        </div>
      </div>

      {/* Student 360 Context Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
              {mentee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {mentee.name}
                </h1>
                <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Roll: {mentee.rollNo}
                </span>
                <RagBadge status={mentee.ragRiskStatus} size="sm" />
              </div>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                <span>Class: <strong>{mentee.section}</strong></span>
                <span>&bull;</span>
                <span>Stream: <strong className="text-indigo-600">{mentee.stream}</strong></span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {mentee.contact.parentPhone}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] font-semibold">ATTENDANCE</span>
              <span className={`text-base font-bold ${mentee.academicMetrics.overallAttendance < 75 ? 'text-rose-600' : 'text-slate-900'}`}>
                {mentee.academicMetrics.overallAttendance}%
              </span>
              <span className="text-[10px] text-slate-400 block">
                {mentee.grade === 'GRADE_9' || mentee.grade === 'GRADE_10'
                  ? (mentee.academicMetrics.overallAttendance < 75 ? '⚠️ Follow-up Regularity' : 'Regular Habit')
                  : (mentee.academicMetrics.overallAttendance < 75 ? '⚠️ Below 75% Cutoff' : 'Compliant')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] font-semibold">LAST TERM</span>
              <span className="text-base font-bold text-slate-900">
                {mentee.academicMetrics.lastTermPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 block">
                {mentee.grade === 'GRADE_9' || mentee.grade === 'GRADE_10' ? 'Term Assessment' : 'Academic Benchmark'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[11px] font-semibold">CADENCE</span>
              <span className={`text-base font-bold ${mentee.daysSinceLastSession > 21 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {mentee.daysSinceLastSession}d ago
              </span>
              <span className="text-[10px] text-slate-400 block">Rolling 2-3 wk rotation</span>
            </div>
          </div>
        </div>

        {/* Bottlenecks & Aspirations Pills */}
        <div className="pt-4 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Subject Bottlenecks:</span>
            {mentee.academicMetrics.weakSubjects.length > 0 ? (
              mentee.academicMetrics.weakSubjects.map((sub, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-medium">
                  {sub}
                </span>
              ))
            ) : (
              <span className="text-emerald-600 font-medium text-[11px]">No academic bottlenecks reported</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Aspirations:</span>
            {mentee.academicMetrics.competitiveAspirations.map((asp, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium">
                {asp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Success Modal / Banner if locked */}
      {isApprovedAndLocked && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-base">
                1-on-1 Guidance Session Approved &amp; Sealed to Cumulative Record
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Audit record created. Student RAG score recalculated. Zero raw audio retained.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/api/mentorship/export-crc?studentId=${mentee.studentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              View Updated CRC Card
            </a>
            <Link
              href="/mentorship/mentor"
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Cockpit
            </Link>
          </div>
        </div>
      )}

      {/* The 30–45s AI Voice-to-Insight Engine */}
      {!isApprovedAndLocked && (
        <VoiceRecorder
          studentId={mentee.studentId}
          studentName={mentee.name}
          onExtractionComplete={handleAiExtraction}
        />
      )}

      {/* Interactive 1-on-1 Session Logging Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Session Log &amp; Cumulative Record Entry</span>
              {hasAiAudioSummary && (
                <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Voice Populated ({audioDurationSeconds}s)
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and refine points below before sealing to student&apos;s multi-year cumulative record.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Duration:</span>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              disabled={isApprovedAndLocked}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700"
            >
              <option value={15}>15 Minutes</option>
              <option value={20}>20 Minutes (Standard)</option>
              <option value={30}>30 Minutes (Deep Dive)</option>
            </select>
          </div>
        </div>

        {/* 4 Pillars Radio Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Focus Mentoring Pillar
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pillarsList.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPillar === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  disabled={isApprovedAndLocked}
                  onClick={() => setSelectedPillar(p.key)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs">{p.title}</span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight">{p.hint}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Discussion Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Student's Core Blocker / Reflection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Student Concern &amp; Core Blocker</span>
              <span className="text-[11px] font-normal text-slate-400">Verbal reflection</span>
            </label>
            <textarea
              rows={4}
              value={studentConcern}
              disabled={isApprovedAndLocked}
              onChange={(e) => setStudentConcern(e.target.value)}
              placeholder="e.g. Student feels overwhelmed by calculus integration pacing and mid-term exam schedule..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Teacher's Guidance Given */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Mentor Pedagogical Guidance</span>
              <span className="text-[11px] font-normal text-slate-400">Actionable advice</span>
            </label>
            <textarea
              rows={4}
              value={teacherAdvice}
              disabled={isApprovedAndLocked}
              onChange={(e) => setTeacherAdvice(e.target.value)}
              placeholder="e.g. Break practice into 25-minute Pomodoro sessions. Focus on NCERT solved problems before touching coaching modules..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Committed Action Item with Target Date */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Committed Student Action Item &amp; Milestone
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={actionTask}
              disabled={isApprovedAndLocked}
              onChange={(e) => setActionTask(e.target.value)}
              placeholder="e.g. Complete NCERT Physics Ch 7 Exercises (Q1 to Q15) and submit by Friday"
              className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Target Date:</span>
              <input
                type="date"
                value={actionTargetDate}
                disabled={isApprovedAndLocked}
                onChange={(e) => setActionTargetDate(e.target.value)}
                className="text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none text-slate-800 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Confidential Note (Mentor & Wing Head Only) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Confidential Note (Restricted to Mentor &amp; Wing Head Only)
            </span>
            <span className="text-[11px] font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Not visible on Student portal
            </span>
          </label>
          <input
            type="text"
            value={confidentialNote}
            disabled={isApprovedAndLocked}
            onChange={(e) => setConfidentialNote(e.target.value)}
            placeholder="e.g. Parental friction regarding stream choice; student exhibits high stress; monitor in upcoming zero period."
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none text-slate-800"
          />
        </div>

        {/* Parent Digest Option & Final Lock Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 font-medium select-none">
            <input
              type="checkbox"
              checked={parentDigestSent}
              disabled={isApprovedAndLocked}
              onChange={(e) => setParentDigestSent(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span>Send automated summary digest to parent phone ({mentee.contact.parentPhone})</span>
          </label>

          {!isApprovedAndLocked ? (
            <button
              type="button"
              onClick={handleApproveAndSeal}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sealing Record...' : 'Approve & Lock to Cumulative Record'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-100 px-4 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
              <span>Record Sealed &bull; Cumulative Audit Log Updated</span>
            </div>
          )}
        </div>
      </div>

      {/* Past Cumulative Sessions History Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center justify-between">
          <span>Continuous Cumulative History ({pastSessions.length} Past Records)</span>
          <span className="text-xs text-slate-400 font-normal">Multi-Year Advisory Audit Trail</span>
        </h3>

        {pastSessions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No previous sessions on record for this student.
          </p>
        ) : (
          <div className="space-y-3">
            {pastSessions.map((sess) => (
              <div key={sess.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px]">
                      {sess.pillar || 'GENERAL'}
                    </span>
                    <span>{new Date(sess.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{sess.durationMinutes} min session</span>
                  </div>
                </div>

                <div className="text-slate-600">
                  <strong>Concern:</strong> {sess.studentConcern}
                </div>
                <div className="text-slate-600">
                  <strong>Advice:</strong> {sess.teacherAdvice}
                </div>

                {sess.actionItem && (
                  <div className="text-indigo-700 bg-indigo-50/80 p-2 rounded-lg font-medium flex items-center justify-between">
                    <span>Task: {sess.actionItem.task}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold border border-indigo-200">
                      Target: {sess.actionItem.targetDate}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
