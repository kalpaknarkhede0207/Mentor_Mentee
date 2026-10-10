'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BookMarked, 
  Users, 
  GraduationCap, 
  LogOut, 
  Bell, 
  Sparkles,
  School,
  FileCheck,
  Building2
} from 'lucide-react';
import { SEED_MENTORS } from '@/lib/db/seed-data';

export default function GfmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ role: 'STUDENT' | 'MENTOR'; name: string; rollNo?: string; mentorId?: string } | null>(null);

  useEffect(() => {
    // Check logged in user or set default demo state
    const savedUser = localStorage.getItem('gfm_logged_in_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        // fallback
      }
    } else {
      // Default to student Karan if on student route, else mentor Sharma
      if (pathname.includes('/student')) {
        setCurrentUser({ role: 'STUDENT', name: 'Karan Vashisht', rollNo: '10A-01' });
      } else {
        setCurrentUser({ role: 'MENTOR', name: 'Dr. Ananya Sen', mentorId: 'mentor-3' });
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('gfm_logged_in_user');
    router.push('/gfm/login');
  };

  const isLoginPage = pathname === '/gfm/login';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {!isLoginPage && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-15 sm:h-16 gap-2">
              {/* Brand Logo */}
              <Link 
                href={currentUser?.role === 'STUDENT' ? '/gfm/student' : '/gfm/mentor'} 
                className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform shrink-0">
                  <BookMarked className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs sm:text-base tracking-tight text-slate-900 flex items-center gap-1.5 sm:gap-2">
                    <span className="truncate">GFM Portal</span>
                    <span className="hidden sm:inline-flex text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                      Academic Green Book
                    </span>
                  </div>
                  <div className="hidden md:flex text-[11px] text-slate-500 items-center gap-1.5">
                    <School className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">Guardian Faculty Member &bull; Student Care &amp; Mentorship</span>
                  </div>
                </div>
              </Link>

              {/* Portal Switcher Navigation */}
              <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
                {currentUser && (
                  <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold mr-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="truncate max-w-[130px]">{currentUser.name} {currentUser.rollNo ? `(${currentUser.rollNo})` : ''}</span>
                  </span>
                )}

                <div className="flex items-center bg-slate-100/80 p-0.5 sm:p-1 rounded-xl border border-slate-200/60">
                  <Link
                    href="/gfm/student"
                    className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                      pathname.startsWith('/gfm/student')
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                    title="Student Mentee Portal"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student</span>
                  </Link>

                  <Link
                    href="/gfm/mentor"
                    className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                      pathname.startsWith('/gfm/mentor') || pathname.startsWith('/gfm/session') || pathname.startsWith('/gfm/meeting')
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                    title="GFM Faculty Mentor Portal"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Mentor</span>
                  </Link>

                  <Link
                    href="/gfm/coordinator"
                    className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                      pathname.startsWith('/gfm/coordinator')
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                    title="Mentor Coordinator Console"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Coord</span>
                    <span className="sm:hidden">Coord</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Logout / Switch User"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </nav>
            </div>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </main>

      {/* Footer */}
      {!isLoginPage && (
        <footer className="border-0 border-none bg-transparent py-4 mt-auto text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>GFM System &bull; Compliant with Institutional Mentorship Guidelines</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] text-slate-400">
              <span>Weekly Batch Meetings</span>
              <span>&bull;</span>
              <span>On-Device Grievance Box</span>
              <span>&bull;</span>
              <span>30–45s AI Voice Transcripts</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
