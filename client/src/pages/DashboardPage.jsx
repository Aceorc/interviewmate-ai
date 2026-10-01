import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  Bot,
  Calculator,
  Brain,
  Code2,
  Users,
  FileText,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  ArrowRight,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const DashboardPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.getDashboardStats();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Sample or live trend data
  const scoreBreakdown = [
    { category: 'Aptitude', score: stats?.aptitudeScore || 70, color: '#6366f1' },
    { category: 'Reasoning', score: stats?.reasoningScore || 75, color: '#06b6d4' },
    { category: 'Technical', score: stats?.technicalScore || 65, color: '#a855f7' },
    { category: 'HR Round', score: stats?.hrScore || 80, color: '#10b981' }
  ];

  const trendData = [
    { day: 'Mon', score: 65 },
    { day: 'Tue', score: 72 },
    { day: 'Wed', score: 68 },
    { day: 'Thu', score: 80 },
    { day: 'Fri', score: 78 },
    { day: 'Sat', score: 85 },
    { day: 'Sun', score: stats?.averageScore || 82 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Placement Season {user?.graduationYear || 2026} Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Targeting <span className="font-semibold text-white">{user?.targetRole || 'Software Engineer'}</span> at{' '}
              <span className="font-semibold text-white">{user?.college || 'Campus Placements'}</span>. Your practice momentum is on track!
            </p>
          </div>

          {/* Placement Readiness Gauge */}
          <div className="flex items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="relative flex items-center justify-center w-20 h-20 mr-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400"
                  strokeDasharray={`${stats?.readinessIndex || 72}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold">{stats?.readinessIndex || 72}%</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-cyan-300">
                Readiness Index
              </div>
              <div className="text-xs font-semibold text-white mt-0.5">
                {stats?.readinessIndex >= 75 ? 'Interview Ready' : 'In Preparation'}
              </div>
              <p className="text-[10px] text-indigo-200 mt-1">Based on quiz & mock scores</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Questions Completed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Questions Solved</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats?.questionsCompleted || 0}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Across 17 Placement Topics
          </span>
        </div>

        {/* Mock Interviews */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mock Interviews</span>
            <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats?.mockInterviewsCompleted || 0}
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            Full AI Sessions Completed
          </span>
        </div>

        {/* Average Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Score</span>
            <TrendingUp className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats?.averageScore || 76}%
          </div>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
            Top 15% Campus Percentile
          </span>
        </div>

        {/* Quizzes Taken */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Practice Tests</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats?.quizzesCompleted || 0}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Timed Diagnostic Tests
          </span>
        </div>
      </div>

      {/* 3. CHARTS & PERFORMANCE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weekly Performance Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Average score trajectory across all practice rounds</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              Last 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" domain={[40, 100]} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fill="url(#scoreGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Category Proficiency</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Competency across placement dimensions</p>

            <div className="space-y-4">
              {scoreBreakdown.map(item => (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.category}</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('progress')}
              className="w-full py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-center"
            >
              View Full Analytics Report
            </button>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTION CARDS */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick Launch Practice</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('mock-interview')}
            className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer group"
          >
            <Bot className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm">AI Mock Interview</h4>
            <p className="text-xs text-indigo-100 mt-1">Multi-turn live simulation with instant scorecard</p>
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-white mt-3">
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => onNavigate('aptitude')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <Calculator className="w-6 h-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Quantitative Aptitude</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Timed test on Percentages & Profit/Loss</p>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-3">
              <span>Start Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => onNavigate('technical')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <Code2 className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Technical Rounds</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Java, Python, SQL & Core DSA Prep</p>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-purple-600 dark:text-purple-400 mt-3">
              <span>Code & Explain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => onNavigate('resume')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <FileText className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Resume ATS Scanner</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Check keyword density and missing items</p>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-600 dark:text-amber-400 mt-3">
              <span>Scan Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY FEED */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Recent Activity</h3>
        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {stats.recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    {act.type === 'Mock Interview' ? <Bot className="w-4 h-4" /> : <Calculator className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 dark:text-white">{act.title}</h5>
                    <p className="text-[11px] text-slate-400">
                      {new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {act.score}%
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No recent sessions recorded yet. Start with a quiz or mock interview!</p>
          </div>
        )}
      </div>
    </div>
  );
};
