import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/stores/resumeStore';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import FrontendTemplate from '../templates/FrontendTemplate';
import BackendTemplate from '../templates/BackendTemplate';
import SoftwareEngineerTemplate from '../templates/SoftwareEngineerTemplate';
import FullStackTemplate from '../templates/FullStackTemplate';
import CorporateTemplate from '../templates/CorporateTemplate';

export default function ResumePreview() {
  const { selectedTemplate, resumeData } = useResumeStore();

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern': return <ModernTemplate data={resumeData} />;
      case 'minimal': return <MinimalTemplate data={resumeData} />;
      case 'creative': return <CreativeTemplate data={resumeData} />;
      case 'frontend': return <FrontendTemplate data={resumeData} />;
      case 'backend': return <BackendTemplate data={resumeData} />;
      case 'software-engineer': return <SoftwareEngineerTemplate data={resumeData} />;
      case 'fullstack': return <FullStackTemplate data={resumeData} />;
      case 'corporate': return <CorporateTemplate data={resumeData} />;
      default: return <ModernTemplate data={resumeData} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedTemplate}
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -8 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="resume-preview bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200"
      >
        {renderTemplate()}
      </motion.div>
    </AnimatePresence>
  );
}

