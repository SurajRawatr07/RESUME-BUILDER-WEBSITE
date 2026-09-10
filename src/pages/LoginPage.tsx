import AuthPage from "./AuthPage";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
}

export default function LoginPage({
  onLoginSuccess,
  onNavigateToSignup,
  onNavigateToForgotPassword,
}: LoginPageProps) {
  return (
    <AuthPage
      initialMode="signin"
      onLoginSuccess={onLoginSuccess}
      onSignupSuccess={onLoginSuccess}
      onNavigateToSignup={onNavigateToSignup}
      onNavigateToForgotPassword={onNavigateToForgotPassword}
    />
  );
}
