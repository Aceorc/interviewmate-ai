import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import {
  Users,
  Sparkles,
  Send,
  Award,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Compass,
  ArrowRight
} from 'lucide-react';

export const HRInterviewPage = ({ onNavigate }) => {
  const { addToast } = useToast();

  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHRQuestions();
  }, []);

  const loadHRQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.getHRQuestions();
      if (res.success && res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
        setActiveQuestion(res.questions[0]);
      }
    } catch (err) {
      addToast('Failed to load HR questions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) {
      addToast('Please type your response before submitting.', 'warning');
      return;
    }

    setEvaluating(true);
    try {
      const res = await api.evaluateHRAnswer({
        questionId: activeQuestion?._id,
        questionText: activeQuestion?.question,
        userAnswer
      });

      if (res.success) {
        setEvaluation(res.evaluation);
        const marksMsg = res.evaluation.marksAwarded !== undefined
          ? `${res.evaluation.marksAwarded}/${res.evaluation.maxMarks || 25} marks (${res.evaluation.score}%)`
          : `${res.evaluation.score}/100`;
        addToast(`HR Response evaluated! Score: ${marksMsg}`, res.evaluation.score > 0 ? 'success' : 'warning');
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
        <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
          <Users className="w-4 h-4" />
          <span>Behavioral & Cultural Fit Rounds</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          HR Interview Practice
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Craft compelling answers to standard behavioral questions with automated STAR technique coaching
        </p>
      </div>

      {/* STAR Method Helper Card */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs">
        <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 font-bold mb-1">
          <Compass className="w-4 h-4" />
          <span>The STAR Technique Blueprint</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 dark:text-slate-400 pt-1">
          <div><strong className="text-emerald-600">S</strong>ituation: Set the context & background</div>
          <div><strong className="text-emerald-600">T</strong>ask: What was the goal or challenge?</div>
          <div><strong className="text-emerald-600">A</strong>ction: What specific steps did you take?</div>
          <div><strong className="text-emerald-600">R</strong>esult: What positive outcome was achieved?</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Question Selector & Input */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {questions.map((q, idx) => (
              <button
                key={q._id}
                onClick={() => { setActiveQuestion(q); setEvaluation(null); setUserAnswer(''); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeQuestion?._id === q._id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Question {idx + 1}
              </button>
            ))}
          </div>

          {activeQuestion && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {activeQuestion.topic || 'HR Behavioral'}
                </span>
                <span className="text-xs text-slate-400">Standard Placement Round</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                "{activeQuestion.question}"
              </h3>

              {activeQuestion.explanation && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Recruiter Intent: </span>
                  {activeQuestion.explanation}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Your Verbal Response / Story:</span>
                  <span className="text-[11px] text-slate-400">
                    {userAnswer.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <textarea
                  rows={8}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Share a genuine story using Situation, Task, Action, and Result (STAR)..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Be authentic and quantify your accomplishments.
                </span>
                <button
                  onClick={handleEvaluate}
                  disabled={evaluating || !userAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/25 flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  {evaluating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Reviewing Answer...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Evaluate Response</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: AI Score & STAR Feedback */}
        <div className="lg:col-span-5">
          {evaluation ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 animate-slide-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  HR Evaluation
                </span>
                <div className="text-right">
                  <div className="flex items-baseline justify-end space-x-1">
                    <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {evaluation.marksAwarded !== undefined ? evaluation.marksAwarded : evaluation.score}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      / {evaluation.maxMarks || 25} marks
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Rating: {evaluation.score}%
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  HR Recruiter Feedback:
                </span>
                {evaluation.feedback}
              </div>

              {/* STAR Breakdown */}
              {evaluation.starFeedback && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    STAR Analysis:
                  </span>
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1 text-slate-700 dark:text-slate-300">
                    <p><strong className="text-emerald-600">Situation:</strong> {evaluation.starFeedback.situation}</p>
                    <p><strong className="text-emerald-600">Task:</strong> {evaluation.starFeedback.task}</p>
                    <p><strong className="text-emerald-600">Action:</strong> {evaluation.starFeedback.action}</p>
                    <p><strong className="text-emerald-600">Result:</strong> {evaluation.starFeedback.result}</p>
                  </div>
                </div>
              )}

              {evaluation.improvementTip && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <span className="font-bold flex items-center space-x-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>Coach Tip to Stand Out</span>
                  </span>
                  <p className="leading-relaxed">{evaluation.improvementTip}</p>
                </div>
              )}

              {activeQuestion?.sampleAnswer && (
                <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 block">
                    Model STAR Answer:
                  </span>
                  <p className="leading-relaxed">{activeQuestion.sampleAnswer}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[350px] p-8 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <Users className="w-10 h-10 text-emerald-400 opacity-60" />
              <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                  Awaiting Response
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Type your behavioral story and submit to inspect STAR breakdown, recruiter feedback, and model placement answers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
