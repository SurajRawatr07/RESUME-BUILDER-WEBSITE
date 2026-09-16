import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  Search,
  Sparkles,
  Layout,
  RefreshCw,
  Clock,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useResumeStore } from '@/stores/resumeStore';
import { ApiResume } from '@/lib/api';
import { TemplateType } from '@/types/resume';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
import BrandWordmark from '@/components/ui/BrandWordmark';
import { Button } from '@/components/ui/button';

interface DashboardPageProps {
  onNavigateToEditor: (resumeId?: string) => void;
  onNavigateToProfile: () => void;
  onBackToHome: () => void;
}

const TEMPLATE_OPTIONS: Array<{ id: TemplateType; name: string; tag: string }> = [
  { id: 'frontend', name: 'Frontend Engineer', tag: 'Modern & Clean' },
  { id: 'backend', name: 'Backend Systems', tag: 'High-Density' },
  { id: 'fullstack', name: 'Full-Stack Developer', tag: 'Balanced & Classic' },
  { id: 'sde', name: 'Software Engineer (SDE)', tag: 'LaTeX Overleaf Style' },
  { id: 'faang', name: 'FAANG Minimalist', tag: 'ATS Single-Page' },
  { id: 'devops', name: 'DevOps & SRE', tag: 'Infrastructure Focus' },
  { id: 'data-python', name: 'Data & Python', tag: 'Analytical Focus' },
  { id: 'mobile', name: 'Mobile App Developer', tag: 'Product Focused' },
  { id: 'fresher', name: 'Student & Fresher', tag: 'Education First' },
  { id: 'opensource', name: 'Open Source Contributor', tag: 'Project Heavy' },
];

export default function DashboardPage({
  onNavigateToEditor,
  onNavigateToProfile,
  onBackToHome,
}: DashboardPageProps) {
  const { user } = useAuth();
  const {
    savedResumes,
    isLoadingResumes,
    fetchUserResumes,
    selectResumeToEdit,
    createNewResume,
    duplicateResume,
    deleteResume,
  } = useResumeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTemplateForNew, setSelectedTemplateForNew] = useState<TemplateType>('frontend');
  const [isCreating, setIsCreating] = useState(false);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserResumes();
  }, [fetchUserResumes]);

  const filteredResumes = savedResumes.filter((resume) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      resume.title.toLowerCase().includes(q) ||
      resume.selectedTemplate?.toLowerCase().includes(q) ||
      resume.resumeData?.jobTitle?.toLowerCase().includes(q)
    );
  });

  const handleOpenResume = (resume: ApiResume) => {
    selectResumeToEdit(resume);
    onNavigateToEditor(String(resume._id));
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const title = newTitle.trim() || 'Software Engineer Resume';
      const created = await createNewResume(title, selectedTemplateForNew);
      if (created) {
        setIsCreatingModalOpen(false);
        setNewTitle('');
        onNavigateToEditor(String(created._id));
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDuplicate = async (e: React.MouseEvent, resumeId: string) => {
    e.stopPropagation();
    setActionInProgressId(resumeId);
    try {
      await duplicateResume(resumeId);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, resumeId: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      setActionInProgressId(resumeId);
      try {
        await deleteResume(resumeId);
      } finally {
        setActionInProgressId(null);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100 transition-colors">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none"
            >
              <BrandWordmark size="md" />
            </button>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ProfileDropdown
              onNavigateToDashboard={() => {}}
              onNavigateToProfile={onNavigateToProfile}
              onNavigateToEditor={() => onNavigateToEditor()}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200 dark:border-gray-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Engineer'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
              Manage your role-targeted resumes, monitor live ATS scores, and craft interview-ready applications.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchUserResumes()}
              disabled={isLoadingResumes}
              className="gap-2 text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingResumes ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>

            <Button
              size="sm"
              onClick={() => {
                setNewTitle('');
                setIsCreatingModalOpen(true);
              }}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Resume</span>
            </Button>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 my-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search resumes by title or template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
            <span>
              Total: <strong className="text-slate-800 dark:text-gray-200">{savedResumes.length}</strong> resumes
            </span>
          </div>
        </div>

        {/* Resume Cards Grid */}
        {isLoadingResumes && savedResumes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-48 rounded-2xl border border-slate-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 animate-pulse p-6"
              />
            ))}
          </div>
        ) : filteredResumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => {
              const hasAnalysis = !!resume.lastAtsAnalysis?.score;
              const isWorking = actionInProgressId === String(resume._id);

              return (
                <motion.div
                  key={String(resume._id)}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleOpenResume(resume)}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div>
                    {/* Header: Title & Optional Completed ATS Analysis Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {resume.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
                          {resume.resumeData?.jobTitle || 'Software Engineer'}
                        </p>
                      </div>

                      {hasAnalysis && resume.lastAtsAnalysis && (
                        <div
                          className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5"
                          title={`Analyzed for ${resume.lastAtsAnalysis.targetJobTitle} on ${new Date(resume.lastAtsAnalysis.analyzedAt).toLocaleDateString()}`}
                        >
                          <FileCheck className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
                          <span>ATS {resume.lastAtsAnalysis.score}</span>
                        </div>
                      )}
                    </div>

                    {/* Template Badge & Date */}
                    <div className="flex items-center gap-2 mt-4 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-medium capitalize">
                        {resume.selectedTemplate || 'Frontend'}
                      </span>
                      <span className="text-slate-400 dark:text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(resume.updatedAt || Date.now()).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-gray-800/80">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:underline">
                      <span>Edit in Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        title="Duplicate Resume"
                        disabled={isWorking}
                        onClick={(e) => handleDuplicate(e, String(resume._id))}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        title="Delete Resume"
                        disabled={isWorking}
                        onClick={(e) => handleDelete(e, String(resume._id), resume.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {searchQuery ? 'No resumes match your search' : 'No resumes found'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 max-w-sm mt-1 mb-6">
              {searchQuery
                ? 'Try searching with a different term or clear the search filter.'
                : 'Create your first role-tailored resume to begin optimizing your ATS score.'}
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setIsCreatingModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Resume</span>
            </Button>
          </div>
        )}
      </main>

      {/* Modal: Create New Resume */}
      {isCreatingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Create a New Resume
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Give your resume a name and choose an initial role-tested template layout.
            </p>

            <form onSubmit={handleCreateNew} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                  Resume Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer Resume"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                  Starting Template
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {TEMPLATE_OPTIONS.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplateForNew(tmpl.id)}
                      className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                        selectedTemplateForNew === tmpl.id
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 dark:border-indigo-500'
                          : 'border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {tmpl.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400">
                        {tmpl.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreatingModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isCreating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isCreating ? 'Creating...' : 'Create & Open'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
