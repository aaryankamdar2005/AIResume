import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useResumeStore from '../store/useResumeStore';
import { 
  Save, 
  Download, 
  ArrowLeft, 
  MessageSquare, 
  Edit3, 
  Plus, 
  Trash2, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Settings,
  ChevronRight,
  Sparkles,
  Search,
  Layers,
  PanelRightClose,
  PanelRightOpen,
  Bold,
  Italic,
  List
} from 'lucide-react';
import { getLatexPreview } from '../services/api';

const ManualResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, fetchResumeById, updateResume, isLoading, updateCurrentResumeState } = useResumeStore();
  
  const [activeTab, setActiveTab] = useState('structure'); // 'structure' or 'chat'
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [selection, setSelection] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchResumeById(id);
  }, [id, fetchResumeById]);

  if (isLoading || !currentResume) {
    return (
      <div className="flex h-screen items-center justify-center bg-app-bg text-brand-primary">
        <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  const handleSave = async () => {
    await updateResume(id, currentResume);
  };

  const handleExportPDF = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.open(`${API_URL}/export/pdf/${id}`, '_blank');
  };

  const handleContentChange = (field, value) => {
    updateCurrentResumeState({
      ...currentResume,
      content: { ...(currentResume.content || {}), [field]: value }
    });
  };

  const handlePersonalInfo = (e) => {
    const { name, value } = e.target;
    handleContentChange('personalInfo', { ...(currentResume.content?.personalInfo || {}), [name]: value });
  };

  return (
    <div className="flex h-screen w-full bg-app-bg overflow-hidden font-sans text-text-primary">
      {/* 1. Rail Navigation (Left - 64px) */}
      <aside className="w-16 flex flex-col items-center py-6 bg-white border-r border-gray-100 z-50 shrink-0">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-3 mb-8 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col gap-4 flex-1">
          {[
            { icon: Layout, label: 'Templates' },
            { icon: Type, label: 'Typography' },
            { icon: Layers, label: 'Sections' },
            { icon: Sparkles, label: 'AI Builder', onClick: () => navigate(`/editor/${id}/ai`) },
          ].map((item, i) => (
            <div key={i} className="group relative">
              <button 
                onClick={item.onClick}
                className="p-3 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
              >
                <item.icon className={`w-6 h-6 ${item.label === 'AI Builder' ? 'text-brand-ai' : ''}`} />
              </button>
              {/* Custom Tooltip Replacement */}
              <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 uppercase tracking-widest translate-y-[-150%]">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <button className="p-3 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all mt-auto">
          <Settings className="w-6 h-6" />
        </button>
      </aside>

      {/* 2. The Canvas (Center) */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Canvas Toolbar */}
        <header className="h-14 border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Draft</h2>
            <div className="h-4 w-px bg-gray-100" />
            <span className="text-sm font-bold truncate max-w-[200px]">{currentResume.title}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all"
            >
              Sync to Cloud
            </button>
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Publish
            </button>
            <div className="h-4 w-px bg-gray-100 mx-2" />
            <button 
              onClick={() => setIsInspectorOpen(!isInspectorOpen)}
              className={`p-2 rounded-lg transition-all ${isInspectorOpen ? 'text-brand-primary bg-brand-primary/5' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {isInspectorOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Scrollable Spatial Area */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto bg-gray-50/50 dot-matrix p-12 custom-scrollbar flex justify-center items-start"
        >
          <motion.div 
            layoutId="resume-canvas"
            className="w-full max-w-[800px] bg-white border border-gray-200/50 shadow-2xl rounded-sm aspect-[1/1.414] relative p-16 origin-top mb-20"
          >
            {/* Contextual Toolbar Popover (Mockup) */}
            <AnimatePresence>
              {selection && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute z-50 bg-gray-900 text-white p-1 rounded-xl shadow-2xl flex items-center gap-1 border border-white/10 -top-12 left-1/2 -translate-x-1/2"
                >
                  <button className="p-2 hover:bg-white/10 rounded-lg"><Sparkles className="w-4 h-4 text-brand-ai" /></button>
                  <div className="w-px h-4 bg-white/10 mx-1" />
                  <button className="p-2 hover:bg-white/10 rounded-lg"><Bold className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-white/10 rounded-lg"><Italic className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-white/10 rounded-lg"><List className="w-4 h-4" /></button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resume Content (WYSIWYG-ish Blocks) */}
            <div className="h-full font-serif text-text-primary">
              {/* Header Block */}
              <div 
                className="text-center mb-12 cursor-text hover:bg-gray-50/50 p-4 rounded-xl transition-colors"
                onClick={() => setSelection('header')}
              >
                <h1 className="text-4xl font-extrabold tracking-tight uppercase mb-2 border-b-2 border-brand-primary pb-2 inline-block px-4">
                  {currentResume.content?.personalInfo?.fullName || 'John Doe'}
                </h1>
                <div className="text-xs font-bold text-gray-500 tracking-widest flex items-center justify-center gap-3">
                  <span>{currentResume.content?.personalInfo?.email}</span>
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{currentResume.content?.personalInfo?.phone}</span>
                </div>
              </div>

              {/* Sections Map */}
              <div className="space-y-8">
                {/* Summary */}
                <section className="group relative">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary border-b border-gray-100 pb-2 mb-4">Executive Summary</h2>
                  <p 
                    contentEditable 
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentChange('summary', e.target.innerText)}
                    className="text-sm leading-relaxed text-justify outline-none focus:ring-2 ring-brand-primary/10 p-2 rounded-lg"
                  >
                    {currentResume.content?.summary || 'Drafting your impact...'}
                  </p>
                </section>

                {/* Experience */}
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary border-b border-gray-100 pb-2 mb-6">Experience Architecture</h2>
                  <div className="space-y-8">
                    {(currentResume.content?.experience || []).map((exp, idx) => (
                      <div key={idx} className="relative group hover:bg-gray-50/50 p-4 -m-4 rounded-xl transition-colors">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-lg">{exp.title || 'Role Title'}</h3>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{exp.startDate} — {exp.endDate}</span>
                        </div>
                        <div className="text-xs font-bold text-brand-primary mb-3">{exp.company}</div>
                        <p className="text-sm leading-relaxed text-gray-600">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* 3. AI Copilot Inspector (Right - 360px) */}
      <AnimatePresence>
        {isInspectorOpen && (
          <motion.aside 
            initial={{ x: 360 }}
            animate={{ x: 0 }}
            exit={{ x: 360 }}
            className="w-[360px] bg-white/70 backdrop-blur-xl border-l border-gray-100 flex flex-col z-50 shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 shrink-0">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab('structure')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'structure' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Layers className="w-4 h-4" />
                  Blueprint
                </button>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'chat' ? 'bg-white text-brand-ai shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <MessageSquare className="w-4 h-4" />
                  AI Logic
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeTab === 'structure' ? (
                <div className="space-y-6">
                  {/* Personal Info Group */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Identity</h4>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
                        <input 
                          type="text" 
                          name="fullName"
                          value={currentResume.content?.personalInfo?.fullName || ''} 
                          onChange={handlePersonalInfo}
                          className="w-full bg-gray-50 border border-transparent focus:border-brand-primary/20 focus:bg-white p-2.5 text-xs font-bold rounded-xl outline-none transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Role Objective</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Senior Software Architect"
                          className="w-full bg-gray-50 border border-transparent focus:border-brand-primary/20 focus:bg-white p-2.5 text-xs font-bold rounded-xl outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section List (Droppable Mockup) */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Architecture Layers</h4>
                    <div className="space-y-2">
                      {['Summary', 'Experience', 'Projects', 'Education', 'Skills'].map((layer, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-xl cursor-grab transition-all group">
                          <div className="flex items-center gap-3">
                            <MoreVertical className="w-4 h-4 text-gray-300" />
                            <span className="text-xs font-bold">{layer}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-100 hover:border-brand-primary/20 hover:text-brand-primary rounded-xl text-gray-400 transition-all font-bold text-xs uppercase tracking-widest">
                      <Plus className="w-4 h-4" />
                      Add Layer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-16 h-16 bg-brand-ai/5 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-brand-ai" />
                    </div>
                    <h4 className="font-bold mb-2">AI Reasoning Engine</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Ask me to refine your experience, synthesize metrics, or change the tone of your document.</p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Bottom Input */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="relative group">
                <textarea 
                  placeholder="Tell AI what to optimize..."
                  className="w-full bg-gray-50 border border-transparent focus:border-brand-ai/20 focus:bg-white p-4 pr-12 text-sm font-medium rounded-2xl outline-none transition-all resize-none min-h-[100px]"
                />
                <button className="absolute bottom-4 right-4 p-2 bg-brand-ai text-white rounded-xl shadow-lg shadow-brand-ai/20 hover:scale-110 active:scale-95 transition-all">
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-gray-400 mt-3 text-center font-bold uppercase tracking-widest">Neural Layer V2 — Context Ready</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal icons helper if needed
const MoreVertical = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
  </svg>
);

export default ManualResumeEditor;

