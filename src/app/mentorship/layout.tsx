'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  GraduationCap, 
  FileSpreadsheet, 
  Users, 
  School,
  ChevronDown
} from 'lucide-react';
import { SEED_MENTORS } from '@/lib/db/seed-data';

export default function MentorshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeMentorId, setActiveMentorId] = useState('mentor-1');
  const [showMentorDropdown, setShowMentorDropdown] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('active_mentor_id');
    if (saved) {
      setActiveMentorId(saved);
    }
  }, []);

  const handleSelectMentor = (id: string) => {
    setActiveMentorId(id);
    localStorage.setItem('active_mentor_id', id);
    setShowMentorDropdown(false);
    window.dispatchEvent(new Event('mentor-changed'));
  };

  const activeMentor = SEED_MENTORS.find(m => m.id === activeMentorId) || SEED_MENTORS[0];

  // Exactly 3 roles/spaces kept as requested
  const navLinks = [
    {
      href: '/mentorship/mentor',
      label: 'Mentor Cockpit',
      icon: Users,
      badge: 'Guidance'
    },
    {
      href: '/mentorship/student',
      label: 'Student Space',
      icon: GraduationCap,
      badge: 'My Targets'
    },
    {
      href: '/mentorship/authority',
      label: 'Authority Reports',
      icon: FileSpreadsheet,
      badge: 'Div / Batch / Year'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Institutional Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <Link href="/mentorship" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 flex items-center gap-2">
                    Senior School Mentorship Cell
                    <span className="hidden md:inline-flex text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold px-2 py-0.5 rounded-full">
                      Grades 9–12
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <School className="w-3 h-3 text-slate-400" />
                    <span>Holistic Student Guidance &bull; Mentorship System</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation Portals: Exactly 3 Portals */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/mentorship' && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span>{link.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {link.badge}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Active Teacher Mentor Switcher */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowMentorDropdown(!showMentorDropdown)}
                  className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-left transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {activeMentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {activeMentor.name}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      {activeMentor.subject} &bull; {activeMentor.assignedGrade.replace('_', ' ')}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showMentorDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Mentor
                    </div>
                    {SEED_MENTORS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMentor(m.id)}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          m.id === activeMentorId ? 'bg-indigo-50/70 font-semibold text-indigo-900' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{m.name}</div>
                          <div className="text-[11px] text-slate-500">{m.designation}</div>
                        </div>
                        {m.id === activeMentorId && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden border-t border-slate-200 px-4 py-2 flex items-center justify-around bg-slate-50 text-xs">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-medium ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Senior School Mentorship Platform &bull; Continuous Student Care</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Direct Mentor-to-Student Guidance</span>
            <span>&bull;</span>
            <span>Authority Reporting (Div, Batch, Year)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
