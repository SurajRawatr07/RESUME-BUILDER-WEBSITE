import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Eye, EyeOff, User, LogOut, FileCheck, Layout, FileText, Sun, Moon, FileDown, Printer, Sparkles, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '@/stores/resumeStore';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import ResumeForm from '@/components/features/ResumeForm';
import ResumePreview from '@/components/features/ResumePreview';
import TemplateSelector from '@/components/features/TemplateSelector';
import ATSChecker from '@/components/features/forms/ATSChecker';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
import BrandWordmark from '@/components/ui/BrandWordmark';
import GlowingShadow from '@/components/ui/GlowingShadow';
import { exportToPDF, exportToDOCX } from '@/lib/utils';

interface EditorPageProps {
  onBack: () => void;
  onNavigateToProfile?: () => void;
}

export default function EditorPage({ onBack, onNavigateToProfile }: EditorPageProps) {
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const {
    resumeData,
    atsScore,
    isSaving,
    saveCurrentResume,
    currentResumeTitle,
    setCurrentResumeTitle,
  } = useResumeStore();
  const [showPreview, setShowPreview] = useState(true);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showATSChecker, setShowATSChecker] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    await exportToPDF('resume-preview-content', `${resumeData.fullName.replace(/\s+/g, '_')}_resume`);
    setIsExporting(false);
  };

  const handleExportDOCX = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    await exportToDOCX(resumeData, `${resumeData.fullName.replace(/\s+/g, '_')}_resume`);
    setIsExporting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen transition-colors duration-200 bg-transparent ${isDark ? 'text-white' : 'text-slate-900'}`}
    >
      {/* Header */}
      <header className={`sticky top-0 z-40 no-print backdrop-blur-xl border-b transition-colors duration-200 ${isDark ? 'bg-[#111111]/90 border-white/[0.09] shadow-black/40' : 'bg-white/90 border-black/[0.08]'} shadow-sm`}>
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className={`rounded-xl transition-colors shrink-0 ${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-indigo-50 hover:text-indigo-600'}`}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              <BrandWordmark
                size="md"
                className="hidden sm:inline-block"
                onClick={onBack}
                ariaLabel="Resume Craft Home"
              />
              <input
                type="text"
                value={currentResumeTitle}
                onChange={(e) => setCurrentResumeTitle(e.target.value)}
                placeholder="Resume Title"
                className={`hidden md:inline-block max-w-[180px] px-2.5 py-1 text-xs font-semibold rounded-lg border bg-transparent truncate focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDark ? 'border-gray-800 text-gray-200' : 'border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Auto-Save & Manual Save Status Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => saveCurrentResume()}
              disabled={isSaving}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-xl ${
                isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                  <span className="hidden md:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden md:inline">Saved</span>
                </>
              )}
            </Button>

            {/* Live ATS Score Pill */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowATSChecker(true)}
              className={`flex items-center gap-1.5 rounded-xl font-bold text-xs transition-all ${
                atsScore >= 80
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                  : atsScore >= 60
                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                  : 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATS {atsScore}</span>
            </Button>

            <ThemeToggle />

            <ProfileDropdown
              onNavigateToProfile={onNavigateToProfile}
              onNavigateToDashboard={onBack}
              onNavigateToEditor={() => {}}
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateSelector(true)}
              className={`hidden sm:flex items-center gap-1.5 rounded-xl transition-all ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-indigo-500' : 'border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300'}`}
            >
              <Layout className="w-4 h-4" />
              <span className="hidden lg:inline">Template</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className={`lg:hidden rounded-xl ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}`}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>

            {/* Export Menu */}
            <div className="relative">
              <Button
                onClick={() => setShowExportMenu(!showExportMenu)}
                size="sm"
                disabled={isExporting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all rounded-xl"
              >
                {isExporting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Download className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="hidden sm:inline ml-1.5">Export</span>
              </Button>

              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-2xl border overflow-hidden z-50 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                  >
                    <button
                      onClick={handleExportPDF}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-indigo-50'}`}
                    >
                      <FileText className="w-4 h-4 text-red-500" />
                      Download PDF
                    </button>
                    <div className={`h-px mx-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
                    <button
                      onClick={() => {
                        setShowExportMenu(false);
                        window.print();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-emerald-50'}`}
                    >
                      <Printer className="w-4 h-4 text-emerald-500" />
                      Print / Vector PDF
                    </button>
                    <div className={`h-px mx-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
                    <button
                      onClick={handleExportDOCX}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-blue-50'}`}
                    >
                      <FileDown className="w-4 h-4 text-blue-500" />
                      Export as DOCX
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className={`hidden md:flex rounded-xl transition-all ${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-red-400' : 'hover:bg-red-50 hover:text-red-600'}`}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile tab switcher */}
        <div className={`lg:hidden flex border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${!showPreview
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${showPreview
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Preview
          </button>
        </div>
      </header>

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowExportMenu(false)} />
      )}

      {/* Editor Layout */}
      <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 57px)' }}>
        {/* Form Sidebar */}
        <motion.div
          className={`
            ${showPreview ? 'hidden lg:flex' : 'flex'}
            lg:w-[440px] xl:w-[500px] overflow-y-auto no-print flex-col
            ${isDark ? 'bg-[#171717] border-white/[0.09]' : 'bg-white border-black/[0.08]'} border-r
          `}
          initial={false}
        >
          <ResumeForm />
        </motion.div>

        {/* Preview Area */}
        <div className={`
          ${showPreview ? 'flex' : 'hidden lg:flex'}
          flex-1 overflow-y-auto flex-col min-w-0
          ${isDark ? 'bg-[#111111]' : 'bg-white'}
        `}>
          <div className={`px-4 py-3 flex items-center justify-between border-b no-print ${isDark ? 'bg-[#171717] border-white/[0.09]' : 'bg-white border-black/[0.08]'}`}>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Live Preview</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Auto-saving</span>
            </div>
          </div>
          <div className="flex-1 p-2 sm:p-4 lg:p-8 overflow-x-auto overflow-y-auto w-full flex flex-col items-center">
            <div className="w-full max-w-[850px] min-w-0">
              <GlowingShadow
                variant="subtle"
                interactive={false}
                rounded="rounded-lg"
                className="w-full mx-auto"
              >
                <div id="resume-preview-content" className="w-full overflow-x-auto">
                  <ResumePreview />
                </div>
              </GlowingShadow>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showTemplateSelector && (
          <TemplateSelector onClose={() => setShowTemplateSelector(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showATSChecker && (
          <ATSChecker resumeData={resumeData} onClose={() => setShowATSChecker(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
