'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Mic, 
  Radio, 
  Flame,
  FileSpreadsheet,
  ChevronRight,
  Send,
  Building2,
  Check
} from 'lucide-react';
import { MenteeProfile, MentorshipGroup, TeacherMentor } from '@/types/mentorship';
import { SEED_MENTORS } from '@/lib/db/seed-data';
import { ComplianceMatrix } from '@/components/mentorship/ComplianceMatrix';
import { RagBadge } from '@/components/mentorship/RagBadge';

export default function MentorCockpitPage() {
  const [mentorId, setMentorId] = useState('mentor-1');
  const [mentees, setMentees] = useState<MenteeProfile[]>([]);
  const [group, setGroup] = useState<MentorshipGroup | null>(null);
  const [loading, setLoading] = useState(true);

  // Authority Report Submission Modal State
  const [showAuthorityModal, setShowAuthorityModal] = useState(false);
  const [reportDivision, setReportDivision] = useState('Div A (11-A)');
  const [reportBatch, setReportBatch] = useState('Batch 2026-27');
  const [reportAcademicYear, setReportAcademicYear] = useState('2026-27');
  const [reportObservations, setReportObservations] = useState('');
  const [reportActionPlan, setReportActionPlan] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmittedSuccess, setReportSubmittedSuccess] = useState(false);

  // Load active mentor from localStorage or fallback
  useEffect(() => {
    const handleMentorChange = () => {
      const saved = localStorage.getItem('active_mentor_id');
      if (saved) setMentorId(saved);
    };

    handleMentorChange();
    window.addEventListener('mentor-changed', handleMentorChange);
    return () => window.removeEventListener('mentor-changed', handleMentorChange);
  }, []);

  // Fetch mentees and cohort group for active mentor
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menteesRes, groupsRes] = await Promise.all([
          fetch(`/api/mentorship/mentees?mentorId=${mentorId}`),
          fetch(`/api/mentorship/groups?mentorId=${mentorId}`)
        ]);

        const menteesJson = await menteesRes.json();
        const groupsJson = await groupsRes.json();

        if (menteesJson.success) {
          setMentees(menteesJson.data);
        }
        if (groupsJson.success && groupsJson.data.length > 0) {
          const g = groupsJson.data[0];
          setGroup(g);
          setReportDivision(`Div ${g.section.startsWith('12') ? 'B' : 'A'} (${g.section})`);
          setReportObservations(`Cohort ${g.section} (${g.stream}) progressing steadily. 1-on-1 guidance focuses on concept clarity, regular study blocks, and personalized support.`);
          setReportActionPlan(`Continue twice-weekly zero period clinics and monitor students requiring extra assistance.`);
        }
      } catch (err) {
        console.error('Error fetching mentor cockpit data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mentorId]);

  const currentMentor: TeacherMentor = SEED_MENTORS.find(m => m.id === mentorId) || SEED_MENTORS[0];
  const isJuniorSenior = currentMentor.assignedGrade === 'GRADE_9' || currentMentor.assignedGrade === 'GRADE_10';

  const redAlertCount = mentees.filter(m => m.ragRiskStatus === 'RED').length;
  const amberAlertCount = mentees.filter(m => m.ragRiskStatus === 'AMBER').length;
  const overdueCount = mentees.filter(m => m.daysSinceLastSession > 21).length;
  const completedOneOnOnes = mentees.filter(m => m.daysSinceLastSession <= 21).length;

  const handleSubmitReportToAuthority = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportObservations.trim()) return;

    setIsSubmittingReport(true);
    try {
      const avgAtt = mentees.length > 0
        ? Math.round(mentees.reduce((acc, m) => acc + m.academicMetrics.overallAttendance, 0) / mentees.length)
        : 85;

      const highPriorityStudents = mentees
        .filter(m => m.ragRiskStatus === 'RED')
        .map(m => ({
          studentId: m.studentId,
          name: m.name,
          rollNo: m.rollNo,
          concern: m.academicMetrics.weakSubjects.length > 0 
            ? `Needs support in ${m.academicMetrics.weakSubjects.join(', ')}` 
            : 'Requires attendance follow-up'
        }));

      const payload = {
        mentorId: currentMentor.id,
        mentorName: currentMentor.name,
        division: reportDivision,
        batch: reportBatch,
        academicYear: reportAcademicYear,
        grade: currentMentor.assignedGrade,
        stream: group?.stream || 'GENERAL',
        totalMentees: mentees.length,
        completedOneOnOnes,
        averageAttendance: avgAtt,
        summaryObservations: reportObservations,
        actionPlanForAuthority: reportActionPlan,
        highPriorityStudents
      };

      const res = await fetch('/api/mentorship/authority-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        setReportSubmittedSuccess(true);
        setTimeout(() => {
          setShowAuthorityModal(false);
          setReportSubmittedSuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Cockpit Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-indigo-50 border border-indigo-200/60 text-indigo-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {currentMentor.designation}
            </span>
            <span className="text-xs text-slate-400 font-semibold">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">
              Ratio: 1 : {mentees.length} Students (Continuous Care)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Teacher Mentor Cockpit: {currentMentor.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Assigned Cohort: <strong>{group?.section || '11-A'}</strong> &bull; Stream: <strong>{group?.stream || 'SCIENCE'}</strong>. 
            {isJuniorSenior ? (
              <span> Focusing on foundational concept mastery, study routine formation, and stream exploration (zero high-stakes board test pressure).</span>
            ) : (
              <span> Guiding students through subject pacing, habit building, and higher education aspirations.</span>
            )}
          </p>
        </div>

        {/* Quick Launch & Authority Report Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAuthorityModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all"
          >
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Submit Report to Authority</span>
          </button>

          <Link
            href="/mentorship/mentor/huddle"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all group"
          >
            <Radio className="w-4 h-4 text-indigo-200 animate-pulse" />
            <span>Launch Batch Huddle</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Next Huddle */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Huddle 1: Sprint Kickoff</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {group?.huddleSchedule.kickoffDay || 'MONDAY'} Zero Period
          </div>
          <div className="text-xs text-indigo-600 font-medium mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{group?.huddleSchedule.kickoffTime || '08:15 AM'} (35 min)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Weekly academic planner, syllabus pacing &amp; study strategy
          </p>
        </div>

        {/* Card 2: Huddle 2 Clinic */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Huddle 2: Peer Clinic</span>
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {group?.huddleSchedule.clinicDay || 'THURSDAY'} Zero Period
          </div>
          <div className="text-xs text-violet-600 font-medium mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{group?.huddleSchedule.clinicTime || '08:15 AM'} (35 min)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Weekly review, win spotlight &amp; peer academic clinic
          </p>
        </div>

        {/* Card 3: 1-on-1 Rotation Health */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">1-on-1 Rotation</span>
            <div className={`p-2 rounded-lg ${overdueCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{completedOneOnOnes} / {mentees.length}</span>
            <span className="text-xs text-slate-500 font-medium">Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full" 
              style={{ width: `${(completedOneOnOnes / (mentees.length || 1)) * 100}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {overdueCount > 0 ? `${overdueCount} due for rotation touchpoint` : 'All mentees within regular cycle'}
          </p>
        </div>

        {/* Card 4: Support Attention Count */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attention Needed</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">{redAlertCount}</span>
            <span className="text-xs text-rose-700 font-semibold">Priority Students</span>
          </div>
          <div className="text-xs text-amber-600 font-medium mt-1">
            + {amberAlertCount} on regular watch
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Personalized mentoring &amp; concept doubt clearing
          </p>
        </div>
      </div>

      {/* Main Feature: Compulsory 1-on-1 Compliance Matrix */}
      <div>
        <ComplianceMatrix mentees={mentees} mentorId={mentorId} />
      </div>

      {/* Submit Report to Authority Modal */}
      {showAuthorityModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Submit Batch Mentorship Report to Authority</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Formal submission of mentee observations to School Authority structured by <strong>Division</strong>, <strong>Batch</strong>, and <strong>Academic Year</strong>.
            </p>

            {reportSubmittedSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs text-center font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Report successfully transmitted to Authority Portal!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReportToAuthority} className="space-y-4 text-xs">
                {/* 3 Taxonomy Selectors */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1 text-[11px]">Division / Sec</label>
                    <input
                      type="text"
                      value={reportDivision}
                      onChange={(e) => setReportDivision(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1 text-[11px]">Batch</label>
                    <input
                      type="text"
                      value={reportBatch}
                      onChange={(e) => setReportBatch(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1 text-[11px]">Academic Year</label>
                    <input
                      type="text"
                      value={reportAcademicYear}
                      onChange={(e) => setReportAcademicYear(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Summary Observations */}
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1 text-[11px]">
                    Cohort Summary Observations
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reportObservations}
                    onChange={(e) => setReportObservations(e.target.value)}
                    placeholder="Highlight overall academic trends, student engagement, and foundational focus..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Proposed Action Plan */}
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1 text-[11px]">
                    Proposed Action Plan &amp; Support Requests for Authority
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={reportActionPlan}
                    onChange={(e) => setReportActionPlan(e.target.value)}
                    placeholder="e.g. Requesting extra problem clinic in zero period; coordinating parent orientation..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 flex items-center justify-between">
                  <span>Auto-Attaching <strong>{mentees.length} Mentees</strong> data</span>
                  <span><strong>{redAlertCount} Priority Students</strong> flagged</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAuthorityModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingReport ? 'Transmitting...' : 'Submit to Authority'}</span>
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
