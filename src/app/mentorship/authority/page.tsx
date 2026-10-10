'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Filter, 
  Search, 
  Printer, 
  CheckCircle2, 
  Clock, 
  User, 
  Users, 
  Calendar, 
  Award, 
  AlertTriangle,
  Building2,
  ChevronDown,
  Sparkles,
  Check
} from 'lucide-react';
import { AuthorityReport, MenteeProfile } from '@/types/mentorship';
import { SEED_MENTORS } from '@/lib/db/seed-data';

export default function AuthorityReportsPage() {
  const [reports, setReports] = useState<AuthorityReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters according to Division, Batch, and Academic Year
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Review modal state
  const [activeReportToReview, setActiveReportToReview] = useState<AuthorityReport | null>(null);
  const [authorityRemarksInput, setAuthorityRemarksInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [selectedDivision, selectedBatch, selectedYear]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDivision !== 'ALL') params.append('division', selectedDivision);
      if (selectedBatch !== 'ALL') params.append('batch', selectedBatch);
      if (selectedYear !== 'ALL') params.append('academicYear', selectedYear);

      const res = await fetch(`/api/mentorship/authority-reports?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setReports(json.data);
      }
    } catch (err) {
      console.error('Error fetching authority reports', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(r => {
    return (
      r.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summaryObservations.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReportToReview || !authorityRemarksInput.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/mentorship/authority-reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeReportToReview.id,
          authorityRemarks: authorityRemarksInput
        })
      });

      const json = await res.json();
      if (json.success) {
        setReports(prev => prev.map(r => r.id === json.data.id ? json.data : r));
        setReviewSuccess(true);
        setTimeout(() => {
          setActiveReportToReview(null);
          setReviewSuccess(false);
          setAuthorityRemarksInput('');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const totalReportedMentees = filteredReports.reduce((sum, r) => sum + r.totalMentees, 0);
  const totalCompleted1on1s = filteredReports.reduce((sum, r) => sum + r.completedOneOnOnes, 0);
  const totalHighPriority = filteredReports.reduce((sum, r) => sum + (r.highPriorityStudents?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-slate-900 text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>School Authority Portal</span>
            </span>
            <span className="text-xs text-slate-500 font-semibold">&bull;</span>
            <span className="text-xs text-slate-600 font-medium">
              Academic Supervision &amp; Mentee Governance
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mentorship Batch Reports by Division &amp; Year
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Central repository of official mentee progress reports submitted by teacher mentors, organized strictly by <strong>Division (Div)</strong>, <strong>Batch</strong>, and <strong>Academic Year</strong>.
          </p>
        </div>

        {/* Global Print/Export Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-xs transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Batch Summary</span>
          </button>
        </div>
      </div>

      {/* 3 Overview Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Mentees Covered
          </span>
          <div className="text-3xl font-black text-slate-900">{totalReportedMentees}</div>
          <div className="text-xs text-indigo-600 font-semibold mt-1">
            Across {filteredReports.length} Submitted Cohort Reports
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            1-on-1 Guidance Sessions Logged
          </span>
          <div className="text-3xl font-black text-emerald-600">{totalCompleted1on1s}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {totalReportedMentees > 0 ? Math.round((totalCompleted1on1s / totalReportedMentees) * 100) : 0}% Coverage Rate
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Students Flagged for Support
          </span>
          <div className="text-3xl font-black text-amber-600">{totalHighPriority}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Identified for extra academic or habit assistance
          </div>
        </div>
      </div>

      {/* Filter Bar: Division, Batch, and Academic Year */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900">
              Filter Reports by Institutional Taxonomy
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Division Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Division:</span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Divisions</option>
                <option value="Div A">Div A (10-A, 11-A)</option>
                <option value="Div B">Div B (12-B)</option>
              </select>
            </div>

            {/* Batch Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Batch:</span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Batches</option>
                <option value="Batch 2026-27">Batch 2026-27</option>
                <option value="Batch 2025-26">Batch 2025-26</option>
              </select>
            </div>

            {/* Academic Year Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Years</option>
                <option value="2026-27">2026-27</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search report by mentor name, division, or keyword in observations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
            No mentor reports found matching the selected Division, Batch, or Year filters.
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 transition-all hover:border-indigo-300"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    {report.mentorName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <span>{report.mentorName}</span>
                      <span className="text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full">
                        {report.division}
                      </span>
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Batch: <strong>{report.batch}</strong></span>
                      <span>&bull;</span>
                      <span>Academic Year: <strong>{report.academicYear}</strong></span>
                      <span>&bull;</span>
                      <span>Stream: <strong>{report.stream}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {report.status === 'REVIEWED_AND_ACKNOWLEDGED' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reviewed by Authority</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveReportToReview(report)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Review &amp; Acknowledge</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold">TOTAL MENTEES</span>
                  <span className="font-bold text-slate-900 text-sm">{report.totalMentees} Students</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold">1-ON-1 PROGRESS</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {report.completedOneOnOnes} of {report.totalMentees} Completed
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold">AVERAGE ATTENDANCE</span>
                  <span className="font-bold text-slate-900 text-sm">{report.averageAttendance}%</span>
                </div>
              </div>

              {/* Summary Observations */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mentor&apos;s Comprehensive Observations
                </h4>
                <p className="text-xs text-slate-700 bg-slate-50/50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                  {report.summaryObservations}
                </p>
              </div>

              {/* Action Plan Requested */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Proposed Action Plan &amp; Institutional Requests
                </h4>
                <p className="text-xs text-indigo-950 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 leading-relaxed">
                  {report.actionPlanForAuthority}
                </p>
              </div>

              {/* Flagged Students */}
              {report.highPriorityStudents && report.highPriorityStudents.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-amber-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Students Flagged for Special Attention ({report.highPriorityStudents.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {report.highPriorityStudents.map((st) => (
                      <div key={st.studentId} className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/40 text-xs">
                        <div className="font-bold text-amber-950 flex items-center justify-between">
                          <span>{st.name}</span>
                          <span className="text-[10px] font-mono text-amber-700 bg-white px-1.5 py-0.5 rounded border border-amber-200">
                            {st.rollNo}
                          </span>
                        </div>
                        <div className="text-[11px] text-amber-800 mt-1">{st.concern}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Authority Remarks if already reviewed */}
              {report.authorityRemarks && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                  <div className="font-bold text-emerald-900 mb-0.5">
                    Authority Remarks (Reviewed on {report.reviewedAt ? new Date(report.reviewedAt).toLocaleDateString() : 'Recent'}):
                  </div>
                  <div>{report.authorityRemarks}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review & Acknowledge Modal */}
      {activeReportToReview && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span>Acknowledge Mentor Report &bull; {activeReportToReview.division}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Submitted by <strong>{activeReportToReview.mentorName}</strong> ({activeReportToReview.batch}, Year {activeReportToReview.academicYear}).
            </p>

            {reviewSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs text-center font-semibold">
                ✅ Report acknowledged and recorded with official authority seal!
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Official Authority Feedback / Endorsement
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={authorityRemarksInput}
                    onChange={(e) => setAuthorityRemarksInput(e.target.value)}
                    placeholder="e.g. Reviewed and approved. Commendable progress on stream counseling. Science clinic granted for Friday mornings..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveReportToReview(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Confirm & Acknowledge'}
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
