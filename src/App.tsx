/* eslint-disable react-hooks/exhaustive-deps */
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import { useState, useEffect } from 'react';

type Page = 'login' | 'signup' | 'forgot-password' | 'landing' | 'editor';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('login');

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        if (currentPage !== 'signup' && currentPage !== 'forgot-password') {
          setCurrentPage('login');
        }
      } else {
        if (['login', 'signup', 'forgot-password'].includes(currentPage)) {
          setCurrentPage('landing');
        }
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    switch (currentPage) {
      case 'signup':
        return <SignupPage onSignupSuccess={() => setCurrentPage('landing')} onNavigateToLogin={() => setCurrentPage('login')} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigateToLogin={() => setCurrentPage('login')} />;
      default:
        return <LoginPage onLoginSuccess={() => setCurrentPage('landing')} onNavigateToSignup={() => setCurrentPage('signup')} onNavigateToForgotPassword={() => setCurrentPage('forgot-password')} />;
    }
  }

  switch (currentPage) {
    case 'editor':
      return <EditorPage onBack={() => setCurrentPage('landing')} />;
    default:
      return <LandingPage onStartBuilding={() => setCurrentPage('editor')} />;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
