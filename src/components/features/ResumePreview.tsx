import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/stores/resumeStore';
import { getTemplateById } from '../templates/registry';

export default function ResumePreview() {
  const { selectedTemplate, resumeData } = useResumeStore();
  const templateDef = getTemplateById(selectedTemplate);
  const TemplateComponent = templateDef.component;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={templateDef.id}
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="resume-preview bg-white shadow-xl rounded-sm overflow-hidden border border-gray-200 print:border-none print:shadow-none print:rounded-none"
      >
        <TemplateComponent data={resumeData} />
      </motion.div>
    </AnimatePresence>
  );
}

