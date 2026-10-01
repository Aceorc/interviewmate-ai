import React from 'react';
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
  CheckCircle2,
  ArrowRight,
  Target,
  Zap,
  GraduationCap
} from 'lucide-react';

export const LandingPage = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-cyan-500/20 to-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span>The Next-Gen Placement Preparation Suite</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Master Your Campus Placements with{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">
                InterviewMate AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Personalized AI-powered practice for Quantitative Aptitude, Logical Reasoning, Technical Rounds, and interactive multi-turn Mock Interviews with real-time feedback.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-102"
              >
                <span>Start Preparing</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('mock-interview')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-base border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-2 shadow-sm transition-all"
              >
                <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Take Mock Interview</span>
              </button>
            </div>

            {/* Micro badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Installation Required</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Real Campus Placement Questions</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>STAR Method Evaluation</span>
              </span>
            </div>
          </div>

          {/* Product Showcase Mockup Card */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl p-2 sm:p-4 bg-gradient-to-b from-indigo-500/10 via-slate-200/50 to-transparent dark:from-indigo-500/10 dark:via-slate-800/40 border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">ai-interview-session.studio</span>
                </div>
                <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                  Live Interviewer Active
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* AI Dialogue Box */}
                <div className="md:col-span-2 space-y-3">
                  <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center space-x-1.5">
                      <Bot className="w-3.5 h-3.5" />
                      <span>InterviewMate AI (Technical Interviewer)</span>
                    </p>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                      "Can you explain how a Hash Map handles collision resolution under high load factors, and contrast Separate Chaining with Open Addressing?"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Your Response (Alex Johnson - NIT Trichy):
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                      "In separate chaining, each bucket contains a linked list or red-black tree. Open addressing uses linear/quadratic probing inside the same array, which gives better cache locality..."
                    </p>
                  </div>
                </div>

                {/* Scorecard Widget */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                      Live AI Scorecard
                    </span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">88</span>
                      <span className="text-xs text-slate-500">/ 100</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Strong Answer
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 my-3 text-[11px]">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Technical Depth</span>
                      <span className="font-semibold text-indigo-600">92%</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Clarity & Structure</span>
                      <span className="font-semibold text-indigo-600">85%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('mock-interview')}
                    className="w-full py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-center"
                  >
                    Try Live Simulation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section id="stats" className="py-12 bg-indigo-600 dark:bg-indigo-950 border-y border-indigo-500/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold">94.2%</div>
              <div className="text-xs sm:text-sm text-indigo-200 mt-1">Placement Success Rate</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold">50,000+</div>
              <div className="text-xs sm:text-sm text-indigo-200 mt-1">Interview Questions Solved</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold">120+</div>
              <div className="text-xs sm:text-sm text-indigo-200 mt-1">Campus Drives Supported</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold">4.9 / 5</div>
              <div className="text-xs sm:text-sm text-indigo-200 mt-1">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Comprehensive Preparation
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Every Placement Round, Covered in Depth
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Designed according to the recruitment patterns of top tier product and service firms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div
              onClick={() => onNavigate('aptitude')}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Quantitative Aptitude
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                9 core categories including Percentages, Profit & Loss, Time & Work, Speed & Distance, Probability, and Ratios with countdown timer quizzes and step-by-step mathematical explanations.
              </p>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Start Practice Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 2 */}
            <div
              onClick={() => onNavigate('reasoning')}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Logical Reasoning
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Master Number Series, Coding-Decoding, Blood Relations, Direction Sense, Syllogisms, and Seating Arrangements across Easy, Medium, and Hard placement filters.
              </p>
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Solve Logic Problems</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 3 */}
            <div
              onClick={() => onNavigate('technical')}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Technical Interview Prep
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Topic-specific preparation for Java, Python, C, SQL, OOP, Data Structures, DBMS, Operating Systems, and Computer Networks with automated AI answer scoring and conceptual model answers.
              </p>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Practice Technical Rounds</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 4 */}
            <div
              onClick={() => onNavigate('mock-interview')}
              className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/30 dark:to-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Live AI Mock Interview
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-600 text-white uppercase">
                  Flagship
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Multi-turn dynamic mock interviews tailored to your target job role. The AI listens, evaluates your answer, scores you, provides constructive feedback, and poses context-aware follow-up questions.
              </p>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Start Interactive Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 5 */}
            <div
              onClick={() => onNavigate('hr')}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                HR Behavioral Coach
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Tackle classic behavioral questions like "Why should we hire you?" and "Challenge faced". Receive automated feedback broken down by Situation, Task, Action, and Result (STAR).
              </p>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Practice HR Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 6 */}
            <div
              onClick={() => onNavigate('resume')}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Resume ATS Analyzer
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Upload your resume in PDF format. Get an instant ATS readiness score, detected skills chips, alerts for missing sections, project improvement ideas, and tailored interview questions.
              </p>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Upload & Scan Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Structured Roadmap
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              How InterviewMate AI Prepares You
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                Setup Target Profile
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Specify your college, graduation year, and target role (Full Stack, Backend, Data Analyst, Cloud).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                Diagnostic Practice
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Solve timed Quantitative and Reasoning quizzes to identify your strengths and pinpoint weak topics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                AI Mock Rounds
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Engage in realistic conversational technical and HR interviews with AI scoring and live follow-up questions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                4
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                Ace Campus Drives
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Track your Readiness Index gauge, optimize your resume ATS score, and land offers at top companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-tr from-indigo-900 via-indigo-800 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Supercharge Your Placement Prep?
          </h2>
          <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto mb-8">
            Join thousands of college candidates preparing with personalized AI simulations, timed quizzes, and instant feedback.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-bold text-sm shadow-xl transition-all hover:scale-102"
            >
              Get Started Now — It's Free
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              Try Instant Demo Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
