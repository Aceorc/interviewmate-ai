import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ProtectedRoute, StudentRoute, AdminRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AptitudePage } from './pages/AptitudePage';
import { LogicalReasoningPage } from './pages/LogicalReasoningPage';
import { TechnicalPrepPage } from './pages/TechnicalPrepPage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { HRInterviewPage } from './pages/HRInterviewPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { ProgressPage } from './pages/ProgressPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AppContent() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const [currentView, setCurrentView] = useState(() => {
    const token = localStorage.getItem('interviewmate_token');
    if (!token) return 'landing';
    try {
      const savedUser = localStorage.getItem('interviewmate_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.role === 'admin') return 'admin';
      }
    } catch (e) {}
    return 'dashboard';
  });

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enforce role-based view guard when user state loads or updates
  React.useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const studentOnlyViews = [
        'dashboard',
        'aptitude',
        'reasoning',
        'technical',
        'mock-interview',
        'hr',
        'resume',
        'progress',
        'questions'
      ];
      const adminOnlyViews = ['admin', 'admin-overview', 'admin-users', 'admin-questions'];

      if (user.role === 'admin' && studentOnlyViews.includes(currentView)) {
        setCurrentView('admin');
      } else if (user.role !== 'admin' && adminOnlyViews.includes(currentView)) {
        setCurrentView('dashboard');
      }
    } else if (!loading && !isAuthenticated && !['landing', 'login', 'register'].includes(currentView)) {
      setCurrentView('landing');
    }
  }, [user, loading, isAuthenticated, currentView]);

  // Determine if current view is a dashboard module with sidebar
  const isDashboardLayout = isAuthenticated && ![
    'landing',
    'login',
    'register'
  ].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Layout Area */}
      <div className="flex-1 flex w-full">
        {isDashboardLayout && (
          <div className="hidden md:block">
            <Sidebar currentView={currentView} onNavigate={handleNavigate} />
          </div>
        )}

        <main className={`flex-1 ${isDashboardLayout ? 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full' : ''}`}>
          {currentView === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentView === 'login' && <LoginPage onNavigate={handleNavigate} />}
          {currentView === 'register' && <RegisterPage onNavigate={handleNavigate} />}

          {currentView === 'dashboard' && (
            <StudentRoute onNavigate={handleNavigate}>
              <DashboardPage onNavigate={handleNavigate} />
            </StudentRoute>
          )}

          {currentView === 'aptitude' && (
            <StudentRoute onNavigate={handleNavigate}>
              <AptitudePage onNavigate={handleNavigate} />
            </StudentRoute>
          )}

          {currentView === 'reasoning' && (
            <StudentRoute onNavigate={handleNavigate}>
              <LogicalReasoningPage onNavigate={handleNavigate} />
            </StudentRoute>
          )}

          {currentView === 'technical' && (
            <StudentRoute onNavigate={handleNavigate}>
              <TechnicalPrepPage onNavigate={handleNavigate} />
            </StudentRoute>
          )}

          {currentView === 'mock-interview' && (
            <StudentRoute onNavigate={handleNavigate}>
              <MockInterviewPage onNavigate={handleNavigate} />
            </StudentRoute>
          )}

          {currentView === 'hr' && (
            <StudentRoute onNavigate={handleNavigate}>
              <HRInterviewPage onNavigate={handleNavigate} />
            </StudentRoute>
          )}

          {currentView === 'resume' && (
            <StudentRoute onNavigate={handleNavigate}>
              <ResumeAnalyzerPage onNavigate={handleNavigate} />
            </StudentRoute>
          )}

          {currentView === 'progress' && (
            <StudentRoute onNavigate={handleNavigate}>
              <ProgressPage onNavigate={handleNavigate} />
            </StudentRoute>
          )}

          {currentView === 'questions' && (
            <StudentRoute onNavigate={handleNavigate}>
              <QuestionBankPage onNavigate={handleNavigate} />
            </StudentRoute>
          )}

          {currentView === 'profile' && (
            <ProtectedRoute onNavigate={handleNavigate}>
              <ProfilePage onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}

          {(currentView === 'admin' || currentView === 'admin-overview' || currentView === 'admin-users' || currentView === 'admin-questions') && (
            <AdminRoute onNavigate={handleNavigate}>
              <AdminDashboardPage
                initialTab={
                  currentView === 'admin-users' ? 'users' :
                  currentView === 'admin-questions' ? 'questions' : 'overview'
                }
                onNavigate={handleNavigate}
              />
            </AdminRoute>
          )}
        </main>
      </div>

      {/* Global Footer (shown on landing and bottom of pages) */}
      {!isDashboardLayout && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
