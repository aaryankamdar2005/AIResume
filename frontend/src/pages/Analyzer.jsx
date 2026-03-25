import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Activity, 
  MessageSquare, 
  Edit3, 
  Zap, 
  Search,
  Sparkles,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Analyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setError('Neural footprint required: Please upload a resume.');
      return;
    }
    if (!jdFile && !jdText.trim()) {
      setError('Context missing: Please provide a job description.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setResults(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);
    if (jdFile) formData.append('jd_file', jdFile);
    if (jdText) formData.append('job_description_text', jdText);

    try {
      const response = await axios.post(`${API_URL}/analyze/match`, formData, {
        withCredentials: true
      });
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError('Matrix error: Analysis transmission failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ScoreBento = ({ score, label, icon: Icon }) => (
    <div className="glass p-6 rounded-3xl border border-white flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all duration-300">
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="40" cy="40" r="36" className="stroke-current text-gray-100" strokeWidth="6" fill="transparent" />
          <motion.circle 
            initial={{ strokeDashoffset: 226 }}
            animate={{ strokeDashoffset: 226 - (226 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="40" cy="40" r="36" 
            className="stroke-current text-brand-primary" 
            strokeWidth="6" 
            fill="transparent" 
            strokeDasharray="226.2"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-text-primary leading-none">{score}</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">%</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3 h-3 text-brand-ai" />}
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-app-bg dot-matrix p-6 lg:p-12 font-sans text-text-primary custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 bg-white rounded-2xl shadow-ai-panel flex items-center justify-center text-brand-ai">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-text-primary uppercase leading-none">Matrix Analyzer</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Cross-referencing experience vs market benchmarks</p>
            </div>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {!results && !isAnalyzing && (
            <motion.div 
              key="input-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Resume Upload Bento */}
              <div className="glass p-10 rounded-[2.5rem] border border-white shadow-ai-panel flex flex-col relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <FileText className="w-32 h-32" />
                </div>
                <h2 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  01. Source Architecture
                </h2>
                <div className="flex-1 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-12 bg-gray-50/50 hover:bg-white hover:border-brand-primary/20 hover:shadow-2xl transition-all relative cursor-pointer group/upload">
                  <input 
                    type="file" 
                    accept=".pdf,.docx" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-300 group-hover/upload:text-brand-primary group-hover/upload:scale-110 transition-all mb-6">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-black text-text-primary mb-2 uppercase tracking-wide">{resumeFile ? resumeFile.name : 'Upload Neural Map'}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PDF or DOCX • Max 5MB</p>
                </div>
              </div>

              {/* JD Input Bento */}
              <div className="glass p-10 rounded-[2.5rem] border border-white shadow-ai-panel flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Search className="w-32 h-32" />
                </div>
                <h2 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-ai" />
                  02. Target Specification
                </h2>
                <div className="space-y-6 flex-1 flex flex-col">
                  <textarea 
                    className="flex-1 w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-ai/20 rounded-[2rem] p-6 text-sm font-bold text-text-primary placeholder:text-gray-300 outline-none resize-none transition-all shadow-inner"
                    placeholder="Inject Job Description parameters here..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                  />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em]">
                      <span className="px-4 bg-app-bg text-gray-300">Alternate Input</span>
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 relative cursor-pointer hover:bg-white hover:shadow-lg transition-all flex items-center justify-center gap-3">
                     <input 
                      type="file" 
                      accept=".pdf,.docx" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => setJdFile(e.target.files[0])}
                    />
                    <FileText className="w-4 h-4 text-gray-300" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{jdFile ? jdFile.name : 'Select JD Context File'}</span>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 flex flex-col items-center mt-12">
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-6 bg-red-50 px-6 py-3 rounded-full border border-red-100"
                  >
                    {error}
                  </motion.p>
                )}
                <button 
                  onClick={handleAnalyze}
                  className="group px-12 py-5 bg-text-primary text-white rounded-[2rem] font-black hover:bg-brand-primary transition-all shadow-2xl shadow-gray-200 flex items-center gap-4 uppercase tracking-[0.2em] text-xs"
                >
                  Initiate Alignment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div 
              key="analyzing-stage"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-32 rounded-[3rem] border border-white shadow-ai-panel flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
            >
              <div className="relative w-24 h-24 mb-10">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-t-brand-primary rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Sparkles className="w-8 h-8 text-brand-ai animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter mb-4">Neural Mapping in Progress</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] max-w-md leading-relaxed">Cross-referencing your experience architecture against industry-standard ATS filters...</p>
            </motion.div>
          )}

          {results && (
            <motion.div 
              key="results-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12 pb-32"
            >
              {/* Metrics Hero Bento */}
              <div className="glass p-12 rounded-[3rem] border border-white shadow-ai-panel relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                   <div>
                     <h2 className="text-xs font-black text-brand-primary uppercase tracking-[0.3em] mb-2">Performance Metrics</h2>
                     <h3 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">Alignment Core</h3>
                   </div>
                   <button onClick={() => setResults(null)} className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 hover:bg-white hover:shadow-lg rounded-2xl transition-all border border-transparent hover:border-gray-100">
                     New Alignment
                   </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                  <ScoreBento score={results.overall_match_score || 0} label="Match" icon={Activity} />
                  <ScoreBento score={results.skills_match_score || 0} label="Skills" icon={Cpu} />
                  <ScoreBento score={results.experience_relevance_score || 0} label="Exp" icon={ShieldCheck} />
                  <ScoreBento score={results.project_relevance_score || 0} label="Proj" icon={Layers} />
                  <ScoreBento score={results.ats_keyword_score || 0} label="ATS" icon={Search} />
                  <ScoreBento score={results.technical_depth_score || 0} label="Depth" icon={Zap} />
                  <ScoreBento score={results.resume_quality_score || 0} label="Qual" icon={Sparkles} />
                </div>
                
                <div className="mt-12 glass p-8 rounded-3xl border-brand-primary/10 bg-brand-primary/5 flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-primary shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-2">Executive Strategy</h4>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed whitespace-pre-line">
                      {results.final_summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Matrix Data Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Gap Analysis Bento (7 Cols) */}
                <div className="lg:col-span-7 glass p-10 rounded-[2.5rem] border border-white shadow-ai-panel space-y-10">
                  <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                    <Activity className="w-4 h-4 text-brand-primary" />
                    Gap Dissection
                  </h3>
                  
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" /> Neural Match
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {results.matched_skills?.map((skill, i) => (
                          <span key={i} className="px-4 py-2 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-xl border border-green-100">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-red-500" /> Missing Vectors
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {results.missing_skills?.map((skill, i) => (
                          <span key={i} className="px-4 py-2 bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-xl border border-red-100">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Bento (5 Cols) */}
                <div className="lg:col-span-5 glass p-10 rounded-[2.5rem] border border-white shadow-ai-panel space-y-8">
                  <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-brand-ai" />
                    Neural Feedback
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[9px] font-black text-green-600 mb-3 uppercase tracking-widest">Structural Strengths</h4>
                      <ul className="space-y-3">
                        {results.strengths?.slice(0, 3).map((str, i) => (
                          <li key={i} className="text-[11px] font-bold text-gray-600 flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="h-px bg-gray-50" />

                    <div>
                      <h4 className="text-[9px] font-black text-brand-primary mb-3 uppercase tracking-widest">Optimization Suggestions</h4>
                      <ul className="space-y-3">
                        {results.improvement_suggestions?.slice(0, 3).map((sug, i) => (
                          <li key={i} className="text-[11px] font-bold text-gray-600 flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bullet Rewrites Full-width Bento */}
                {results.rewritten_resume_bullets?.length > 0 && (
                  <div className="lg:col-span-12 glass p-10 rounded-[2.5rem] border border-white shadow-ai-panel">
                    <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                      <Edit3 className="w-4 h-4 text-brand-ai" /> 
                      Architectural Refinement
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.rewritten_resume_bullets.map((bullet, i) => (
                        <div key={i} className="bg-gray-50/50 border border-gray-100 rounded-3xl overflow-hidden flex flex-col group hover:shadow-xl transition-all">
                          <div className="p-6 border-b border-gray-100/50">
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em] mb-3 block">Raw Content</span>
                            <p className="text-[11px] font-bold text-gray-400 italic line-through decoration-red-200/50">{bullet.original}</p>
                          </div>
                          <div className="p-6 bg-white flex-1">
                            <span className="text-[8px] font-black text-brand-ai uppercase tracking-[0.3em] mb-3 block">Optimized Logic</span>
                            <p className="text-[13px] font-black text-text-primary leading-relaxed">{bullet.improved}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Reusable Layers icon
const Layers = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.1 6.27a2 2 0 0 0 0 3.66l9.07 4.09a2 2 0 0 0 1.66 0l9.07-4.09a2 2 0 0 0 0-3.66z"/><path d="m2.1 14.07 9.07 4.09a2 2 0 0 0 1.66 0l9.07-4.09"/><path d="m2.1 19.07 9.07 4.09a2 2 0 0 0 1.66 0l9.07-4.09"/>
  </svg>
);

export default Analyzer;
