import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import {
  Code2,
  Sparkles,
  Send,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  ChevronRight,
  Terminal,
  HelpCircle
} from 'lucide-react';

const TECH_TOPICS = [
  { id: 'Java', name: 'Java', desc: 'JVM, Multithreading, OOP, Collections' },
  { id: 'Python', name: 'Python', desc: 'GIL, Generators, OOP, Memory Management' },
  { id: 'C', name: 'C / C++', desc: 'Pointers, Memory Allocation, STL' },
  { id: 'SQL', name: 'SQL', desc: 'Joins, Aggregations, Indexing, Transactions' },
  { id: 'OOP', name: 'OOP', desc: 'Encapsulation, Polymorphism, Design Principles' },
  { id: 'Data Structures', name: 'Data Structures', desc: 'Arrays, Trees, Graphs, Hash Maps, Sorting' },
  { id: 'DBMS', name: 'DBMS', desc: 'ACID, Normalization, Concurrency Control' },
  { id: 'Operating Systems', name: 'Operating Systems', desc: 'Deadlocks, Processes, Threads, Memory' },
  { id: 'Computer Networks', name: 'Computer Networks', desc: 'TCP/IP, OSI, Handshake, Routing, DNS' }
];

export const TechnicalPrepPage = ({ onNavigate }) => {
  const { addToast } = useToast();

  const [selectedTopic, setSelectedTopic] = useState('Java');
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    loadQuestions(selectedTopic);
  }, [selectedTopic]);

  const loadQuestions = async (topic) => {
    setLoadingQuestions(true);
    setEvaluation(null);
    setUserAnswer('');

    try {
      const res = await api.getTechnicalQuestions({ topic });
      if (res.success && res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
        setActiveQuestion(res.questions[0]);
      } else {
        setQuestions([]);
        setActiveQuestion(null);
      }
    } catch (err) {
      addToast('Failed to load technical questions.', 'error');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) {
      addToast('Please type your explanation or solution before submitting.', 'warning');
      return;
    }

    setEvaluating(true);
    try {
      const res = await api.evaluateTechnicalAnswer({
        questionId: activeQuestion?._id,
        topic: selectedTopic,
        userAnswer
      });

      if (res.success) {
        setEvaluation(res.evaluation);
        const marksMsg = res.evaluation.marksAwarded !== undefined
          ? `${res.evaluation.marksAwarded}/${res.evaluation.maxMarks || 50} marks (${res.evaluation.score}%)`
          : `${res.evaluation.score}/100`;
        addToast(`Answer evaluated! Score: ${marksMsg}`, res.evaluation.score > 0 ? 'success' : 'warning');
      }
    } catch (err) {
      addToast(err.message || 'Evaluation failed.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-semibold text-xs mb-1">
          <Code2 className="w-4 h-4" />
          <span>Core Engineering Rounds</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Technical Interview Preparation
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Answer real technical interview questions and get evaluated by AI on conceptual depth, edge cases, and code clarity
        </p>
      </div>

      {/* 1. TOPIC CAROUSEL / SELECTOR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {TECH_TOPICS.map(topic => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopic(topic.id)}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
              selectedTopic === topic.id
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 shadow-sm font-bold scale-102'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-purple-400'
            }`}
          >
            <span className="text-xs font-bold truncate w-full">{topic.name}</span>
          </button>
        ))}
      </div>

      {/* 2. MAIN TECHNICAL CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Question Drawer & Editor */}
        <div className="lg:col-span-7 space-y-4">
          {/* Question Selector Tabs */}
          {questions.length > 0 ? (
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {questions.map((q, idx) => (
                <button
                  key={q._id}
                  onClick={() => { setActiveQuestion(q); setEvaluation(null); setUserAnswer(''); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeQuestion?._id === q._id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Question {idx + 1}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400">Loading topic questions...</div>
          )}

          {/* Active Question Box */}
          {activeQuestion && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {activeQuestion.topic} Round
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Difficulty: {activeQuestion.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {activeQuestion.question}
              </h3>

              {activeQuestion.codeSnippet && (
                <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
                  <code>{activeQuestion.codeSnippet}</code>
                </pre>
              )}

              {/* Answer Input Console */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-purple-600" />
                    <span>Your Technical Answer / Explanation</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {userAnswer.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <textarea
                  rows={8}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Explain the core mechanism, syntax, memory implications, and real-world trade-offs..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono transition-all"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-400">
                  Tip: Mention architectural trade-offs & time complexity.
                </div>
                <button
                  onClick={handleEvaluate}
                  disabled={evaluating || !userAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-purple-600/25 flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  {evaluating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>AI Reviewing Answer...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Evaluate Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: AI Evaluation Report */}
        <div className="lg:col-span-5">
          {evaluation ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 animate-slide-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Technical Scorecard
                    </h4>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Placement Benchmark
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end space-x-1">
                    <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                      {evaluation.marksAwarded !== undefined ? evaluation.marksAwarded : evaluation.score}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      / {evaluation.maxMarks || 50} marks
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Rating: {evaluation.score}%
                  </span>
                </div>
              </div>

              {/* Feedback */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Interviewer Feedback:
                </span>
                {evaluation.feedback}
              </div>

              {/* Strengths */}
              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>What You Did Well</span>
                  </span>
                  <div className="space-y-1">
                    {evaluation.strengths.map((str, idx) => (
                      <div key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Points */}
              {evaluation.missingPoints && evaluation.missingPoints.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Missing Key Points / Edge Cases</span>
                  </span>
                  <div className="space-y-1">
                    {evaluation.missingPoints.map((mp, idx) => (
                      <div key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{mp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concept & Model Answer */}
              {evaluation.modelAnswer && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2 text-xs">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5">
                    <Lightbulb className="w-4 h-4 text-indigo-600" />
                    <span>Exemplary Model Answer</span>
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {evaluation.modelAnswer}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[350px] p-8 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <Code2 className="w-10 h-10 text-purple-400 opacity-60" />
              <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                  Evaluation Report Awaits
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Type your explanation on the left and submit to view instant AI scoring, conceptual breakdowns, and model answers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
