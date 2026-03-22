import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useResumeStore from '../store/useResumeStore';
import { Save, Download, ArrowLeft, MessageSquare, Edit3, Plus, Trash2 } from 'lucide-react';
import { getLatexPreview } from '../services/api';

const ManualResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, fetchResumeById, updateResume, isLoading, updateCurrentResumeState } = useResumeStore();
  
  // Fully fast instant Native HTML Preview
  // No latency-bound PDF LaTeX requests in Manual mode.

  useEffect(() => {
    fetchResumeById(id);
  }, [id, fetchResumeById]);

  if (isLoading || !currentResume) {
    return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Loading editor...</div>;
  }

  const handleSave = async () => {
    await updateResume(id, currentResume);
  };

  const handleExportPDF = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.open(`${API_URL}/export/pdf/${id}`, '_blank');
  };

  // --- Form Handlers ---
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
  
  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...(currentResume.content?.[field] || [])];
    newArray[index] = { ...newArray[index], [key]: value };
    handleContentChange(field, newArray);
  };
  
  const addArrayItem = (field, emptyItem) => {
    handleContentChange(field, [...(currentResume.content?.[field] || []), emptyItem]);
  };
  
  const removeArrayItem = (field, index) => {
    const newArray = [...(currentResume.content?.[field] || [])];
    newArray.splice(index, 1);
    handleContentChange(field, newArray);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate overflow-hidden h-[calc(100vh-4rem)] font-sans">
      {/* Editorial Toolbar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-silver px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-10 w-full">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-charcoal/60 hover:text-navy hover:bg-slate rounded-md transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="font-extrabold text-lg text-navy flex items-center gap-2 tracking-tight">
            <Edit3 className="w-5 h-5 text-blue" />
            Structural Blueprint Editor
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/editor/${id}/ai`)}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-bold tracking-wide text-navy bg-white hover:bg-slate transition-colors border border-silver shadow-sm"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Engage AI Weaver
          </button>
          <div className="w-px h-6 bg-silver mx-1"></div>
          <button onClick={handleSave} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-bold tracking-wide text-charcoal hover:text-navy hover:bg-slate border border-transparent transition-colors">
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </button>
          <button onClick={handleExportPDF} className="inline-flex items-center px-5 py-2 rounded-md text-sm font-bold tracking-wide text-white bg-navy hover:bg-blue transition-all shadow-sm hover:shadow hover:-translate-y-px duration-150">
            <Download className="w-4 h-4 mr-2" /> Publish PDF
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden w-full">
        {/* Left Pane: Full Form Editor */}
        <div className="w-1/2 bg-white border-r border-silver flex flex-col overflow-y-auto shadow-inner z-10 custom-scrollbar relative">
          <div className="px-8 py-5 border-b border-silver sticky top-0 bg-white/95 backdrop-blur z-20 shadow-sm">
            <h2 className="text-lg font-extrabold text-navy tracking-tight">Document Architecture</h2>
            <p className="text-xs font-semibold text-charcoal/60 mt-1 tracking-wide">Fields instantly update the preview via Native Javascript rendering.</p>
          </div>
          
          <div className="p-8 space-y-8 pb-32">
            {/* Header */}
            <section className="bg-slate p-6 rounded-md border border-silver shadow-sm">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-4 border-b border-silver/60 pb-2">Identify</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="fullName" placeholder="Full Name" value={currentResume.content?.personalInfo?.fullName || ''} onChange={handlePersonalInfo} className="col-span-2 px-4 py-2 bg-white border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm outline-none focus:border-blue border transition-colors shadow-inner" />
                <input type="email" name="email" placeholder="Email" value={currentResume.content?.personalInfo?.email || ''} onChange={handlePersonalInfo} className="px-4 py-2 bg-white border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm outline-none focus:border-blue border transition-colors shadow-inner" />
                <input type="text" name="phone" placeholder="Phone" value={currentResume.content?.personalInfo?.phone || ''} onChange={handlePersonalInfo} className="px-4 py-2 bg-white border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm outline-none focus:border-blue border transition-colors shadow-inner" />
                <input type="text" name="location" placeholder="Location (City, State)" value={currentResume.content?.personalInfo?.location || ''} onChange={handlePersonalInfo} className="px-4 py-2 bg-white border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm outline-none focus:border-blue border transition-colors shadow-inner" />
                <input type="text" name="linkedin" placeholder="LinkedIn URL" value={currentResume.content?.personalInfo?.linkedin || ''} onChange={handlePersonalInfo} className="px-4 py-2 bg-white border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm outline-none focus:border-blue border transition-colors shadow-inner" />
                <input type="text" name="github" placeholder="GitHub URL" value={currentResume.content?.personalInfo?.github || ''} onChange={handlePersonalInfo} className="col-span-2 px-4 py-2 bg-white border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm outline-none focus:border-blue border transition-colors shadow-inner" />
              </div>
            </section>
            
            {/* Summary */}
            <section className="bg-slate p-6 rounded-md border border-silver shadow-sm">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-4 border-b border-silver/60 pb-2">Professional Summary</h3>
              <textarea rows="4" placeholder="Briefly summarize your top skills and objective..." value={currentResume.content?.summary || ''} onChange={(e) => handleContentChange('summary', e.target.value)} className="w-full px-4 py-3 bg-white border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm resize-y outline-none focus:border-blue border transition-colors shadow-inner"></textarea>
            </section>

            {/* Experience */}
            <section className="bg-slate p-6 rounded-md border border-silver shadow-sm">
              <div className="flex justify-between items-center mb-5 border-b border-silver/60 pb-3">
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest">Experience</h3>
                <button onClick={() => addArrayItem('experience', {title:'', company:'', location:'', startDate:'', endDate:'', description:''})} className="flex items-center text-xs font-bold tracking-wide bg-white text-navy px-3 py-1.5 rounded-sm hover:bg-slate transition-colors border border-silver shadow-sm"><Plus className="w-3.5 h-3.5 mr-1.5"/> Add Role</button>
              </div>
              <div className="space-y-6">
                {(currentResume.content?.experience || []).map((exp, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-md border border-silver shadow-sm relative group">
                    <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-3 right-3 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-sm bg-white opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-red-200"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-2 gap-3 mb-4 pr-8">
                      <input type="text" placeholder="Job Title" value={exp.title || ''} onChange={(e) => handleArrayChange('experience', idx, 'title', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                      <input type="text" placeholder="Company" value={exp.company || ''} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                      <input type="text" placeholder="Start Date (e.g. June 2021)" value={exp.startDate || ''} onChange={(e) => handleArrayChange('experience', idx, 'startDate', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                      <input type="text" placeholder="End Date (or Present)" value={exp.endDate || ''} onChange={(e) => handleArrayChange('experience', idx, 'endDate', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                      <input type="text" placeholder="Location" value={exp.location || ''} onChange={(e) => handleArrayChange('experience', idx, 'location', e.target.value)} className="col-span-2 px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                    </div>
                    <p className="text-xs text-charcoal/60 mb-2 font-bold tracking-wide uppercase">Description (Hyphen separated)</p>
                    <textarea rows="4" placeholder="• Led development of...\n• Increased sales by 20%..." value={exp.description || ''} onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)} className="w-full px-4 py-3 bg-slate/50 border border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm resize-y outline-none focus:border-blue shadow-inner"></textarea>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section className="bg-slate p-6 rounded-md border border-silver shadow-sm">
              <div className="flex justify-between items-center mb-5 border-b border-silver/60 pb-3">
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest">Projects</h3>
                <button onClick={() => addArrayItem('projects', {title:'', subtitle:'', startDate:'', endDate:'', description:''})} className="flex items-center text-xs font-bold tracking-wide bg-white text-navy px-3 py-1.5 rounded-sm hover:bg-slate transition-colors border border-silver shadow-sm"><Plus className="w-3.5 h-3.5 mr-1.5"/> Add Project</button>
              </div>
              <div className="space-y-6">
                {(currentResume.content?.projects || []).map((proj, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-md border border-silver shadow-sm relative group">
                    <button onClick={() => removeArrayItem('projects', idx)} className="absolute top-3 right-3 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-sm bg-white opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-red-200"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-2 gap-3 mb-4 pr-8">
                      <input type="text" placeholder="Project Title" value={proj.title || ''} onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                      <input type="text" placeholder="Subtitle / Tech Stack" value={proj.subtitle || ''} onChange={(e) => handleArrayChange('projects', idx, 'subtitle', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                      <input type="text" placeholder="Start Date" value={proj.startDate || ''} onChange={(e) => handleArrayChange('projects', idx, 'startDate', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                      <input type="text" placeholder="End Date" value={proj.endDate || ''} onChange={(e) => handleArrayChange('projects', idx, 'endDate', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                    </div>
                    <p className="text-xs text-charcoal/60 mb-2 font-bold tracking-wide uppercase">Description</p>
                    <textarea rows="3" placeholder="• Engineered a full-stack dashboard..." value={proj.description || ''} onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)} className="w-full px-4 py-3 bg-slate/50 border border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm resize-y outline-none focus:border-blue shadow-inner"></textarea>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="bg-slate p-6 rounded-md border border-silver shadow-sm">
              <div className="flex justify-between items-center mb-5 border-b border-silver/60 pb-3">
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest">Education</h3>
                <button onClick={() => addArrayItem('education', {institution:'', location:'', degree:'', fieldOfStudy:'', startDate:'', endDate:''})} className="flex items-center text-xs font-bold tracking-wide bg-white text-navy px-3 py-1.5 rounded-sm hover:bg-slate transition-colors border border-silver shadow-sm"><Plus className="w-3.5 h-3.5 mr-1.5"/> Add Degree</button>
              </div>
              <div className="space-y-6">
                {(currentResume.content?.education || []).map((edu, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-md border border-silver shadow-sm relative group">
                    <button onClick={() => removeArrayItem('education', idx)} className="absolute top-3 right-3 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-sm bg-white opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-red-200"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-2 gap-3 pr-8">
                      <input type="text" placeholder="Institution Name" value={edu.institution || ''} onChange={(e) => handleArrayChange('education', idx, 'institution', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                      <input type="text" placeholder="Location" value={edu.location || ''} onChange={(e) => handleArrayChange('education', idx, 'location', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                      <input type="text" placeholder="Degree (e.g. BS)" value={edu.degree || ''} onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} className="col-span-2 px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                      <input type="text" placeholder="Start Date" value={edu.startDate || ''} onChange={(e) => handleArrayChange('education', idx, 'startDate', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                      <input type="text" placeholder="End Date" value={edu.endDate || ''} onChange={(e) => handleArrayChange('education', idx, 'endDate', e.target.value)} className="px-3 py-2 bg-slate/50 border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm w-full outline-none focus:border-blue border shadow-inner" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section className="bg-slate p-6 rounded-md border border-silver shadow-sm">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-4 border-b border-silver/60 pb-2">Technical Engine</h3>
              <p className="text-xs text-charcoal/60 mb-3 font-bold tracking-wide uppercase">Enter skills separated by commas</p>
              <textarea 
                rows="3" 
                placeholder="Architecture, JavaScript, Structural Engineering" 
                value={(currentResume.content?.skills || []).join(', ')} 
                onChange={(e) => handleContentChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
                className="w-full px-4 py-3 bg-white border-silver text-charcoal placeholder-charcoal/40 rounded-sm text-sm outline-none resize-y focus:border-blue transition-colors border shadow-inner"
              ></textarea>
            </section>

          </div>
        </div>

        {/* Right Pane: Instant HTML Full Live Preview */}
        <div className="w-1/2 bg-slate border-l border-silver overflow-y-auto p-12 relative flex items-start justify-center shadow-inner">
            <div className="bg-white mx-auto shadow-md border border-silver w-full max-w-[21cm] min-h-[29.7cm] p-12 transition-all duration-300 relative text-[11pt] font-sans transform scale-95 hover:scale-100 ease-out">
              
              {/* Header */}
              <div className="text-center mb-8 border-b-2 border-navy pb-6">
                <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-2 uppercase">{currentResume?.content?.personalInfo?.fullName || 'Untitled Architect'}</h1>
                <p className="text-charcoal font-semibold tracking-wide text-xs">
                   {currentResume?.content?.personalInfo?.email || 'email@example.com'} 
                   {currentResume?.content?.personalInfo?.phone && ` | ${currentResume?.content?.personalInfo?.phone}`}
                   {currentResume?.content?.personalInfo?.location && ` | ${currentResume?.content?.personalInfo?.location}`}
                </p>
                <div className="text-[10px] text-charcoal/70 tracking-widest font-bold uppercase mt-2">
                   {currentResume?.content?.personalInfo?.linkedin && <span>LinkedIn</span>}
                   {currentResume?.content?.personalInfo?.github && <span> • GitHub</span>}
                </div>
              </div>
              
              {/* Summary */}
              {currentResume?.content?.summary && (
                <div className="mb-6">
                  <h2 className="text-[11px] font-extrabold text-navy uppercase tracking-[0.2em] border-b border-silver pb-1 mb-3">Professional Summary</h2>
                  <p className="text-[13px] text-charcoal leading-relaxed text-justify font-medium">{currentResume.content.summary}</p>
                </div>
              )}

              {/* Experience */}
              {(currentResume?.content?.experience || []).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-[11px] font-extrabold text-navy uppercase tracking-[0.2em] border-b border-silver pb-1 mb-4">Experience Architecture</h2>
                  <div className="space-y-5">
                    {currentResume.content.experience.map((exp, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className="font-extrabold text-navy text-[14px]">{exp.title}</h3>
                          <span className="text-[11px] font-bold text-charcoal/70 tracking-wider uppercase">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="font-bold text-charcoal text-[13px] uppercase tracking-wide">{exp.company}</span>
                          <span className="font-semibold text-charcoal/60 text-[11px]">{exp.location}</span>
                        </div>
                        <ul className="list-none text-[13px] text-charcoal space-y-2 text-justify mt-3">
                          {(exp.description || '').split('\\n').filter(b => b.trim()).map((bullet, i) => (
                            <li key={i} className="relative pl-3 before:content-[''] before:absolute before:left-0 before:top-[0.4em] before:w-[4px] before:h-[4px] before:bg-blue before:rounded-full">
                              {bullet.replace(/^[-*•]\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Projects */}
              {(currentResume?.content?.projects || []).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-[11px] font-extrabold text-navy uppercase tracking-[0.2em] border-b border-silver pb-1 mb-4">Project Monographs</h2>
                  <div className="space-y-5">
                    {currentResume.content.projects.map((proj, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className="font-extrabold text-navy text-[14px]">{proj.title} <span className="font-bold text-charcoal/60 uppercase text-[11px] tracking-wide ml-2">| {proj.subtitle}</span></h3>
                          <span className="text-[11px] font-bold text-charcoal/70 tracking-wider uppercase">{proj.startDate} – {proj.endDate}</span>
                        </div>
                        <ul className="list-none text-[13px] text-charcoal space-y-2 text-justify mt-2">
                          {(proj.description || '').split('\\n').filter(b => b.trim()).map((bullet, i) => (
                            <li key={i} className="relative pl-3 before:content-[''] before:absolute before:left-0 before:top-[0.4em] before:w-[4px] before:h-[4px] before:bg-blue before:rounded-full">
                              {bullet.replace(/^[-*•]\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {(currentResume?.content?.education || []).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-[11px] font-extrabold text-navy uppercase tracking-[0.2em] border-b border-silver pb-1 mb-4">Education</h2>
                  <div className="space-y-4">
                    {currentResume.content.education.map((edu, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className="font-extrabold text-navy text-[14px]">{edu.institution}</h3>
                          <span className="text-[11px] font-bold text-charcoal/70 tracking-wider uppercase">{edu.startDate} – {edu.endDate}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-charcoal text-[13px] tracking-wide">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</span>
                          <span className="font-semibold text-charcoal/60 text-[11px]">{edu.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {(currentResume?.content?.skills || []).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-[11px] font-extrabold text-navy uppercase tracking-[0.2em] border-b border-silver pb-1 mb-3">Technical Engine</h2>
                  <p className="text-[13px] text-charcoal leading-relaxed font-bold tracking-wide">
                    {currentResume.content.skills.join('  •  ')}
                  </p>
                </div>
              )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default ManualResumeEditor;
