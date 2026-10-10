'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookMarked, 
  GraduationCap, 
  Users, 
  ArrowRight, 
  KeyRound, 
  User, 
  AlertCircle,
  Sparkles,
  School,
  Building2
} from 'lucide-react';

export default function GfmLoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'MENTOR' | 'COORDINATOR'>('STUDENT');

  // Student Form
  const [rollNo, setRollNo] = useState('10A-01');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/gfm/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo, password })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Login failed');
      }

      localStorage.setItem('gfm_logged_in_user', JSON.stringify({
        role: 'STUDENT',
        studentId: json.data.account.studentId,
        name: json.data.account.name,
        rollNo: json.data.account.rollNo,
        batchId: json.data.account.batchId
      }));

      router.push('/gfm/student');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStudentLogin = (demoRoll: string) => {
    setRollNo(demoRoll);
    setPassword('password123');
  };

  const handleMentorQuickLogin = (mentorId: string, mentorName: string) => {
    localStorage.setItem('gfm_logged_in_user', JSON.stringify({
      role: 'MENTOR',
      mentorId,
      name: mentorName
    }));
    localStorage.setItem('active_mentor_id', mentorId);
    router.push('/gfm/mentor');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-5 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md mb-3 border border-white/20">
            <BookMarked className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-xl font-extrabold tracking-tight">
            Guardian Faculty Member (GFM) App
          </h1>
          <p className="text-xs text-emerald-100 mt-1 flex items-center justify-center gap-1">
            <School className="w-3.5 h-3.5 text-emerald-200" />
            <span>Academic Green Book Mentorship &amp; Grievance Cell</span>
          </p>

          {/* Role Tabs */}
          <div className="flex bg-emerald-950/40 p-1 rounded-xl mt-6 text-xs font-bold border border-white/10">
            <button
              type="button"
              onClick={() => { setActiveTab('STUDENT'); setError(null); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'STUDENT' ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-100 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('MENTOR'); setError(null); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'MENTOR' ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Mentor</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('COORDINATOR' as any); setError(null); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                (activeTab as any) === 'COORDINATOR' ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Coordinator</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-8">
          {activeTab === 'STUDENT' ? (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Student Roll Number</span>
                </label>
                <input
                  type="text"
                  required
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="e.g. 10A-01 or 11A-01"
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-semibold text-slate-900 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-semibold text-slate-900 bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Enter GFM Batch'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Demo Logins */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  1-Click Demo Student Accounts:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickStudentLogin('10A-01')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 font-semibold transition-colors"
                  >
                    10A-01 (Karan Vashisht)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStudentLogin('11A-01')}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg border border-rose-200 font-semibold transition-colors"
                  >
                    11A-01 (Aarav - High Risk)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStudentLogin('11A-06')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 font-semibold transition-colors"
                  >
                    11A-06 (Aditya)
                  </button>
                </div>
              </div>
            </form>
          ) : activeTab === 'MENTOR' ? (
            <div className="space-y-4">
              <span className="text-xs text-slate-500 block mb-2">
                Select your faculty profile to access your GFM Batch Dashboard:
              </span>

              <button
                type="button"
                onClick={() => handleMentorQuickLogin('mentor-3', 'Dr. Ananya Sen')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">Dr. Ananya Sen</div>
                  <div className="text-xs text-slate-500">GFM Div-B &bull; Batch-2 (36 Students) &bull; English &amp; Humanities Lead</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleMentorQuickLogin('mentor-1', 'Mr. R.K. Sharma')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">Mr. R.K. Sharma</div>
                  <div className="text-xs text-slate-500">GFM Div-A &bull; Batch-1 (34 Students) &bull; Senior Physics</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleMentorQuickLogin('mentor-2', 'Mrs. Sunita Roy')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">Mrs. Sunita Roy</div>
                  <div className="text-xs text-slate-500">GFM Div-C &bull; Batch-3 (32 Students) &bull; Senior Accounts</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            /* COORDINATOR LOGIN */
            <div className="space-y-4">
              <span className="text-xs text-slate-500 block mb-2">
                Access the central oversight console for Mentor Coordinators, HoDs, and Academic Administration:
              </span>

              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Institutional Coordinator Portal</h4>
                    <p className="text-[11px] text-slate-400">Total Mentors &bull; Mentee Reports &bull; Allocation</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Review submitted mentor reports, view student names across mentors, audit Red/Orange/Green mentor activity health flags, and allocate faculty to batch divisions.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('gfm_logged_in_user', JSON.stringify({
                      role: 'COORDINATOR',
                      name: 'Prof. S. Mukherjee (Mentor Coordinator)'
                    }));
                    router.push('/gfm/coordinator');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enter Coordinator Admin Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
