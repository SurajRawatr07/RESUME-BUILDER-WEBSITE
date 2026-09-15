import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Eye,
  EyeOff,
  User,
  LogOut,
  FileCheck,
  Layout,
  FileText,
  Sun,
  Moon,
  FileDown,
  Printer,
  Sparkles,
  Check,
  Loader2,
  Search,
  Target,
  Wand2,
  GitBranch,
  Activity,
  UploadCloud,
  ShieldCheck,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '@/stores/resumeStore';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import ResumeForm from '@/components/features/ResumeForm';
import ResumePreview from '@/components/features/ResumePreview';
import TemplateSelector from '@/components/features/TemplateSelector';
import ATSChecker from '@/components/features/forms/ATSChecker';
import ATSScoreCard from '@/components/features/ATSScoreCard';
import FeatureHubModal, { FeatureModalTab } from '@/components/features/FeatureHubModal';
import ResumeReadinessModal from '@/components/features/ResumeReadinessModal';
import { ResumeVersion } from '@/lib/storage';
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
    currentResumeId,
    currentResumeTitle,
    setCurrentResumeTitle,
    resumeData,
    setResumeData,
    selectedTemplate,
    setSelectedTemplate,
    atsScore,
    isSaving,
    saveCurrentResume,
  } = useResumeStore();

  const [showPreview, setShowPreview] = useState(true);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // New Feature Hub & Readiness Modals State
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<FeatureModalTab>('job_matcher');
  const [showReadinessModal, setShowReadinessModal] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  const handleOpenFeature = (tab: FeatureModalTab) => {
    setActiveFeatureTab(tab);
    setFeatureModalOpen(true);
    setShowToolsDropdown(false);
  };

  const handleApplyContentAssistant = (newText: string, sectionType: string) => {
    if (sectionType === 'summary') {
      setResumeData({ summary: newText });
    } else if (sectionType === 'experience' && resumeData.experience && resumeData.experience.length > 0) {
      const updatedExp = [...resumeData.experience];
      updatedExp[0] = {
        ...updatedExp[0],
        description: newText,
      };
      setResumeData({ experience: updatedExp });
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
                className={`hidden md:inline-block max-w-[170px] px-2.5 py-1 text-xs font-semibold rounded-lg border bg-transparent truncate focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDark ? 'border-gray-800 text-gray-200' : 'border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
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

            {/* Live ATS Score Pill (Click opens Diagnostic) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenFeature('ats_diagnostic')}
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

            {/* Pre-Flight Audit Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReadinessModal(true)}
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-semibold text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">Pre-Flight Review</span>
            </Button>

            {/* Template Selector Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateSelector(true)}
              className={`hidden sm:flex items-center gap-1.5 rounded-xl transition-all ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-indigo-500' : 'border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300'}`}
            >
              <Layout className="w-4 h-4" />
              <span className="hidden lg:inline">Template</span>
            </Button>

            {/* Mobile View Toggle */}
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

            <ThemeToggle />

            <ProfileDropdown
              onNavigateToProfile={onNavigateToProfile}
              onNavigateToDashboard={onBack}
              onNavigateToEditor={() => {}}
            />

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

        {/* Feature Tools Subheader Bar */}
        <div className={`px-4 py-2 border-t flex items-center justify-between gap-2 overflow-x-auto text-xs ${isDark ? 'bg-gray-950/60 border-white/[0.06]' : 'bg-slate-50/90 border-slate-200/80'}`}>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => handleOpenFeature('job_matcher')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-slate-700 hover:text-indigo-600 hover:bg-white'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-indigo-500" />
              <span>JD Matcher</span>
            </button>

            <button
              onClick={() => handleOpenFeature('keyword_gap')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-slate-700 hover:text-indigo-600 hover:bg-white'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-purple-500" />
              <span>Keyword Gap</span>
            </button>

            <button
              onClick={() => handleOpenFeature('content_assistant')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-slate-700 hover:text-indigo-600 hover:bg-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>Content Assistant</span>
            </button>

            <button
              onClick={() => handleOpenFeature('versions')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-slate-700 hover:text-indigo-600 hover:bg-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-blue-500" />
              <span>Versions</span>
            </button>

            <button
              onClick={() => handleOpenFeature('comparison')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-slate-700 hover:text-indigo-600 hover:bg-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>Compare</span>
            </button>

            <button
              onClick={() => handleOpenFeature('health_dashboard')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-slate-700 hover:text-indigo-600 hover:bg-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Health Score</span>
            </button>

            <button
              onClick={() => handleOpenFeature('import_resume')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-slate-700 hover:text-indigo-600 hover:bg-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-rose-500" />
              <span>Import Resume</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowReadinessModal(true)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Readiness</span>
            </button>
          </div>
        </div>

        {/* Mobile tab switcher */}
        <div className={`lg:hidden flex border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${!showPreview
              ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
              : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${showPreview
              ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
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
      <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 95px)' }}>
        {/* Form Sidebar with Reactive Live ATS Card at top */}
        <motion.div
          className={`
            ${showPreview ? 'hidden lg:flex' : 'flex'}
            lg:w-[460px] xl:w-[520px] overflow-y-auto no-print flex-col
            ${isDark ? 'bg-[#171717] border-white/[0.09]' : 'bg-white border-black/[0.08]'} border-r
          `}
          initial={false}
        >
          {/* Live ATS Score Card directly inside editor */}
          <div className="p-3 border-b border-slate-200 dark:border-gray-800 shrink-0">
            <ATSScoreCard
              resumeData={resumeData}
              onOpenFullDiagnostic={() => handleOpenFeature('ats_diagnostic')}
            />
          </div>

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
