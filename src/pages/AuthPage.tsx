import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  FileText,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export interface AuthPageProps {
  initialMode?: "signin" | "signup";
  onLoginSuccess?: () => void;
  onSignupSuccess?: () => void;
  onNavigateToSignup?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToForgotPassword?: () => void;
}

export default function AuthPage({
  initialMode = "signin",
  onLoginSuccess,
  onSignupSuccess,
  onNavigateToSignup,
  onNavigateToLogin,
  onNavigateToForgotPassword,
}: AuthPageProps) {
  const { login, signup } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Email validation
  const isValidEmail = (val: string) => /\S+@\S+\.\S+/.test(val);

  // Password validation checks for signup
  const passwordCriteria = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };

  const passwordScore =
    (passwordCriteria.minLength ? 1 : 0) +
    (passwordCriteria.hasUpper ? 1 : 0) +
    (passwordCriteria.hasNumber ? 1 : 0) +
    (passwordCriteria.hasSymbol ? 1 : 0);

  const handleSwitchMode = (targetMode: "signin" | "signup") => {
    setError(null);
    setSuccessMessage(null);
    setMode(targetMode);
    if (targetMode === "signup" && onNavigateToSignup) {
      onNavigateToSignup();
    } else if (targetMode === "signin" && onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address (e.g., name@example.com).");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(trimmedEmail, password);
      setIsLoading(false);

      if (res.success) {
        setSuccessMessage("Welcome back! Signing you in...");
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 400);
      } else {
        setError(res.message || "Invalid credentials. Please verify and try again.");
      }
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred during sign in. Please try again.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address (e.g., name@example.com).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords you entered do not match. Please verify.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signup(trimmedName, trimmedEmail, password);
      setIsLoading(false);

      if (res.success) {
        setSuccessMessage("Account created successfully! Taking you to your dashboard...");
        setTimeout(() => {
          if (onSignupSuccess) {
            onSignupSuccess();
          } else if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 500);
      } else {
        setError(res.message || "An account with this email address already exists.");
      }
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100 transition-colors duration-200"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      {/* Top Controls: Theme Switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Main Centered Authentication Container */}
      <div className="w-full max-w-md mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 mb-3 shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-xs uppercase tracking-wider font-bold text-indigo-700 dark:text-indigo-400">
            Resume Builder
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            {mode === "signin" ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {mode === "signin"
              ? "Sign in to access your resumes and continue building your career."
              : "Start crafting professional, ATS-optimized resumes in minutes."}
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 p-6 sm:p-8">
          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-gray-800/80 rounded-xl mb-6 border border-slate-200/60 dark:border-gray-700/60">
            <button
              type="button"
              onClick={() => handleSwitchMode("signin")}
              className={`py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                mode === "signin"
                  ? "bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode("signup")}
              className={`py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                mode === "signup"
                  ? "bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Alert Message for Errors */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-red-700 dark:text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Alert Message for Success */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Sign In Form */}
          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Address */}
              <div>
                <label
                  htmlFor="signin-email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="signin-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={isLoading}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="signin-password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                  {onNavigateToForgotPassword && (
                    <button
                      type="button"
                      onClick={onNavigateToForgotPassword}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center pt-0.5">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-gray-700 rounded focus:ring-indigo-500 bg-white dark:bg-gray-800"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs sm:text-sm text-slate-600 dark:text-slate-400 select-none cursor-pointer"
                >
                  Remember me on this device
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    disabled={isLoading}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={isLoading}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    disabled={isLoading}
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1.5 h-1.5 w-full">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full transition-colors duration-200 ${
                            passwordScore >= step
                              ? passwordScore <= 1
                                ? "bg-amber-500"
                                : passwordScore <= 2
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                              : "bg-slate-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        Strength:{" "}
                        {passwordScore <= 1
                          ? "Weak"
                          : passwordScore <= 2
                          ? "Moderate"
                          : passwordScore <= 3
                          ? "Good"
                          : "Strong"}
                      </span>
                      <span className="text-[11px]">8+ chars, uppercase, number</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    disabled={isLoading}
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <p
                    className={`text-xs mt-1.5 flex items-center gap-1 ${
                      password === confirmPassword
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {password === confirmPassword ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Passwords do not match</span>
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Switching Option */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-gray-800 text-center">
            {mode === "signin" ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleSwitchMode("signup")}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleSwitchMode("signin")}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security / Quality Indicator */}
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Secure client-side authenticated session</span>
        </div>
      </div>
    </div>
  );
}
