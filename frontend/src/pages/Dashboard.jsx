import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useResumeStore from '../store/useResumeStore';
import { Plus, Clock, Trash2, Edit3, ArrowUpRight, FileText, CheckCircle, Activity, Sparkles } from 'lucide-react';

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
      navigate(`/editor/${newResume._id}/manual`);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you absolutely certain you wish to delete this resume?')) {
      await deleteResume(id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-12 font-sans" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2942 100%)' }}>
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-[#f1f5f9]">My Resumes</h1>
            <p className="text-[#cbd5e1] text-lg">Manage and create your professional documents with AI assistance.</p>
          </div>
          <button
            onClick={handleCreateNew}
            disabled={isCreating}
            className="flex items-center justify-center px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#6366f1] to-[#ec4899] hover:shadow-lg hover:shadow-[#6366f1]/50 rounded-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:translate-y-0"
          >
            {isCreating ? 'Initializing...' : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                <span>Create New Resume</span>
              </>
            )}
          </button>
        </header>

        {/* Intelligence Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass glass-hover p-8 rounded-xl flex flex-col justify-between h-40 group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-sm font-bold text-[#cbd5e1] uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6366f1] group-hover:scale-110 transition-transform duration-300" /> Total Resumes
            </h3>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#ec4899]">{resumes?.length || 0}</p>
          </div>
          <div className="glass glass-hover p-8 rounded-xl flex flex-col justify-between h-40 relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#10b981] to-transparent"></div>
            <h3 className="text-sm font-bold text-[#cbd5e1] uppercase flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#10b981] group-hover:scale-110 transition-transform duration-300" /> ATS Ready
            </h3>
            <div className="flex items-baseline gap-1">
              <p className="text-5xl font-black text-[#10b981]">94</p>
              <span className="text-[#10b981] font-bold text-2xl">%</span>
            </div>
          </div>
          <div className="glass glass-hover p-8 rounded-xl flex flex-col justify-between h-40 group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-sm font-bold text-[#cbd5e1] uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#6366f1] group-hover:scale-110 transition-transform duration-300" /> System Status
            </h3>
            <p className="text-lg font-bold text-[#f1f5f9] flex items-center gap-2 mt-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
              All systems operational
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-[#475569] pb-4 mb-6">
          <h2 className="text-2xl font-bold text-[#f1f5f9] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ec4899]" />
            Recent Documents
          </h2>
        </div>

        {isLoading && resumes.length === 0 ? (
          <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-4 border-[#475569] border-t-[#6366f1] rounded-full animate-spin"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="glass glass-hover rounded-2xl p-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#475569]">
            <div className="p-5 bg-gradient-to-br from-[#6366f1]/20 to-[#ec4899]/20 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-10 h-10 text-[#6366f1]" />
            </div>
            <h3 className="text-2xl font-bold text-[#f1f5f9] mb-2">No resumes yet</h3>
            <p className="text-[#cbd5e1] mb-8 max-w-sm">
              Create your first tailored resume using our AI engine or start from scratch with our intuitive editor.
            </p>
            <button
              onClick={handleCreateNew}
              className="px-8 py-3 bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#6366f1]/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resumes.map((resume, idx) => (
              <div
                key={resume._id}
                onClick={() => navigate(`/editor/${resume._id}/manual`)}
                className="glass glass-hover flex flex-col h-[320px] cursor-pointer rounded-xl transition-all duration-300 relative overflow-hidden group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Visual Preview Area */}
                <div className="flex-1 border-b border-[#475569] p-6 relative flex flex-col gap-3 bg-gradient-to-br from-[#1e293b] to-[#0f172a]">
                  <div className="w-3/4 h-2 bg-gradient-to-r from-[#6366f1]/30 to-transparent rounded"></div>
                  <div className="w-full h-2 bg-gradient-to-r from-[#6366f1]/20 to-transparent rounded"></div>
                  <div className="w-5/6 h-2 bg-gradient-to-r from-[#ec4899]/20 to-transparent rounded"></div>
                  <div className="w-1/2 h-2 bg-gradient-to-r from-[#6366f1]/15 to-transparent rounded mt-4"></div>
                  <div className="w-full h-2 bg-gradient-to-r from-[#6366f1]/15 to-transparent rounded"></div>
                  <div className="w-4/5 h-2 bg-gradient-to-r from-[#ec4899]/15 to-transparent rounded"></div>
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/editor/${resume._id}/manual`); }}
                      className="p-2 rounded-full text-[#6366f1] bg-[#6366f1]/20 hover:bg-[#6366f1]/30 shadow-lg transition-colors duration-300"
                      title="Edit"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(resume._id, e)}
                      className="p-2 rounded-full text-[#ef4444] bg-[#ef4444]/20 hover:bg-[#ef4444]/30 shadow-lg transition-colors duration-300"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#f1f5f9] truncate mb-3 group-hover:text-[#6366f1] transition-colors duration-300">
                    {resume.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs font-semibold text-[#cbd5e1]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#6366f1]" />
                      {new Date(resume.lastModified).toLocaleDateString()}
                    </span>
                    {resume.isLatexFormat && (
                      <span className="text-[#6366f1] bg-[#6366f1]/20 px-2.5 py-1 rounded-md font-bold">
                        LaTeX
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
