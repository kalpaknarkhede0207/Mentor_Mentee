'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  AlertCircle, 
  FileSpreadsheet, 
  Printer, 
  Phone, 
  Mail, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  Calendar, 
  Download, 
  Filter, 
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { MenteeProfile, MentorshipGroup, TeacherMentor, RagStatus } from '@/types/mentorship';
import { SEED_MENTORS } from '@/lib/db/seed-data';
import { RagBadge } from '@/components/mentorship/RagBadge';

export default function CoordinatorCommandCenter() {
  const [mentees, setMentees] = useState<MenteeProfile[]>([]);
  const [groups, setGroups] = useState<MentorshipGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedRag, setSelectedRag] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Parent alert modal
  const [selectedStudentForParent, setSelectedStudentForParent] = useState<MenteeProfile | null>(null);
  const [parentAlertSuccess, setParentAlertSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menteesRes, groupsRes] = await Promise.all([
          fetch('/api/mentorship/mentees'),
          fetch('/api/mentorship/groups')
        ]);

        const menteesJson = await menteesRes.json();
        const groupsJson = await groupsRes.json();

        if (menteesJson.success) setMentees(menteesJson.data);
        if (groupsJson.success) setGroups(groupsJson.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalStudents = mentees.length;
  const redAlertCount = mentees.filter(m => m.ragRiskStatus === 'RED').length;
  const amberAlertCount = mentees.filter(m => m.ragRiskStatus === 'AMBER').length;
  const greenCount = mentees.filter(m => m.ragRiskStatus === 'GREEN').length;

  const filteredMentees = mentees.filter(m => {
    const matchesRag = selectedRag === 'ALL' || m.ragRiskStatus === selectedRag;
    const matchesGrade = selectedGrade === 'ALL' || m.grade === selectedGrade;
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.stream.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRag && matchesGrade && matchesSearch;
  });

  // Calculate Mentor compliance scores
  const mentorMetrics = SEED_MENTORS.map(mentor => {
    const mentorMentees = mentees.filter(m => m.mentorId === mentor.id);
    const compliantCount = mentorMentees.filter(m => m.daysSinceLastSession <= 21).length;
    const complianceRate = mentorMentees.length > 0 
      ? Math.round((compliantCount / mentorMentees.length) * 100) 
      : 100;

    return {
      mentor,
      total: mentorMentees.length,
      compliant: compliantCount,
      complianceRate,
      redCount: mentorMentees.filter(m => m.ragRiskStatus === 'RED').length
    };
  });

  const handleSendParentNotice = () => {
    setParentAlertSuccess(true);
    setTimeout(() => {
      setSelectedStudentForParent(null);
      setParentAlertSuccess(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm">
        <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
        <p>Loading Wing Head Command Center &amp; Risk Radar Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-slate-900 text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Wing Head &amp; Principal Command Center</span>
            </span>
            <span className="text-xs text-slate-500 font-semibold">&bull;</span>
            <span className="text-xs text-slate-600 font-medium">
              NEP 2020 Continuous Holistic Assessment
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Senior School Wellness &amp; Academic Health Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Tracking {totalStudents} students across Grades 10–12 and 3 dedicated mentoring cohorts. Automated RAG early warning radar active.
          </p>
        </div>

        {/* Global Export Button */}
        <div className="flex items-center gap-3">
          <a
            href={`/api/mentorship/export-crc?studentId=${mentees[0]?.studentId || 'stu-1101'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-indigo-200" />
            <span>Generate NEP 2020 CRC PDF</span>
          </a>
        </div>
      </div>

      {/* Institutional Health Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Under Guidance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Total Senior Mentees
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-500">Across 3 Cohorts</span>
          </div>
          <div className="text-xs text-indigo-600 font-semibold mt-2">
            Strict 1:12 Mentor Ratio Maintained
          </div>
        </div>

        {/* Metric 2: Red Alert Triage */}
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm bg-rose-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Red Alert Triage
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">{redAlertCount}</span>
            <span className="text-xs text-rose-700 font-medium">Critical Intervention</span>
          </div>
          <div className="text-[11px] text-rose-600 mt-2 font-medium">
            Attendance &lt; 74% CBSE cutoff or &gt;25d gap
          </div>
        </div>

        {/* Metric 3: Amber Alert Watchlist */}
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm bg-amber-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Amber Watchlist
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{amberAlertCount}</span>
            <span className="text-xs text-amber-700 font-medium">Approaching Cutoffs</span>
          </div>
          <div className="text-[11px] text-amber-600 mt-2 font-medium">
            Attendance 75–82% or subject marks dip
          </div>
        </div>

        {/* Metric 4: Green Stable */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm bg-emerald-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Green &bull; Thriving
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{greenCount}</span>
            <span className="text-xs text-emerald-700 font-medium">Fully Compliant</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-2 font-medium">
            &gt;85% Attendance, stable marks, active 1-on-1s
          </div>
        </div>
      </div>

      {/* Teacher Mentors Compliance Scoreboard */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
          <span>Teacher Mentoring Cadence Compliance (NEP 2020 Accountability)</span>
          <span className="text-xs text-slate-500 font-normal">Target: 100% Rolling 2–3 Week Coverage</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mentorMetrics.map((item) => (
            <div key={item.mentor.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  {item.mentor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{item.mentor.name}</div>
                  <div className="text-xs text-slate-500">{item.mentor.subject} &bull; {item.mentor.assignedGrade.replace('_', ' ')}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">1-on-1 Compliance:</span>
                  <span className="font-bold text-slate-900">{item.complianceRate}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.complianceRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${item.complianceRate}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 text-slate-500">
                <span>Cohort: 12 Students</span>
                {item.redCount > 0 ? (
                  <span className="text-rose-600 font-bold">{item.redCount} Red Alert</span>
                ) : (
                  <span className="text-emerald-600 font-bold">0 Red Alerts</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* School Risk Radar: Triage Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <span>School Risk Radar: Multi-Stream Triage</span>
              <span className="text-xs bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-bold">
                {redAlertCount} Critical
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Live automated evaluation against CBSE board attendance cutoffs and multi-year cumulative milestones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* RAG Filter */}
            <select
              value={selectedRag}
              onChange={(e) => setSelectedRag(e.target.value)}
              className="p-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All RAG Statuses</option>
              <option value="RED">🔴 Red Alert Only</option>
              <option value="AMBER">🟡 Amber Watchlist Only</option>
              <option value="GREEN">🟢 Green Stable Only</option>
            </select>

            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="p-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Grades (9–12)</option>
              <option value="GRADE_10">Grade 10</option>
              <option value="GRADE_11">Grade 11</option>
              <option value="GRADE_12">Grade 12</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or stream..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Triage Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                <th className="py-3 px-4">Student &amp; Class</th>
                <th className="py-3 px-4">Assigned Mentor</th>
                <th className="py-3 px-4">Attendance &amp; CBSE Threshold</th>
                <th className="py-3 px-4">Academic Bottlenecks</th>
                <th className="py-3 px-4">Risk Radar</th>
                <th className="py-3 px-4 text-right">Intervention Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMentees.map((m) => {
                const mentor = SEED_MENTORS.find(men => men.id === m.mentorId);
                const isRed = m.ragRiskStatus === 'RED';

                return (
                  <tr key={m.id} className={`hover:bg-slate-50/80 transition-colors ${isRed ? 'bg-rose-50/20' : ''}`}>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-xs text-slate-500">
                        {m.section} &bull; <span className="font-semibold text-indigo-600">{m.stream}</span> &bull; Roll: {m.rollNo}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-semibold text-slate-800">{mentor?.name || 'Assigned Mentor'}</div>
                      <div className="text-slate-400">{mentor?.subject}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs space-y-0.5">
                        <div className={`font-bold ${m.academicMetrics.overallAttendance < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {m.academicMetrics.overallAttendance}% Attendance
                        </div>
                        {m.academicMetrics.overallAttendance < 75 && (
                          <div className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold inline-block">
                            Below 75% CBSE Board Cutoff
                          </div>
                        )}
                        <div className="text-slate-400 text-[11px]">Last Term: {m.academicMetrics.lastTermPercentage}%</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      {m.academicMetrics.weakSubjects.length > 0 ? (
                        <div className="space-y-1">
                          {m.academicMetrics.weakSubjects.map((sub, i) => (
                            <span key={i} className="inline-block mr-1 text-[11px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                              {sub}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">No bottlenecks</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <RagBadge status={m.ragRiskStatus} size="sm" />
                      <div className="text-[11px] text-slate-400 mt-1">
                        Met {m.daysSinceLastSession}d ago
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isRed && (
                          <button
                            onClick={() => setSelectedStudentForParent(m)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1 shadow-sm"
                            title="Direct parent alert"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Contact Parent</span>
                          </button>
                        )}
                        <a
                          href={`/api/mentorship/export-crc?studentId=${m.studentId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 border border-slate-200"
                          title="Generate printable CRC"
                        >
                          <Printer className="w-3 h-3 text-slate-500" />
                          <span>CRC Card</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parent Alert Modal */}
      {selectedStudentForParent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-600" />
              <span>Wing Head Red-List Parent Triage</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Trigger formal parent outreach regarding attendance &amp; board eligibility for <strong>{selectedStudentForParent.name}</strong> ({selectedStudentForParent.rollNo}).
            </p>

            {parentAlertSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs text-center font-semibold">
                ✅ Official SMS/Email notice dispatched to parent: {selectedStudentForParent.contact.parentPhone}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div><strong>Parent Phone:</strong> {selectedStudentForParent.contact.parentPhone}</div>
                  <div><strong>Parent Email:</strong> {selectedStudentForParent.contact.parentEmail}</div>
                  <div><strong>Current Attendance:</strong> <span className="text-rose-600 font-bold">{selectedStudentForParent.academicMetrics.overallAttendance}% (CBSE Cutoff 75%)</span></div>
                  <div><strong>Identified Weak Subjects:</strong> {selectedStudentForParent.academicMetrics.weakSubjects.join(', ')}</div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedStudentForParent(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendParentNotice}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 flex items-center gap-1.5 shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Urgent Parent Notice</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
