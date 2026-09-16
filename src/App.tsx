/* eslint-disable react-hooks/exhaustive-deps */
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import FloatingPathsBackground from './components/ui/floating-paths-background';
import InitialLoadingScreen from './components/ui/InitialLoadingScreen';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useResumeStore } from './stores/resumeStore';
import { TemplateType } from './types/resume';

type Page = 'landing' | 'editor' | 'profile' | 'dashboard' | 'login' | 'signup' | 'forgot-password';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { setSelectedTemplate } = useResumeStore();

  // Exactly 3-second initial loader state
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  // Landing page is public by default!
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [postLoginDestination, setPostLoginDestination] = useState<Page>('dashboard');

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

  const handleNavigateToDashboard = () => {
    if (!isAuthenticated) {
      setPostLoginDestination('dashboard');
      setCurrentPage('login');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentPage(postLoginDestination);
  };

  // If user signs out while on protected pages, return to public landing page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (currentPage === 'editor' || currentPage === 'profile' || currentPage === 'dashboard') {
        setCurrentPage('landing');
      }
    }
  }, [isAuthenticated, isLoading]);

  const renderCurrentPage = () => {
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
    if (currentPage === 'dashboard') {
      if (!isAuthenticated) {
        return (
          <LoginPage
            onLoginSuccess={() => setCurrentPage('dashboard')}
            onNavigateToSignup={() => setCurrentPage('signup')}
            onNavigateToForgotPassword={() => setCurrentPage('forgot-password')}
            onBackToHome={() => setCurrentPage('landing')}
          />
        );
      }
      return (
        <DashboardPage
          onNavigateToEditor={(resumeId) => setCurrentPage('editor')}
          onNavigateToProfile={() => setCurrentPage('profile')}
          onBackToHome={() => setCurrentPage('landing')}
        />
      );
    }

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
          onBack={() => setCurrentPage('dashboard')}
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
          onBackToDashboard={() => setCurrentPage('dashboard')}
          onNavigateToEditor={() => setCurrentPage('editor')}
        />
      );
    }

    // Public Landing Page (Default for all visitors)
    return (
      <LandingPage
        onStartBuilding={handleStartBuilding}
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToLogin={() => {
          setPostLoginDestination('dashboard');
          setCurrentPage('login');
        }}
      />
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* 1. Global Floating Paths Background Layer (Z-index: 0, Fixed, Non-blocking) */}
      <FloatingPathsBackground />

      {/* 2. Main Application Content (Z-index: 1, Relative) */}
      <div className="relative z-1 min-h-screen">
        {renderCurrentPage()}
      </div>

      {/* 3. Global Initial Loader (Visible for EXACTLY 3 seconds, then smooth 350ms exit) */}
      <AnimatePresence>
        {showInitialLoader && (
          <InitialLoadingScreen onComplete={() => setShowInitialLoader(false)} />
        )}
      </AnimatePresence>
    </div>
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
