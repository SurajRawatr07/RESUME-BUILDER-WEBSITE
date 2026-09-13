import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import BrandWordmark from '@/components/ui/BrandWordmark';

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
  onBackToHome?: () => void;
}

export default function ForgotPasswordPage({
  onNavigateToLogin,
  onBackToHome,
}: ForgotPasswordPageProps) {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center p-4 transition-colors duration-300 bg-transparent ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        )}
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="relative w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mb-2">
            <BrandWordmark size="xl" />
          </div>
          <h1 className={`text-2xl font-bold mt-1 mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Reset Password
          </h1>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            We'll send you a password reset link
          </p>
        </div>

        <div className={`rounded-2xl shadow-xl border p-6 sm:p-8 ${isDark ? 'bg-[#171717] border-white/[0.09]' : 'bg-white border-black/[0.08]'}`}>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className={`text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Check your email
              </h3>
              <p className={`text-xs mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                We sent a password reset link to <strong>{email}</strong> (Demo environment).
              </p>
              <Button onClick={onNavigateToLogin} className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold">
                Back to Sign In
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="pl-9 h-10 text-sm rounded-xl"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs">
                Send Reset Link
              </Button>

              <button
                type="button"
                onClick={onNavigateToLogin}
                className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
