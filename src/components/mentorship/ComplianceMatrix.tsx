'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MenteeProfile } from '@/types/mentorship';
import { RagBadge } from './RagBadge';
import { 
  Calendar, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  User,
  GraduationCap
} from 'lucide-react';

interface ComplianceMatrixProps {
  mentees: MenteeProfile[];
  mentorId: string;
}

export function ComplianceMatrix({ mentees }: ComplianceMatrixProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompliance, setFilterCompliance] = useState<'ALL' | 'OVERDUE' | 'DUE_SOON' | 'COMPLIANT'>('ALL');

  // Categorize compliance (2-3 week rolling cycle: 14 to 21 days)
  const getComplianceCategory = (days: number) => {
    if (days > 21) return 'OVERDUE';
    if (days >= 14) return 'DUE_SOON';
    return 'COMPLIANT';
  };

  const filteredMentees = mentees.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.stream.toLowerCase().includes(searchQuery.toLowerCase());

    const compliance = getComplianceCategory(m.daysSinceLastSession);
    const matchesFilter = filterCompliance === 'ALL' || compliance === filterCompliance;

    return matchesSearch && matchesFilter;
  });

  const overdueCount = mentees.filter(m => getComplianceCategory(m.daysSinceLastSession) === 'OVERDUE').length;
  const dueSoonCount = mentees.filter(m => getComplianceCategory(m.daysSinceLastSession) === 'DUE_SOON').length;
  const compliantCount = mentees.filter(m => getComplianceCategory(m.daysSinceLastSession) === 'COMPLIANT').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header with stats */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <span>Compulsory 1-on-1 Compliance Matrix</span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold">
              Rolling 2–3 Wk Cycle
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tracking multi-year continuity across your assigned {mentees.length} mentees. Zero-stigma, timetable scheduled.
          </p>
        </div>

        {/* Quick compliance badges */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterCompliance(filterCompliance === 'OVERDUE' ? 'ALL' : 'OVERDUE')}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              filterCompliance === 'OVERDUE'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Overdue ({overdueCount})</span>
          </button>

          <button
            onClick={() => setFilterCompliance(filterCompliance === 'DUE_SOON' ? 'ALL' : 'DUE_SOON')}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              filterCompliance === 'DUE_SOON'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Due Soon ({dueSoonCount})</span>
          </button>

          <button
            onClick={() => setFilterCompliance(filterCompliance === 'COMPLIANT' ? 'ALL' : 'COMPLIANT')}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              filterCompliance === 'COMPLIANT'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Compliant ({compliantCount})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or stream..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Table list */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
              <th className="py-3 px-4">Mentee Details</th>
              <th className="py-3 px-4">Academic &amp; Attendance</th>
              <th className="py-3 px-4">Last 1-on-1 Cadence</th>
              <th className="py-3 px-4">RAG Early Warning</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMentees.map((mentee) => {
              const compliance = getComplianceCategory(mentee.daysSinceLastSession);
              const isOverdue = compliance === 'OVERDUE';
              const isDueSoon = compliance === 'DUE_SOON';

              return (
                <tr 
                  key={mentee.id} 
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isOverdue ? 'bg-rose-50/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
                        {mentee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{mentee.name}</span>
                          <span className="text-[11px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {mentee.rollNo}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{mentee.section}</span>
                          <span>&bull;</span>
                          <span className="font-medium text-indigo-600">{mentee.stream}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className={mentee.academicMetrics.overallAttendance < 75 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                          {mentee.academicMetrics.overallAttendance}% Attendance
                        </span>
                        {mentee.academicMetrics.overallAttendance < 75 && (
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-1 rounded font-bold">
                            Below 75% Cutoff
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500">
                        Last Term: <span className="font-semibold text-slate-700">{mentee.academicMetrics.lastTermPercentage}%</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-xs">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {isOverdue && (
                          <span className="text-rose-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {mentee.daysSinceLastSession} days ago
                          </span>
                        )}
                        {isDueSoon && (
                          <span className="text-amber-600 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {mentee.daysSinceLastSession} days ago
                          </span>
                        )}
                        {!isOverdue && !isDueSoon && (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {mentee.daysSinceLastSession} days ago
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {mentee.lastOneOnOneDate 
                          ? new Date(mentee.lastOneOnOneDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                          : 'Never met'}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <RagBadge status={mentee.ragRiskStatus} size="sm" />
                    {mentee.academicMetrics.weakSubjects.length > 0 && (
                      <div className="text-[11px] text-slate-400 mt-1 truncate max-w-[150px]">
                        Weak: {mentee.academicMetrics.weakSubjects.join(', ')}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/mentorship/mentor/session/${mentee.studentId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-medium text-xs border border-indigo-200 hover:border-indigo-600 transition-all shadow-sm group"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredMentees.length === 0 && (
        <div className="p-8 text-center text-slate-500 text-sm">
          No mentees match your search and filter criteria.
        </div>
      )}
    </div>
  );
}
