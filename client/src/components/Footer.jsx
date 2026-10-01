import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">
                InterviewMate AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering college students and fresh graduates with personalized, AI-driven preparation for technical interviews, aptitude tests, and HR rounds.
            </p>
          </div>

          {/* Quick Practice Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Practice Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onNavigate('aptitude')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Quantitative Aptitude
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reasoning')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Logical Reasoning
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('technical')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Technical Rounds (Java, Python, SQL)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mock-interview')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Interactive AI Mock Interview
                </button>
              </li>
            </ul>
          </div>

          {/* Tools & Analytics */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Tools & Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onNavigate('resume')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Resume ATS Analyzer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hr')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  HR STAR Method Coach
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('questions')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Searchable Question Bank
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('progress')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Performance Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Placement Impact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Campus Placement Stats
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p>🎯 <span className="font-semibold text-slate-800 dark:text-slate-200">94%</span> students clear first round</p>
              <p>⚡ <span className="font-semibold text-slate-800 dark:text-slate-200">120+</span> Engineering colleges supported</p>
              <p>📈 <span className="font-semibold text-slate-800 dark:text-slate-200">50k+</span> Practice questions solved</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} InterviewMate AI. Built for college placement excellence.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>for aspiring software engineers</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
