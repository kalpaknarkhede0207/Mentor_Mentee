'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Radio, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Clock, 
  Sparkles, 
  FileCheck, 
  BookOpen,
  Award
} from 'lucide-react';
import { MenteeProfile, MentorshipGroup, BatchHuddleRecord } from '@/types/mentorship';
import { SEED_MENTORS } from '@/lib/db/seed-data';

export default function BatchHuddlePage() {
  const router = useRouter();
  const [mentorId, setMentorId] = useState('mentor-1');
  const [group, setGroup] = useState<MentorshipGroup | null>(null);
  const [mentees, setMentees] = useState<MenteeProfile[]>([]);
  const [pastHuddles, setPastHuddles] = useState<BatchHuddleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [huddleType, setHuddleType] = useState<'SPRINT_KICKOFF' | 'REVIEW_AND_CLINIC'>('SPRINT_KICKOFF');
  const [agendaTopic, setAgendaTopic] = useState('');
  const [groupNotes, setGroupNotes] = useState('');
  const [presentStudentIds, setPresentStudentIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('active_mentor_id');
    if (saved) setMentorId(saved);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [groupsRes, menteesRes, huddlesRes] = await Promise.all([
          fetch(`/api/mentorship/groups?mentorId=${mentorId}`),
          fetch(`/api/mentorship/mentees?mentorId=${mentorId}`),
          fetch('/api/mentorship/huddles')
        ]);

        const groupsJson = await groupsRes.json();
        const menteesJson = await menteesRes.json();
        const huddlesJson = await huddlesRes.json();

        if (groupsJson.success && groupsJson.data.length > 0) {
          const g = groupsJson.data[0];
          setGroup(g);
          if (huddlesJson.success) {
            setPastHuddles(huddlesJson.data.filter((h: BatchHuddleRecord) => h.groupId === g.id));
          }
        }
        if (menteesJson.success) {
          setMentees(menteesJson.data);
          // Default: all present
          setPresentStudentIds(menteesJson.data.map((m: MenteeProfile) => m.studentId));
        }
      } catch (err) {
        console.error('Error fetching huddle data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mentorId]);

  // Set default agenda based on huddle type
  useEffect(() => {
    if (huddleType === 'SPRINT_KICKOFF') {
      setAgendaTopic('Zero Period Kickoff: Weekly academic planner, syllabus pacing & study strategy');
    } else {
      setAgendaTopic('Zero Period Review: Weekly achievements spotlight & peer academic clinic');
    }
  }, [huddleType]);

  const toggleStudentAttendance = (studentId: string) => {
    setPresentStudentIds(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const markAllPresent = () => {
    setPresentStudentIds(mentees.map(m => m.studentId));
  };

  const handleSubmitHuddle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;
    if (!agendaTopic.trim()) {
      alert('Please specify an agenda topic.');
      return;
    }

    setIsSubmitting(true);
    try {
      const absentStudentIds = mentees
        .map(m => m.studentId)
        .filter(id => !presentStudentIds.includes(id));

      const payload = {
        groupId: group.id,
        mentorId,
        date: new Date().toISOString(),
        huddleType,
        agendaTopic,
        attendeeStudentIds: presentStudentIds,
        absentStudentIds,
        groupNotes
      };

      const res = await fetch('/api/mentorship/huddles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to record huddle');
      }

      setPastHuddles(prev => [json.data, ...prev]);
      setSuccessSaved(true);
      setGroupNotes('');
    } catch (err: any) {
      alert(err.message || 'Error recording huddle');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm">
        <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
        <p>Loading Cohort Huddle Roster...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/mentorship/mentor"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Mentor Cockpit</span>
        </Link>
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                <Radio className="w-4 h-4 animate-pulse" />
              </span>
              <h1 className="text-xl font-extrabold text-slate-900">
                Twice-a-Week Batch Huddle Launcher
              </h1>
              <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold">
                Cohort: {group?.section} ({group?.stream})
              </span>
            </div>
            <p className="text-xs text-slate-500">
              35-minute Zero Period group momentum engine &bull; Zero clash with core lectures.
            </p>
          </div>

          {/* Huddle Cadence Selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setHuddleType('SPRINT_KICKOFF'); setSuccessSaved(false); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                huddleType === 'SPRINT_KICKOFF'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Huddle 1: Sprint Kickoff
            </button>
            <button
              type="button"
              onClick={() => { setHuddleType('REVIEW_AND_CLINIC'); setSuccessSaved(false); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                huddleType === 'REVIEW_AND_CLINIC'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Huddle 2: Peer Clinic
            </button>
          </div>
        </div>

        {successSaved && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Batch Huddle attendance and discussion notes recorded successfully!</span>
            </div>
            <button
              onClick={() => setSuccessSaved(false)}
              className="text-[11px] underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmitHuddle} className="mt-6 space-y-6">
          {/* Agenda Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Huddle Agenda &amp; Focus Topic (35-Minute Window)
            </label>
            <input
              type="text"
              value={agendaTopic}
              onChange={(e) => setAgendaTopic(e.target.value)}
              placeholder="e.g. Weekly Sprint Kickoff: Thermodynamics chapter pacing & formula sheet audit"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800"
            />
          </div>

          {/* 1-Click Fast Batch Attendance Roster */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  Cohort Attendance Roster ({presentStudentIds.length} / {mentees.length} Present)
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Tap any student to toggle absent / present status in seconds
                </span>
              </div>
              <button
                type="button"
                onClick={markAllPresent}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2"
              >
                Mark All Present
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {mentees.map((m) => {
                const isPresent = presentStudentIds.includes(m.studentId);
                return (
                  <button
                    key={m.studentId}
                    type="button"
                    onClick={() => toggleStudentAttendance(m.studentId)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isPresent
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-semibold shadow-xs'
                        : 'bg-rose-50/70 border-rose-200 text-rose-800 opacity-75'
                    }`}
                  >
                    <div className="truncate">
                      <div className="text-xs truncate">{m.name}</div>
                      <div className="text-[10px] opacity-70 font-mono">{m.rollNo}</div>
                    </div>
                    {isPresent ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Notes & Takeaways */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Huddle Takeaways &amp; Peer Clinic Notes</span>
              <span className="text-[11px] font-normal text-slate-400">Shared cohort learnings</span>
            </label>
            <textarea
              rows={3}
              value={groupNotes}
              onChange={(e) => setGroupNotes(e.target.value)}
              placeholder="e.g. Discussed high-yield Carnot cycle derivations. Aditya shared a summary mind-map with the class. Reminder for weekend practice test..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/mentorship/mentor"
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Recording Huddle...' : 'Save Huddle Attendance & Notes'}
            </button>
          </div>
        </form>
      </div>

      {/* Cohort Huddle History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
          <span>Past Batch Huddle Records ({pastHuddles.length})</span>
          <span className="text-xs text-slate-400 font-normal">Twice-weekly cadence log</span>
        </h3>

        {pastHuddles.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No batch huddles recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {pastHuddles.map((huddle) => (
              <div key={huddle.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      huddle.huddleType === 'SPRINT_KICKOFF' 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'bg-violet-100 text-violet-800'
                    }`}>
                      {huddle.huddleType === 'SPRINT_KICKOFF' ? 'SPRINT KICKOFF' : 'PEER CLINIC'}
                    </span>
                    <span>{huddle.agendaTopic}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {new Date(huddle.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div className="text-slate-600">
                  {huddle.groupNotes || 'No additional notes logged.'}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-4 pt-1 border-t border-slate-200/40">
                  <span className="text-emerald-700 font-medium">
                    &bull; {huddle.attendeeStudentIds.length} Students Present
                  </span>
                  {huddle.absentStudentIds.length > 0 && (
                    <span className="text-rose-600 font-medium">
                      &bull; {huddle.absentStudentIds.length} Absent
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
