import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useResumeStore from '../store/useResumeStore';
import { Plus, Clock, Trash2, Edit3, ArrowUpRight, FileText, CheckCircle, Activity } from 'lucide-react';

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
    <div className="flex-1 overflow-y-auto bg-background-secondary p-6 lg:p-10 font-sans text-text-primary">
      <div className="max-w-7xl mx-auto w-full space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">My Resumes</h1>
            <p className="text-text-secondary text-lg">Create and manage your professional documents.</p>
          </div>
          <button
            onClick={handleCreateNew}
            disabled={isCreating}
            className="group flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{isCreating ? 'Creating...' : 'New Resume'}</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background-primary border border-border-light rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Total Resumes</p>
                <p className="text-4xl font-bold text-primary">{resumes?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-background-primary border border-border-light rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">ATS Score</p>
                <p className="text-4xl font-bold text-success">94%</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center text-success">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-background-primary border border-border-light rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Status</p>
                <p className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                  All systems active
                </p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center text-info">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="pt-6 border-t border-border-light">
          <h2 className="text-2xl font-bold text-text-primary">Your Documents</h2>
        </div>

        {isLoading && resumes.length === 0 ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-border-default border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="border-2 border-dashed border-border-default rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-background-primary">
            <div className="p-5 bg-primary/10 rounded-full mb-6">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">No resumes yet</h3>
            <p className="text-text-secondary mb-8 max-w-sm">
              Create your first resume using our AI assistant or start from scratch with full control.
            </p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-all shadow-lg"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                onClick={() => navigate(`/editor/${resume._id}/manual`)}
                className="group bg-background-primary border border-border-light hover:border-accent/40 rounded-xl shadow-sm hover:shadow-lg flex flex-col h-72 cursor-pointer transition-all relative overflow-hidden"
              >
                {/* Visual Preview Area */}
                <div className="flex-1 bg-background-secondary border-b border-border-light p-6 relative flex flex-col gap-2.5">
                  <div className="w-3/4 h-2.5 bg-border-light rounded"></div>
                  <div className="w-full h-2.5 bg-border-light rounded"></div>
                  <div className="w-5/6 h-2.5 bg-border-light rounded"></div>
                  <div className="w-1/2 h-2.5 bg-border-light rounded mt-2"></div>
                  <div className="w-full h-2.5 bg-border-light rounded"></div>
                  <div className="w-4/5 h-2.5 bg-border-light rounded"></div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/editor/${resume._id}/manual`); }}
                      className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-md transition-all"
                      title="Edit"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(resume._id, e)}
                      className="p-2.5 bg-danger/10 text-danger hover:bg-danger/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="p-6 bg-background-primary">
                  <h3 className="text-lg font-bold text-text-primary truncate mb-3 group-hover:text-primary transition-colors">
                    {resume.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase text-text-tertiary gap-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(resume.lastModified).toLocaleDateString()}
                    </span>
                    {resume.isLatexFormat && (
                      <span className="text-primary bg-primary/10 px-2.5 py-1 rounded-md">
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
