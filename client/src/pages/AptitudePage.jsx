import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import confetti from 'canvas-confetti';
import {
  Calculator,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';

const APTITUDE_TOPICS = [
  'All',
  'Quantitative aptitude',
  'Number system',
  'Percentages',
  'Profit and loss',
  'Time and work',
  'Time, speed and distance',
  'Probability',
  'Ratios',
  'Averages'
];

export const AptitudePage = ({ onNavigate }) => {
  const { addToast } = useToast();

  // Selection state
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [questionCount, setQuestionCount] = useState(5);

  // Quiz active state
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionIndex }
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Results state
  const [result, setResult] = useState(null);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isQuizActive && timeLeft > 0 && !result) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizActive, timeLeft, result]);

  const handleStartQuiz = async () => {
    setLoading(true);
    setResult(null);
    setSelectedAnswers({});
    setCurrentIndex(0);

    try {
      const res = await api.getAptitudeQuestions({
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        limit: questionCount
      });

      if (res.success && res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
        setTimeLeft(res.questions.length * 60); // 1 min per question
        setIsQuizActive(true);
        addToast(`Quiz started! You have ${res.questions.length} minutes.`, 'info');
      } else {
        addToast('No questions found for the selected filters. Showing all aptitude questions.', 'warning');
        const fallback = await api.getAptitudeQuestions({ limit: questionCount });
        setQuestions(fallback.questions);
        setTimeLeft(fallback.questions.length * 60);
        setIsQuizActive(true);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch questions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleAutoSubmit = () => {
    addToast('Time is up! Submitting your answers automatically.', 'warning');
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    const answersPayload = questions.map(q => ({
      questionId: q._id,
      selectedOption: selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : null
    }));

    const totalTimeAllocated = questions.length * 60;
    const timeSpent = Math.max(totalTimeAllocated - timeLeft, 10);

    try {
      const res = await api.submitQuiz({
        category: 'aptitude',
        topic: selectedTopic === 'All' ? 'Mixed Aptitude' : selectedTopic,
        answers: answersPayload,
        timeSpentSeconds: timeSpent
      });

      if (res.success) {
        setResult(res);
        setIsQuizActive(false);

        if (res.score >= 70) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        addToast(`Quiz complete! You scored ${res.score}%.`, 'success');
      }
    } catch (err) {
      addToast(err.message || 'Submission failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
            <Calculator className="w-4 h-4" />
            <span>Campus Placement Module</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Quantitative Aptitude Practice
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sharpen speed and accuracy across standard placement mathematical topics
          </p>
        </div>

        {isQuizActive && (
          <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono text-sm font-bold">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* VIEW 1: QUIZ CONFIGURATION & TOPIC SELECTOR */}
      {!isQuizActive && !result && (
        <div className="space-y-6">
          {/* Topic Pills */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center space-x-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>Select Aptitude Category</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {APTITUDE_TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedTopic === topic
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              {/* Difficulty */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <div className="flex space-x-2">
                  {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        selectedDifficulty === diff
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Number of Questions
                </label>
                <div className="flex space-x-2">
                  {[5, 10, 15].map(cnt => (
                    <button
                      key={cnt}
                      onClick={() => setQuestionCount(cnt)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        questionCount === cnt
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleStartQuiz}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/25 flex items-center space-x-2 transition-all"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Start Practice Quiz</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE QUIZ RUNNER */}
      {isQuizActive && questions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Box */}
          <div className="lg:col-span-3 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {questions[currentIndex]?.topic} • {questions[currentIndex]?.difficulty}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {questions[currentIndex]?.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {questions[currentIndex]?.options.map((option, oIdx) => {
                const isSelected = selectedAnswers[questions[currentIndex]._id] === oIdx;

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(questions[currentIndex]._id, oIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>

            {/* Prev / Next / Submit Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1))}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center space-x-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Navigator Palette */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Question Navigator
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q._id] !== undefined;
                const isCurrent = currentIndex === idx;

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white'
                        : isAnswered
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Answered ({Object.keys(selectedAnswers).length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span>Unattempted ({questions.length - Object.keys(selectedAnswers).length})</span>
              </div>
            </div>

            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Submit Test Now
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: QUIZ RESULTS & DETAILED REVIEW */}
      {result && (
        <div className="space-y-6">
          {/* Result Score Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl text-center relative overflow-hidden">
            <div className="max-w-md mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Quiz Evaluation Completed
              </span>
              <div className="text-5xl font-extrabold tracking-tight">
                {result.score}%
              </div>
              <div className="text-sm font-bold text-cyan-300">
                Score: {result.totalScore !== undefined ? result.totalScore : result.correctAnswers * 10} / {result.maximumScore !== undefined ? result.maximumScore : (result.totalQuestions || 5) * 10} Marks
              </div>
              <p className="text-xs text-indigo-200">
                {result.score >= 80
                  ? 'Outstanding performance! You have high aptitude speed.'
                  : result.score >= 60
                  ? 'Good effort! Review the missed questions below to solidify your concepts.'
                  : 'Needs revision. Practice this category again with detailed explanations.'}
              </p>

              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10 text-xs">
                <div>
                  <div className="text-lg font-bold text-emerald-400">{result.correctAnswers}</div>
                  <div className="text-[11px] text-indigo-200">Correct</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-rose-400">{result.incorrectAnswers}</div>
                  <div className="text-[11px] text-indigo-200">Incorrect</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-300">{result.unansweredQuestions ?? 0}</div>
                  <div className="text-[11px] text-indigo-200">Unattempted</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-cyan-300">{result.timeSpentSeconds}s</div>
                  <div className="text-[11px] text-indigo-200">Time Taken</div>
                </div>
              </div>

              <div className="pt-4 flex justify-center space-x-3">
                <button
                  onClick={handleStartQuiz}
                  className="px-5 py-2 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-slate-100 flex items-center space-x-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => { setResult(null); setIsQuizActive(false); }}
                  className="px-5 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-colors"
                >
                  Choose Another Topic
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Detailed Question Review & Explanations</span>
            </h3>

            {result.detailedAnswers?.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Marks: {item.marksAwarded !== undefined ? item.marksAwarded : (item.isCorrect ? (item.maxMarks || 10) : 0)} / {item.maxMarks || 10}
                    </span>
                    {item.isCorrect ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.questionText}
                </p>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-white">Correct Option: </span>
                    {typeof item.correctOption === 'number' ? `Option ${String.fromCharCode(65 + item.correctOption)}` : item.correctOption}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-white">Your Selection: </span>
                    {item.selectedOption !== null && item.selectedOption !== undefined
                      ? `Option ${String.fromCharCode(65 + item.selectedOption)}`
                      : 'Unattempted'}
                  </p>
                </div>

                {item.explanation && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200">
                    <span className="font-bold block mb-1">Step-by-step Explanation:</span>
                    <p className="leading-relaxed">{item.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
