import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Calculator,
  Bot,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  X,
  Layers,
  GraduationCap
} from 'lucide-react';

export const AdminDashboardPage = ({ onNavigate, initialTab = 'overview' }) => {
  const { addToast } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab || 'overview'); // overview, users, questions
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Add Question Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQ, setNewQ] = useState({
    category: 'technical',
    topic: 'Java',
    difficulty: 'Medium',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    sampleAnswer: ''
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, questionsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAllUsers(),
        api.getAllQuestions()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (questionsRes.success) setQuestions(questionsRes.questions || []);
    } catch (err) {
      addToast('Failed to load admin data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to remove this question from the Question Bank?')) return;

    try {
      const res = await api.deleteQuestion(id);
      if (res.success) {
        setQuestions(prev => prev.filter(q => q._id !== id));
        addToast('Question deleted successfully.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete question.', 'error');
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!newQ.question.trim() || !newQ.topic.trim()) {
      addToast('Please provide question and topic.', 'warning');
      return;
    }

    try {
      const payload = {
        category: newQ.category,
        topic: newQ.topic,
        difficulty: newQ.difficulty,
        question: newQ.question,
        options: newQ.category === 'aptitude' || newQ.category === 'reasoning'
          ? newQ.options.filter(Boolean)
          : [],
        correctAnswer: Number(newQ.correctAnswer),
        explanation: newQ.explanation,
        sampleAnswer: newQ.sampleAnswer
      };

      const res = await api.createQuestion(payload);
      if (res.success && res.question) {
        setQuestions(prev => [res.question, ...prev]);
        setShowAddModal(false);
        addToast('Question added to Question Bank!', 'success');
        setNewQ({
          category: 'technical',
          topic: 'Java',
          difficulty: 'Medium',
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: '',
          sampleAnswer: ''
        });
      }
    } catch (err) {
      addToast(err.message || 'Failed to add question.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-semibold text-xs mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Placement Officer Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Admin Management Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor platform usage, view candidate enrollments, and curate the placement Question Bank
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => { setActiveTab('overview'); onNavigate && onNavigate('admin'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => { setActiveTab('users'); onNavigate && onNavigate('admin-users'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Enrolled Candidates ({users.length})
        </button>
        <button
          onClick={() => { setActiveTab('questions'); onNavigate && onNavigate('admin-questions'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'questions'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Question Bank Management ({questions.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Registered Students</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {stats?.totalUsers || users.length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Questions</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {stats?.totalQuestions || questions.length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Diagnostic Quizzes</span>
              <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
                {stats?.totalQuizzes || 0}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Mock Interviews</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {stats?.totalMocks || 0}
              </div>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Aptitude Questions</span>
              <div className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                {stats?.categoryBreakdown?.aptitude || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/50">
              <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">Reasoning Questions</span>
              <div className="text-xl font-bold text-cyan-900 dark:text-cyan-100 mt-1">
                {stats?.categoryBreakdown?.reasoning || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Technical Questions</span>
              <div className="text-xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {stats?.categoryBreakdown?.technical || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">HR Questions</span>
              <div className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                {stats?.categoryBreakdown?.hr || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED USERS */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registered Candidates</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">Candidate Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">College & Degree</th>
                  <th className="p-3">Batch</th>
                  <th className="p-3">Target Role</th>
                  <th className="p-3 rounded-r-xl">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="p-3 text-slate-500">{u.email}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{u.college} ({u.degree})</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{u.graduationYear}</td>
                    <td className="p-3 font-medium text-indigo-600 dark:text-indigo-400">{u.targetRole}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QUESTIONS MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Curated Question Bank Items ({questions.length})
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q._id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {q.category}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{q.topic}</span>
                    <span className="text-slate-400 text-[10px]">({q.difficulty})</span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">{q.question}</p>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD QUESTION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Add Question to Bank</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={newQ.category}
                    onChange={(e) => setNewQ({ ...newQ, category: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="aptitude">Aptitude</option>
                    <option value="reasoning">Reasoning</option>
                    <option value="technical">Technical</option>
                    <option value="hr">HR Round</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={newQ.topic}
                    onChange={(e) => setNewQ({ ...newQ, topic: e.target.value })}
                    placeholder="e.g. Java, Percentages"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newQ.difficulty}
                    onChange={(e) => setNewQ({ ...newQ, difficulty: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Question Text *
                </label>
                <textarea
                  rows={3}
                  value={newQ.question}
                  onChange={(e) => setNewQ({ ...newQ, question: e.target.value })}
                  placeholder="Enter the complete question prompt..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>

              {(newQ.category === 'aptitude' || newQ.category === 'reasoning') && (
                <div className="space-y-2 pt-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Options (A, B, C, D) & Select Correct Answer
                  </label>
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correctAnswerOption"
                        checked={Number(newQ.correctAnswer) === idx}
                        onChange={() => setNewQ({ ...newQ, correctAnswer: idx })}
                        title="Mark as correct option"
                      />
                      <span className="font-bold">{String.fromCharCode(65 + idx)}:</span>
                      <input
                        type="text"
                        value={newQ.options[idx] || ''}
                        onChange={(e) => {
                          const updated = [...newQ.options];
                          updated[idx] = e.target.value;
                          setNewQ({ ...newQ, options: updated });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Explanation / Model Concept
                </label>
                <textarea
                  rows={2}
                  value={newQ.explanation}
                  onChange={(e) => setNewQ({ ...newQ, explanation: e.target.value })}
                  placeholder="Detailed step-by-step reasoning or formula..."
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
