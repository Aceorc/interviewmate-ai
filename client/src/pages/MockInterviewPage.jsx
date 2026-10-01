import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import confetti from 'canvas-confetti';
import {
  Bot,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Award,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Volume2,
  ListOrdered,
  History,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

export const MockInterviewPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  // Setup configuration state
  const [setupState, setSetupState] = useState({
    targetRole: user?.targetRole || 'Full Stack Software Engineer',
    experienceLevel: 'Fresher',
    interviewType: 'Technical',
    totalQuestions: 4
  });

  // Active interview state
  const [session, setSession] = useState(null); // { id, questionText, currentQ, totalQ, dialogue: [] }
  const [userAnswer, setUserAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Completed final scorecard state
  const [finalReport, setFinalReport] = useState(null);

  // Past history state
  const [historyList, setHistoryList] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + transcript);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeech = () => {
    if (!speechSupported) {
      addToast('Speech-to-text is not supported in this browser. Please type your response.', 'info');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        addToast('Microphone active. Speak your answer clearly...', 'info');
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleStartInterview = async () => {
    setIsProcessing(true);
    setFinalReport(null);
    try {
      const res = await api.startMockInterview(setupState);
      if (res.success) {
        setSession({
          id: res.interviewId,
          questionText: res.questionText,
          currentQuestionNumber: res.currentQuestionIndex,
          totalQuestions: res.totalQuestions,
          targetRole: res.targetRole,
          interviewType: res.interviewType,
          experienceLevel: res.experienceLevel,
          dialogue: [
            {
              questionNumber: res.currentQuestionIndex,
              questionText: res.questionText,
              userAnswer: '',
              aiFeedback: '',
              score: null
            }
          ]
        });
        setUserAnswer('');
        addToast('Mock interview session initialized! AI Interviewer is ready.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to start interview session.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      addToast('Please articulate your response before submitting.', 'warning');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    setIsProcessing(true);
    try {
      const res = await api.submitMockAnswer(session.id, {
        userAnswer: userAnswer.trim(),
        currentQuestionNumber: session.currentQuestionNumber
      });

      if (res.success) {
        if (res.isCompleted) {
          setFinalReport(res.finalReport);
          setSession(null);
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
          addToast('Interview completed! Generating comprehensive scorecard...', 'success');
        } else {
          // Advance to next question / follow-up
          setSession(prev => {
            const updatedDialogue = [...prev.dialogue];
            const currentIdx = updatedDialogue.findIndex(d => d.questionNumber === prev.currentQuestionNumber);
            if (currentIdx !== -1) {
              updatedDialogue[currentIdx].userAnswer = userAnswer.trim();
              updatedDialogue[currentIdx].aiFeedback = res.feedback;
              updatedDialogue[currentIdx].score = res.score;
            }

            updatedDialogue.push({
              questionNumber: res.nextQuestion.questionNumber,
              questionText: res.nextQuestion.questionText,
              userAnswer: '',
              aiFeedback: '',
              score: null
            });

            return {
              ...prev,
              currentQuestionNumber: res.nextQuestion.questionNumber,
              questionText: res.nextQuestion.questionText,
              dialogue: updatedDialogue
            };
          });

          setUserAnswer('');
          addToast(`Answer scored: ${res.score}/100. Follow-up posed.`, 'info');
        }
      }
    } catch (err) {
      addToast(err.message || 'Error submitting answer.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadPastInterviews = async () => {
    try {
      const res = await api.getMockHistory();
      if (res.success) {
        setHistoryList(res.interviews || []);
        setShowHistoryModal(true);
      }
    } catch (err) {
      addToast('Failed to load past mock interviews.', 'error');
    }
  };

  // Prepare radar metrics for scorecard
  const radarMetrics = finalReport?.scores ? [
    { subject: 'Technical Knowledge', score: finalReport.scores.technicalKnowledge, fullMark: 100 },
    { subject: 'Communication', score: finalReport.scores.communication, fullMark: 100 },
    { subject: 'Problem Solving', score: finalReport.scores.problemSolving, fullMark: 100 },
    { subject: 'Confidence & Clarity', score: finalReport.scores.confidenceClarity, fullMark: 100 }
  ] : [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
            <Bot className="w-4 h-4" />
            <span>Interactive Interview Studio</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            AI Mock Interview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time conversational interview simulation with dynamic follow-up questions & official scoring
          </p>
        </div>

        <button
          onClick={loadPastInterviews}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
        >
          <History className="w-3.5 h-3.5" />
          <span>Past Interview History</span>
        </button>
      </div>

      {/* VIEW 1: PRE-INTERVIEW CONFIGURATION */}
      {!session && !finalReport && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Configure Your Mock Interview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize the interview parameters to match your upcoming company drive
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Target Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Job Role
              </label>
              <input
                type="text"
                value={setupState.targetRole}
                onChange={(e) => setSetupState(prev => ({ ...prev, targetRole: e.target.value }))}
                placeholder="e.g. Full Stack Software Engineer, Frontend Engineer, Data Analyst"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Interview Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interview Focus Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Technical', 'HR', 'Mixed'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSetupState(prev => ({ ...prev, interviewType: type }))}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                        setupState.interviewType === type
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Experience Level
                </label>
                <select
                  value={setupState.experienceLevel}
                  onChange={(e) => setSetupState(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Fresher">Fresher (Campus Graduate)</option>
                  <option value="1-2 Yrs">Associate / Junior (1-2 Yrs)</option>
                  <option value="Internship">Summer Intern Candidate</option>
                </select>
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Number of Interview Rounds/Questions
              </label>
              <div className="flex space-x-3">
                {[3, 4, 5, 7].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSetupState(prev => ({ ...prev, totalQuestions: num }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      setupState.totalQuestions === num
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartInterview}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-101"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to AI Interviewer...</span>
                </div>
              ) : (
                <>
                  <span>Begin Mock Interview</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: LIVE MULTI-TURN CONVERSATION STUDIO */}
      {session && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Interview Progress Ribbon */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {session.targetRole} • {session.interviewType} Round
                </h4>
                <p className="text-[11px] text-slate-400">
                  Question {session.currentQuestionNumber} of {session.totalQuestions}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex items-center space-x-3">
              <div className="w-32 sm:w-48 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(session.currentQuestionNumber / session.totalQuestions) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {Math.round((session.currentQuestionNumber / session.totalQuestions) * 100)}%
              </span>
            </div>
          </div>

          {/* Dialogue History Stream */}
          <div className="space-y-4">
            {session.dialogue.map((turn, tIdx) => (
              <div key={tIdx} className="space-y-3">
                {/* AI Interviewer Bubble */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-md shadow-indigo-600/20">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 sm:p-5 rounded-2xl rounded-tl-none bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 max-w-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed shadow-sm">
                    <div className="flex items-center justify-between mb-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      <span>Interviewer Question #{turn.questionNumber}</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      "{turn.questionText}"
                    </p>
                  </div>
                </div>

                {/* Candidate Answer (if already submitted in previous turn) */}
                {turn.userAnswer && (
                  <div className="flex items-start justify-end space-x-3">
                    <div className="p-4 sm:p-5 rounded-2xl rounded-tr-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-slate-500">
                        <span>Your Response</span>
                        {turn.score !== null && (
                          <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                            Score: {turn.score}/100
                          </span>
                        )}
                      </div>
                      <p className="italic text-slate-700 dark:text-slate-300">{turn.userAnswer}</p>

                      {turn.aiFeedback && (
                        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-indigo-600 dark:text-indigo-400">
                          <span className="font-bold">Feedback: </span>
                          <span>{turn.aiFeedback}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active Response Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Your Answer to Current Question:
              </span>
              <div className="flex items-center space-x-2">
                {speechSupported && (
                  <button
                    onClick={toggleSpeech}
                    type="button"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? 'Listening (Speak)...' : 'Voice Input'}</span>
                  </button>
                )}
                <span className="text-slate-400 text-[11px]">
                  {userAnswer.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>

            <textarea
              rows={5}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="State your technical reasoning or experience clearly using STAR or structural framework..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />

            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-slate-400">
                Constructive feedback and follow-up questions will be generated after each submission.
              </p>
              <button
                onClick={handleSubmitAnswer}
                disabled={isProcessing || !userAnswer.trim()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/25 flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI Evaluating...</span>
                  </div>
                ) : (
                  <>
                    <span>Submit & Continue</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: OFFICIAL COMPREHENSIVE SCORECARD */}
      {finalReport && (
        <div className="max-w-4xl mx-auto space-y-6 animate-slide-in">
          {/* Main Score Header */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold">
                  <Award className="w-4 h-4" />
                  <span>Interview Session Complete</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Official Performance Scorecard
                </h2>
                <p className="text-xs text-indigo-200">
                  Candidate: <span className="font-semibold text-white">{user?.name}</span> • Role: <span className="font-semibold text-white">{setupState.targetRole}</span>
                </p>
              </div>

              {/* Overall Score Badge */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shrink-0">
                <span className="text-[11px] uppercase tracking-wider text-cyan-300 font-bold">
                  Overall Score
                </span>
                <div className="text-5xl font-black mt-1 text-white">
                  {finalReport.overallScore}
                  <span className="text-xl text-indigo-300 font-medium">/100</span>
                </div>
                <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 mt-2">
                  {finalReport.overallScore >= 75 ? 'Placement Ready' : 'Solid Potential'}
                </span>
              </div>
            </div>
          </div>

          {/* Radar & Metrics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Multi-Dimensional Radar Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Candidate Competency Radar
              </h3>
              <p className="text-xs text-slate-400 mb-4">Evaluation across core interview dimensions</p>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarMetrics}>
                    <PolarGrid stroke="#94a3b8" opacity={0.3} />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" opacity={0.3} />
                    <Radar name="Candidate" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score Metrics List */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                  Dimensional Score Breakdown
                </h3>

                <div className="space-y-4">
                  {radarMetrics.map((m, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">{m.subject}</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{m.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${m.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex gap-3">
                <button
                  onClick={() => { setFinalReport(null); setSession(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Mock Interview</span>
                </button>
              </div>
            </div>
          </div>

          {/* Strengths & Areas to Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Observed Key Strengths</span>
              </span>
              <ul className="space-y-2">
                {finalReport.strengths?.map((str, sIdx) => (
                  <li key={sIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Areas to Improve</span>
              </span>
              <ul className="space-y-2">
                {finalReport.areasToImprove?.map((area, aIdx) => (
                  <li key={aIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Topics */}
          {finalReport.recommendedTopics && finalReport.recommendedTopics.length > 0 && (
            <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Recommended Topics to Study</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {finalReport.recommendedTopics.map((topic, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <History className="w-4 h-4 text-indigo-600" />
                <span>Past Mock Interviews</span>
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {historyList.length > 0 ? (
                historyList.map(item => (
                  <div
                    key={item._id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">
                        {item.targetRole} ({item.interviewType})
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString()} • {item.dialogue?.length || 0} Questions
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                          {item.overallScore || 75}
                        </span>
                        <span className="text-slate-400">/100</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No mock interviews found in your history yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
