'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  UserPlus, 
  ArrowRight, 
  Check, 
  X, 
  Filter, 
  Search, 
  Send, 
  ShieldCheck, 
  Eye, 
  Menu,
  Calendar,
  School,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface MentorData {
  id: string;
  name: string;
  subject: string;
  designation: string;
  avatarUrl?: string;
  division: string;
  batch: string;
  totalMentees: number;
  studentNames: string[]; // Strictly names only!
  reportsCount: number;
  huddlesCount: number;
  lastReportDate: string | null;
  activityFlag: 'GREEN' | 'ORANGE' | 'RED';
  activityFlagReason: string;
}

interface AuthorityReportData {
  id: string;
  mentorId: string;
  mentorName: string;
  division: string;
  batch: string;
  academicYear: string;
  grade: string;
  stream: string;
  submittedAt: string;
  totalMentees: number;
  completedOneOnOnes: number;
  averageAttendance: number;
  summaryObservations: string;
  actionPlanForAuthority?: string;
  highPriorityStudents?: Array<{ studentId: string; name: string; rollNo: string; concern: string }>;
  status: string;
  authorityRemarks?: string;
  reviewedAt?: string;
}

export default function MentorCoordinatorPage() {
  const [loading, setLoading] = useState(true);
  const [totalMentors, setTotalMentors] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [reports, setReports] = useState<AuthorityReportData[]>([]);
  const [mentors, setMentors] = useState<MentorData[]>([]);

  // Navigation module & drawer encapsulation
  type CoordinatorModule = 'OVERVIEW' | 'MENTORS' | 'REPORTS' | 'ALLOCATION' | 'INSTITUTIONAL';
  const [activeModule, setActiveModule] = useState<CoordinatorModule>('OVERVIEW');
  const [showDrawerMenu, setShowDrawerMenu] = useState(false);

  // Modal 1: Student Names Only Modal
  const [selectedMentorForStudents, setSelectedMentorForStudents] = useState<MentorData | null>(null);
  const [studentNameFilter, setStudentNameFilter] = useState('');

  // Modal 2: Report Review Modal
  const [selectedReportForReview, setSelectedReportForReview] = useState<AuthorityReportData | null>(null);
  const [coordinatorRemarks, setCoordinatorRemarks] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Allocation Form State
  const [allocDivision, setAllocDivision] = useState('Div-A');
  const [allocBatch, setAllocBatch] = useState('Batch-1');
  const [allocMentorId, setAllocMentorId] = useState('');
  const [allocating, setAllocating] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Filter & Search
  const [searchMentor, setSearchMentor] = useState('');
  const [flagFilter, setFlagFilter] = useState<'ALL' | 'GREEN' | 'ORANGE' | 'RED'>('ALL');

  useEffect(() => {
    fetchCoordinatorData();
  }, []);

  const fetchCoordinatorData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gfm/coordinator');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTotalMentors(json.data.totalMentors);
          setTotalStudents(json.data.totalStudents);
          setReports(json.data.reports || []);
          setMentors(json.data.mentors || []);
          if (json.data.mentors?.length > 0 && !allocMentorId) {
            setAllocMentorId(json.data.mentors[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Error loading coordinator data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocMentorId) return;

    setAllocating(true);
    setNoticeMessage(null);

    try {
      const res = await fetch('/api/gfm/coordinator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'allocate',
          mentorId: allocMentorId,
          division: allocDivision,
          batch: allocBatch
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setMentors(json.data.mentors || []);
        const assignedMentor = json.data.mentors?.find((m: MentorData) => m.id === allocMentorId);
        setNoticeMessage(`✓ Mentor ${assignedMentor?.name || ''} successfully allocated to ${allocDivision} (${allocBatch}).`);
        setTimeout(() => setNoticeMessage(null), 5000);
      }
    } catch (err) {
      console.error('Allocation error:', err);
    } finally {
      setAllocating(false);
    }
  };

  const handleReviewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportForReview || !coordinatorRemarks.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/gfm/coordinator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'acknowledge_report',
          reportId: selectedReportForReview.id,
          authorityRemarks: coordinatorRemarks.trim()
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setReports(json.data.reports || []);
        setMentors(json.data.mentors || []);
        setSelectedReportForReview(null);
        setCoordinatorRemarks('');
        setNoticeMessage('✓ Mentor report acknowledged and official feedback logged.');
        setTimeout(() => setNoticeMessage(null), 5000);
      }
    } catch (err) {
      console.error('Review error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const greenMentorsCount = mentors.filter(m => m.activityFlag === 'GREEN').length;
  const orangeMentorsCount = mentors.filter(m => m.activityFlag === 'ORANGE').length;
  const redMentorsCount = mentors.filter(m => m.activityFlag === 'RED').length;

  const filteredMentors = mentors.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchMentor.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchMentor.toLowerCase()) ||
      m.division.toLowerCase().includes(searchMentor.toLowerCase());
    const matchesFlag = flagFilter === 'ALL' || m.activityFlag === flagFilter;
    return matchesSearch && matchesFlag;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Mentor Coordinator Command Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* SOLID PROFESSIONAL HEADER */}
      <header className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] bg-slate-800 text-amber-400 border border-slate-700 px-2.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                Admin Command Center
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded font-semibold">
                Mentor Coordinator Authority
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Institutional Mentorship Oversight
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Supervise Guardian Faculty Members (GFMs), inspect submitted mentee reports, allocate division batches, and audit mentor activity health flags.
            </p>
          </div>

          {/* Quick Action Buttons & 3-Line Menu Trigger */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveModule('ALLOCATION')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Allocate Mentor</span>
            </button>

            {/* 3-LINE MENU BUTTON */}
            <button
              onClick={() => setShowDrawerMenu(true)}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-slate-900" />
              <span>Menu</span>
            </button>
          </div>
        </div>

        {/* 4 Essential Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Total Mentors</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black text-white">{totalMentors}</span>
              <span className="text-[10px] text-slate-400">Faculty Members</span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Total Students</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black text-emerald-400">{totalStudents}</span>
              <span className="text-[10px] text-slate-400">Mentees</span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Reports Received</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black text-white">{reports.length}</span>
              <span className="text-[10px] text-slate-400">Official Dossiers</span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Activity Flags</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {greenMentorsCount}
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {orangeMentorsCount}
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                {redMentorsCount}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 3-LINE MENU DRAWER / MODAL */}
      {showDrawerMenu && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-slate-200 flex flex-col p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5 text-slate-900" />
                <h3 className="font-black text-base text-slate-900">Coordinator Modules</h3>
              </div>
              <button 
                onClick={() => setShowDrawerMenu(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider px-1">
              Administration
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto">
              <button
                onClick={() => { setActiveModule('OVERVIEW'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'OVERVIEW' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Dashboard Overview</span>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveModule('MENTORS'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'MENTORS' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Mentors &amp; Activity ({mentors.length})</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveModule('REPORTS'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'REPORTS' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Official Reports ({reports.length})</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveModule('ALLOCATION'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'ALLOCATION' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4" />
                  <span>Batch Allocation Console</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => { setActiveModule('INSTITUTIONAL'); setShowDrawerMenu(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeModule === 'INSTITUTIONAL' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4" />
                  <span>Institutional Model &amp; PMM</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <button
                onClick={() => { setActiveModule('ALLOCATION'); setShowDrawerMenu(false); }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Quick Allocate Mentor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Notification Banner */}
      {noticeMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{noticeMessage}</span>
          </div>
          <button onClick={() => setNoticeMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SOLID CAPSULE TAB BAR */}
      <div className="bg-white rounded-xl p-1.5 border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveModule('OVERVIEW')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
            activeModule === 'OVERVIEW'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveModule('MENTORS')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
            activeModule === 'MENTORS'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Mentors &amp; Activity ({mentors.length})
        </button>

        <button
          onClick={() => setActiveModule('REPORTS')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
            activeModule === 'REPORTS'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Reports from Mentors ({reports.length})
        </button>

        <button
          onClick={() => setActiveModule('ALLOCATION')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
            activeModule === 'ALLOCATION'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Batch Allocation Console
        </button>

        <button
          onClick={() => setActiveModule('INSTITUTIONAL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
            activeModule === 'INSTITUTIONAL'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Institutional Model &amp; PMM
        </button>
      </div>

      {/* =========================================================================
          TAB 0: EXECUTIVE OVERVIEW
         ========================================================================= */}
      {activeModule === 'OVERVIEW' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Mentors RAG Health */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mentor Compliance</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{mentors.length}</span>
                <span className="text-xs text-slate-500">Mentors on Record</span>
              </div>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  {greenMentorsCount} Green
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                  {orangeMentorsCount} Orange
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-bold border border-rose-200">
                  {redMentorsCount} Red
                </span>
              </div>
              <button
                onClick={() => setActiveModule('MENTORS')}
                className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open Mentors Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Official Reports Received */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reports Log</span>
                <FileText className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{reports.length}</span>
                <span className="text-xs text-slate-500">Submitted Dossiers</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1">
                {reports.filter(r => r.status === 'SUBMITTED' || !r.reviewedAt).length} pending institutional review
              </p>
              <button
                onClick={() => setActiveModule('REPORTS')}
                className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Review Reports</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Batch Cohort Allocations */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Batch Allocation</span>
                <UserPlus className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{totalStudents}</span>
                <span className="text-xs text-slate-500">Mentees Mapped</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1">
                Div-A, Div-B, Div-C cohorts assigned
              </p>
              <button
                onClick={() => setActiveModule('ALLOCATION')}
                className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Configure Batches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4. Institutional Model & PMM */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Institutional Flow</span>
                <Building2 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">Mid-Sem</span>
                <span className="text-xs text-slate-500">PMM Protocol</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1">
                Academic &amp; Non-Academic bridge flow
              </p>
              <button
                onClick={() => setActiveModule('INSTITUTIONAL')}
                className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Framework</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Focus Split: Mentors RAG Snapshot & Recent Reports Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Mentors Attention Snapshot */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Mentor Activity Status</h3>
                  <p className="text-xs text-slate-500">Live RAG flag compliance across faculty</p>
                </div>
                <button 
                  onClick={() => setActiveModule('MENTORS')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {mentors.slice(0, 4).map((mentor) => (
                  <div key={mentor.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center shrink-0">
                        {mentor.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{mentor.name}</div>
                        <div className="text-[11px] text-slate-500">{mentor.division} &bull; {mentor.batch} &bull; {mentor.subject}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mentor.activityFlag === 'GREEN'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : mentor.activityFlag === 'ORANGE'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {mentor.activityFlag}
                      </span>
                      <button
                        onClick={() => setSelectedMentorForStudents(mentor)}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer text-[11px]"
                      >
                        {mentor.totalMentees} Mentees
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Reports & Inquiries Snapshot */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Mentor Reports</h3>
                  <p className="text-xs text-slate-500">Official dossiers submitted for administrative action</p>
                </div>
                <button 
                  onClick={() => setActiveModule('REPORTS')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  Review All &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {reports.slice(0, 3).map((rep) => (
                  <div key={rep.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{rep.mentorName} ({rep.division})</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(rep.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-1">{rep.summaryObservations}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        Attendance: <strong className="text-slate-800">{rep.averageAttendance}%</strong> &bull; Mentees: <strong className="text-slate-800">{rep.totalMentees}</strong>
                      </span>
                      <button
                        onClick={() => {
                          setSelectedReportForReview(rep);
                          setCoordinatorRemarks(rep.authorityRemarks || '');
                        }}
                        className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}

                {reports.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-6">No submitted reports on file.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: MENTORS DIRECTORY WITH RAG ACTIVITY FLAGS & CLICKABLE NAME ROSTER
         ========================================================================= */}
      {activeModule === 'MENTORS' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search mentor by name, department, or division..."
                value={searchMentor}
                onChange={(e) => setSearchMentor(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-slate-400 text-[11px] font-bold mr-1">Filter Activity:</span>
              <button
                onClick={() => setFlagFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                  flagFilter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFlagFilter('GREEN')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer flex items-center gap-1 ${
                  flagFilter === 'GREEN' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Green ({greenMentorsCount})</span>
              </button>
              <button
                onClick={() => setFlagFilter('ORANGE')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer flex items-center gap-1 ${
                  flagFilter === 'ORANGE' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Orange ({orangeMentorsCount})</span>
              </button>
              <button
                onClick={() => setFlagFilter('RED')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer flex items-center gap-1 ${
                  flagFilter === 'RED' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Red ({redMentorsCount})</span>
              </button>
            </div>
          </div>

          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-4">Faculty Mentor</th>
                  <th className="p-4">Allocated Batch</th>
                  <th className="p-4">Mentees Count</th>
                  <th className="p-4">Reports Sent to Coordinator</th>
                  <th className="p-4">Mentor Activity Flag</th>
                  <th className="p-4 text-right">Student List (Names Only)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMentors.map((m) => (
                  <tr 
                    key={m.id} 
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-extrabold flex items-center justify-center">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-slate-900 text-sm block">{m.name}</strong>
                          <span className="text-[11px] text-slate-500">{m.subject}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                        {m.division} &bull; {m.batch}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-extrabold text-slate-900 text-sm">{m.totalMentees}</span>
                      <span className="text-slate-500 text-[11px] block">Students assigned</span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          m.reportsCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {m.reportsCount} {m.reportsCount === 1 ? 'Report' : 'Reports'}
                        </span>
                        {m.lastReportDate && (
                          <span className="text-[10px] text-slate-400">
                            Last: {new Date(m.lastReportDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Activity RAG Flag */}
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${
                          m.activityFlag === 'GREEN'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : m.activityFlag === 'ORANGE'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            m.activityFlag === 'GREEN' ? 'bg-emerald-600' : m.activityFlag === 'ORANGE' ? 'bg-amber-600' : 'bg-rose-600'
                          }`} />
                          <span>{m.activityFlag === 'GREEN' ? 'Green (Active)' : m.activityFlag === 'ORANGE' ? 'Orange (Pending)' : 'Red (Defaulter)'}</span>
                        </span>
                        <span className="text-[10px] text-slate-500">{m.activityFlagReason}</span>
                      </div>
                    </td>

                    {/* Clickable student list */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedMentorForStudents(m);
                          setStudentNameFilter('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Student List </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (visible on mobile only) */}
          <div className="md:hidden space-y-3">
            {filteredMentors.map((m) => (
              <div 
                key={m.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-extrabold flex items-center justify-center shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <strong className="text-slate-900 text-sm block">{m.name}</strong>
                      <span className="text-xs text-slate-500">{m.subject}</span>
                    </div>
                  </div>

                  {/* RAG Flag Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                    m.activityFlag === 'GREEN'
                      ? 'bg-emerald-100 text-emerald-800'
                      : m.activityFlag === 'ORANGE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      m.activityFlag === 'GREEN' ? 'bg-emerald-600' : m.activityFlag === 'ORANGE' ? 'bg-amber-600' : 'bg-rose-600'
                    }`} />
                    <span>{m.activityFlag} Flag</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Allocated Batch:</span>
                    <strong className="text-slate-800">{m.division} &bull; {m.batch}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Total Mentees:</span>
                    <strong className="text-slate-800">{m.totalMentees} Students</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block font-bold">Reports Submitted:</span>
                    <strong className="text-slate-800">{m.reportsCount} Reports to Coordinator</strong>
                    <span className="text-[10px] text-slate-500 block">{m.activityFlagReason}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedMentorForStudents(m);
                    setStudentNameFilter('');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Student List </span>
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: REPORTS FROM MENTORS SENT TO COORDINATOR
         ========================================================================= */}
      {activeModule === 'REPORTS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Official Batch Reports Submitted by Mentors
              </h2>
              <p className="text-xs text-slate-500">
                Periodic reports submitted according to Division, Batch, and Academic Year
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
              {reports.length} Dossiers Received
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {reports.map((rep) => (
              <div 
                key={rep.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {rep.division} &bull; {rep.batch}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Year: <strong>{rep.academicYear}</strong>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rep.status === 'REVIEWED_AND_ACKNOWLEDGED' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rep.status === 'REVIEWED_AND_ACKNOWLEDGED' ? '✓ Acknowledged by Coordinator' : 'Pending Review'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Mentee Progress &amp; Welfare Report &bull; {rep.mentorName}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Submitted on: {new Date(rep.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Telemetry pill */}
                  <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs shrink-0">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Mentees</span>
                      <strong className="text-slate-800">{rep.totalMentees}</strong>
                    </div>
                    <div className="h-6 w-px bg-slate-200" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Avg Attendance</span>
                      <strong className={rep.averageAttendance < 75 ? 'text-rose-600' : 'text-emerald-700'}>
                        {rep.averageAttendance}%
                      </strong>
                    </div>
                    <div className="h-6 w-px bg-slate-200" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">1-on-1s</span>
                      <strong className="text-slate-800">{rep.completedOneOnOnes} Done</strong>
                    </div>
                  </div>
                </div>

                {/* Mentor Summary Observations */}
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                    Mentor Observations &amp; Interventions Completed:
                  </span>
                  <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
                    {rep.summaryObservations}
                  </p>
                </div>

                {/* Existing Coordinator Remarks or Review Button */}
                {rep.authorityRemarks ? (
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-0.5">
                    <strong className="block text-[11px] text-blue-900 uppercase">Coordinator Review / Remarks:</strong>
                    <p className="leading-relaxed">{rep.authorityRemarks}</p>
                    <span className="text-[10px] text-blue-600 block mt-1">
                      Acknowledged on: {new Date(rep.reviewedAt || rep.submittedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => {
                        setSelectedReportForReview(rep);
                        setCoordinatorRemarks('');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Review &amp; Acknowledge Report</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {reports.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
                No mentor reports received yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: MENTOR ALLOCATION TO DIVISION & BATCHES
         ========================================================================= */}
      {activeModule === 'ALLOCATION' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs max-w-2xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Allocate Mentor to Division &amp; Batch
                </h2>
                <p className="text-xs text-slate-500">
                  Assign faculty mentors to 20–30 student cohorts across Division and Batches
                </p>
              </div>
            </div>

            <form onSubmit={handleAllocateMentor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Target Division
                  </label>
                  <select
                    value={allocDivision}
                    onChange={(e) => setAllocDivision(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Div-A">Division A (10th / First Year)</option>
                    <option value="Div-B">Division B (11th Science / Second Year)</option>
                    <option value="Div-C">Division C (12th Commerce / Third Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Batch
                  </label>
                  <select
                    value={allocBatch}
                    onChange={(e) => setAllocBatch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Batch-1">Batch 1 (Roll 01 - 25)</option>
                    <option value="Batch-2">Batch 2 (Roll 26 - 50)</option>
                    <option value="Batch-3">Batch 3 (Roll 51 - 75)</option>
                  </select>
                </div>
              </div>

              {/* Mentor selection dropdown */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Faculty Mentor from Dropdown
                </label>
                <select
                  value={allocMentorId}
                  onChange={(e) => setAllocMentorId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} &bull; {m.subject} (Currently: {m.division} {m.batch})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <strong>Institutional Allocation Rule:</strong>
                <p>
                  Allocating a mentor assigns the entire mentee roster of the selected division and batch to the chosen faculty member. Mentees will automatically see this mentor on their GFM device.
                </p>
              </div>

              <button
                type="submit"
                disabled={allocating}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {allocating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Allocating Mentor...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Confirm &amp; Allocate Mentor to {allocDivision}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Current Active Allocations Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Current Division &amp; Batch Mentor Allocations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {mentors.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
                      {m.division} &bull; {m.batch}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{m.totalMentees} Mentees</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-sm">{m.name}</strong>
                    <span className="text-[11px] text-slate-500">{m.subject}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: INSTITUTIONAL MODEL (NON-ACADEMIC BRIDGE & MID-SEM PMM)
         ========================================================================= */}
      {activeModule === 'INSTITUTIONAL' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Institutional Mentorship Guidelines &amp; Bridge Function
                </h2>
                <p className="text-xs text-slate-500">
                  Mapping academic and non-academic counseling flow towards Institute Authorities
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Card A: Dual Problem-Solving Architecture */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>Academic vs Non-Academic Bridge Function</span>
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Academic on Forefront:</strong> Handled directly by faculty mentors via weekly batch huddles, unit test remedial clinics, and 30–45s voice summaries.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Non-Academic Escalation:</strong> For issues concerning hostel, mess, campus discipline, fees, or personal wellbeing, the mentor works as a <strong>bridge</strong> to convey issues directly to the Coordinator, HoD, and Campus Administration.
                </p>
              </div>

              {/* Card B: Mid-Semester Parent-Mentor Meeting (PMM) */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                <span className="font-extrabold text-indigo-950 text-xs flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-700" />
                  <span>Mid-Semester Parent-Mentor Meeting (PMM)</span>
                </span>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Cadence:</strong> Conducted once every semester, ideally in the middle of the semester.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Purpose:</strong> Direct interaction where parents review their ward&apos;s Academic Green Book progress, attendance percentage, and academic trajectory. Parents are welcome to visit the Institute anytime to consult mentors and the Coordinator.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          MODAL 1: STUDENT NAMES ONLY MODAL (STRICTLY NAMES, NO OTHER DETAILS)
         ========================================================================= */}
      {selectedMentorForStudents && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 relative">
              <button
                onClick={() => setSelectedMentorForStudents(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base">
                  {selectedMentorForStudents.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    {selectedMentorForStudents.name}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    {selectedMentorForStudents.division} &bull; {selectedMentorForStudents.batch} &bull; {selectedMentorForStudents.subject}
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Compliance Banner */}
            <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
              <span className="font-bold">Mentee Student List:</span>
              <span className="text-[11px] font-semibold bg-emerald-200/80 px-2 py-0.5 rounded-full">
                {selectedMentorForStudents.studentNames.length} Students Assigned
              </span>
            </div>

            {/* Quick Search Filter */}
            <div className="p-3 bg-white border-b border-slate-200">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter student names..."
                  value={studentNameFilter}
                  onChange={(e) => setStudentNameFilter(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* List of Students - STRICTLY NAME ONLY! */}
            <div className="p-4 sm:p-5 max-h-[55vh] overflow-y-auto space-y-2 text-xs">
              {selectedMentorForStudents.studentNames
                .filter(name => !studentNameFilter.trim() || name.toLowerCase().includes(studentNameFilter.toLowerCase()))
                .map((studentName, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-900 font-semibold flex items-center gap-3 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-800">{studentName}</span>
                  </div>
                ))}

              {selectedMentorForStudents.studentNames.filter(name => !studentNameFilter.trim() || name.toLowerCase().includes(studentNameFilter.toLowerCase())).length === 0 && (
                <p className="text-slate-400 italic text-center py-6">
                  {studentNameFilter ? 'No matching student names found.' : 'No students assigned to this mentor yet.'}
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 italic">
                * Minimal student identity view compliant with coordinator guidelines
              </span>
              <button
                onClick={() => {
                  setSelectedMentorForStudents(null);
                  setStudentNameFilter('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: COORDINATOR REPORT REVIEW & ACKNOWLEDGMENT MODAL
         ========================================================================= */}
      {selectedReportForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 relative">
              <button
                onClick={() => setSelectedReportForReview(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-base sm:text-lg font-extrabold">
                Review Mentee Report
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                From: {selectedReportForReview.mentorName} &bull; {selectedReportForReview.division} ({selectedReportForReview.batch})
              </p>
            </div>

            <form onSubmit={handleReviewReport} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Mentor Observations:</span>
                <p className="text-slate-800 font-medium leading-relaxed">{selectedReportForReview.summaryObservations}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Coordinator Remarks &amp; Institutional Directives
                </label>
                <textarea
                  value={coordinatorRemarks}
                  onChange={(e) => setCoordinatorRemarks(e.target.value)}
                  placeholder="Enter institutional directions, guidance on non-academic escalations, or remedial clinic approval..."
                  rows={4}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReportForReview(null)}
                  className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingReview || !coordinatorRemarks.trim()}
                  className="w-full sm:w-auto text-center justify-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Acknowledge &amp; Send Directives</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
