import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Eye, EyeOff, User, LogOut, FileCheck, Layout, FileText, Sun, Moon, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
impowATSChecker] = useState(false);
  const [showExportMenu, set
         ame="flex items-center gap-2 flex-shrink-0">
            {/* User badge */}
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-indigo-50 border-indigo-100 text-gray-700'}`}>
    oggle />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowATSChecker(true)}
              className={`hidden md:flex items-center gap-1.5 rounded-xl transition-all ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-green-500 hover:text-green-400' : 'border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300'}`}
            >
              <FileCheck className="w-4 h-4" />
              <span className="hidden lg:inline">ATS Check</span>
            </Button>

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
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all rounded-xl"
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
                      Export as PDF
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
            ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r
          `}
          initial={false}
        >
          <ResumeForm />
        </motion.div>

        {/* Preview Area */}
        <div className={`
          ${showPreview ? 'flex' : 'hidden lg:flex'}
          flex-1 overflow-y-auto flex-col
          ${isDark ? 'bg-gray-950' : 'bg-gray-100'}
        `}>
          <div className={`px-4 py-3 flex items-center justify-between border-b no-print ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Live Preview</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Auto-saving</span>
            </div>
          </div>
          <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="max-w-[900px] mx-auto" id="resume-preview-content">
              <ResumePreview />
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
