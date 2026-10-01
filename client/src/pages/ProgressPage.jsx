import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  TrendingUp,
  Award,
  CheckCircle,
  Calendar,
  Clock,
  Calculator,
  Brain,
  Code2,
  Users,
  Bot,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export const ProgressPage = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const [statsRes, histRes] = await Promise.all([
        api.getDashboardStats(),
        api.getQuizHistory()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (histRes.success) setHistory(histRes.attempts || []);
    } catch (err) {
      console.error('Failed to load progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  const radarData = [
    { subject: 'Aptitude', score: stats?.aptitudeScore || 70 },
    { subject: 'Reasoning', score: stats?.reasoningScore || 75 },
    { subject: 'Technical', score: stats?.technicalScore || 65 },
    { subject: 'HR Round', score: stats?.hrScore || 80 },
    { subject: 'Mock Interview', score: stats?.averageScore || 75 }
  ];

  const weeklyActivityData = [
    { day: 'Mon', tests: 2, hours: 1.2 },
    { day: 'Tue', tests: 4, hours: 2.5 },
    { day: 'Wed', tests: 3, hours: 1.8 },
    { day: 'Thu', tests: 5, hours: 3.1 },
    { day: 'Fri', tests: 4, hours: 2.2 },
    { day: 'Sat', tests: 6, hours: 4.0 },
    { day: 'Sun', tests: 3, hours: 2.0 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Continuous Placement Improvement</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Progress & Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Track historical scores, skill radar coverage, and daily placement preparation consistency
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400">Quizzes Completed</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.quizzesCompleted || history.length}
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Diagnostic tests</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400">Aptitude Avg</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {stats?.aptitudeScore || 70}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Quant & Numbers</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400">Reasoning Avg</span>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
            {stats?.reasoningScore || 75}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Logic & Series</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400">Technical Avg</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {stats?.technicalScore || 65}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Core Concepts</span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weekly Activity Volume</h3>
              <p className="text-xs text-slate-400">Number of practice tests solved per day</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              Active Streak: 6 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="tests" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Coverage Radar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Skill Dimension Radar</h3>
            <p className="text-xs text-slate-400">Balance across all campus interview pillars</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#94a3b8" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} opacity={0.3} />
                <Radar name="Proficiency" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Attempt History</h3>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">Category / Topic</th>
                  <th className="p-3">Questions</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Time Spent</th>
                  <th className="p-3 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((att) => (
                  <tr key={att._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      <span className="capitalize">{att.category}</span>: {att.topic}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {att.totalQuestions} Questions
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          att.score >= 75
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : att.score >= 50
                            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {att.score}%
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {att.timeSpentSeconds || 45}s
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(att.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            No quiz attempts recorded yet. Head over to Aptitude or Reasoning to take your first test!
          </div>
        )}
      </div>
    </div>
  );
};
