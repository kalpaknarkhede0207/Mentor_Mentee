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
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Solid Header Branding */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center border-b border-slate-800">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-sm mb-3">
            <BookMarked className="w-6 h-6 text-amber-400" />
          </div>

          <h1 className="text-xl font-extrabold tracking-tight">
            Guardian Faculty Member (GFM) Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
            <School className="w-3.5 h-3.5 text-amber-400" />
            <span>Academic Mentorship &amp; Grievance Cell</span>
          </p>

          {/* Solid Capsule Role Tabs */}
          <div className="flex bg-slate-800 p-1 rounded-xl mt-6 text-xs font-semibold border border-slate-700">
            <button
              type="button"
              onClick={() => { setActiveTab('STUDENT'); setError(null); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'STUDENT' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('MENTOR'); setError(null); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'MENTOR' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Mentor</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('COORDINATOR'); setError(null); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'COORDINATOR' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Coordinator</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {activeTab === 'STUDENT' ? (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Student Roll Number</span>
                </label>
                <input
                  type="text"
                  required
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="e.g. 10A-01 or 11A-01"
                  className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-medium text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-medium text-slate-900 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Student Portal'}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              {/* Demo Helper Accounts */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Demo Student Accounts
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickStudentLogin('10A-01')}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 font-medium transition-colors cursor-pointer"
                  >
                    10A-01 (Karan Vashisht)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStudentLogin('11A-01')}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 font-medium transition-colors cursor-pointer"
                  >
                    11A-01 (Aarav Verma)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStudentLogin('11A-06')}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 font-medium transition-colors cursor-pointer"
                  >
                    11A-06 (Aditya Joshi)
                  </button>
                </div>
              </div>
            </form>
          ) : activeTab === 'MENTOR' ? (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Select Faculty Profile:
              </span>

              <button
                type="button"
                onClick={() => handleMentorQuickLogin('mentor-3', 'Dr. Ananya Sen')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Dr. Ananya Sen</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">Div-B &bull; Batch-2</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">36 Mentees &bull; English &amp; Humanities Lead</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleMentorQuickLogin('mentor-1', 'Mr. R.K. Sharma')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Mr. R.K. Sharma</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">Div-A &bull; Batch-1</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">34 Mentees &bull; Senior Physics</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleMentorQuickLogin('mentor-2', 'Mrs. Sunita Roy')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Mrs. Sunita Roy</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">Div-C &bull; Batch-3</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">32 Mentees &bull; Senior Accounts</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          ) : (
            /* COORDINATOR LOGIN */
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Administrative Oversight
              </span>

              <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3.5 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold border border-slate-700">
                    <Building2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Institutional Coordinator Portal</h4>
                    <p className="text-[11px] text-slate-400">Total Mentors &bull; Mentee Reports &bull; Allocation</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Review verified mentor logs, track mentee activity status across divisions, and manage academic batch allocations.
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
                  className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
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
