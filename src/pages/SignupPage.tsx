import AuthPage from "./AuthPage";

interface SignupPageProps {
  onSignupSuccess: () => void;
  onNavigateToLogin: () => void;
  onBackToHome?: () => void;
}

export default function SignupPage({
  onSignupSuccess,
  onNavigateToLogin,
  onBackToHome,
}: SignupPageProps) {
  return (
    <AuthPage
      initialMode="signup"
      onSignupSuccess={onSignupSuccess}
      onLoginSuccess={onSignupSuccess}
      onNavigateToLogin={onNavigateToLogin}
      onBackToHome={onBackToHome}
    />
  );
}
