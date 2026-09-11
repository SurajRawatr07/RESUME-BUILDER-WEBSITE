import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Globe,
  ExternalLink,
  ShieldCheck,
  X,
  Heart,
  ChevronRight,
  Send,
} from 'lucide-react';

interface StackedCircularFooterProps {
  isDark: boolean;
  scrollTo: (id: string) => void;
  onStartBuilding: () => void;
  onShowToast?: (message: string) => void;
}

export default function StackedCircularFooter({
  isDark,
  scrollTo,
  onStartBuilding,
  onShowToast,
}: StackedCircularFooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState<
    'privacy' | 'terms' | 'support' | null
  >(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      if (onShowToast) onShowToast('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    if (onShowToast) {
      onShowToast('🎉 Thank you for subscribing to career updates!');
    }
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const navColumns = [
    {
      title: 'Platform',
      links: [
        { label: 'Home', action: () => scrollTo('#home') },
        { label: 'Resume Templates', action: () => scrollTo('#templates') },
        { label: 'ATS Features', action: () => scrollTo('#features') },
        { label: 'How It Works', action: () => scrollTo('#how-it-works') },
        { label: 'Create New Resume', action: onStartBuilding },
      ],
    },
    {
      title: 'ATS & Career',
      links: [
        { label: 'ATS Score Checker', action: () => scrollTo('#features') },
        { label: 'Keyword Optimization', action: () => scrollTo('#features') },
        { label: 'Multi-Format Export', action: () => scrollTo('#features') },
        { label: 'Live Preview Mode', action: () => scrollTo('#templates') },
        { label: 'ATS-Friendly Formatting', action: () => scrollTo('#features') },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Template Gallery', action: () => scrollTo('#templates') },
        {
          label: 'Live Web Demo',
          href: 'https://resume-craft-07.vercel.app/',
          external: true,
        },
        {
          label: 'GitHub Repository',
          href: 'https://github.com/SurajRawatr07',
          external: true,
        },
        { label: 'Help & Support', action: () => setActiveModal('support') },
        { label: 'Privacy Policy', action: () => setActiveModal('privacy') },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/SurajRawatr07',
      ariaLabel: 'GitHub profile of Suraj Rawat',
      accent: 'hover:border-indigo-500 hover:text-indigo-400',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/suraj-rawat-30513b340',
      ariaLabel: 'LinkedIn profile of Suraj Rawat',
      accent: 'hover:border-blue-500 hover:text-blue-400',
    },
    {
      name: 'Live Portfolio',
      icon: Globe,
      href: 'https://resume-craft-07.vercel.app/',
      ariaLabel: 'Live deployment demo',
      accent: 'hover:border-purple-500 hover:text-purple-400',
    },
    {
      name: 'Email Me',
      icon: Mail,
      href: 'mailto:rawatsuraj80627@gmail.com',
      ariaLabel: 'Send email to Suraj Rawat',
      accent: 'hover:border-emerald-500 hover:text-emerald-400',
    },
  ];

  return (
    <footer
      id="site-footer"
      className={`relative overflow-hidden border-t transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-gray-950 via-[#070913] to-black border-gray-800 text-gray-200'
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-100 border-gray-200 text-gray-800'
      }`}
    >
      {/* =========================================================================
          STACKED CIRCULAR VISUAL BACKDROP (Concentric Layered Rings)
      ========================================================================= */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none w-full max-w-7xl h-full overflow-hidden">
        {/* Glowing Central Radial Atmosphere */}
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[350px] rounded-[100%] blur-3xl opacity-30 ${
            isDark
              ? 'bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-transparent'
              : 'bg-gradient-to-b from-indigo-400/25 via-purple-300/15 to-transparent'
          }`}
        />

        {/* Concentric Layer 1: Outermost Circular Arc */}
        <div
          className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full border border-dashed transition-all duration-700 ${
            isDark
              ? 'border-indigo-500/10'
              : 'border-indigo-400/20'
          }`}
        />

        {/* Concentric Layer 2: Mid Circular Arc */}
        <div
          className={`absolute -top-28 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full border transition-all duration-700 ${
            isDark
              ? 'border-indigo-500/15'
              : 'border-indigo-300/30'
          }`}
        />

        {/* Concentric Layer 3: Inner Circular Ring */}
        <div
          className={`absolute -top-16 left-1/2 -translate-x-1/2 w-[440px] h-[440px] rounded-full border border-dashed transition-all duration-700 ${
            isDark
              ? 'border-purple-500/20'
              : 'border-purple-300/40'
          }`}
        />

        {/* Concentric Layer 4: Tight Circular Core Ring */}
        <div
          className={`absolute top-4 left-1/2 -translate-x-1/2 w-[260px] h-[260px] rounded-full border transition-all duration-700 ${
            isDark
              ? 'border-indigo-500/25 shadow-[0_0_50px_rgba(99,102,241,0.15)]'
              : 'border-indigo-400/30 shadow-[0_0_40px_rgba(99,102,241,0.12)]'
          }`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* =========================================================================
            HEADER TIER: Centered Circular Brand Core
        ========================================================================= */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
          {/* Stacked Circular Badge / Logo Core */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mb-6"
          >
            {/* Outer Circular Ring */}
            <div
              className={`p-3 rounded-full border shadow-xl backdrop-blur-md transition-transform duration-300 hover:scale-105 ${
                isDark
                  ? 'bg-gray-900/90 border-indigo-500/30 shadow-indigo-500/10'
                  : 'bg-white/95 border-indigo-200 shadow-indigo-100'
              }`}
            >
              {/* Inner Circular Emblem */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg relative overflow-hidden group">
                <FileText className="w-7 h-7 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </div>
            </div>

            {/* Pulsing circular indicator */}
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-gray-900" />
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Smart
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Resume
            </span>
          </h2>

          <p
            className={`text-sm sm:text-base leading-relaxed max-w-lg mb-8 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Craft ATS-optimized, high-conversion resumes designed to pass
            automated screening filters and captivate hiring managers.
          </p>

          {/* =========================================================================
              NEWSLETTER SUBSCRIPTION PILL (Circular Input Stack)
          ========================================================================= */}
          <motion.form
            onSubmit={handleSubscribe}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`w-full max-w-md p-1.5 rounded-full border shadow-lg flex items-center transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/40 ${
              isDark
                ? 'bg-gray-900/80 border-gray-800 focus-within:border-indigo-500/60'
                : 'bg-white border-gray-200 focus-within:border-indigo-400'
            }`}
          >
            <div className="pl-4 pr-2 text-indigo-500">
              <Mail className="w-5 h-5" />
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Get career & ATS tips in your inbox..."
              className={`w-full bg-transparent text-sm px-2 py-2.5 outline-none placeholder:text-gray-400 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            />

            <button
              type="submit"
              disabled={subscribed}
              className={`px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-300 whitespace-nowrap shadow-md ${
                subscribed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-indigo-500/25 active:scale-95'
              }`}
            >
              {subscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Joined!</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>

          {/* Quick Circular Action Pills */}
          <div className="flex items-center gap-2.5 mt-4 flex-wrap justify-center">
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full border ${
                isDark
                  ? 'bg-gray-900/60 border-gray-800 text-gray-400'
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              ✨ 100% Free Templates
            </span>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full border ${
                isDark
                  ? 'bg-gray-900/60 border-gray-800 text-gray-400'
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              🎯 Real-time ATS Scorer
            </span>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full border ${
                isDark
                  ? 'bg-gray-900/60 border-gray-800 text-gray-400'
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              ⚡ Instant PDF Export
            </span>
          </div>
        </div>

        {/* =========================================================================
            MIDDLE TIER: Stacked Navigation Columns & Contact Information
        ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-10 border-y border-gray-200 dark:border-gray-800/70">
          {/* Nav Columns 1, 2, 3 */}
          {navColumns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider uppercase text-indigo-500">
                {col.title}
              </h3>

              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : '_self'}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className={`inline-flex items-center gap-1.5 text-sm transition-all duration-200 hover:translate-x-1 ${
                          isDark
                            ? 'text-gray-400 hover:text-indigo-400'
                            : 'text-gray-600 hover:text-indigo-600'
                        }`}
                      >
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        <span>{link.label}</span>
                        {link.external && (
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        )}
                      </a>
                    ) : (
                      <button
                        onClick={link.action}
                        className={`inline-flex items-center gap-1.5 text-sm transition-all duration-200 hover:translate-x-1 text-left ${
                          isDark
                            ? 'text-gray-400 hover:text-indigo-400'
                            : 'text-gray-600 hover:text-indigo-600'
                        }`}
                      >
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        <span>{link.label}</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Social Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-indigo-500">
              Direct Contact
            </h3>

            <div className="space-y-3 text-sm">
              <a
                href="mailto:rawatsuraj80627@gmail.com"
                className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all duration-200 hover:border-indigo-500/50 ${
                  isDark
                    ? 'bg-gray-900/40 border-gray-800/80 text-gray-300 hover:bg-gray-900'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-indigo-50/50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="truncate">rawatsuraj80627@gmail.com</span>
              </a>

              <a
                href="tel:+919675219087"
                className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all duration-200 hover:border-indigo-500/50 ${
                  isDark
                    ? 'bg-gray-900/40 border-gray-800/80 text-gray-300 hover:bg-gray-900'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-indigo-50/50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+91 9675219087</span>
              </a>

              <div
                className={`flex items-center gap-3 p-2.5 rounded-2xl border ${
                  isDark
                    ? 'bg-gray-900/40 border-gray-800/80 text-gray-300'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>India • Available Worldwide</span>
              </div>
            </div>

            {/* Stacked Circular Social Buttons */}
            <div className="pt-2">
              <p
                className={`text-xs font-semibold mb-2.5 uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Connect With Creator
              </p>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${social.accent} ${
                        isDark
                          ? 'bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM TIER: System Status, Copyright & Legal Modals
        ========================================================================= */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Creator & Copyright */}
          <div className="flex items-center gap-2 text-center md:text-left flex-wrap justify-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              © 2026 <strong className="font-semibold">SmartResume</strong>.
              Crafted with care by{' '}
              <a
                href="https://github.com/SurajRawatr07"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-500 hover:underline inline-flex items-center gap-1"
              >
                Suraj Rawat
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* System Operational Status Pill */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] ${
              isDark
                ? 'bg-gray-900/80 border-gray-800 text-gray-300'
                : 'bg-white border-gray-200 text-gray-600 shadow-sm'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>All systems operational • ATS Parser v2.4</span>
          </div>

          {/* Legal and Support Pills */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <button
              onClick={() => setActiveModal('privacy')}
              className={`transition hover:text-indigo-500 underline-offset-4 hover:underline ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Privacy Policy
            </button>
            <span className="opacity-30">•</span>
            <button
              onClick={() => setActiveModal('terms')}
              className={`transition hover:text-indigo-500 underline-offset-4 hover:underline ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Terms & Conditions
            </button>
            <span className="opacity-30">•</span>
            <button
              onClick={() => setActiveModal('support')}
              className={`transition hover:text-indigo-500 underline-offset-4 hover:underline ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Support Center
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE LEGAL / SUPPORT MODALS (Clean Accessible Popups)
      ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border ${
                isDark
                  ? 'bg-gray-900 border-gray-800 text-gray-200'
                  : 'bg-white border-gray-200 text-gray-800'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className={`absolute top-5 right-5 p-2 rounded-full border transition ${
                  isDark
                    ? 'border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white'
                    : 'border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-black'
                }`}
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {activeModal === 'privacy' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Privacy Policy</h3>
                      <p className="text-xs text-gray-500">
                        Last updated: March 2026
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400 dark:text-gray-400">
                    Your privacy is our utmost priority. SmartResume processes
                    your resume information securely in your browser and on
                    authenticated sessions. We never sell your personal contact
                    details, resume entries, or employment history to third-party
                    advertisers.
                  </p>
                  <div className="text-xs space-y-2 text-gray-400">
                    <p>• Data is stored locally and in secure encrypted cloud storage.</p>
                    <p>• You can export, modify, or permanently delete your resumes anytime.</p>
                    <p>• ATS parsing metrics are calculated strictly for user guidance.</p>
                  </div>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Terms & Conditions</h3>
                      <p className="text-xs text-gray-500">
                        Standard Service Agreement
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400 dark:text-gray-400">
                    By using SmartResume, you agree to generate truthful
                    information for your job applications. All templates and
                    designs provided on this platform are free to use for personal
                    career development and job hunting purposes.
                  </p>
                  <div className="text-xs space-y-2 text-gray-400">
                    <p>• Full rights to generated resume content belong to you.</p>
                    <p>• Templates are optimized for industry ATS standards.</p>
                  </div>
                </div>
              )}

              {activeModal === 'support' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Support & Inquiries</h3>
                      <p className="text-xs text-gray-500">
                        Fast direct developer assistance
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400 dark:text-gray-400">
                    Need help building your resume, report an issue, or suggest a
                    new template design? Feel free to reach out directly to
                    Suraj Rawat:
                  </p>
                  <div className="p-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-2 text-sm">
                    <p className="font-semibold text-indigo-400">
                      📧 rawatsuraj80627@gmail.com
                    </p>
                    <p className="text-xs text-gray-400">
                      📞 +91 9675219087 (Mon-Sat, 9AM - 8PM IST)
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
