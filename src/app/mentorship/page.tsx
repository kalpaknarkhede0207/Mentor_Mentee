'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  GraduationCap, 
  FileSpreadsheet, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Target, 
  CheckCircle2, 
  HeartHandshake
} from 'lucide-react';

export default function MentorshipHubPage() {
  const portals = [
    {
      title: 'Teacher Mentor Cockpit',
      role: 'Class Mentors & Subject Guides',
      description: 'Dedicated workspace for mentors to track their 12–15 assigned students, log quick 1-on-1 guidance, conduct batch huddles, and submit reports directly to school authority.',
      href: '/mentorship/mentor',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Mentor Workspace',
      features: [
        'Rolling 1-on-1 Guidance Tracking',
        '30-Second AI Voice Wrap-Up Engine',
        'Submit Batch Reports to Authority by Div/Batch/Year'
      ]
    },
    {
      title: 'Student Space',
      role: 'Grades 9, 10, 11 & 12 Mentees',
      description: 'A positive, supportive hub for students to view personal guidance targets, check off mentor action items, build daily study habits, and directly request advice without board exam stress for Grades 9-10.',
      href: '/mentorship/student',
      icon: GraduationCap,
      color: 'from-indigo-600 to-violet-600',
      badge: 'Student Space',
      features: [
        'Foundational Term Milestones (No Board Panic for 9-10)',
        'Interactive Action Item Checklist from Mentor',
        '1-Click Direct Advice & Guidance Request'
      ]
    },
    {
      title: 'Authority Reports Portal',
      role: 'Principal, Supervisor & Academic Management',
      description: 'Central reporting command where school authorities review formal batch reports submitted by mentors, filtered by Division (Div), Batch, and Academic Year.',
      href: '/mentorship/authority',
      icon: FileSpreadsheet,
      color: 'from-slate-800 to-slate-900',
      badge: 'Institutional Governance',
      features: [
        'Filter by Division (Div A, Div B), Batch & Year',
        'Mentor Observations & High-Priority Student Triage',
        'Official Authority Review & Printable Batch Summary'
      ]
    }
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clean Mentor-to-Student Flow &bull; Authority Oversight</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Senior School Mentorship &amp; Academic Guidance Cell
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            A simplified, human-centered student mentorship framework for Grades 9–12. Removed board exam pressure for Grades 9–10 in favor of foundational growth, personalized teacher coaching, and structured authority reporting by <strong>Division</strong>, <strong>Batch</strong>, and <strong>Academic Year</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/mentorship/mentor"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 group"
            >
              <span>Open Teacher Mentor Cockpit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/mentorship/authority"
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <span>View Authority Reports</span>
            </Link>
          </div>
        </div>
      </div>

      {/* The 3 Core Modules */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Platform Portals</h2>
          <p className="text-xs text-slate-500">Select a portal to explore the unified workflow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.title}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${portal.color} text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {portal.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-400 mb-2">{portal.role}</div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {portal.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {portal.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={portal.href}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 font-semibold text-xs border border-slate-200 group-hover:border-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                  <span>Enter Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simplified Student-Mentor Workflow Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-indigo-600" />
          <span>Simplified Student &bull; Mentor &bull; Authority Progression Flow</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Removing high-stakes board test pressure for 9–10 while giving school authorities complete visibility across Division, Batch, and Academic Year.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="font-bold text-indigo-700 block mb-1">Step 1: Mentor Guidance</span>
            <p className="text-slate-600">
              Mentor conducts friendly rolling 1-on-1 or huddles. Uses 30s voice summary or text to set positive action items.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="font-bold text-indigo-700 block mb-1">Step 2: Student Execution</span>
            <p className="text-slate-600">
              Student views clear, encouraging targets in their Student Space, checks off finished tasks, and requests guidance anytime.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="font-bold text-indigo-700 block mb-1">Step 3: Authority Reporting</span>
            <p className="text-slate-600">
              Mentor submits aggregated reports structured by <strong>Division</strong>, <strong>Batch</strong>, and <strong>Year</strong> for administrative review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
