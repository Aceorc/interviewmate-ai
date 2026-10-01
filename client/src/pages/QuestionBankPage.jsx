import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Filter,
  CheckCircle,
  HelpCircle,
  Code2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const QuestionBankPage = ({ onNavigate }) => {
  const { addToast } = useToast();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, [categoryFilter, difficultyFilter, showBookmarksOnly]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      if (showBookmarksOnly) {
        const res = await api.getBookmarks();
        if (res.success) setQuestions(res.questions || []);
      } else {
        const res = await api.getAllQuestions({
          category: categoryFilter,
          difficulty: difficultyFilter,
          search: searchTerm
        });
        if (res.success) setQuestions(res.questions || []);
      }
    } catch (err) {
      addToast('Error loading question bank.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadQuestions();
  };

  const handleToggleBookmark = async (qId) => {
    try {
      const res = await api.toggleBookmark(qId);
      if (res.success) {
        setQuestions(prev =>
          prev.map(q => q._id === qId ? { ...q, isBookmarked: res.isBookmarked } : q)
        );
        addToast(res.message, 'success');
      }
    } catch (err) {
      addToast('Failed to update bookmark.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Central Repository</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Question Bank & Bookmarks
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Search, filter, and bookmark placement questions across Quantitative, Logical, Technical, and HR rounds
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords (e.g. 'Percentages', 'HashMap', 'TCP', 'Deadlock')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Aptitude', 'Reasoning', 'Technical', 'HR'].map(cat => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat); setShowBookmarksOnly(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  categoryFilter === cat && !showBookmarksOnly
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty & Bookmark toggles */}
          <div className="flex items-center space-x-2">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Bookmarks Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading question bank...</span>
          </div>
        ) : questions.length > 0 ? (
          questions.map((q) => {
            const isExpanded = expandedId === q._id;

            return (
              <div
                key={q._id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {q.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {q.topic}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          q.difficulty === 'Easy'
                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950'
                            : q.difficulty === 'Hard'
                            ? 'text-rose-600 bg-rose-50 dark:bg-rose-950'
                            : 'text-amber-600 bg-amber-50 dark:bg-amber-950'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </h4>
                  </div>

                  {/* Bookmark Button */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleToggleBookmark(q._id)}
                      className={`p-2 rounded-xl transition-colors ${
                        q.isBookmarked
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                      title={q.isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                    >
                      <Bookmark className={`w-4 h-4 ${q.isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Answer & Explanation Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fadeIn text-xs">
                    {/* MCQ Options */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = String(oIdx) === String(q.correctAnswer);

                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
                                isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200 font-semibold'
                                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                              <span>{opt}</span>
                              {isCorrect && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanation / Sample Answer */}
                    {(q.explanation || q.sampleAnswer) && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200 space-y-1">
                        <span className="font-bold block">Model Concept / Explanation:</span>
                        <p className="leading-relaxed">{q.explanation || q.sampleAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No questions match your current search or filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
