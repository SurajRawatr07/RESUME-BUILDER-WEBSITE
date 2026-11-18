import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  FileCheck,
  FileText,
  FileDown,
  Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '@/stores/resumeStore';
import { useTheme } from '@/context/ThemeContext';
import ResumeForm from '@/components/features/ResumeForm';
import ResumePreview from '@/components/features/ResumePreview';
import TemplateSelector from '@/components/features/TemplateSelector';
import FeatureHubModal, { FeatureModalTab } from '@/components/features/FeatureHubModal';
import ResumeReadinessModal from '@/components/features/ResumeReadinessModal';
import { ResumeVersion } from '@/lib/storage';
import BrandWordmark from '@/components/ui/BrandWordmark';
import GlowingShadow from '@/components/ui/GlowingShadow';
import { exportToPDF, exportToDOCX } from '@/lib/utils';

interface EditorPageProps {
  onBack: () => void;
  onNavigateToProfile?: () => void;
}

export default function EditorPage({ onBack, onNavigateToProfile }: EditorPageProps) {
  const { isDark } = useTheme();
  const {
    currentResumeId,
    currentResumeTitle,
    setCurrentResumeTitle,
    resumeData,
    setResumeData,
    selectedTemplate,
    setSelectedTemplate,
    atsScore,
  } = useResumeStore();

  const [showPreview, setShowPreview] = useState(true);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Feature Hub & Readiness Modals State (for ATS score and detailed diagnostics)
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<FeatureModalTab>('ats_diagnostic');
  const [showReadinessModal, setShowReadinessModal] = useState(false);

  const handleOpenFeature = (tab: FeatureModalTab) => {
    setActiveFeatureTab(tab);
    setFeatureModalOpen(true);
  };

  const handleApplyContentAssistant = (newText: string, sectionType: string) => {
    if (sectionType === 'summary') {
      setResumeData({ summary: newText });
    } else if (sectionType === 'experience' && resumeData.experiences && resumeData.experiences.length > 0) {
      const updatedExp = [...resumeData.experiences];
      updatedExp[0] = {
        ...updatedExp[0],
        description: newText,
      };
      setResumeData({ experiences: updatedExp });
    } else if (sectionType === 'project' && resumeData.projects && resumeData.projects.length > 0) {
      const updatedProj = [...resumeData.projects];
      updatedProj[0] = {
        ...updatedProj[0],
        description: newText,
      };
      setResumeData({ projects: updatedProj });
    } else {
      setResumeData({ summary: newText });
    }
  };

  const handleApplyImportedData = (imported: Partial<typeof resumeData>) => {
    setResumeData(imported);
  };

  const handleSelectVersion = (version: ResumeVersion) => {
    setResumeData(version.resumeData);
    setSelectedTemplate(version.selectedTemplate);
    setCurrentResumeTitle(version.name);
  };

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
      {/* Primary Header */}
      <header className={`sticky top-0 z-40 no-print backdrop-blur-xl border-b transition-colors duration-200 ${isDark ? 'bg-[#111111]/90 border-white/[0.09] shadow-black/40' : 'bg-white/90 border-black/[0.08]'} shadow-sm`}>
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              aria-label="Back"
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
              {/* Editable Resume Title (Visible on tablet & desktop, clean and minimal) */}
              <input
                type="text"
                value={currentResumeTitle}
                onChange={(e) => setCurrentResumeTitle(e.target.value)}
                placeholder="Resume Title"
                aria-label="Editable resume name"
                className={`max-w-[130px] sm:max-w-[200px] md:max-w-[260px] px-2.5 py-1 text-xs font-semibold rounded-lg border bg-transparent truncate focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                  isDark ? 'border-neutral-800 text-neutral-200 hover:border-neutral-700' : 'border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              />
            </div>
          </div>

          {/* Right Primary Actions: ONLY ATS Score and Export */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* ATS Score Button (Analyzes current resume and opens detailed score & improvement suggestions) */}
            <Button
              id="editor-ats-score-btn"
              variant="outline"
              size="sm"
              onClick={() => handleOpenFeature('ats_diagnostic')}
              className={`flex items-center gap-1.5 rounded-xl font-semibold text-xs px-3 py-1.5 transition-all shadow-2xs ${
                isDark
                  ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
              <span>ATS Score</span>
            </Button>

            {/* Export Button & Menu */}
            <div className="relative">
              <Button
                id="editor-export-btn"
                onClick={() => setShowExportMenu(!showExportMenu)}
                size="sm"
                disabled={isExporting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all rounded-xl font-semibold text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                {isExporting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Download className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Export</span>
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
          </div>
        </div>

        {/* Mobile Tab Switcher (Edit vs Preview) for responsive ergonomics */}
        <div className={`lg:hidden flex border-t ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 py-2 text-xs font-semibold transition-colors ${
              !showPreview
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/20'
                : isDark ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`flex-1 py-2 text-xs font-semibold transition-colors ${
              showPreview
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/20'
                : isDark ? 'text-neutral-400' : 'text-neutral-500'
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

      {/* Editor Layout: Responsive flex height that fills viewport cleanly */}
      <div className="flex flex-col lg:flex-row h-[calc(100dvh-88px)] lg:h-[calc(100dvh-54px)] overflow-hidden">
        {/* Form Sidebar */}
        <motion.div
          className={`
            ${showPreview ? 'hidden lg:flex' : 'flex'}
            lg:w-[460px] xl:w-[520px] overflow-y-auto no-print flex-col
            ${isDark ? 'bg-[#171717] border-white/[0.09]' : 'bg-white border-black/[0.08]'} border-r
          `}
          initial={false}
        >
          {/* Form Area - Focused purely on editing without ATS distraction */}
          <div className="flex-1 overflow-y-auto">
            <ResumeForm />
          </div>
        </motion.div>

        {/* Preview Area */}
        <div className={`
          ${showPreview ? 'flex' : 'hidden lg:flex'}
          flex-1 overflow-y-auto flex-col min-w-0
          ${isDark ? 'bg-[#111111]' : 'bg-slate-50/50'}
        `}>
          <div className={`px-4 py-2.5 flex items-center justify-between border-b no-print ${isDark ? 'bg-[#171717] border-white/[0.09]' : 'bg-white border-black/[0.08]'}`}>
            <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Live Preview & Real-Time Render</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Reactive Engine Active</span>
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

      {/* Feature Hub Modal (Houses Features 1, 2, 3, 4, 5, 6, 7, 9) */}
      <AnimatePresence>
        {featureModalOpen && (
          <FeatureHubModal
            isOpen={featureModalOpen}
            onClose={() => setFeatureModalOpen(false)}
            currentTab={activeFeatureTab}
            onTabChange={setActiveFeatureTab}
            resumeData={resumeData}
            currentResumeId={currentResumeId || 'default_resume'}
            currentResumeTitle={currentResumeTitle}
            currentTemplate={selectedTemplate}
            atsScore={atsScore}
            onApplyContentAssistant={handleApplyContentAssistant}
            onApplyImportedData={handleApplyImportedData}
            onSelectVersion={handleSelectVersion}
            onOpenReadinessModal={() => setShowReadinessModal(true)}
          />
        )}
      </AnimatePresence>

      {/* Feature 10: Resume Readiness / Pre-Flight Review Modal */}
      <AnimatePresence>
        {showReadinessModal && (
          <ResumeReadinessModal
            isOpen={showReadinessModal}
            onClose={() => setShowReadinessModal(false)}
            resumeData={resumeData}
            currentResumeTitle={currentResumeTitle}
            onOpenContentAssistant={() => handleOpenFeature('content_assistant')}
            onOpenJobMatcher={() => handleOpenFeature('job_matcher')}
            onExportPDF={handleExportPDF}
          />
        )}
      </AnimatePresence>

      {/* Feature 8: Template Live Preview & Instant Switcher */}
      <AnimatePresence>
        {showTemplateSelector && (
          <TemplateSelector onClose={() => setShowTemplateSelector(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
