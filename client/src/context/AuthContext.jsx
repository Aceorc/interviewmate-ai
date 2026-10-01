import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('interviewmate_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('interviewmate_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('interviewmate_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('interviewmate_user', JSON.stringify(res.user));
          } else {
            localStorage.removeItem('interviewmate_token');
            localStorage.removeItem('interviewmate_user');
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          console.error('Failed to load authenticated user profile:', err);
          localStorage.removeItem('interviewmate_token');
          localStorage.removeItem('interviewmate_user');
          setUser(null);
          setToken(null);
        }
      } else {
        localStorage.removeItem('interviewmate_user');
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('interviewmate_token', res.token);
      if (res.user) {
        localStorage.setItem('interviewmate_user', JSON.stringify(res.user));
      }
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('interviewmate_token', res.token);
      if (res.user) {
        localStorage.setItem('interviewmate_user', JSON.stringify(res.user));
      }
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const demoLogin = async (role = 'student') => {
    const res = await api.demoLogin(role);
    if (res.success && res.token) {
      localStorage.setItem('interviewmate_token', res.token);
      if (res.user) {
        localStorage.setItem('interviewmate_user', JSON.stringify(res.user));
      }
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('interviewmate_token');
    localStorage.removeItem('interviewmate_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('interviewmate_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        demoLogin,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
