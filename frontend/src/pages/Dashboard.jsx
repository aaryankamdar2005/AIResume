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
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6 lg:p-12 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">My Resumes</h1>
            <p className="text-gray-600 text-lg">Manage and build your professional documents.</p>
          </div>
          <button
            onClick={handleCreateNew}
            disabled={isCreating}
            className="flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
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
          <div className="bg-white border text-gray-900 border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between h-36">
            <h3 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" /> Total Resumes
            </h3>
            <p className="text-4xl font-extrabold text-blue-600">{resumes?.length || 0}</p>
          </div>
          <div className="bg-white border text-gray-900 border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between h-36 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
            <h3 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" /> ATS Ready
            </h3>
            <div className="flex items-baseline gap-1">
              <p className="text-4xl font-extrabold text-green-600">94</p>
              <span className="text-green-600 font-bold">%</span>
            </div>
          </div>
          <div className="bg-white border text-gray-900 border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between h-36">
            <h3 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> System Status
            </h3>
            <p className="text-xl font-bold text-gray-900 flex items-center gap-2 mt-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              All systems operational
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Documents</h2>
        </div>

        {isLoading && resumes.length === 0 ? (
          <div className="flex justify-center py-32">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-white">
            <div className="p-5 bg-blue-50 rounded-full mb-6">
              <FileText className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm">
              Create your first tailored resume using our AI architect or start from scratch.
            </p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                onClick={() => navigate(`/editor/${resume._id}/manual`)}
                className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md flex flex-col h-[300px] cursor-pointer hover:border-blue-300 transition-all relative overflow-hidden"
              >
                {/* Visual Preview Area */}
                <div className="flex-1 bg-gray-50 border-b border-gray-100 p-6 relative flex flex-col gap-3">
                  <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                  <div className="w-full h-2 bg-gray-200 rounded"></div>
                  <div className="w-5/6 h-2 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-2 bg-gray-200 rounded mt-4"></div>
                  <div className="w-full h-2 bg-gray-200 rounded"></div>
                  <div className="w-4/5 h-2 bg-gray-200 rounded"></div>
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/editor/${resume._id}/manual`); }}
                      className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 shadow-sm transition-colors"
                      title="Edit"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(resume._id, e)}
                      className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="p-5 bg-white">
                  <h3 className="text-lg font-bold text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors">
                    {resume.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(resume.lastModified).toLocaleDateString()}
                    </span>
                    {resume.isLatexFormat && (
                      <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
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
