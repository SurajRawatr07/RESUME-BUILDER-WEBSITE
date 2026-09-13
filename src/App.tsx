/* eslint-disable react-hooks/exhaustive-deps */
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import ProfilePage from './pages/ProfilePage';
import { useState, useEffect } from 'react';
import { useResumeStore } from './stores/resumeStore';
import { TemplateType } from './types/resume';

type Page = 'landing' | 'editor' | 'profile' | 'login' | 'signup' | 'forgot-password';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { setSelectedTemplate } = useResumeStore();

  // Landing page is public by default!
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [postLoginDestination, setPostLoginDestination] = useState<Page>('editor');

  // Handle protected actions for unauthenticated visitors
  const handleStartBuilding = (templateId?: TemplateType) => {
    if (templateId) {
      setSelectedTemplate(templateId);
    }

    if (!isAuthenticated) {
      setPostLoginDestination('editor');
      setCurrentPage('login');
    } else {
      setCurrentPage('editor');
    }
  };

  const handleNavigateToProfile = () => {
    if (!isAuthenticated) {
      setPostLoginDestination('profile');
      setCurrentPage('login');
    } else {
      setCurrentPage('profile');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentPage(postLoginDestination);
  };

  // If user signs out while on protected pages, return to public landing page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (currentPage === 'editor' || currentPage === 'profile') {
        setCurrentPage('landing');
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F4EE] dark:bg-[#11110F]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">
            Loading Resume Craft...
          </p>
        </div>
      </div>
    );
  }

  // Authentication Flow Pages
  if (currentPage === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignup={() => setCurrentPage('signup')}
        onNavigateToForgotPassword={() => setCurrentPage('forgot-password')}
        onBackToHome={() => setCurrentPage('landing')}
      />
    );
  }

  if (currentPage === 'signup') {
    return (
      <SignupPage
        onSignupSuccess={handleLoginSuccess}
        onNavigateToLogin={() => setCurrentPage('login')}
        onBackToHome={() => setCurrentPage('landing')}
      />
    );
  }

  if (currentPage === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onNavigateToLogin={() => setCurrentPage('login')}
        onBackToHome={() => setCurrentPage('landing')}
      />
    );
  }

  // Protected Pages (requires authentication)
  if (currentPage === 'editor') {
    if (!isAuthenticated) {
      return (
        <LoginPage
          onLoginSuccess={() => setCurrentPage('editor')}
          onNavigateToSignup={() => setCurrentPage('signup')}
          onNavigateToForgotPassword={() => setCurrentPage('forgot-password')}
        />
      );
    }
    return (
      <EditorPage
        onBack={() => setCurrentPage('landing')}
        onNavigateToProfile={() => setCurrentPage('profile')}
      />
    );
  }

  if (currentPage === 'profile') {
    if (!isAuthenticated) {
      return (
        <LoginPage
          onLoginSuccess={() => setCurrentPage('profile')}
          onNavigateToSignup={() => setCurrentPage('signup')}
          onNavigateToForgotPassword={() => setCurrentPage('forgot-password')}
        />
      );
    }
    return (
      <ProfilePage
        onBackToDashboard={() => setCurrentPage('landing')}
        onNavigateToEditor={() => setCurrentPage('editor')}
      />
    );
  }

  // Public Landing Page (Default for all visitors)
  return (
    <LandingPage
      onStartBuilding={handleStartBuilding}
      onNavigateToProfile={handleNavigateToProfile}
      onNavigateToLogin={() => {
        setPostLoginDestination('editor');
        setCurrentPage('login');
      }}
    />
  );
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
