import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useResumeStore from '../store/useResumeStore';
import { 
  Plus, 
  Clock, 
  Trash2, 
  Edit3, 
  FileText, 
  Activity, 
  LayoutGrid, 
  Sparkles,
  ChevronRight,
  MoreVertical,
  Download,
  Copy
} from 'lucide-react';

const Dashboard = () => {
  const { resumes, fetchResumes, createResume, deleteResume, isLoading } = useResumeStore();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreateNew = async () => {
    setIsCreating(true);
    const newResume = await createResume({ title: 'Untitled Resume' });
    setIsCreating(false);
    if (newResume) {
      navigate(`/editor/${newResume._id}/ai`);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you absolutely certain you wish to delete this resume?')) {
      await deleteResume(id);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-app-bg p-6 lg:p-10 font-sans text-text-primary custom-scrollbar">
      <motion.div 
        className="max-w-7xl mx-auto w-full space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Workspace</h1>
            <p className="text-gray-500 mt-1 font-medium">Design and orchestrate your professional narrative.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateNew}
            disabled={isCreating}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white font-semibold rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all disabled:opacity-50"
          >
            {isCreating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>New Resume</span>
              </>
            )}
          </motion.button>
        </header>

        {/* Top Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Hero Bento: ATS Readiness */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 lg:col-span-8 bg-surface-card rounded-[2rem] p-8 shadow-ai-panel border border-gray-100/50 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="relative shrink-0 flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-100"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="440"
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * 92) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                  className="text-brand-primary"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-text-primary">92%</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Readiness</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                  <Activity className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Global ATS Analytics</h2>
              </div>
              <p className="text-gray-500 leading-relaxed max-w-md">
                Your profiles are currently outperforming <span className="text-brand-primary font-bold">84%</span> of applicants in the modern tech stack ecosystem. Intelligence optimization recommended for "Advanced Cloud Architecture" roles.
              </p>
              <div className="flex gap-3 pt-2">
                <div className="px-3 py-1.5 bg-gray-50 rounded-full text-xs font-bold text-gray-600 border border-gray-100">AI Synced</div>
                <div className="px-3 py-1.5 bg-brand-ai/10 rounded-full text-xs font-bold text-brand-ai border border-brand-ai/10 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Copilot Active
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Bento: Timeline */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 lg:col-span-4 bg-surface-card rounded-[2rem] p-8 shadow-ai-panel border border-gray-100/50 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-text-primary">
                <Clock className="w-5 h-5 text-brand-ai" /> Recent Pulse
              </h3>
              <button className="text-xs font-bold text-gray-400 hover:text-brand-primary uppercase tracking-wider">View All</button>
            </div>
            
            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {[
                { title: 'Resume Refined', time: '2m ago', icon: Sparkles, color: 'text-brand-ai bg-brand-ai/10' },
                { title: 'New Blueprint', time: '1h ago', icon: Plus, color: 'text-brand-primary bg-brand-primary/10' },
                { title: 'PDF Exported', time: '3h ago', icon: Download, color: 'text-green-600 bg-green-50' },
              ].map((act, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`p-2 rounded-xl shrink-0 ${act.color}`}>
                    <act.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary truncate">{act.title}</p>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-tight">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-white transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">AI Engine Stable</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-primary transition-colors" />
            </div>
          </motion.div>
        </div>

        {/* Document Gallery Title */}
        <div className="flex items-center justify-between pt-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-text-primary/5 rounded-lg text-text-primary">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Portfolio Canvas</h2>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{resumes?.length || 0} Documents Found</span>
        </div>

        {/* Document Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {resumes.map((resume) => (
              <motion.div
                key={resume._id}
                layoutId={resume._id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={() => navigate(`/editor/${resume._id}/ai`)}
                className="group relative"
              >
                {/* A4 Card Container */}
                <div className="aspect-[1/1.414] bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden cursor-pointer group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 ease-out relative flex flex-col items-center p-6 gap-3">
                  {/* Subtle Background Paper Lines */}
                  <div className="absolute inset-x-8 top-12 h-1 bg-gray-50 rounded" />
                  <div className="absolute inset-x-8 top-16 h-1 bg-gray-50 rounded" />
                  <div className="absolute inset-32 top-20 h-1 bg-gray-50 rounded w-1/3" />
                  
                  <div className="w-full mt-12 space-y-4 opacity-30 group-hover:opacity-60 transition-opacity">
                    <div className="h-1 bg-gray-200 rounded w-3/4" />
                    <div className="h-1 bg-gray-200 rounded w-full" />
                    <div className="h-1 bg-gray-200 rounded w-5/6" />
                    <div className="h-1 bg-gray-200 rounded w-1/2 mt-8" />
                    <div className="h-1 bg-gray-200 rounded w-full" />
                    <div className="h-1 bg-gray-200 rounded w-4/5" />
                  </div>

                  {/* Progressive Disclosure: Hover Actions */}
                  <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/5 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300 pointer-events-auto">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/editor/${resume._id}/ai`); }}
                        className="p-3 bg-white rounded-full text-brand-primary shadow-xl hover:scale-110 transition-transform border border-brand-primary/10"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                         onClick={(e) => { e.stopPropagation(); }} // Implement duplicate if store supports it
                         className="p-3 bg-white rounded-full text-brand-ai shadow-xl hover:scale-110 transition-transform border border-brand-ai/10"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(resume._id, e)}
                        className="p-3 bg-white rounded-full text-red-500 shadow-xl hover:scale-110 transition-transform border border-red-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Badge */}
                  {resume.isLatexFormat && (
                    <div className="absolute top-4 left-4 bg-brand-primary text-[8px] font-black text-white px-2 py-0.5 rounded tracking-widest uppercase shadow-lg shadow-brand-primary/30">
                      LaTeX
                    </div>
                  )}
                </div>

                {/* Metadata Below Card */}
                <div className="mt-4 flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-text-primary truncate group-hover:text-brand-primary transition-colors">{resume.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        {new Date(resume.lastModified).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <button className="p-1 text-gray-300 hover:text-text-primary transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* New Project Placeholder */}
          <motion.div 
            variants={itemVariants}
            className="group relative cursor-pointer"
            onClick={() => !isCreating && handleCreateNew()}
          >
            <div className="aspect-[1/1.414] bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 gap-6 group-hover:border-brand-primary group-hover:bg-brand-primary/5 transition-all duration-300">
              <div className="p-4 bg-gray-50 rounded-full text-gray-400 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                {isCreating ? (
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Plus className="w-8 h-8" />
                )}
              </div>
              
              <div className="text-center mt-4">
                <p className="text-sm font-bold text-gray-700">Create New Resume</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Architecture Engine v1.0</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

