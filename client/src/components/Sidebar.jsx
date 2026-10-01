import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Bot,
  Calculator,
  Brain,
  Code2,
  Users,
  FileText,
  TrendingUp,
  BookOpen,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ currentView, onNavigate }) => {
  const { user, isAdmin } = useAuth();

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: '' },
    { id: 'mock-interview', label: 'AI Mock Interview', icon: Bot, badge: 'AI Live', highlight: true },
    { id: 'aptitude', label: 'Aptitude Practice', icon: Calculator, badge: '9 Topics' },
    { id: 'reasoning', label: 'Logical Reasoning', icon: Brain, badge: '8 Topics' },
    { id: 'technical', label: 'Technical Prep', icon: Code2, badge: 'Code AI' },
    { id: 'hr', label: 'HR Behavioral', icon: Users, badge: 'STAR' },
    { id: 'resume', label: 'Resume ATS', icon: FileText, badge: 'Scanner' },
    { id: 'progress', label: 'Analytics & Streaks', icon: TrendingUp, badge: '' },
    { id: 'questions', label: 'Question Bank', icon: BookOpen, badge: '' },
    { id: 'profile', label: 'Profile & Goals', icon: UserCheck, badge: '' },
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert, badge: 'Overview' },
    { id: 'admin-users', label: 'Enrolled Candidates', icon: Users, badge: 'Students' },
    { id: 'admin-questions', label: 'Question Management', icon: BookOpen, badge: 'Editor' },
    { id: 'profile', label: 'Admin Profile', icon: UserCheck, badge: '' },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <aside className="w-64 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 transition-colors">
      {/* Mini Profile Card */}
      <div className="p-3.5 mb-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-slate-100/60 dark:from-slate-800/80 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl ${isAdmin ? 'bg-gradient-to-tr from-amber-500 to-orange-500' : 'bg-gradient-to-tr from-indigo-600 to-cyan-500'} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
            {user?.name ? user.name.charAt(0).toUpperCase() : (isAdmin ? 'A' : 'S')}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user?.name || (isAdmin ? 'Placement Admin' : 'Student Candidate')}
            </h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              {isAdmin && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  ADMIN
                </span>
              )}
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">
                {user?.targetRole || (isAdmin ? 'Placement Coordinator' : 'Software Engineer')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 mb-2">
        {isAdmin ? 'Administration Portal' : 'Preparation Modules'}
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'admin' && currentView === 'admin-overview');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                  : item.highlight
                  ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : item.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.highlight
                      ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                      : isAdmin
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Card */}
      <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/80 dark:border-indigo-900/40 text-xs">
        <div className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
          {isAdmin ? <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{isAdmin ? 'Admin Portal Active' : 'Placement Tip'}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
          {isAdmin
            ? 'Manage candidates, review benchmarks, and curate the placement Question Bank.'
            : 'Consistent practice of 2 mock interviews per week increases campus offer rates by 4.2x.'}
        </p>
      </div>
    </aside>
  );
};
