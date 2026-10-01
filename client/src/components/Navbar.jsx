import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Sun, Moon, LogOut, User, Menu, X, ArrowRight, Shield } from 'lucide-react';

export const Navbar = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('landing');
    setMobileMenuOpen(false);
  };

  const navTo = (view) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => navTo(isAuthenticated ? (isAdmin ? 'admin' : 'dashboard') : 'landing')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">
                InterviewMate AI
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
                Campus Placement Platform
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navTo('landing')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'landing'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Home
                </button>
                <a
                  href="#features"
                  onClick={(e) => { if (currentView !== 'landing') { e.preventDefault(); navTo('landing'); } }}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => { if (currentView !== 'landing') { e.preventDefault(); navTo('landing'); } }}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#stats"
                  onClick={(e) => { if (currentView !== 'landing') { e.preventDefault(); navTo('landing'); } }}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Impact
                </a>
              </>
            ) : isAdmin ? (
              <>
                <button
                  onClick={() => navTo('admin')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'admin' || currentView === 'admin-overview'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={() => navTo('admin-users')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'admin-users'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Candidates
                </button>
                <button
                  onClick={() => navTo('admin-questions')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'admin-questions'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Question Bank
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navTo('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navTo('mock-interview')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'mock-interview'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Mock Interview
                </button>
                <button
                  onClick={() => navTo('aptitude')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'aptitude'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Aptitude
                </button>
                <button
                  onClick={() => navTo('technical')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'technical'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Technical
                </button>
                <button
                  onClick={() => navTo('resume')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'resume'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Resume ATS
                </button>
              </>
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 transition-colors"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => navTo('profile')}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => navTo('login')}
                  className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navTo('register')}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md shadow-indigo-600/20 transition-all hover:scale-102"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navTo('landing')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Home
              </button>
              <button
                onClick={() => navTo('login')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Sign In
              </button>
              <button
                onClick={() => navTo('register')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 font-semibold"
              >
                Create Account
              </button>
            </>
          ) : isAdmin ? (
            <>
              <button
                onClick={() => navTo('admin')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Admin Dashboard
              </button>
              <button
                onClick={() => navTo('admin-users')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Enrolled Candidates
              </button>
              <button
                onClick={() => navTo('admin-questions')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Question Bank Editor
              </button>
              <button
                onClick={() => navTo('profile')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Admin Profile
              </button>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navTo('dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Dashboard
              </button>
              <button
                onClick={() => navTo('mock-interview')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Mock Interview Studio
              </button>
              <button
                onClick={() => navTo('aptitude')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Aptitude Practice
              </button>
              <button
                onClick={() => navTo('reasoning')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Logical Reasoning
              </button>
              <button
                onClick={() => navTo('technical')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Technical Interview Prep
              </button>
              <button
                onClick={() => navTo('hr')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                HR & Behavioral Prep
              </button>
              <button
                onClick={() => navTo('resume')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Resume ATS Analyzer
              </button>
              <button
                onClick={() => navTo('progress')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Progress & Analytics
              </button>
              <button
                onClick={() => navTo('questions')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                Question Bank
              </button>
              <button
                onClick={() => navTo('profile')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              >
                My Profile
              </button>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
