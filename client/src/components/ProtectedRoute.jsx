import React from 'react';
import { useAuth } from '../context/AuthContext';

// General authenticated route (e.g. Profile)
export const ProtectedRoute = ({ children, onNavigate }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    onNavigate('login');
    return null;
  }

  return children;
};

// Student-only route (e.g. Dashboard, Tests, Mock Interview, Resume)
export const StudentRoute = ({ children, onNavigate }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    onNavigate('login');
    return null;
  }

  // Admins are strictly disallowed from student learning/test flows
  if (isAdmin || user.role === 'admin') {
    onNavigate('admin');
    return null;
  }

  return children;
};

// Admin-only route (e.g. Admin Dashboard, Candidates, Question Bank Editor)
export const AdminRoute = ({ children, onNavigate }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    onNavigate('login');
    return null;
  }

  // Students are strictly disallowed from admin portal
  if (!isAdmin && user.role !== 'admin') {
    onNavigate('dashboard');
    return null;
  }

  return children;
};
