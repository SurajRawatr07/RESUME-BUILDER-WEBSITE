import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import BrandWordmark from '@/components/ui/BrandWordmark';

interface FooterProps {
  isDark: boolean;
  scrollTo?: (id: string) => void;
  onStartBuilding?: () => void;
  onShowToast?: (message: string) => void;
}

export default function StackedCircularFooter({
  isDark,
  scrollTo,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      className={`border-t py-12 transition-colors duration-300 ${
        isDark
          ? 'bg-gray-950 border-gray-800 text-gray-300'
          : 'bg-white border-gray-200 text-gray-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Identity */}
          <div className="flex flex-col">
            <BrandWordmark
              size="lg"
              onClick={scrollTo ? () => scrollTo('#home') : undefined}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
              Overleaf and LaTeX-inspired professional resume platform.
            </p>
          </div>

          {/* Social Links (GitHub and LinkedIn Only) */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/SurajRawatr07"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile of Suraj Rawat"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isDark
                  ? 'bg-gray-900 border-gray-800 text-gray-300 hover:text-white hover:border-gray-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:text-black hover:border-gray-300'
              }`}
            >
              <Github className="w-4 h-4 text-indigo-500" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/suraj-rawat-30513b340"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile of Suraj Rawat"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isDark
                  ? 'bg-gray-900 border-gray-800 text-gray-300 hover:text-white hover:border-gray-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:text-black hover:border-gray-300'
              }`}
            >
              <Linkedin className="w-4 h-4 text-blue-500" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <p>
            © {currentYear} <strong>Resume Craft</strong>. All rights reserved.
          </p>
          <p className="text-[11px]">
            100% Free • ATS-Compliant • Overleaf & LaTeX Architectural Standards
          </p>
        </div>
      </div>
    </footer>
  );
}
