import AuthPage from "./AuthPage";

interface SignupPageProps {
  onSignupSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function SignupPage({
  onSignupSuccess,
  onNavigateToLogin,
}: SignupPageProps) {
  return (
    <AuthPage
      initialMode="signup"
      onSignupSuccess={onSignupSuccess}
      onLoginSuccess={onSignupSuccess}
      onNavigateToLogin={onNavigateToLogin}
    />
  );
}
