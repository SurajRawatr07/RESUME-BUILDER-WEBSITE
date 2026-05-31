import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useTheme } 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100'}`}>
      <div className="absolute top-4 right-4 z-20"><ThemeToggle /></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 20, 0], y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity }}
          className={`absolute top-20 left-20 w-64 h-64 rounded-full filter blur-3xl opacity-25 ${isDark ? 'bg-blue-800' : 'bg-blue-300'}`} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Reset Password</h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>We'll send you a reset link</p>
        </div>

        <div className={`rounded-3xl shadow-2xl border p-8 backdrop-blur-xl ${isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-white/30'}`}>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Check your email!</h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                We sent a password reset link to <strong>{email}</strong> (UI demo only)
              </p>
              <Button onClick={onNavigateToLogin} className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl">
                Back to Sign In
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className={`flex items-start gap-3 p-4 rounded-2xl ${isDark ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-100'}`}>
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className={`font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`h-12 rounded-xl ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500' : 'bg-white/70 border-gray-200'}`}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg">
                Send Reset Link
              </Button>
            </form>
          )}

          {!submitted && (
            <button onClick={onNavigateToLogin} className={`mt-6 flex items-center justify-center gap-2 w-full text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
