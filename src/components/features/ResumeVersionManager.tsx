import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  Edit2,
  Check,
  Calendar,
  Sparkles,
  AlertTriangle,
  FolderKanban,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeData, TemplateType } from '@/types/resume';
import { versionStorage, ResumeVersion } from '@/lib/storage';
import { calculateATSScore } from '@/lib/atsEngine';

interface ResumeVersionManagerProps {
  currentResumeId: string;
  currentResumeTitle: string;
  currentResumeData: ResumeData;
  currentTemplate: TemplateType;
  atsScore: number;
  onSelectVersion: (version: ResumeVersion) => void;
  onClose?: () => void;
}

export default function ResumeVersionManager({
  currentResumeId,
  currentResumeTitle,
  currentResumeData,
  currentTemplate,
  atsScore,
  onSelectVersion,
  onClose,
}: ResumeVersionManagerProps) {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newTargetRole, setNewTargetRole] = useState('Frontend Developer');
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = versionStorage.createInitialVersionIfEmpty(
      currentResumeId || 'default-resume',
      currentResumeTitle || 'Primary Resume',
      currentTemplate,
      atsScore,
      currentResumeData
    );
    setVersions(loaded);
  }, [currentResumeId, currentResumeTitle, currentTemplate, atsScore, currentResumeData]);

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newVersionName.trim() || `${newTargetRole} Version`;
    const newVer: ResumeVersion = {
      id: `ver-${Date.now()}`,
      resumeId: currentResumeId || 'default-resume',
      name,
      targetRole: newTargetRole,
      selectedTemplate: currentTemplate,
      atsScore: calculateATSScore(currentResumeData, newTargetRole).score,
      resumeData: {
        ...currentResumeData,
        jobTitle: newTargetRole,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false,
    };

    const updated = versionStorage.saveVersion(currentResumeId || 'default-resume', newVer);
    setVersions(updated);
    setIsCreating(false);
    setNewVersionName('');
  };

  const handleDuplicateVersion = (v: ResumeVersion) => {
    const dup: ResumeVersion = {
      ...v,
      id: `ver-${Date.now()}`,
      name: `${v.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false,
    };
    const updated = versionStorage.saveVersion(currentResumeId || 'default-resume', dup);
    setVersions(updated);
  };

  const handleDeleteVersion = (id: string) => {
    const updated = versionStorage.deleteVersion(currentResumeId || 'default-resume', id);
    setVersions(updated);
    setConfirmDeleteId(null);
  };

  const handleSaveRename = (id: string) => {
    const target = versions.find((v) => v.id === id);
    if (target && editedName.trim()) {
      const updatedItem: ResumeVersion = {
        ...target,
        name: editedName.trim(),
        updatedAt: new Date().toISOString(),
      };
      const updated = versionStorage.saveVersion(currentResumeId || 'default-resume', updatedItem);
      setVersions(updated);
    }
    setEditingVersionId(null);
    setEditedName('');
  };

  const handleOpenVersion = (v: ResumeVersion) => {
    versionStorage.setActiveVersion(currentResumeId || 'default-resume', v.id);
    onSelectVersion(v);
    if (onClose) onClose();
  };

  const roles = [
    'Frontend Developer',
    'Full Stack Developer',
    'Backend Developer',
    'Software Engineer',
    'DevOps Engineer',
    'Data Analyst',
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <GitBranch className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Resume Version Manager
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Maintain role-specific resume branches (e.g. Frontend vs Backend) with independent templates and ATS scores.
            </p>
          </div>

          <Button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold h-9 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create New Version
          </Button>
        </div>

        {/* Create Version Drawer */}
        <AnimatePresence>
          {isCreating && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreateVersion}
              className="mt-5 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-3"
            >
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                Branch New Resume Version
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-gray-300 block mb-1">
                    Version Name:
                  </label>
                  <input
                    type="text"
                    value={newVersionName}
                    onChange={(e) => setNewVersionName(e.target.value)}
                    placeholder="e.g. Senior Frontend at FAANG"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-gray-300 block mb-1">
                    Target Role Alignment:
                  </label>
                  <select
                    value={newTargetRole}
                    onChange={(e) => setNewTargetRole(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                  className="rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs"
                >
                  Save Version
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Version Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {versions.map((v) => {
          const isEditing = editingVersionId === v.id;
          const isConfirmingDelete = confirmDeleteId === v.id;

          return (
            <motion.div
              key={v.id}
              layout
              className={`rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                v.isActive
                  ? 'border-indigo-600 bg-white dark:bg-gray-900 shadow-md ring-1 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-slate-300 dark:hover:border-gray-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 mb-2">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="text-xs font-bold px-2 py-1 rounded border border-indigo-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white w-full"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(v.id)}
                          className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {v.name}
                        </h4>
                        <button
                          onClick={() => {
                            setEditingVersionId(v.id);
                            setEditedName(v.name);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 transition-opacity"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <span className="text-xs text-slate-500 dark:text-gray-400 block truncate">
                      Role: {v.targetRole}
                    </span>
                  </div>

                  {/* ATS Badge */}
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    v.atsScore >= 80
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
                  }`}>
                    ATS {v.atsScore}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-gray-800 space-y-1.5 text-xs text-slate-500 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Template:</span>
                    <strong className="text-slate-700 dark:text-gray-300 uppercase tracking-wide text-[10px]">
                      {v.selectedTemplate}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Updated:</span>
                    <span className="text-[11px]">
                      {new Date(v.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicateVersion(v)}
                    title="Duplicate version"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {versions.length > 1 && (
                    <button
                      onClick={() => setConfirmDeleteId(confirmDeleteId === v.id ? null : v.id)}
                      title="Delete version"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <Button
                  size="sm"
                  variant={v.isActive ? 'secondary' : 'default'}
                  onClick={() => handleOpenVersion(v)}
                  className={`rounded-xl text-xs h-8 ${
                    v.isActive
                      ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {v.isActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Active
                    </>
                  ) : (
                    'Open Version'
                  )}
                </Button>
              </div>

              {/* Confirm Delete Warning */}
              {isConfirmingDelete && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">
                    Confirm deletion?
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteVersion(v.id)}
                      className="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-semibold"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-0.5 rounded bg-slate-200 dark:bg-gray-700 text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
