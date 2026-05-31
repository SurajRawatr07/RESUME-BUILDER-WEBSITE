import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useTheme } 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email)ame={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
        </div>
      </motion.div>
    </div>
  );
}
